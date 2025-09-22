
-- 1) Função para determinar se um usuário é "membro" (assinatura ativa)
CREATE OR REPLACE FUNCTION public.is_member(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_status  text;
  v_expires timestamptz;
BEGIN
  SELECT TRIM(subscription_status), subscription_end_at
  INTO v_status, v_expires
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_status IS NULL THEN
    RETURN false;
  END IF;

  RETURN (v_status = 'active') AND (v_expires IS NULL OR v_expires > now());
END;
$function$;

-- 2) Atualizar as políticas da tabela tools
-- Remover política antiga de leitura (se existir)
DROP POLICY IF EXISTS "Allow authenticated users to read tools" ON public.tools;

-- Permitir leitura para admins (veem tudo)
CREATE POLICY "Admins can read all tools"
ON public.tools
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Permitir leitura para membros autenticados
CREATE POLICY "Members can read tools"
ON public.tools
FOR SELECT
TO authenticated
USING (public.is_member(auth.uid()));
