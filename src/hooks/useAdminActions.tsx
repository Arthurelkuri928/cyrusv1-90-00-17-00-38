
import { useCallback } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAdminAudit } from '@/hooks/useAdminAudit';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook centralizado para ações administrativas com validação de permissões
 */
export const useAdminActions = () => {
  const { can, isLoading } = usePermissions();
  const { logToolAction, logUserAction, logSystemAction } = useAdminAudit();

  const executeWithPermission = useCallback(async (
    permission: string,
    action: () => Promise<any>,
    auditData?: { type: 'tool' | 'user' | 'system'; id?: string; oldValues?: any; newValues?: any; action: string }
  ) => {
    if (isLoading) {
      toast.error('Aguarde a verificação de permissões...');
      return { success: false, error: 'Loading permissions' };
    }

    if (!can(permission as any)) {
      const errorMsg = `Acesso negado. Você não tem permissão para: ${permission}`;
      toast.error(errorMsg);
      console.error('🚫 [AdminActions]', errorMsg);
      return { success: false, error: 'Permission denied' };
    }

    try {
      console.log(`🔐 [AdminActions] Executando ação com permissão: ${permission}`);
      
      const result = await action();
      
      // Log da auditoria se fornecido
      if (auditData) {
        switch (auditData.type) {
          case 'tool':
            await logToolAction(auditData.action, auditData.id || '', auditData.oldValues, auditData.newValues);
            break;
          case 'user':
            await logUserAction(auditData.action, auditData.id || '', auditData.oldValues, auditData.newValues);
            break;
          case 'system':
            await logSystemAction(auditData.action, auditData.newValues);
            break;
        }
      }
      
      return { success: true, data: result };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao executar ação: ${errorMsg}`);
      console.error('❌ [AdminActions] Erro:', error);
      return { success: false, error: errorMsg };
    }
  }, [can, isLoading, logToolAction, logUserAction, logSystemAction]);

  // Ações específicas para ferramentas
  const updateTool = useCallback(async (toolId: string, updates: any, oldValues?: any) => {
    return executeWithPermission(
      'edit_tools',
      async () => {
        const { data, error } = await supabase
          .from('tools')
          .update(updates)
          .eq('id', Number(toolId))
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Ferramenta atualizada com sucesso!');
        return data;
      },
      {
        type: 'tool',
        id: toolId,
        action: 'update_tool',
        oldValues,
        newValues: updates
      }
    );
  }, [executeWithPermission]);

  const createTool = useCallback(async (toolData: any) => {
    return executeWithPermission(
      'create_tools',
      async () => {
        const { data, error } = await supabase
          .from('tools')
          .insert(toolData)
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Ferramenta criada com sucesso!');
        return data;
      },
      {
        type: 'tool',
        action: 'create_tool',
        newValues: toolData
      }
    );
  }, [executeWithPermission]);

  const deleteTool = useCallback(async (toolId: string, toolData?: any) => {
    return executeWithPermission(
      'delete_tools',
      async () => {
        const { error } = await supabase
          .from('tools')
          .delete()
          .eq('id', Number(toolId));

        if (error) throw error;
        
        toast.success('Ferramenta removida com sucesso!');
        return true;
      },
      {
        type: 'tool',
        id: toolId,
        action: 'delete_tool',
        oldValues: toolData
      }
    );
  }, [executeWithPermission]);

  // Ações específicas para usuários
  const updateUserSubscription = useCallback(async (userId: string, subscriptionData: any, oldData?: any) => {
    return executeWithPermission(
      'edit_user_subscription',
      async () => {
        const { data, error } = await supabase.rpc('admin_update_user_subscription', {
          target_user_id: userId,
          new_expiration: subscriptionData.expiration || null,
          new_status: subscriptionData.status || null,
          extend_days: subscriptionData.extendDays || null
        });

        if (error) throw error;
        
        toast.success('Assinatura atualizada com sucesso!');
        return data;
      },
      {
        type: 'user',
        id: userId,
        action: 'update_user_subscription',
        oldValues: oldData,
        newValues: subscriptionData
      }
    );
  }, [executeWithPermission]);

  return {
    executeWithPermission,
    updateTool,
    createTool,
    deleteTool,
    updateUserSubscription,
    can,
    isLoading
  };
};
