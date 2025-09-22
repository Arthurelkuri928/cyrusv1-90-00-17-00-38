
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, Settings, RefreshCw } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  requiresPermission?: string;
}

interface AdminQuickActionsProps {
  onRefresh?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onSettings?: () => void;
  customActions?: QuickAction[];
}

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({
  onRefresh,
  onAdd,
  onExport,
  onImport,
  onSettings,
  customActions = []
}) => {
  const location = useLocation();
  const { can } = usePermissions();
  const currentPath = location.pathname;

  // Define actions based on current section
  const getContextualActions = (): QuickAction[] => {
    const baseActions: QuickAction[] = [];

    // Add refresh action for all pages
    if (onRefresh) {
      baseActions.push({
        id: 'refresh',
        label: 'Atualizar',
        icon: RefreshCw,
        onClick: onRefresh,
        variant: 'ghost'
      });
    }

    // Add contextual actions based on current path
    if (currentPath.includes('/usuarios') && can('manage_users') && onAdd) {
      baseActions.unshift({
        id: 'add-user',
        label: 'Novo Usuário',
        icon: Plus,
        onClick: onAdd,
        variant: 'default'
      });
    }

    if (currentPath.includes('/ferramentas') && can('create_tools') && onAdd) {
      baseActions.unshift({
        id: 'add-tool',
        label: 'Nova Ferramenta',
        icon: Plus,
        onClick: onAdd,
        variant: 'default'
      });
    }

    if (currentPath.includes('/anuncios') && can('create_advertisements') && onAdd) {
      baseActions.unshift({
        id: 'add-ad',
        label: 'Novo Anúncio',
        icon: Plus,
        onClick: onAdd,
        variant: 'default'
      });
    }

    // Add export/import actions where applicable
    if (onExport && (currentPath.includes('/usuarios') || currentPath.includes('/ferramentas'))) {
      baseActions.push({
        id: 'export',
        label: 'Exportar',
        icon: Download,
        onClick: onExport,
        variant: 'outline'
      });
    }

    if (onSettings) {
      baseActions.push({
        id: 'settings',
        label: 'Configurações',
        icon: Settings,
        onClick: onSettings,
        variant: 'ghost'
      });
    }

    return [...baseActions, ...customActions];
  };

  const actions = getContextualActions();

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant || 'ghost'}
          size="sm"
          onClick={action.onClick}
          className={`
            px-3 py-2 text-sm font-medium transition-all duration-200
            ${action.variant === 'default' 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : action.variant === 'outline'
              ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }
          `}
        >
          <action.icon className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};
