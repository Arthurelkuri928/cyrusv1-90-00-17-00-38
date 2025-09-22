
-- Passo 1: Modificar a tabela profiles para adicionar campos de assinatura
ALTER TABLE public.profiles 
ADD COLUMN subscription_end_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'expired', 'suspended')),
ADD COLUMN subscription_type TEXT DEFAULT 'basic',
ADD COLUMN created_by UUID REFERENCES auth.users(id),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Passo 2: Criar trigger para updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Passo 3: Função para verificar status da assinatura
CREATE OR REPLACE FUNCTION public.check_subscription_status(user_id UUID)
RETURNS TABLE(is_valid BOOLEAN, status TEXT, expires_at TIMESTAMP WITH TIME ZONE)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    CASE 
      WHEN p.subscription_end_at IS NULL THEN true
      WHEN p.subscription_end_at > now() THEN true
      ELSE false
    END as is_valid,
    COALESCE(p.subscription_status, 'active') as status,
    p.subscription_end_at as expires_at
  FROM profiles p
  WHERE p.id = user_id;
$$;

-- Passo 4: Função para desativar assinaturas expiradas (cron job)
CREATE OR REPLACE FUNCTION public.deactivate_expired_subscriptions()
RETURNS TABLE(deactivated_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE profiles 
  SET subscription_status = 'expired'
  WHERE subscription_end_at < now() 
    AND subscription_status = 'active';
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RETURN QUERY SELECT affected_rows;
END;
$$;

-- Passo 5: Função para validar login com verificação de assinatura
CREATE OR REPLACE FUNCTION public.validate_user_login(user_email TEXT)
RETURNS TABLE(
  can_login BOOLEAN, 
  user_id UUID, 
  role TEXT, 
  subscription_valid BOOLEAN,
  expires_at TIMESTAMP WITH TIME ZONE,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Buscar dados do usuário
  SELECT 
    p.id,
    p.role,
    p.subscription_end_at,
    p.subscription_status,
    au.email
  INTO user_record
  FROM profiles p
  JOIN auth.users au ON p.id = au.id
  WHERE au.email = user_email;
  
  -- Se usuário não encontrado
  IF user_record IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, false, NULL::TIMESTAMP WITH TIME ZONE, 'Usuário não encontrado';
    RETURN;
  END IF;
  
  -- Se é admin, sempre pode logar
  IF TRIM(user_record.role) = 'admin' THEN
    RETURN QUERY SELECT true, user_record.id, user_record.role, true, user_record.subscription_end_at, 'Login autorizado - Admin';
    RETURN;
  END IF;
  
  -- Verificar assinatura para usuários normais
  IF user_record.subscription_end_at IS NULL OR user_record.subscription_end_at > now() THEN
    RETURN QUERY SELECT true, user_record.id, user_record.role, true, user_record.subscription_end_at, 'Login autorizado';
  ELSE
    RETURN QUERY SELECT false, user_record.id, user_record.role, false, user_record.subscription_end_at, 'Assinatura expirada';
  END IF;
END;
$$;

-- Passo 6: Função administrativa para atualizar assinatura
CREATE OR REPLACE FUNCTION public.admin_update_user_subscription(
  target_user_id UUID,
  new_expiration TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  new_status TEXT DEFAULT NULL,
  extend_days INTEGER DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  new_expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  final_expiration TIMESTAMP WITH TIME ZONE;
  current_expiration TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Verificar se quem está executando é admin
  IF NOT public.is_admin(auth.uid()) THEN
    RETURN QUERY SELECT false, 'Acesso negado - apenas administradores', NULL::TIMESTAMP WITH TIME ZONE;
    RETURN;
  END IF;
  
  -- Buscar expiração atual
  SELECT subscription_end_at INTO current_expiration
  FROM profiles WHERE id = target_user_id;
  
  -- Determinar nova data de expiração
  IF new_expiration IS NOT NULL THEN
    final_expiration := new_expiration;
  ELSIF extend_days IS NOT NULL THEN
    final_expiration := COALESCE(current_expiration, now()) + (extend_days || ' days')::INTERVAL;
  ELSE
    final_expiration := current_expiration;
  END IF;
  
  -- Atualizar perfil
  UPDATE profiles 
  SET 
    subscription_end_at = final_expiration,
    subscription_status = COALESCE(new_status, subscription_status),
    updated_at = now()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Usuário não encontrado', NULL::TIMESTAMP WITH TIME ZONE;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT true, 'Assinatura atualizada com sucesso', final_expiration;
END;
$$;

-- Passo 7: Atualizar políticas RLS
DROP POLICY IF EXISTS "Permitir acesso ao próprio perfil" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR public.is_admin(auth.uid())
);

CREATE POLICY "Only admins can update profiles" ON public.profiles
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert profiles" ON public.profiles
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- Passo 8: Configurar cron job para limpeza automática
SELECT cron.schedule(
  'deactivate-expired-subscriptions',
  '0 1 * * *',
  $$
  SELECT public.deactivate_expired_subscriptions();
  $$
);

-- Passo 9: Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_end_at ON public.profiles(subscription_end_at);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
