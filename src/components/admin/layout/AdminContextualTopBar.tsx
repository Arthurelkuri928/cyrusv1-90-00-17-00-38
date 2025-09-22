
import React, { useState } from 'react';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { AdminTabsNavigation } from './AdminTabsNavigation';
import { AdminViewToggle } from './AdminViewToggle';
import { AdminQuickActions } from './AdminQuickActions';
import { AdminQuickSearch } from './AdminQuickSearch';
import { useLocation } from 'react-router-dom';

interface AdminContextualTopBarProps {
  // View toggle props
  currentView?: 'grid' | 'list' | 'table';
  onViewChange?: (view: 'grid' | 'list' | 'table') => void;
  availableViews?: ('grid' | 'list' | 'table')[];
  
  // Search props
  searchValue?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  
  // Quick actions props
  onRefresh?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onSettings?: () => void;
  customActions?: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }>;
  
  // Additional props
  showSearch?: boolean;
  showViewToggle?: boolean;
  showQuickActions?: boolean;
}

export const AdminContextualTopBar: React.FC<AdminContextualTopBarProps> = ({
  currentView = 'grid',
  onViewChange,
  availableViews,
  searchValue = '',
  onSearch,
  searchPlaceholder,
  onRefresh,
  onAdd,
  onExport,
  onImport,
  onSettings,
  customActions,
  showSearch = true,
  showViewToggle = true,
  showQuickActions = true,
}) => {
  const location = useLocation();

  // Determine search placeholder based on current page
  const getSearchPlaceholder = () => {
    if (searchPlaceholder) return searchPlaceholder;
    
    const path = location.pathname;
    if (path.includes('/usuarios')) return 'Buscar usuários...';
    if (path.includes('/ferramentas')) return 'Buscar ferramentas...';
    if (path.includes('/anuncios')) return 'Buscar anúncios...';
    if (path.includes('/visibilidade')) return 'Buscar páginas...';
    return 'Buscar...';
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section - Breadcrumb and Tabs */}
        <div className="flex items-center space-x-8">
          <AdminBreadcrumb />
          <AdminTabsNavigation />
        </div>

        {/* Right section - Search, View Toggle, and Actions */}
        <div className="flex items-center space-x-4">
          {showSearch && onSearch && (
            <AdminQuickSearch
              value={searchValue}
              onSearch={onSearch}
              placeholder={getSearchPlaceholder()}
              className="w-64"
            />
          )}
          
          {showViewToggle && onViewChange && (
            <AdminViewToggle
              currentView={currentView}
              onViewChange={onViewChange}
              availableViews={availableViews}
            />
          )}
          
          {showQuickActions && (
            <AdminQuickActions
              onRefresh={onRefresh}
              onAdd={onAdd}
              onExport={onExport}
              onImport={onImport}
              onSettings={onSettings}
              customActions={customActions}
            />
          )}
        </div>
      </div>
    </div>
  );
};
