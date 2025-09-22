-- ETAPA 1: Padronização dos Dados de Perfis e Estrutura de Permissões

-- 1. LIMPEZA E PADRONIZAÇÃO DE PAPÉIS
-- 1.1 Limpar espaços em branco dos roles existentes
UPDATE public.profiles SET role = TRIM(role);

-- 1.2 Converter admin existente para admin_master
UPDATE public.profiles SET role = 'admin_master' WHERE role = 'admin';

-- 1.3 Adicionar constraint de validação para roles permitidos
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_valid 
CHECK (role IN ('admin_master', 'gestor_operacoes', 'editor_conteudo', 'suporte', 'user'));

-- 2. CRIAÇÃO DAS FUNÇÕES DE PERMISSÃO

-- 2.1 Função principal que verifica permissões por usuário
CREATE OR REPLACE FUNCTION public.has_permission_for_user(p_user_id uuid, p_action text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_role text;
BEGIN
  -- Buscar o role do usuário
  SELECT role INTO user_role FROM public.profiles WHERE id = p_user_id;
  
  -- Se não encontrar o usuário, retornar false
  IF user_role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verificar permissões por role
  RETURN public.has_permission(user_role, p_action);
END;
$function$;

-- 2.2 Função que mapeia permissões por role
CREATE OR REPLACE FUNCTION public.has_permission(p_role text, p_action text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Admin Master: Acesso total
  IF p_role = 'admin_master' THEN
    RETURN true;
  END IF;
  
  -- Gestor de Operações: Ferramentas e Usuários (sem exclusão de ferramentas)
  IF p_role = 'gestor_operacoes' THEN
    RETURN p_action IN (
      'view_tools', 'edit_tools', 'manage_tool_credentials',
      'view_users', 'edit_user_subscription', 'extend_subscription',
      'view_user_details'
    );
  END IF;
  
  -- Editor de Conteúdo: Páginas e Anúncios
  IF p_role = 'editor_conteudo' THEN
    RETURN p_action IN (
      'view_pages', 'create_pages', 'edit_pages', 'delete_pages',
      'view_advertisements', 'create_advertisements', 'edit_advertisements', 'delete_advertisements',
      'manage_sidebar_links'
    );
  END IF;
  
  -- Suporte: Apenas visualização de usuários e assinaturas
  IF p_role = 'suporte' THEN
    RETURN p_action IN (
      'view_users', 'view_user_details', 'view_subscription_history',
      'extend_subscription'
    );
  END IF;
  
  -- User: Sem permissões administrativas
  IF p_role = 'user' THEN
    RETURN false;
  END IF;
  
  -- Role desconhecido
  RETURN false;
END;
$function$;

-- 2.3 Atualizar função is_admin para reconhecer admin_master
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND TRIM(role) IN ('admin', 'admin_master')
  );
$function$;

-- 3. TABELA DE AUDITORIA

-- 3.1 Criar tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  timestamp timestamp with time zone NOT NULL DEFAULT now()
);

-- 3.2 Habilitar RLS na tabela de auditoria
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 3.3 Política RLS: Apenas admins podem ver logs de auditoria
CREATE POLICY "Admin can view all audit logs" 
ON public.admin_audit_logs 
FOR SELECT 
USING (public.has_permission_for_user(auth.uid(), 'view_audit'));

-- 3.4 Política RLS: Sistema pode inserir logs (para triggers)
CREATE POLICY "System can insert audit logs" 
ON public.admin_audit_logs 
FOR INSERT 
WITH CHECK (true);

-- 3.5 Índices para performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_user_id ON public.admin_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON public.admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_timestamp ON public.admin_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_resource ON public.admin_audit_logs(resource_type, resource_id);

-- 4. CORREÇÕES DE SEGURANÇA - Atualizar funções existentes

-- 4.1 Atualizar função debug_admin_check
CREATE OR REPLACE FUNCTION public.debug_admin_check()
RETURNS TABLE(current_user_id uuid, user_exists boolean, user_role text, is_admin_result boolean)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 
    auth.uid() as current_user_id,
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid()) as user_exists,
    TRIM((SELECT role FROM public.profiles WHERE id = auth.uid())) as user_role,
    public.is_admin(auth.uid()) as is_admin_result;
$function$;

