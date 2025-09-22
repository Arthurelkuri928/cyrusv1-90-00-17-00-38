import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTheme } from 'next-themes';

export type Theme = 'light' | 'dark';

interface AdminDashboardContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  isSearchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
}

const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
};

interface AdminDashboardProviderProps {
  children: ReactNode;
}

export const AdminDashboardProvider: React.FC<AdminDashboardProviderProps> = ({ children }) => {
  const { theme: systemTheme, setTheme: setSystemTheme } = useTheme();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const currentTheme = (systemTheme as Theme) || 'dark';

  const setTheme = (theme: Theme) => {
    setSystemTheme(theme);
  };

  const toggleTheme = () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const value: AdminDashboardContextType = {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    isSidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    isSearchModalOpen,
    setSearchModalOpen,
    isCreateModalOpen,
    setCreateModalOpen,
  };

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  );
};