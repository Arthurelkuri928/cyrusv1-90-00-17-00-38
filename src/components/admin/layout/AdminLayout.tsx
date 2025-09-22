
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AdminDashboardProvider } from '../../../contexts/AdminDashboardContext';
import { AdminDashboardSidebar } from './AdminDashboardSidebar';
import { AdminDynamicTopbar } from './AdminDynamicTopbar';
import { AdminSearchModal } from '../modals/AdminSearchModal';
import { AdminCreateModal } from '../modals/AdminCreateModal';
import { useRealtimePermissions } from '@/hooks/useRealtimePermissions';
import { useAdminDashboard } from '../../../contexts/AdminDashboardContext';
import { SIDEBAR_CONFIG } from '../../../config/sidebarConfig';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

// Componente interno que usa o hook do contexto
const AdminLayoutContent: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isSidebarCollapsed } = useAdminDashboard();
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Calculate dynamic padding based on sidebar state
  const sidebarWidth = isSidebarCollapsed ? SIDEBAR_CONFIG.COLLAPSED_WIDTH : SIDEBAR_CONFIG.EXPANDED_WIDTH;
  const dynamicPadding = sidebarWidth + SIDEBAR_CONFIG.MARGIN;

  return (
    <div className="h-screen bg-background relative">
      {/* Sidebar */}
      <AdminDashboardSidebar />
      
      {/* Main Content - Responsive layout que se adapta ao sidebar */}
      <div 
        className="flex flex-col h-full overflow-hidden transition-all duration-300"
        style={{ 
          paddingLeft: isDesktop ? `${dynamicPadding}px` : '0px' 
        }}
      >
        {/* Topbar */}
        <AdminDynamicTopbar />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="min-h-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AdminSearchModal />
      <AdminCreateModal />
      <Toaster />
    </div>
  );
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Ativar monitoramento de permissões em tempo real
  useRealtimePermissions();

  return (
    <AdminDashboardProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminDashboardProvider>
  );
};

export default AdminLayout;
