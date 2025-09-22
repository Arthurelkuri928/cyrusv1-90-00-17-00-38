
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PainelAdmin from './PainelAdmin';
import UsersManagement from '@/components/admin/UsersManagement';
import ToolsManagement from '@/components/admin/ToolsManagement';
import ToolsTrash from '@/components/admin/ToolsTrash';
import HeaderManagement from '@/components/admin/HeaderManagement';
import Visibility from '@/components/admin/Visibility';
import AdvertisementsManagement from '@/components/admin/AdvertisementsManagement';
import SidebarLinksManagement from '@/components/admin/SidebarLinksManagement';
import Diagnostics from '@/components/admin/Diagnostics';
import { NotificationsPage } from '@/components/admin/NotificationsPage';
import { NotificationsManagementPage } from '@/components/admin/NotificationsManagementPage';
import { PermissionsManagement } from '@/components/admin/PermissionsManagement';
import AdminAccountSettings from './AdminAccountSettings';
import { usePermissions } from '@/hooks/usePermissions';

const AdminPanel = () => {
  const { can, role } = usePermissions();
  
  // Verificar se é admin_master para seção de envio
  const isAdminMaster = role === 'admin_master';

  return (
    <AdminLayout>
      <Routes>
        {/* Default route - redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Clean routes without individual AdminLayout wrappers */}
        <Route path="dashboard" element={<PainelAdmin />} />
        
        {/* Conditional routes based on permissions */}
        {can('view_users') && (
          <Route path="usuarios" element={<UsersManagement />} />
        )}
        
        {can('view_tools') && (
          <>
            <Route path="ferramentas" element={<ToolsManagement />} />
            <Route path="lixeira-ferramentas" element={<ToolsTrash />} />
          </>
        )}

        {can('admin.panel.view') && (
          <Route path="cabecalho" element={<HeaderManagement />} />
        )}

        {can('view_pages') && (
          <Route path="visibilidade" element={<Visibility />} />
        )}

        {can('view_advertisements') && (
          <Route path="anuncios" element={<AdvertisementsManagement />} />
        )}

        {can('admin.panel.view') && (
          <Route path="sidebar-links" element={<SidebarLinksManagement />} />
        )}

        {/* Rotas de notificações */}
        {can('admin.panel.view') && (
          <Route path="notificacoes" element={<NotificationsManagementPage />} />
        )}

        {/* Rotas de chat */}
        {can('admin.panel.view') && (
          <Route path="chat" element={<NotificationsPage />} />
        )}

        {can('manage_users') && (
          <Route path="permissoes" element={<PermissionsManagement />} />
        )}

        {can('admin.panel.view') && (
          <Route path="diagnosticos" element={<Diagnostics />} />
        )}

        {/* Account Settings Route */}
        <Route path="configuracoes-conta" element={<AdminAccountSettings />} />

        {/* Fallback route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPanel;
