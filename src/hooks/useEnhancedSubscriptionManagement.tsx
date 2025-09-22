import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';

interface UserWithSubscription {
  id: string;
  email: string;
  role: string;
  subscription_end_at: string | null;
  subscription_status: string;
  subscription_type: string;
  created_at: string;
  updated_at: string | null;
}

interface CreateUserData {
  email: string;
  password: string;
  subscription_days: number;
}

interface UpdateCredentialsData {
  email?: string;
  password?: string;
}

export const useEnhancedSubscriptionManagement = () => {
  const { toast } = useToast();
  const { can } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Verificações de permissão específicas
  const canViewSubscriptions = can('view_users') || can('edit_user_subscription') || can('manage_users');
  const canManageUsers = can('manage_users');

  const loadUsers = async (search: string = '', page: number = 1) => {
    if (!canViewSubscriptions) {
      console.warn('❌ Tentativa de acesso não autorizada - sem permissão para visualizar assinaturas');
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para visualizar assinaturas",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('📊 Carregando usuários via Edge Function...');
      
      const offset = (page - 1) * pageSize;

      const { data: result, error } = await supabase.functions.invoke('admin-list-users', {
        body: {
          search_term: search,
          page_limit: pageSize,
          page_offset: offset
        }
      });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        toast({
          title: "Erro",
          description: `Erro ao buscar usuários: ${error.message}`,
          variant: "destructive"
        });
        setUsers([]);
        setTotalUsers(0);
        return;
      }

      if (!result || !result.users) {
        console.error('❌ Resposta inválida:', result);
        toast({
          title: "Erro",
          description: "Resposta inválida do servidor",
          variant: "destructive"
        });
        setUsers([]);
        setTotalUsers(0);
        return;
      }

      console.log('✅ Usuários carregados:', result.users.length);
      
      setUsers(result.users);
      setTotalUsers(result.total || result.users.length);
      setSearchTerm(search);
      setCurrentPage(page);

      toast({
        title: "Usuários Carregados",
        description: `${result.users.length} usuários carregados com sucesso`,
        duration: 2000
      });
      
    } catch (error) {
      console.error('💥 Erro crítico ao carregar usuários:', error);
      toast({
        title: "Erro Crítico",
        description: `Falha ao carregar usuários: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserData) => {
    if (!canManageUsers) {
      toast({
        title: "Acesso Negado",
        description: "Apenas o Administrador Master pode criar usuários",
        variant: "destructive"
      });
      return { success: false };
    }

    setLoading(true);
    try {
      console.log('👤 Criando novo usuário:', userData.email);

      const { data: result, error } = await supabase.functions.invoke('admin-create-user', {
        body: userData
      });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      if (!result || !result.success) {
        console.error('❌ Falha na criação:', result);
        throw new Error(result?.error || 'Erro desconhecido ao criar usuário');
      }

      console.log('✅ Usuário criado com sucesso:', result.user?.email);
      toast({
        title: "Sucesso",
        description: `Usuário ${result.user?.email || userData.email} criado com sucesso`,
        duration: 4000
      });

      await loadUsers(searchTerm, currentPage);
      return { success: true, data: result.user };

    } catch (error) {
      console.error('💥 Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro inesperado ao criar usuário",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!canManageUsers) {
      toast({
        title: "Acesso Negado",
        description: "Apenas o Administrador Master pode excluir usuários",
        variant: "destructive"
      });
      return { success: false };
    }

    setLoading(true);
    try {
      console.log('🗑️ Excluindo usuário:', userEmail);

      const { data: result, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { user_id: userId }
      });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      if (!result || !result.success) {
        console.error('❌ Falha na exclusão:', result);
        throw new Error(result?.error || 'Erro desconhecido ao excluir usuário');
      }

      console.log('✅ Usuário excluído com sucesso:', userEmail);
      toast({
        title: "Sucesso",
        description: `Usuário ${userEmail} excluído com sucesso`,
        duration: 4000
      });

      await loadUsers(searchTerm, currentPage);
      return { success: true };

    } catch (error) {
      console.error('💥 Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro inesperado ao excluir usuário",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateUserCredentials = async (userId: string, credentialsData: UpdateCredentialsData) => {
    if (!canManageUsers) {
      toast({
        title: "Acesso Negado",
        description: "Apenas o Administrador Master pode alterar credenciais",
        variant: "destructive"
      });
      return { success: false };
    }

    setLoading(true);
    try {
      console.log('🔐 Atualizando credenciais do usuário:', userId);

      const { data: result, error } = await supabase.functions.invoke('admin-update-user-credentials', {
        body: { user_id: userId, ...credentialsData }
      });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      if (!result || !result.success) {
        console.error('❌ Falha na atualização:', result);
        throw new Error(result?.error || 'Erro desconhecido ao atualizar credenciais');
      }

      console.log('✅ Credenciais atualizadas com sucesso');
      toast({
        title: "Sucesso",
        description: "Credenciais do usuário atualizadas com sucesso",
        duration: 4000
      });

      await loadUsers(searchTerm, currentPage);
      return { success: true };

    } catch (error) {
      console.error('💥 Erro ao atualizar credenciais:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro inesperado ao atualizar credenciais",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!can('change_user_role')) {
      toast({
        title: "Acesso Negado",
        description: "Apenas o Administrador Master pode alterar cargos de usuários",
        variant: "destructive"
      });
      return { success: false };
    }

    setLoading(true);
    try {
      console.log('🔄 Alterando cargo do usuário:', userId, 'para:', newRole);

      const { data: result, error } = await supabase.functions.invoke('admin-update-user-role', {
        body: { user_id: userId, new_role: newRole }
      });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      if (!result || !result.success) {
        console.error('❌ Falha na alteração:', result);
        throw new Error(result?.error || 'Erro desconhecido ao alterar cargo');
      }

      console.log('✅ Cargo alterado com sucesso');
      toast({
        title: "Sucesso",
        description: result.message || "Cargo do usuário alterado com sucesso",
        duration: 4000
      });
      
      await loadUsers(searchTerm, currentPage);
      return { success: true };

    } catch (error) {
      console.error('💥 Erro ao alterar cargo:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro inesperado ao alterar cargo",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateUserSubscription = async (
    userId: string, 
    options: {
      newExpiration?: string;
      newStatus?: string;
      extendDays?: number;
    }
  ) => {
    if (!canViewSubscriptions) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para gerenciar assinaturas",
        variant: "destructive"
      });
      return { success: false };
    }

    setLoading(true);
    try {
      console.log('🔄 Atualizando assinatura do usuário:', userId, options);

      const { data: result, error } = await supabase.functions.invoke('admin-update-subscription', {
        body: {
          target_user_id: userId,
          new_expiration: options.newExpiration || null,
          new_status: options.newStatus || null,
          extend_days: options.extendDays || null
        }
      });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      if (!result || !result.success) {
        console.error('❌ Falha na atualização:', result);
        throw new Error(result?.error || 'Erro desconhecido ao atualizar assinatura');
      }

      console.log('✅ Assinatura atualizada com sucesso');
      toast({
        title: "Sucesso",
        description: result.message || "Assinatura atualizada com sucesso",
        duration: 4000
      });
      
      await loadUsers(searchTerm, currentPage);
      return { success: true };

    } catch (error) {
      console.error('💥 Erro ao atualizar assinatura:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro inesperado ao atualizar assinatura",
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
        description: "Apenas o Administrador Master pode executar limpeza",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🧹 Executando limpeza de assinaturas expiradas...');

      const { data: result, error } = await supabase.functions.invoke('admin-deactivate-expired', {
        body: {}
      });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      if (!result || !result.success) {
        console.error('❌ Falha na limpeza:', result);
        throw new Error(result?.error || 'Erro desconhecido na limpeza');
      }

      console.log('✅ Limpeza concluída:', result.deactivated_count, 'assinaturas desativadas');
      
      toast({
        title: "Limpeza Concluída",
        description: result.message || `${result.deactivated_count} assinaturas foram desativadas`,
        duration: 4000
      });
      
      await loadUsers(searchTerm, currentPage);

    } catch (error) {
      console.error('💥 Erro na limpeza:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro inesperado na limpeza",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnectivity = async () => {
    if (!canViewSubscriptions) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para executar testes",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🧪 Testando conectividade...');
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('🧪 Usuário autenticado:', userData?.user?.id);
      
      if (userError) {
        console.error('❌ Erro de autenticação:', userError);
        toast({
          title: "Erro de Autenticação",
          description: userError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Teste de Conectividade",
        description: "✅ Conectividade OK - Sistema funcionando com Edge Functions",
        duration: 4000
      });
      
    } catch (error) {
      console.error('💥 Erro no teste:', error);
      toast({
        title: "Erro no Teste",
        description: error instanceof Error ? error.message : "Erro inesperado",
        variant: "destructive"
      });
    }
  };

  return {
    users,
    totalUsers,
    loading,
    canViewSubscriptions,
    canManageUsers,
    searchTerm,
    currentPage,
    pageSize,
    loadUsers,
    createUser,
    deleteUser,
    updateUserCredentials,
    updateUserRole,
    extendSubscription,
    changeSubscriptionStatus,
    setCustomExpiration,
    deactivateExpiredSubscriptions,
    testRPC: testConnectivity
  };
};
