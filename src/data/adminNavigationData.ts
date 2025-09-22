import { 
  LayoutDashboard,
  MessageCircle,
  Users,
  Eye,
  Wrench,
  Link,
  Shield,
  Stethoscope,
  Settings,
  HelpCircle,
  User,
  Megaphone,
  Bell,
  Trash2
} from 'lucide-react';

export interface AdminNavItem {
  id: string;
  label: string;
  icon: any;
  count?: number;
  href: string;
  hasNotification?: boolean;
  active?: boolean;
}

export interface AdminNavSection {
  id: string;
  label?: string;
  items: AdminNavItem[];
}

export const adminNavigationData: AdminNavSection[] = [
  {
    id: 'geral',
    label: 'GERAL',
    items: [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: LayoutDashboard, 
        href: '/painel-admin/dashboard',
        active: true
      },
      { 
        id: 'usuarios', 
        label: 'Usuários', 
        icon: Users, 
        href: '/painel-admin/usuarios' 
      },
      { 
        id: 'notificacoes', 
        label: 'Notificações', 
        icon: Bell, 
        href: '/painel-admin/notificacoes' 
      },
      { 
        id: 'chat', 
        label: 'Chat', 
        icon: MessageCircle, 
        href: '/painel-admin/chat'
      }
    ]
  },
  {
    id: 'workspace',
    label: 'WORKSPACE',
    items: [
      { 
        id: 'ferramentas', 
        label: 'Ferramentas', 
        icon: Wrench, 
        href: '/painel-admin/ferramentas' 
      },
      { 
        id: 'lixeira-ferramentas', 
        label: 'Lixeira de Ferramentas', 
        icon: Trash2, 
        href: '/painel-admin/lixeira-ferramentas' 
      },
      { 
        id: 'anuncios', 
        label: 'Anúncios', 
        icon: Megaphone, 
        href: '/painel-admin/anuncios' 
      },
      { 
        id: 'visibilidade', 
        label: 'Visibilidade', 
        icon: Eye, 
        href: '/painel-admin/visibilidade' 
      },
      { 
        id: 'sidebar-links', 
        label: 'Links da Sidebar', 
        icon: Link, 
        href: '/painel-admin/sidebar-links' 
      }
    ]
  },
  {
    id: 'configuracoes',
    label: 'CONFIGURAÇÕES',
    items: [
      { 
        id: 'cabecalho', 
        label: 'Cabeçalho', 
        icon: Settings, 
        href: '/painel-admin/cabecalho' 
      },
      { 
        id: 'permissoes', 
        label: 'Permissões', 
        icon: Shield, 
        href: '/painel-admin/permissoes' 
      },
      { 
        id: 'diagnosticos', 
        label: 'Diagnósticos', 
        icon: Stethoscope, 
        href: '/painel-admin/diagnosticos' 
      },
      { 
        id: 'conta', 
        label: 'Minha Conta', 
        icon: User, 
        href: '/painel-admin/configuracoes-conta' 
      }
    ]
  }
];

export interface AdminDocument {
  id: string;
  title: string;
  type: 'diagnostics' | 'users' | 'tools' | 'notifications' | 'permissions';
  category: string;
  date: string;
  time: string;
  author?: string;
  status?: 'active' | 'connected' | 'pending';
  description?: string;
}

export const adminDocumentsData: AdminDocument[] = [
  {
    id: '1',
    title: 'Relatório de Diagnósticos do Sistema',
    type: 'diagnostics',
    category: 'Diagnósticos',
    date: 'March 5',
    time: '3:15 AM',
    description: 'Análise completa do sistema e performance'
  },
  {
    id: '2',
    title: 'Usuários Ativos - Dashboard',
    type: 'users',
    category: 'Usuários',
    date: 'March 5',
    time: '2:30 PM',
    status: 'active',
    description: 'Lista de usuários ativos no sistema'
  },
  {
    id: '3',
    title: 'Ferramentas Conectadas',
    type: 'tools',
    category: 'Ferramentas',
    date: 'March 4',
    time: '11:45 AM',
    status: 'connected',
    description: 'Status das integrações de ferramentas'
  },
  {
    id: '4',
    title: 'Notificações Pendentes',
    type: 'notifications',
    category: 'Notificações',
    date: 'March 4',
    time: '9:20 AM',
    status: 'pending',
    description: 'Lista de notificações aguardando processamento'
  },
  {
    id: '5',
    title: 'Configuração de Permissões',
    type: 'permissions',
    category: 'Permissões',
    date: 'March 3',
    time: '4:10 PM',
    description: 'Configurações de acesso e permissões do sistema'
  }
];

export const adminFilterCategories = [
  'Diagnósticos',
  'Usuários', 
  'Ferramentas',
  'Notificações',
  'Permissões',
  'Configurações'
];