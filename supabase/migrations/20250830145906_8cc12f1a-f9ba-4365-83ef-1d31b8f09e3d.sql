
-- Criar função RPC para buscar usuários administradores (otimizada para autocomplete)
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE(id uuid, email text, role text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  caller_role text;
BEGIN
  -- Verificar se o usuário atual é admin_master
  SELECT TRIM(role) INTO caller_role FROM public.profiles WHERE id = auth.uid();
  
  IF caller_role IS NULL OR caller_role != 'admin_master' THEN
    RAISE EXCEPTION 'Access denied. Only admin_master can list admin users.';
  END IF;

  -- Retornar usuários administradores (exceto admin_master e user)
  RETURN QUERY
  SELECT 
    p.id,
    au.email,
    TRIM(p.role) as role
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  WHERE TRIM(p.role) IN ('gestor_operacoes', 'editor_conteudo', 'suporte')
  ORDER BY au.email ASC;
END;
$function$
