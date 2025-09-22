
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Eye, 
  Settings, 
  Shield, 
  FileText, 
  Stethoscope,
  Bell,
  Send,
  Megaphone,
  Link
} from 'lucide-react';
import type { Action } from '@/shared/permissions';

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  permission: Action;
  badge: string | null;
  adminMasterOnly?: boolean;
}

export interface MenuCategory {
  id: string;
  label: string;
  icon: any;
  permission: Action;
  subItems: MenuSubItem[];
}

export interface MenuSubItem {
  id: string;
  label: string;
  icon: any;
  to: string;
  permission: Action;
}

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/painel-admin/dashboard',
    permission: 'admin.panel.view',
    badge: null
  },
  {
    id: 'users',
    label: 'Usuários',
    icon: Users,
    path: '/painel-admin/usuarios',
    permission: 'view_users',
    badge: null
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    icon: Wrench,
    path: '/painel-admin/ferramentas',
    permission: 'view_tools',
    badge: null
  },
  {
    id: 'advertisements',
    label: 'Anúncios',
    icon: Megaphone,
    path: '/painel-admin/anuncios',
    permission: 'view_advertisements',
    badge: null
  },
  {
    id: 'header',
    label: 'Cabeçalho',
    icon: Settings,
    path: '/painel-admin/cabecalho',
    permission: 'admin.panel.view',
    badge: null
  },
  {
    id: 'visibility',
    label: 'Visibilidade',
    icon: Eye,
    path: '/painel-admin/visibilidade',
    permission: 'view_pages',
    badge: null
  },
  {
    id: 'sidebar-links',
    label: 'Links da Sidebar',
    icon: Link,
    path: '/painel-admin/sidebar-links',
    permission: 'admin.panel.view',
    badge: null
  },
  {
    id: 'notifications',
    label: 'Notificações',
    icon: Bell,
    path: '/painel-admin/notificacoes',
    permission: 'view_admin_notifications',
    badge: null
  },
  {
    id: 'permissions',
    label: 'Permissões',
    icon: Shield,
    path: '/painel-admin/permissoes',
    permission: 'manage_users',
    badge: null,
    adminMasterOnly: true
  },
  {
    id: 'diagnostics',
    label: 'Diagnósticos',
    icon: Stethoscope,
    path: '/painel-admin/diagnosticos',
    permission: 'admin.panel.view',
    badge: null
  }
];

// Admin menu config for sidebar
export const adminMenuConfig: MenuCategory[] = [
  {
    id: 'general',
    label: 'Geral',
    icon: LayoutDashboard,
    permission: 'admin.panel.view',
    subItems: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        to: '/painel-admin/dashboard',
        permission: 'admin.panel.view'
      }
    ]
  },
  {
    id: 'users',
    label: 'Usuários',
    icon: Users,
    permission: 'view_users',
    subItems: [
      {
        id: 'users-management',
        label: 'Gerenciar Usuários',
        icon: Users,
        to: '/painel-admin/usuarios',
        permission: 'view_users'
      }
    ]
  },
  {
    id: 'content',
    label: 'Conteúdo',
    icon: Wrench,
    permission: 'view_tools',
    subItems: [
      {
        id: 'tools',
        label: 'Ferramentas',
        icon: Wrench,
        to: '/painel-admin/ferramentas',
        permission: 'view_tools'
      },
      {
        id: 'advertisements',
        label: 'Anúncios',
        icon: Megaphone,
        to: '/painel-admin/anuncios',
        permission: 'view_advertisements'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    permission: 'admin.panel.view',
    subItems: [
      {
        id: 'header',
        label: 'Cabeçalho',
        icon: Settings,
        to: '/painel-admin/cabecalho',
        permission: 'admin.panel.view'
      },
      {
        id: 'visibility',
        label: 'Visibilidade',
        icon: Eye,
        to: '/painel-admin/visibilidade',
        permission: 'view_pages'
      },
      {
        id: 'sidebar-links',
        label: 'Links da Sidebar',
        icon: Link,
        to: '/painel-admin/sidebar-links',
        permission: 'admin.panel.view'
      }
    ]
  },
  {
    id: 'notifications',
    label: 'Comunicados',
    icon: Bell,
    permission: 'view_admin_notifications',
    subItems: [
      {
        id: 'notifications-view',
        label: 'Notificações',
        icon: Bell,
        to: '/painel-admin/notificacoes',
        permission: 'view_admin_notifications'
      }
    ]
  },
  {
    id: 'system',
    label: 'Sistema',
    icon: Stethoscope,
    permission: 'admin.panel.view',
    subItems: [
      {
        id: 'permissions',
        label: 'Permissões',
        icon: Shield,
        to: '/painel-admin/permissoes',
        permission: 'manage_users'
      },
      {
        id: 'diagnostics',
        label: 'Diagnósticos',
        icon: Stethoscope,
        to: '/painel-admin/diagnosticos',
        permission: 'admin.panel.view'
      }
    ]
  }
];
