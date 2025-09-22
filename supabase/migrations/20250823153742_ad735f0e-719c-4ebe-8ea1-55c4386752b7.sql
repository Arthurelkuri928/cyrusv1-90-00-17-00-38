
-- 1.1. Padronização dos Dados na tabela profiles
-- Converter role 'admin' para 'admin_master' e validar novos papéis

-- Primeiro, vamos atualizar os roles existentes
UPDATE public.profiles 
SET role = 'admin_master' 
WHERE TRIM(role) = 'admin';

-- Agora vamos criar uma constraint para validar apenas os roles permitidos
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin_master', 'gestor_operacoes', 'editor_conteudo', 'suporte', 'user'));

-- 1.2. Criação da Nova Função de Permissões Completa
-- Esta função mapeia cada role para suas ações específicas

CREATE OR REPLACE FUNCTION public.has_specific_permission(p_role text, p_action text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Normalizar o role (remover espaços)
  p_role := TRIM(p_role);
  
  -- Admin Master: Acesso total a tudo
  IF p_role = 'admin_master' THEN
    RETURN true;
  END IF;
  
  -- Gestor de Operações: Ferramentas e Usuários (sem exclusão de ferramentas)
  IF p_role = 'gestor_operacoes' THEN
    RETURN p_action IN (
      'admin.panel.view',
      'view_tools', 'edit_tools', 'manage_tool_credentials',
      'view_users', 'edit_user_subscription', 'extend_subscription', 'view_user_details'
    );
  END IF;
  
  -- Editor de Conteúdo: Páginas e Anúncios
  IF p_role = 'editor_conteudo' THEN
    RETURN p_action IN (
      'admin.panel.view',
      'view_pages', 'create_pages', 'edit_pages', 'delete_pages',
      'view_advertisements', 'create_advertisements', 'edit_advertisements', 'delete_advertisements',
      'manage_sidebar_links'
    );
  END IF;
  
  -- Suporte: Apenas visualização de usuários e assinaturas
  IF p_role = 'suporte' THEN
    RETURN p_action IN (
      'admin.panel.view',
      'view_users', 'view_user_details', 'view_subscription_history', 'extend_subscription'
    );
  END IF;
  
  -- User: Sem permissões administrativas
  IF p_role = 'user' THEN
    RETURN false;
  END IF;
  
  -- Role desconhecido
  RETURN false;
END;
$$;

-- Função para verificar permissão de um usuário específico
CREATE OR REPLACE FUNCTION public.user_has_permission(p_user_id uuid, p_action text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
BEGIN
  -- Buscar o role do usuário
  SELECT TRIM(role) INTO user_role FROM public.profiles WHERE id = p_user_id;
  
  -- Se não encontrar o usuário, retornar false
  IF user_role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Usar a função de permissões específicas
  RETURN public.has_specific_permission(user_role, p_action);
END;
$$;

-- Função de conveniência para o usuário atual
CREATE OR REPLACE FUNCTION public.current_user_can(p_action text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN public.user_has_permission(auth.uid(), p_action);
END;
$$;

-- 1.3. Manter compatibilidade com função is_admin() existente
-- Atualizar para reconhecer admin_master como admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND TRIM(role) IN ('admin_master', 'gestor_operacoes', 'editor_conteudo', 'suporte')
  );
$$;

-- Função de debug melhorada para diagnosticar o sistema
CREATE OR REPLACE FUNCTION public.debug_permissions_check()
RETURNS TABLE(
  current_user_id uuid, 
  user_exists boolean, 
  user_role text, 
  is_admin_result boolean,
  can_view_admin_panel boolean,
  can_manage_tools boolean,
  can_manage_users boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    auth.uid() as current_user_id,
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid()) as user_exists,
    TRIM((SELECT role FROM public.profiles WHERE id = auth.uid())) as user_role,
    public.is_admin(auth.uid()) as is_admin_result,
    public.current_user_can('admin.panel.view') as can_view_admin_panel,
    public.current_user_can('edit_tools') as can_manage_tools,
    public.current_user_can('manage_users') as can_manage_users;
$$;

-- Atualizar a função has_permission existente para usar a nova lógica
CREATE OR REPLACE FUNCTION public.has_permission(p_role text, p_action text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN public.has_specific_permission(p_role, p_action);
END;
$$;

-- Função para listar todas as permissões de um role
CREATE OR REPLACE FUNCTION public.get_role_permissions(p_role text)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  permissions text[];
  all_actions text[] := ARRAY[
    'admin.panel.view', 'view_users', 'edit_user_subscription', 'extend_subscription',
    'view_user_details', 'manage_users', 'view_tools', 'edit_tools', 'create_tools',
    'delete_tools', 'manage_tool_credentials', 'view_pages', 'create_pages', 'edit_pages',
    'delete_pages', 'view_advertisements', 'create_advertisements', 'edit_advertisements',
    'delete_advertisements', 'manage_sidebar_links', 'view_audit', 'view_subscription_history'
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
$$;
