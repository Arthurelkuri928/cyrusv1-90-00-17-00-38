
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';

interface UserWithSubscription {
  id: string;
  role: string;
  subscription_end_at: string | null;
  subscription_status: string;
  subscription_type: string;
  created_at: string;
  updated_at: string | null;
}

export const useSubscriptionManagement = () => {
  const { toast } = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Verificações de permissão usando o sistema moderno
  const canViewUsers = can('view_users');
  const canEditSubscriptions = can('edit_user_subscription');
  const canManageUsers = can('manage_users');

  console.log('💳 [useSubscriptionManagement] Permissões verificadas:', {
    canViewUsers,
    canEditSubscriptions,
    canManageUsers,
    permissionsLoading,
    hasLoadedOnce
  });

  // Função loadUsers otimizada com useCallback
  const loadUsers = useCallback(async () => {
    // Evitar múltiplas chamadas se ainda estiver carregando
    if (loading) {
      console.log('🔄 LoadUsers já em execução, ignorando nova chamada...');
      return;
    }

    // Aguardar verificação de permissões
    if (permissionsLoading) {
      console.log('⏳ Aguardando verificação de permissões...');
      return;
    }

    if (!canViewUsers) {
      console.warn('❌ Usuário não tem permissão para visualizar usuários');
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para visualizar usuários",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('📊 Carregando usuários com dados de assinatura...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          role,
          subscription_end_at,
          subscription_status,
          subscription_type,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar lista de usuários",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Usuários carregados:', data?.length || 0);
      
      // Garantir que os dados têm todos os campos necessários
      const usersWithDefaults = (data || []).map(user => ({
        id: user.id,
        role: user.role || 'user',
        subscription_end_at: user.subscription_end_at || null,
        subscription_status: user.subscription_status || 'active',
        subscription_type: user.subscription_type || 'basic',
        created_at: user.created_at,
        updated_at: user.updated_at || null,
      }));
      
      setUsers(usersWithDefaults);
      setHasLoadedOnce(true);

      // Toast de sucesso apenas na primeira carga
      if (!hasLoadedOnce) {
        toast({
          title: "Usuários Carregados",
          description: `${usersWithDefaults.length} usuários carregados com sucesso`,
          duration: 2000
        });
      }
      
    } catch (error) {
      console.error('💥 Erro geral ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [permissionsLoading, canViewUsers, loading, toast, hasLoadedOnce]);

  // Funções de gerenciamento de assinatura mantidas com implementação simplificada
  const updateUserSubscription = async (
    userId: string, 
    options: {
      newExpiration?: string;
      newStatus?: string;
      extendDays?: number;
    }
  ) => {
    if (!canEditSubscriptions) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para editar assinaturas",
        variant: "destructive"
      });
      return { success: false };
    }

    setLoading(true);
    try {
      console.log('🔄 Atualizando assinatura do usuário:', userId, options);

      const { data, error } = await supabase.rpc('admin_update_user_subscription' as any, {
        target_user_id: userId,
        new_expiration: options.newExpiration || null,
        new_status: options.newStatus || null,
        extend_days: options.extendDays || null
      });

      if (error) {
        console.error('❌ Erro ao atualizar assinatura:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar assinatura do usuário",
          variant: "destructive"
        });
        return { success: false };
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const result = data[0];
        
        if (result.success) {
          console.log('✅ Assinatura atualizada com sucesso');
          toast({
            title: "Sucesso",
            description: result.message,
            duration: 4000
          });
          
          // Recarregar após sucesso
          await loadUsers();
          return { success: true, data: result };
        } else {
          console.error('❌ Falha ao atualizar:', result.message);
          toast({
            title: "Erro",
            description: result.message,
            variant: "destructive"
          });
          return { success: false };
        }
      }
    } catch (error) {
      console.error('💥 Erro geral ao atualizar assinatura:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar assinatura",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const extendSubscription = async (userId: string, days: number) => {
    return updateUserSubscription(userId, { extendDays: days });
  };

  const changeSubscriptionStatus = async (userId: string, status: string) => {
    return updateUserSubscription(userId, { newStatus: status });
  };

  const setCustomExpiration = async (userId: string, expirationDate: string) => {
    return updateUserSubscription(userId, { newExpiration: expirationDate });
  };

  const deactivateExpiredSubscriptions = async () => {
    if (!canManageUsers) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para executar limpeza",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🧹 Executando limpeza de assinaturas expiradas...');

      const { data, error } = await supabase.rpc('deactivate_expired_subscriptions' as any);

      if (error) {
        console.error('❌ Erro na limpeza:', error);
        toast({
          title: "Erro",
          description: "Erro ao executar limpeza de assinaturas",
          variant: "destructive"
        });
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const result = data[0];
        console.log('✅ Limpeza concluída:', result.deactivated_count, 'assinaturas desativadas');
        
        toast({
          title: "Limpeza Concluída",
          description: `${result.deactivated_count} assinaturas foram desativadas`,
          duration: 4000
        });
        
        // Recarregar após limpeza
        await loadUsers();
      }
    } catch (error) {
      console.error('💥 Erro geral na limpeza:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado na limpeza",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    permissionsLoading,
    canViewUsers,
    canEditSubscriptions,
    canManageUsers,
    loadUsers,
    extendSubscription,
    changeSubscriptionStatus,
    setCustomExpiration,
    deactivateExpiredSubscriptions
  };
};
