/**
 * Sistema de Permissões - Mapeamento Frontend
 * 
 * Define os tipos de roles, ações e o mapa de permissões
 * que corresponde exatamente ao sistema implementado no backend
 */

// Tipos de Roles disponíveis no sistema
export type Role = 'admin_master' | 'gestor_operacoes' | 'editor_conteudo' | 'suporte' | 'user';

// Ações disponíveis no sistema (correspondem às ações do backend)
export type Action = 
  // Acesso ao painel administrativo
  | 'admin.panel.view'
  
  // Gerenciamento de usuários
  | 'view_users'
  | 'edit_user_subscription'
  | 'extend_subscription'
  | 'view_user_details'
  | 'manage_users'
  | 'change_user_role'
  | 'manage_user_permissions'
  
  // Gerenciamento de ferramentas
  | 'view_tools'
  | 'edit_tools'
  | 'create_tools'
  | 'delete_tools'
  | 'manage_tool_credentials'
  
  // Gerenciamento de páginas
  | 'view_pages'
  | 'create_pages'
  | 'edit_pages'
  | 'delete_pages'
  
  // Gerenciamento de anúncios
  | 'view_advertisements'
  | 'create_advertisements'
  | 'edit_advertisements'
  | 'delete_advertisements'
  
  // Gerenciamento de links da sidebar
  | 'manage_sidebar_links'
  
  // Sistema de notificações internas
  | 'view_admin_notifications'
  | 'create_admin_notifications'
  
  // Auditoria e logs
  | 'view_audit'
  | 'view_subscription_history';

/**
 * Mapa de permissões por role
 * Define exatamente quais ações cada role pode executar
 */
export const ROLE_PERMISSIONS: Record<Role, Action[]> = {
  // Administrador Master: Acesso total
  admin_master: [
    'admin.panel.view',
    'view_users',
    'edit_user_subscription',
    'extend_subscription',
    'view_user_details',
    'manage_users',
    'change_user_role',
    'manage_user_permissions',
    'view_tools',
    'edit_tools',
    'create_tools',
    'delete_tools',
    'manage_tool_credentials',
    'view_pages',
    'create_pages',
    'edit_pages',
    'delete_pages',
    'view_advertisements',
    'create_advertisements',
    'edit_advertisements',
    'delete_advertisements',
    'manage_sidebar_links',
    'view_admin_notifications',
    'create_admin_notifications',
    'view_audit',
    'view_subscription_history'
  ],

  // Gestor de Operações: Ferramentas e Usuários (sem exclusão de ferramentas)
  gestor_operacoes: [
    'admin.panel.view',
    'view_tools',
    'edit_tools',
    'manage_tool_credentials',
    'view_users',
    'edit_user_subscription',
    'extend_subscription',
    'view_user_details',
    'view_admin_notifications'
  ],

  // Editor de Conteúdo: Páginas e Anúncios
  editor_conteudo: [
    'admin.panel.view',
    'view_pages',
    'create_pages',
    'edit_pages',
    'delete_pages',
    'view_advertisements',
    'create_advertisements',
    'edit_advertisements',
    'delete_advertisements',
    'manage_sidebar_links',
    'view_admin_notifications'
  ],

  // Suporte: Apenas visualização de usuários e assinaturas
  suporte: [
    'admin.panel.view',
    'view_users',
    'view_user_details',
    'view_subscription_history',
    'extend_subscription',
    'view_admin_notifications'
  ],

  // User: Sem permissões administrativas
  user: []
};

/**
 * Verifica se um role específico tem uma determinada permissão
 */
export function hasPermission(role: Role, action: Action): boolean {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}

/**
 * Verifica se um role tem acesso ao painel administrativo
 */
export function canAccessAdminPanel(role: Role): boolean {
  return hasPermission(role, 'admin.panel.view');
}

/**
 * Obtém todas as permissões de um role específico
 */
export function getRolePermissions(role: Role): Action[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Verifica se um role é considerado administrativo (tem acesso ao painel)
 */
export function isAdminRole(role: Role): boolean {
  return role !== 'user';
}

/**
 * Mapeia os roles para nomes legíveis em português
 */
export const ROLE_LABELS: Record<Role, string> = {
  admin_master: 'Administrador Master',
  gestor_operacoes: 'Gestor de Operações',
  editor_conteudo: 'Editor de Conteúdo',
  suporte: 'Suporte e Atendimento',
  user: 'Usuário'
};

/**
 * Obtém o label legível de um role
 */
export function getRoleLabel(role: Role): string {
  return ROLE_LABELS[role] || role;
}
