-- Criar RPC para obter permissões dinâmicas de um usuário específico
CREATE OR REPLACE FUNCTION public.get_user_dynamic_permissions(p_user_id uuid)
RETURNS TABLE(code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Retorna as permissões específicas do usuário através da tabela admin_permissions
  RETURN QUERY
  SELECT p.code
  FROM public.admin_permissions ap
  JOIN public.permissions p ON ap.permission_id = p.id
  WHERE ap.admin_id = p_user_id;
END;
$function$;

-- Criar RPC para obter permissões híbridas (dinâmicas + role fallback)
CREATE OR REPLACE FUNCTION public.get_user_hybrid_permissions(p_user_id uuid)
RETURNS TABLE(code text, source text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role text;
  has_dynamic_permissions boolean := false;
BEGIN
  -- Verificar se o usuário tem permissões dinâmicas
  SELECT EXISTS(
    SELECT 1 FROM public.admin_permissions WHERE admin_id = p_user_id
  ) INTO has_dynamic_permissions;
  
  IF has_dynamic_permissions THEN
    -- Se tem permissões dinâmicas, usar apenas elas
    RETURN QUERY
    SELECT p.code, 'dynamic'::text as source
    FROM public.admin_permissions ap
    JOIN public.permissions p ON ap.permission_id = p.id
    WHERE ap.admin_id = p_user_id;
  ELSE
    -- Se não tem permissões dinâmicas, usar permissões do role
    SELECT TRIM(role) INTO user_role 
    FROM public.profiles 
    WHERE id = p_user_id;
    
    -- Retornar permissões baseadas no role usando has_specific_permission
    RETURN QUERY
    SELECT 
      unnest(ARRAY[
        'admin.panel.view', 'view_users', 'edit_user_subscription', 'extend_subscription',
        'view_user_details', 'manage_users', 'change_user_role', 'manage_user_permissions',
        'view_tools', 'edit_tools', 'create_tools', 'delete_tools', 'manage_tool_credentials',
        'view_pages', 'create_pages', 'edit_pages', 'delete_pages',
        'view_advertisements', 'create_advertisements', 'edit_advertisements', 'delete_advertisements',
        'manage_sidebar_links', 'view_admin_notifications', 'create_admin_notifications',
        'view_audit', 'view_subscription_history'
      ]) as code,
      'static'::text as source
    WHERE public.has_specific_permission(user_role, unnest(ARRAY[
      'admin.panel.view', 'view_users', 'edit_user_subscription', 'extend_subscription',
      'view_user_details', 'manage_users', 'change_user_role', 'manage_user_permissions',
      'view_tools', 'edit_tools', 'create_tools', 'delete_tools', 'manage_tool_credentials',
      'view_pages', 'create_pages', 'edit_pages', 'delete_pages',
      'view_advertisements', 'create_advertisements', 'edit_advertisements', 'delete_advertisements',
      'manage_sidebar_links', 'view_admin_notifications', 'create_admin_notifications',
      'view_audit', 'view_subscription_history'
    ]));
  END IF;
END;
$function$;