
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Eye, 
  Megaphone, 
  Link, 
  Settings,
  Stethoscope,
  Bell,
  Send
} from 'lucide-react';

export const routeCategories = {
  '/painel-admin': 'Dashboard',
  '/painel-admin/dashboard': 'Dashboard',
  '/painel-admin/usuarios': 'Gestão de Usuários', 
  '/painel-admin/ferramentas': 'Gestão de Ferramentas',
  '/painel-admin/cabecalho': 'Configurações do Cabeçalho',
  '/painel-admin/visibilidade': 'Gestão de Páginas',
  '/painel-admin/anuncios': 'Gestão de Anúncios',
  '/painel-admin/sidebar-links': 'Configurações da Sidebar',
  '/painel-admin/notificacoes': 'Gerenciar Notificações',
  '/painel-admin/chat': 'Sistema de Chat',
  '/painel-admin/diagnosticos': 'Diagnósticos do Sistema'
};

export function getCurrentCategoryLabel(pathname: string): string {
  for (const route in routeCategories) {
    if (pathname.startsWith(route)) {
      return routeCategories[route] || 'Painel Administrativo';
    }
  }
  return 'Painel Administrativo';
}

export function getTopBarTabs(pathname: string) {
  const config = topBarSectionConfig[pathname] || topBarSectionConfig.default;
  return config.tabs;
}

export function getTopBarActions(pathname: string) {
  const config = topBarSectionConfig[pathname] || topBarSectionConfig.default;
  return config.actions;
}

export const topBarSectionConfig = {
  '/painel-admin/dashboard': {
    tabs: [
      { id: 'todos', label: 'Todos' },
      { id: 'meus_docs', label: 'Meus docs' },
      { id: 'favoritos', label: 'Favoritos' },
      { id: 'compartilhados', label: 'Compartilhados' },
      { id: 'removidos', label: 'Removidos' },
    ],
    actions: [
      { id: 'agrupar', label: 'Agrupar', icon: 'Rows' },
      { id: 'ordenar', label: 'Ordenar', icon: 'ArrowDownUp' },
      { id: 'visualizar', label: 'Visualizar', icon: 'Eye' },
      { id: 'filtrar', label: 'Filtrar', icon: 'Filter' },
    ],
  },
  '/painel-admin/usuarios': {
    tabs: [
      { id: 'todos', label: 'Todos os Usuários', filterStatus: null },
      { id: 'ativos', label: 'Ativos', filterStatus: 'active' },
      { id: 'expirados', label: 'Expirados', filterStatus: 'expired' },
      { id: 'suspensos', label: 'Suspensos', filterStatus: 'suspended' },
    ],
    actions: [
      { id: 'filtrar_cargo', label: 'Filtrar por Cargo', icon: 'Filter' },
      { id: 'exportar', label: 'Exportar Lista', icon: 'Download' },
    ],
  },
  '/painel-admin/ferramentas': {
    tabs: [
      { id: 'todas', label: 'Todas as Ferramentas' },
      { id: 'ativas', label: 'Ativas' },
      { id: 'inativas', label: 'Inativas' },
      { id: 'manutencao', label: 'Em Manutenção' },
    ],
    actions: [
      { id: 'filtrar_categoria', label: 'Filtrar', icon: 'Filter' },
      { id: 'nova_ferramenta', label: 'Nova Ferramenta', icon: 'Plus', primary: true },
    ],
  },
  '/painel-admin/notificacoes': {
    tabs: [
      { id: 'recentes', label: 'Recentes' },
      { id: 'nao_lidas', label: 'Não Lidas' },
      { id: 'historico', label: 'Histórico' },
    ],
    actions: [
      { id: 'marcar_lidas', label: 'Marcar como Lidas', icon: 'Check' },
      { id: 'nova_notificacao', label: 'Enviar Notificação', icon: 'Send', primary: true },
    ],
  },
  '/painel-admin/chat': {
    tabs: [
      { id: 'conversas', label: 'Conversas' },
      { id: 'ativas', label: 'Ativas' },
      { id: 'arquivadas', label: 'Arquivadas' },
    ],
    actions: [
      { id: 'buscar', label: 'Buscar', icon: 'Search' },
      { id: 'nova_conversa', label: 'Nova Conversa', icon: 'Plus', primary: true },
    ],
  },
  default: {
    tabs: [{ id: 'geral', label: 'Visão Geral' }],
    actions: [{ id: 'filtrar', label: 'Filtrar', icon: 'Filter' }],
  }
};

export const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/painel-admin/dashboard',
    permission: 'admin.panel.view' as const,
    badge: null
  },
  {
    id: 'users',
    label: 'Usuários',
    icon: Users,
    path: '/painel-admin/usuarios',
    permission: 'view_users' as const,
    badge: null
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    icon: Wrench,
    path: '/painel-admin/ferramentas',
    permission: 'view_tools' as const,
    badge: null
  },
  {
    id: 'header',
    label: 'Cabeçalho',
    icon: Settings,
    path: '/painel-admin/cabecalho',
    permission: 'admin.panel.view' as const,
    badge: null
  },
  {
    id: 'visibility',
    label: 'Visibilidade',
    icon: Eye,
    path: '/painel-admin/visibilidade',
    permission: 'view_pages' as const,
    badge: null
  },
  {
    id: 'advertisements',
    label: 'Anúncios',
    icon: Megaphone,
    path: '/painel-admin/anuncios',
    permission: 'view_advertisements' as const,
    badge: null
  },
  {
    id: 'sidebar-links',
    label: 'Links da Sidebar',
    icon: Link,
    path: '/painel-admin/sidebar-links',
    permission: 'admin.panel.view' as const,
    badge: null
  },
  {
    id: 'notifications',
    label: 'Notificações',
    icon: Bell,
    path: '/painel-admin/notificacoes',
    permission: 'admin.panel.view' as const,
    badge: null
  },
  {
    id: 'diagnostics',
    label: 'Diagnósticos',
    icon: Stethoscope,
    path: '/painel-admin/diagnosticos',
    permission: 'admin.panel.view' as const,
    badge: null
  }
];
