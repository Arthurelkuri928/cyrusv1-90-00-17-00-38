
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUniversalAuth } from '@/hooks/useUniversalAuth';

interface AuditLogData {
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
}

/**
 * Hook para logging automático de ações administrativas
 */
export const useAdminAudit = () => {
  const { user } = useUniversalAuth();

  const logAdminAction = useCallback(async (data: AuditLogData) => {
    if (!user?.id) {
      console.warn('⚠️ [AdminAudit] Não é possível logar ação sem usuário autenticado');
      return;
    }

    try {
      console.log('📝 [AdminAudit] Registrando ação:', data);
      
      const { error } = await supabase.rpc('log_admin_action', {
        p_action: data.action,
        p_resource_type: data.resourceType,
        p_resource_id: data.resourceId || null,
        p_old_values: data.oldValues || null,
        p_new_values: data.newValues || null
      });

      if (error) {
        console.error('❌ [AdminAudit] Erro ao registrar ação:', error);
      } else {
        console.log('✅ [AdminAudit] Ação registrada com sucesso');
      }
    } catch (error) {
      console.error('💥 [AdminAudit] Erro geral ao logar ação:', error);
    }
  }, [user?.id]);

  const logToolAction = useCallback((action: string, toolId: string, oldValues?: any, newValues?: any) => {
    logAdminAction({
      action,
      resourceType: 'tool',
      resourceId: toolId,
      oldValues,
      newValues
    });
  }, [logAdminAction]);

  const logUserAction = useCallback((action: string, userId: string, oldValues?: any, newValues?: any) => {
    logAdminAction({
      action,
      resourceType: 'user',
      resourceId: userId,
      oldValues,
      newValues
    });
  }, [logAdminAction]);

  const logSystemAction = useCallback((action: string, details?: any) => {
    logAdminAction({
      action,
      resourceType: 'system',
      newValues: details
    });
  }, [logAdminAction]);

  return {
    logAdminAction,
    logToolAction,
    logUserAction,
    logSystemAction
  };
};
