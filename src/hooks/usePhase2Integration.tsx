
import { useRealtimePermissions } from '@/hooks/useRealtimePermissions';
import { useAdminActions } from '@/hooks/useAdminActions';
import { useAdminAudit } from '@/hooks/useAdminAudit';
import { useRealtimeDiagnostics } from '@/hooks/useRealtimeDiagnostics';

/**
 * Hook integrador para todas as funcionalidades da Fase 2
 * Fornece acesso unificado a todas as features de sincronização e conexão
 */
export const usePhase2Integration = () => {
  const permissions = useRealtimePermissions();
  const adminActions = useAdminActions();
  const audit = useAdminAudit();
  const diagnostics = useRealtimeDiagnostics();

  return {
    // Permissões em tempo real
    permissions: {
      currentRole: permissions.currentRole,
      refreshPermissions: permissions.refreshPermissions
    },

    // Ações administrativas com validação
    actions: {
      updateTool: adminActions.updateTool,
      createTool: adminActions.createTool,
      deleteTool: adminActions.deleteTool,
      updateUserSubscription: adminActions.updateUserSubscription,
      executeWithPermission: adminActions.executeWithPermission,
      can: adminActions.can,
      isLoading: adminActions.isLoading
    },

    // Sistema de auditoria
    audit: {
      logAdminAction: audit.logAdminAction,
      logToolAction: audit.logToolAction,
      logUserAction: audit.logUserAction,
      logSystemAction: audit.logSystemAction
    },

    // Diagnósticos em tempo real
    diagnostics: {
      ...diagnostics,
      startMonitoring: diagnostics.startMonitoring,
      stopMonitoring: diagnostics.stopMonitoring,
      forceRefresh: diagnostics.forceRefresh
    }
  };
};
