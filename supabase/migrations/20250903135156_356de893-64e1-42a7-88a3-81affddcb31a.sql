
-- RPC para listar administradores com permissões efetivas (dinâmicas ou estáticas)
CREATE OR REPLACE FUNCTION public.get_admin_users_with_permissions()
RETURNS TABLE(
  id uuid,
  email text,
  role text,
  permissions_codes text[],
  source text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  caller_role text;
BEGIN
  -- Garantir que apenas admin_master possa consultar
  SELECT TRIM(p.role) INTO caller_role
  FROM public.profiles p
  WHERE p.id = auth.uid();

  IF caller_role IS NULL OR caller_role <> 'admin_master' THEN
    RAISE EXCEPTION 'Access denied. Only admin_master can list admin users.';
  END IF;

  -- Montar a lista de admins e suas permissões efetivas
  RETURN QUERY
  WITH admins AS (
    SELECT 
      p.id,
      TRIM(p.role) AS role,
      au.email::text AS email
    FROM public.profiles p
    JOIN auth.users au ON au.id = p.id
    WHERE TRIM(p.role) IN ('admin_master', 'gestor_operacoes', 'editor_conteudo', 'suporte')
  ),
  dyn AS (
    SELECT 
      ap.admin_id,
      ARRAY_AGG(perm.code ORDER BY perm.code) AS codes
    FROM public.admin_permissions ap
    JOIN public.permissions perm ON perm.id = ap.permission_id
    GROUP BY ap.admin_id
  )
  SELECT
    a.id,
    a.email,
    a.role,
    COALESCE(d.codes, public.get_role_permissions(a.role)) AS permissions_codes,
    CASE WHEN d.codes IS NULL THEN 'static'::text ELSE 'dynamic'::text END AS source
  FROM admins a
  LEFT JOIN dyn d ON d.admin_id = a.id
  ORDER BY a.email;
END;
$function$;
