import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Action, Role } from '@/shared/permissions';

interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
}

interface AdminUser {
  id: string;
  email: string;
  role: Role;
  permissions: string[];
}

interface UsePermissionsManagementReturn {
  loading: boolean;
  adminUsers: AdminUser[];
  allPermissions: Permission[];
  loadAdminUsers: () => Promise<void>;
  loadPermissions: () => Promise<void>;
  updateUserPermissions: (userId: string, permissionIds: string[]) => Promise<boolean>;
  copyPermissions: (fromUserId: string, toUserId: string) => Promise<boolean>;
  getPermissionsByCategory: () => Record<string, Permission[]>;
}

export function usePermissionsManagement(): UsePermissionsManagementReturn {
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const { toast } = useToast();
  const toastRef = useRef(toast);

  /**
   * Carrega todos os usuários administrativos com suas permissões
   */
  const loadAdminUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Usar nova RPC que retorna permissões diretamente
      const { data: adminUsersData, error: usersError } = await supabase.rpc('get_admin_users_with_permissions');
      
      if (usersError) {
        console.error('Erro RPC get_admin_users_with_permissions:', usersError);
        throw usersError;
      }
      
      if (!adminUsersData || adminUsersData.length === 0) {
        console.warn('Nenhum usuário administrativo encontrado');
        setAdminUsers([]);
        return;
      }

      // Mapear dados diretamente da RPC
      const adminUsersWithPermissions = adminUsersData.map((user: any) => ({
        id: user.id,
        email: user.email,
        role: user.role as Role,
        permissions: user.permissions_codes || []
      }));

      setAdminUsers(adminUsersWithPermissions);
      
    } catch (error) {
      console.error('Erro detalhado ao carregar usuários administrativos:', error);
      toastRef.current({
        title: 'Erro',
        description: 'Falha ao carregar usuários administrativos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carrega todas as permissões disponíveis
   */
  const loadPermissions = useCallback(async () => {
    try {
      const { data: permissions, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('code', { ascending: true });

      if (error) throw error;

      setAllPermissions(permissions || []);
      
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      toastRef.current({
        title: 'Erro',
        description: 'Falha ao carregar permissões disponíveis',
        variant: 'destructive'
      });
    }
  }, []);

  /**
   * Atualiza as permissões de um usuário
   */
  const updateUserPermissions = useCallback(async (userId: string, permissionIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('manage-user-permissions', {
        body: {
          action: 'update',
          userId,
          permissionIds
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.message);

      toastRef.current({
        title: 'Sucesso',
        description: 'Permissões atualizadas com sucesso',
        variant: 'default'
      });

      // Recarregar lista de usuários
      await loadAdminUsers();
      
      return true;
      
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      toastRef.current({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao atualizar permissões',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAdminUsers]);

  /**
   * Copia permissões de um usuário para outro
   */
  const copyPermissions = useCallback(async (fromUserId: string, toUserId: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Buscar permissões do usuário origem
      const { data: sourcePermissions, error: sourceError } = await supabase
        .from('admin_permissions')
        .select('permission_id')
        .eq('admin_id', fromUserId);

      if (sourceError) throw sourceError;

      const permissionIds = sourcePermissions?.map(sp => sp.permission_id) || [];

      // Aplicar permissões ao usuário destino
      const success = await updateUserPermissions(toUserId, permissionIds);
      
      if (success) {
        toastRef.current({
          title: 'Sucesso',
          description: 'Permissões copiadas com sucesso',
          variant: 'default'
        });
      }
      
      return success;
      
    } catch (error) {
      console.error('Erro ao copiar permissões:', error);
      toastRef.current({
        title: 'Erro',
        description: 'Falha ao copiar permissões',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateUserPermissions]);

  /**
   * Organiza permissões por categoria
   */
  const getPermissionsByCategory = useCallback((): Record<string, Permission[]> => {
    return allPermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }, [allPermissions]);

  return {
    loading,
    adminUsers,
    allPermissions,
    loadAdminUsers,
    loadPermissions,
    updateUserPermissions,
    copyPermissions,
    getPermissionsByCategory
  };
}