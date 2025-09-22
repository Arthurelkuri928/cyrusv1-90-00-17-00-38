
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTopBarTabs } from '../config/topBarConfig';
import { usePermissions } from '@/hooks/usePermissions';

export const AdminContextualTabs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const currentPath = location.pathname;

  const availableTabs = getTopBarTabs(currentPath).filter(tab => can(tab.permission));

  // Don't render if there's only one tab or no tabs
  if (availableTabs.length <= 1) {
    return null;
  }

  // Find the currently active tab
  const activeTab = availableTabs.find(tab => 
    currentPath === tab.path || currentPath.startsWith(tab.path + '/')
  );

  const handleTabChange = (tabPath: string) => {
    navigate(tabPath);
  };

  return (
    <div className="flex-1">
      <Tabs 
        value={activeTab?.path} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="h-9 bg-transparent border-0 p-0 space-x-1">
          {availableTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.path}
              className="
                h-8 px-3 py-1.5 text-sm font-medium rounded-md
                data-[state=active]:bg-muted data-[state=active]:text-foreground
                data-[state=inactive]:text-muted-foreground
                hover:text-foreground hover:bg-muted/50
                transition-all duration-200
                border-0 shadow-none
              "
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
