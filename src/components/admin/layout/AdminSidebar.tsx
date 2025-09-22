import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard,
  Bell,
  Users,
  Building2,
  Settings,
  User,
  ChevronDown,
  ChevronLeft,
  HelpCircle,
  Wrench,
  Shield,
  Trash2,
  Stethoscope,
  Eye,
  Link,
  LogOut,
  Menu
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import cyrusLogo from '@/assets/cyrus-logo.png';

// Hierarchical menu structure inspired by ClickUp
interface SidebarSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  to?: string;
  hasNotification?: boolean;
  active?: boolean;
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Geral",
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/painel-admin/dashboard' },
      { id: 'users', label: 'Usuários', icon: Users, to: '/painel-admin/usuarios' },
      { id: 'notifications', label: 'Notificações', icon: Bell, to: '/painel-admin/notificacoes', hasNotification: true },
    ]
  },
  {
    title: "Workspace",
    items: [
      { id: 'overview', label: 'Visão Geral', icon: Eye, to: '/painel-admin/visao-geral' },
      { id: 'tools', label: 'Ferramentas', icon: Wrench, to: '/painel-admin/ferramentas' },
      { id: 'tools-trash', label: 'Lixeira', icon: Trash2, to: '/painel-admin/lixeira-ferramentas' },
      { id: 'integrations', label: 'Integrações', icon: Link, to: '/painel-admin/integracoes' }
    ]
  },
  {
    title: "Configurações",
    items: [
      { id: 'account-settings', label: 'Minha Conta', icon: User, to: '/painel-admin/configuracoes-conta', active: true },
      { id: 'permissions', label: 'Permissões', icon: Shield, to: '/painel-admin/permissoes' },
      { id: 'diagnostics', label: 'Diagnósticos', icon: Stethoscope, to: '/painel-admin/diagnosticos' }
    ]
  }
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { can } = usePermissions();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Todas as categorias abertas por padrão
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Geral": true,
    "Workspace": true,
    "Configurações": true,
  });

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSection = (title: string) => {
    if (!collapsed) {
      setExpandedSections(prev => ({ 
        ...prev, 
        [title]: !prev[title] 
      }));
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getNavCls = (isActiveState: boolean) =>
    isActiveState 
      ? 'bg-primary/10 text-primary border border-primary/20 font-medium' 
      : 'text-muted-foreground hover:bg-accent hover:text-foreground';

  return (
    <div className={`${collapsed ? 'w-16' : 'w-[280px]'} fixed left-4 top-4 bottom-4 bg-background/80 backdrop-blur-xl text-foreground rounded-2xl shadow-2xl transition-all duration-300 ease-in-out flex flex-col border border-border/50`}>
      {/* Header com toggle */}
      <div className="p-3 mb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-2 rounded-lg shadow-lg">
              <img 
                src={cyrusLogo} 
                alt="Cyrus Logo" 
                className="h-5 w-5 object-contain filter drop-shadow-sm" 
              />
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold text-primary whitespace-nowrap select-none">
                Cyrus Admin
              </h1>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2 hover:bg-accent transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Search - só aparece quando expandido */}
      {!collapsed && (
        <div className="relative mb-4 px-3">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Pesquisar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-card/50 text-foreground border border-border/50 rounded-lg pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors backdrop-blur-sm"
      />
          <kbd className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-card/50 px-1.5 py-0.5 rounded border border-border/50">
            ⌘K
          </kbd>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-3">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h2
              className={`text-xs font-semibold text-muted-foreground uppercase mb-2 cursor-pointer flex justify-between items-center select-none transition-colors hover:text-foreground px-3 ${collapsed ? 'justify-center' : ''}`}
              onClick={() => toggleSection(section.title)}
            >
              {!collapsed && (
                <>
                  {section.title}
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${expandedSections[section.title] ? 'rotate-180' : ''}`}
                  />
                </>
              )}
              {collapsed && (
                <div className="w-6 h-0.5 bg-muted-foreground rounded"></div>
              )}
            </h2>

            {(expandedSections[section.title] || collapsed) && (
              <ul className="space-y-0">
                {section.items.map((item, itemIndex) => (
                  <li key={item.id}>
                    <NavLink 
                      to={item.to || '#'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-all duration-200 ${getNavCls(isActive || item.active)} ${collapsed ? 'justify-center' : ''} relative`
                      }
                      title={collapsed ? item.label : ''}
                    >
                      <item.icon className="h-6 w-6 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="select-none">{item.label}</span>
                          {item.hasNotification && (
                            <div className="w-2 h-2 bg-primary rounded-full ml-auto animate-pulse"></div>
                          )}
                        </>
                      )}
                      {collapsed && item.hasNotification && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      )}
                     </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Support Section */}
      <div className={`group mt-auto bg-gradient-to-br from-card/50 to-card/30 border border-border/50 rounded-xl transition-all duration-300 backdrop-blur-sm hover:from-card/60 hover:to-card/40 shadow-lg hover:shadow-xl ${collapsed ? 'm-2 p-2' : 'm-4 p-4'}`}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={`relative z-10 flex items-center gap-3 ${collapsed ? 'justify-center' : 'mb-3'}`}>
          <div className={`rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 p-1.5 ${collapsed ? '' : 'group-hover:scale-110 transition-transform duration-300'}`}>
            <HelpCircle className={`h-4 w-4 text-purple-400 ${collapsed ? 'animate-pulse' : ''}`} />
          </div>
          {!collapsed && (
            <div>
              <p className="font-semibold text-foreground text-sm select-none">Precisa de ajuda?</p>
              <p className="text-xs text-muted-foreground select-none leading-relaxed">
                Entre em contato com nossos agentes
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="relative z-10 w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium py-2 rounded-lg text-sm hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-background">
            Entrar em contato
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;