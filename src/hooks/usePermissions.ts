
/**
 * Hook de Permissões - usePermissions
 * 
 * Gerencia as verificações de permissão baseadas no role do usuário logado
 */

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { hasPermission, canAccessAdminPanel, getRolePermissions, isAdminRole, getRoleLabel } from '@/shared/permissions';
import type { Role, Action } from '@/shared/permissions';

interface UsePermissionsReturn {
  // Estado atual
  role: Role | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Função principal de verificação de permissão (síncrona para compatibilidade)
  can: (action: Action) => boolean;
  
  // Função assíncrona para verificar permissões dinâmicas
  canAsync: (action: Action) => Promise<boolean>;
  
  // Funções de conveniência
  canAccessAdmin: () => boolean;
  isAdmin: () => boolean;
  getAllPermissions: () => Action[];
  getRoleName: () => string;
  
  // Função para recarregar permissões
  refreshPermissions: () => Promise<void>;
}

export function usePermissions(): UsePermissionsReturn {
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Busca permissões híbridas do usuário (dinâmicas + fallback para role)
   */
  const fetchUserPermissions = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      setIsLoading(true);
      
      // Verificar se há um usuário autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erro ao verificar sessão:', sessionError);
        setIsAuthenticated(false);
        setRole(null);
        return;
      }

      if (!session?.user) {
        setIsAuthenticated(false);
        setRole(null);
        return;
      }

      setIsAuthenticated(true);

      // Buscar permissões híbridas do usuário (dinâmicas ou baseadas no role)
      const { data: permissions, error: permError } = await supabase
        .rpc('get_user_hybrid_permissions', { p_user_id: session.user.id })
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (permError) {
        console.error('Erro ao buscar permissões híbridas:', permError);
        // Fallback: buscar apenas o role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        const userRole = (profile?.role as Role) || 'user';
        setRole(userRole.trim() as Role);
        return;
      }

      // Se temos permissões, definir o role baseado no perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      const userRole = (profile?.role as Role) || 'user';
      setRole(userRole.trim() as Role);

      // Salvar ID do usuário atual para acesso síncrono
      sessionStorage.setItem('current_user_id', session.user.id);
      
      // Armazenar permissões dinâmicas apenas se existirem
      const dynamicPermissions = permissions?.map(p => p.code) || [];
      const permissionSource = permissions?.[0]?.source || 'static';
      
      // Para usuários 'user', não cachear permissões (sempre usar fallback estático)
      if (userRole.trim() !== 'user' && dynamicPermissions.length > 0) {
        sessionStorage.setItem(`permissions_${session.user.id}`, JSON.stringify({
          permissions: dynamicPermissions,
          source: permissionSource,
          timestamp: Date.now()
        }));
      } else {
        // Limpar cache para usuários 'user' ou sem permissões dinâmicas
        sessionStorage.removeItem(`permissions_${session.user.id}`);
      }
      
      console.log('✅ [usePermissions] Permissões híbridas carregadas:', {
        role: userRole.trim(),
        permissionsCount: dynamicPermissions.length,
        source: permissionSource,
        userEmail: session.user.email,
        usesDynamicPermissions: userRole.trim() !== 'user' && dynamicPermissions.length > 0
      });
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.warn('⏰ [usePermissions] Timeout ao carregar permissões');
        setRole('user');
      } else {
        console.error('Erro ao carregar permissões:', error);
        setRole('user');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Configura listeners de autenticação e carrega permissões iniciais
   */
  useEffect(() => {
    // Carregar permissões iniciais
    fetchUserPermissions();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 [usePermissions] Mudança de autenticação:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setIsAuthenticated(true);
          // Recarregar permissões quando o usuário fizer login
          setTimeout(() => {
            fetchUserPermissions();
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setRole(null);
          setIsLoading(false);
          // Limpar cache de permissões
          sessionStorage.removeItem('current_user_id');
          const allKeys = Object.keys(sessionStorage);
          allKeys.forEach(key => {
            if (key.startsWith('permissions_')) {
              sessionStorage.removeItem(key);
            }
          });
        }
      }
    );

    // Escutar mudanças nas permissões via localStorage (cross-tab)
    const handlePermissionsUpdate = (e: StorageEvent) => {
      if (e.key === 'permissions_update' && e.newValue) {
        try {
          const updateData = JSON.parse(e.newValue);
          console.log('🔄 [usePermissions] Permissões atualizadas de outra aba:', updateData);
          
          // Recarregar permissões após mudança
          setTimeout(() => {
            fetchUserPermissions();
          }, 100);
        } catch (error) {
          console.error('❌ Erro ao processar update de permissões:', error);
        }
      }
    };

    window.addEventListener('storage', handlePermissionsUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handlePermissionsUpdate);
    };
  }, [fetchUserPermissions]);

  /**
   * Função principal para verificar se o usuário pode executar uma ação (síncrona)
   * Usa cache de permissões dinâmicas se disponível, senão usa role estático
   */
  const can = useCallback((action: Action): boolean => {
    if (!isAuthenticated || !role) {
      console.log(`❌ [usePermissions] can('${action}') = false (não autenticado ou sem role)`, {
        isAuthenticated,
        role
      });
      return false;
    }

    // FORÇA fallback para permissões estáticas se role é 'user'
    if (role === 'user') {
      const result = hasPermission(role, action);
      console.log(`🔍 [usePermissions] can('${action}') = ${result} (role 'user' - sem permissões admin)`, {
        role,
        action,
        result
      });
      return result;
    }

    // Tentar usar permissões dinâmicas do cache (síncrono) apenas para roles administrativos
    try {
      const currentUserId = sessionStorage.getItem('current_user_id');
      if (currentUserId) {
        const cached = sessionStorage.getItem(`permissions_${currentUserId}`);
        if (cached) {
          try {
            const { permissions, source, timestamp } = JSON.parse(cached);
            
            // Cache válido por 2 minutos (reduzido para ser mais responsivo)
            if (Date.now() - timestamp < 2 * 60 * 1000) {
              // Se tem permissões dinâmicas, usar elas
              if (permissions && permissions.length > 0) {
                const result = permissions.includes(action);
                console.log(`🔍 [usePermissions] can('${action}') = ${result} (${source})`, {
                  role,
                  action,
                  result,
                  source,
                  permissionsCount: permissions.length
                });
                return result;
              }
            } else {
              // Cache expirado, limpar
              console.log('🧹 [usePermissions] Cache expirado, limpando...');
              sessionStorage.removeItem(`permissions_${currentUserId}`);
            }
          } catch (error) {
            console.error('❌ [usePermissions] Erro ao ler cache:', error);
            // Limpar cache corrompido
            sessionStorage.removeItem(`permissions_${currentUserId}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ [usePermissions] Erro ao acessar cache:', error);
    }
    
    // Fallback para permissões estáticas baseadas no role
    const result = hasPermission(role, action);
    console.log(`🔍 [usePermissions] can('${action}') = ${result} (static fallback)`, {
      role,
      action,
      result,
      fallbackReason: 'cache inválido ou permissões dinâmicas vazias'
    });
    
    return result;
  }, [role, isAuthenticated]);

  /**
   * Função assíncrona para verificar permissões dinâmicas (sempre busca dados frescos)
   */
  const canAsync = useCallback(async (action: Action): Promise<boolean> => {
    if (!isAuthenticated || !role) {
      return false;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        // Buscar permissões dinâmicas diretamente
        const { data: permissions, error } = await supabase
          .rpc('get_user_dynamic_permissions', { p_user_id: session.user.id });

        if (!error && permissions && permissions.length > 0) {
          return permissions.some(p => p.code === action);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar permissões dinâmicas:', error);
    }
    
    // Fallback para permissões estáticas
    return hasPermission(role, action);
  }, [role, isAuthenticated]);

  /**
   * Verifica se o usuário pode acessar o painel administrativo
   */
  const canAccessAdmin = useCallback((): boolean => {
    if (!isAuthenticated || !role) {
      return false;
    }
    
    return canAccessAdminPanel(role);
  }, [role, isAuthenticated]);

  /**
   * Verifica se o usuário tem um role administrativo
   */
  const isAdmin = useCallback((): boolean => {
    if (!role) {
      return false;
    }
    
    return isAdminRole(role);
  }, [role]);

  /**
   * Obtém todas as permissões do usuário atual
   */
  const getAllPermissions = useCallback((): Action[] => {
    if (!role) {
      return [];
    }
    
    return getRolePermissions(role);
  }, [role]);

  /**
   * Obtém o nome legível do role do usuário
   */
  const getRoleName = useCallback((): string => {
    if (!role) {
      return 'Usuário';
    }
    
    return getRoleLabel(role);
  }, [role]);

  /**
   * Função para recarregar as permissões manualmente
   */
  const refreshPermissions = useCallback(async (): Promise<void> => {
    console.log('🔄 [usePermissions] Recarregando permissões manualmente...');
    
    // Limpar TODO o cache antes de recarregar
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      sessionStorage.removeItem(`permissions_${session.user.id}`);
      sessionStorage.removeItem('current_user_id');
      
      // Limpar todos os caches de permissões
      const allKeys = Object.keys(sessionStorage);
      allKeys.forEach(key => {
        if (key.startsWith('permissions_')) {
          sessionStorage.removeItem(key);
        }
      });
    }
    
    await fetchUserPermissions();
  }, [fetchUserPermissions]);

  return {
    role,
    isLoading,
    isAuthenticated,
    can,
    canAsync,
    canAccessAdmin,
    isAdmin,
    getAllPermissions,
    getRoleName,
    refreshPermissions
  };
}

/**
 * Hook de conveniência para verificações específicas de permissão
 */
export function usePermission(action: Action): boolean {
  const { can } = usePermissions();
  return can(action);
}

/**
 * Hook de conveniência para verificar acesso administrativo
 */
export function useAdminAccess(): boolean {
  const { canAccessAdmin } = usePermissions();
  return canAccessAdmin();
}
