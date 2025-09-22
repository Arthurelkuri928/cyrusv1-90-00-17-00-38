
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminMenuConfig } from '../config/menuConfig';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';

export const AdminTabsNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const currentPath = location.pathname;

  // Find current category and its tabs
  const getCurrentCategoryTabs = () => {
    for (const category of adminMenuConfig) {
      const hasCurrentPath = category.subItems.some(item => 
        currentPath === item.to || currentPath.startsWith(item.to + '/')
      );
      
      if (hasCurrentPath) {
        return category.subItems.filter(item => can(item.permission));
      }
    }
    return [];
  };

  const tabs = getCurrentCategoryTabs();

  // Don't render if there's only one tab or no tabs
  if (tabs.length <= 1) {
    return null;
  }

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex items-center space-x-1">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.to || currentPath.startsWith(tab.to + '/');
        
        return (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => handleTabClick(tab.to)}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-purple-600/20 text-purple-300 border border-purple-600/30' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }
            `}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};