-- 4.2 Atualizar função validate_user_login
CREATE OR REPLACE FUNCTION public.validate_user_login(user_email text)
RETURNS TABLE(can_login boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN p.subscription_status = 'active' AND (p.subscription_end_at IS NULL OR p.subscription_end_at > now()) THEN true
      WHEN p.subscription_status = 'expired' OR (p.subscription_end_at IS NOT NULL AND p.subscription_end_at <= now()) THEN false
      WHEN p.subscription_status = 'suspended' THEN false
      ELSE true
    END as can_login,
    CASE 
      WHEN p.subscription_status = 'expired' OR (p.subscription_end_at IS NOT NULL AND p.subscription_end_at <= now()) THEN 'Sua assinatura expirou. Entre em contato com o suporte.'
      WHEN p.subscription_status = 'suspended' THEN 'Sua conta está suspensa. Entre em contato com o suporte.'
      ELSE 'Login autorizado'
    END as message
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE u.email = user_email;
END;
$function$;

-- 4.3 Atualizar função check_subscription_status
CREATE OR REPLACE FUNCTION public.check_subscription_status(user_id uuid)
RETURNS TABLE(is_valid boolean, status text, expires_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN p.subscription_status = 'active' AND (p.subscription_end_at IS NULL OR p.subscription_end_at > now()) THEN true
      ELSE false
    END as is_valid,
    COALESCE(p.subscription_status, 'active') as status,
    p.subscription_end_at as expires_at
  FROM public.profiles p
  WHERE p.id = user_id;
END;
$function$;

-- 4.4 Atualizar função admin_update_user_subscription
CREATE OR REPLACE FUNCTION public.admin_update_user_subscription(target_user_id uuid, new_expiration timestamp with time zone DEFAULT NULL::timestamp with time zone, new_status text DEFAULT NULL::text, extend_days integer DEFAULT NULL::integer)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  current_expiration TIMESTAMP WITH TIME ZONE;
  new_exp_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if caller has permission
  IF NOT public.has_permission_for_user(auth.uid(), 'edit_user_subscription') THEN
    RETURN QUERY SELECT false, 'Acesso negado. Você não tem permissão para executar esta ação.';
    RETURN;
  END IF;

  -- Get current expiration
  SELECT subscription_end_at INTO current_expiration 
  FROM public.profiles WHERE id = target_user_id;

  -- Calculate new expiration date
  IF extend_days IS NOT NULL THEN
    new_exp_date := COALESCE(current_expiration, now()) + (extend_days || ' days')::INTERVAL;
  ELSIF new_expiration IS NOT NULL THEN
    new_exp_date := new_expiration;
  ELSE
    new_exp_date := current_expiration;
  END IF;

  -- Update the subscription
  UPDATE public.profiles 
  SET 
    subscription_end_at = new_exp_date,
    subscription_status = COALESCE(new_status, subscription_status),
    updated_at = now()
  WHERE id = target_user_id;

  IF FOUND THEN
    RETURN QUERY SELECT true, 'Assinatura atualizada com sucesso.';
  ELSE
    RETURN QUERY SELECT false, 'Usuário não encontrado.';
  END IF;
END;
$function$;

-- 4.5 Atualizar função deactivate_expired_subscriptions
CREATE OR REPLACE FUNCTION public.deactivate_expired_subscriptions()
RETURNS TABLE(deactivated_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Check if caller has permission
  IF NOT public.has_permission_for_user(auth.uid(), 'manage_users') THEN
    RETURN QUERY SELECT 0;
    RETURN;
  END IF;

  -- Update expired subscriptions
  UPDATE public.profiles 
  SET 
    subscription_status = 'expired',
    updated_at = now()
  WHERE 
    subscription_end_at IS NOT NULL 
    AND subscription_end_at <= now() 
    AND subscription_status != 'expired';

  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  RETURN QUERY SELECT affected_rows;
END;
$function$;

-- 4.6 Atualizar função list_users_with_subscriptions
CREATE OR REPLACE FUNCTION public.list_users_with_subscriptions(search_term text DEFAULT ''::text, page_limit integer DEFAULT 50, page_offset integer DEFAULT 0)
RETURNS TABLE(id uuid, email text, role text, subscription_status text, subscription_type text, subscription_end_at timestamp with time zone, created_at timestamp without time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Check if caller has permission
  IF NOT public.has_permission_for_user(auth.uid(), 'view_users') THEN
    RAISE EXCEPTION 'Access denied. You do not have permission to list users.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    au.email,
    p.role,
    p.subscription_status,
    p.subscription_type,
    p.subscription_end_at,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  WHERE 
    (search_term = '' OR 
     au.email ILIKE '%' || search_term || '%' OR
     p.role ILIKE '%' || search_term || '%')
  ORDER BY p.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$function$;

-- 4.7 Atualizar função count_users_with_subscriptions
CREATE OR REPLACE FUNCTION public.count_users_with_subscriptions(search_term text DEFAULT ''::text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_count integer;
BEGIN
  -- Check if caller has permission
  IF NOT public.has_permission_for_user(auth.uid(), 'view_users') THEN
    RAISE EXCEPTION 'Access denied. You do not have permission to count users.';
  END IF;

  SELECT COUNT(*)::integer INTO user_count
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  WHERE 
    (search_term = '' OR 
     au.email ILIKE '%' || search_term || '%' OR
     p.role ILIKE '%' || search_term || '%');

  RETURN user_count;
END;
$function$;

-- 5. FUNÇÃO AUXILIAR PARA LOGS DE AUDITORIA
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action text,
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.admin_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    timestamp
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    now()
  );
END;
$function$;