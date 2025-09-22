
-- 1) Garantir índice único para suportar ON CONFLICT (code)
CREATE UNIQUE INDEX IF NOT EXISTS permissions_code_key ON public.permissions (code);

-- 2) Inserir a nova permissão (idempotente)
INSERT INTO public.permissions (code, name, description, category)
VALUES (
  'manage_user_permissions',
  'Gerenciar Permissões de Usuários',
  'Permite alterar permissões específicas de outros usuários administrativos',
  'admin.users'
)
ON CONFLICT (code) DO NOTHING;

-- 3) Conceder automaticamente a permissão a TODOS os admin_master (evita hardcode de UUID)
INSERT INTO public.admin_permissions (admin_id, permission_id, granted_by, granted_at)
SELECT
  p.id AS admin_id,
  perm.id AS permission_id,
  p.id AS granted_by, -- o próprio admin_master consta como quem concedeu
  now() AS granted_at
FROM public.profiles p
CROSS JOIN LATERAL (
  SELECT id FROM public.permissions WHERE code = 'manage_user_permissions'
) AS perm
WHERE TRIM(p.role) = 'admin_master'
  AND NOT EXISTS (
    SELECT 1 FROM public.admin_permissions ap
    WHERE ap.admin_id = p.id AND ap.permission_id = perm.id
  );

-- 4) Atualizar a função para listar usuários administrativos INCLUINDO admin_master
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
  SELECT TRIM(p.role) INTO caller_role FROM public.profiles p WHERE p.id = auth.uid();
  
  IF caller_role IS NULL OR caller_role != 'admin_master' THEN
    RAISE EXCEPTION 'Access denied. Only admin_master can list admin users.';
  END IF;

  -- Retornar usuários administrativos (inclui admin_master; exclui apenas "user")
  RETURN QUERY
  SELECT 
    p.id,
    au.email,
    TRIM(p.role) as role
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  WHERE TRIM(p.role) IN ('admin_master', 'gestor_operacoes', 'editor_conteudo', 'suporte')
  ORDER BY au.email ASC;
END;
$function$;

-- 5) Atualizar get_role_permissions para incluir o novo código (coerência no backend)
CREATE OR REPLACE FUNCTION public.get_role_permissions(p_role text)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  permissions text[];
  all_actions text[] := ARRAY[
    'admin.panel.view', 'view_users', 'edit_user_subscription', 'extend_subscription',
    'view_user_details', 'manage_users', 'view_tools', 'edit_tools', 'create_tools',
    'delete_tools', 'manage_tool_credentials', 'view_pages', 'create_pages', 'edit_pages',
    'delete_pages', 'view_advertisements', 'create_advertisements', 'edit_advertisements',
    'delete_advertisements', 'manage_sidebar_links', 'view_audit', 'view_subscription_history',
    'manage_user_permissions'
  ];
  action text;
BEGIN
  permissions := ARRAY[]::text[];
  
  FOREACH action IN ARRAY all_actions
  LOOP
    IF public.has_specific_permission(p_role, action) THEN
      permissions := array_append(permissions, action);
    END IF;
  END LOOP;
  
  RETURN permissions;
END;
$function$;

-- 6) Verificação opcional (consulta)
-- SELECT p.code, p.name, p.category, COUNT(ap.admin_id) AS granted_to_users
-- FROM public.permissions p
-- LEFT JOIN public.admin_permissions ap ON p.id = ap.permission_id
-- WHERE p.code = 'manage_user_permissions'
-- GROUP BY p.id, p.code, p.name, p.category;
