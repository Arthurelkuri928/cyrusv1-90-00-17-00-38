
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useAuthStore } from '@/app/store/auth.store';
import { useMemo, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSystemHealth } from '@/utils/systemDiagnostics';

/**
 * Hook universal de autenticação que unifica todos os sistemas
 * Prioriza o Context API atual e gradualmente migra para Zustand
 */
export const useUniversalAuth = () => {
  const contextAuth = useAuthContext();
  const zustandAuth = useAuthStore();
  const [userRole, setUserRole] = useState<any[]>([]);
  
  // Buscar role do usuário na tabela profiles quando usuário estiver logado
  useEffect(() => {
    const fetchUserRole = async () => {
      if (contextAuth.user?.id && !contextAuth.sessionLoading) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', contextAuth.user.id);
          
          if (!error && data) {
            setUserRole(data);
            
            // Log automático para diagnóstico em ambiente de desenvolvimento
            if (process.env.NODE_ENV === 'development') {
              console.log('🔍 [useUniversalAuth] Role carregado:', data);
              
              // Executar diagnóstico completo em desenvolvimento
              setTimeout(() => {
                logSystemHealth();
              }, 1000);
            }
          }
        } catch (err) {
          console.error('Erro ao buscar role do usuário:', err);
        }
      } else {
        setUserRole([]);
      }
    };

    fetchUserRole();
  }, [contextAuth.user, contextAuth.sessionLoading]);
  
  // Sistema principal (Context API) com sessionLoading
  const mainAuth = useMemo(() => ({
    user: contextAuth.user,
    session: contextAuth.session,
    loading: contextAuth.loading,
    sessionLoading: contextAuth.sessionLoading,
    signIn: contextAuth.signIn,
    signOut: contextAuth.signOut,
    isAuthenticated: !!contextAuth.user,
    isReady: !contextAuth.loading && !contextAuth.sessionLoading,
    userRole: userRole,
  }), [contextAuth, userRole]);
  
  // Sistema futuro (Zustand) - disponível mas não prioritário
  const futureAuth = useMemo(() => ({
    user: zustandAuth.user,
    isAuthenticated: zustandAuth.isAuthenticated,
    isLoading: zustandAuth.isLoading,
    error: zustandAuth.error,
    login: zustandAuth.login,
    logout: zustandAuth.logout,
    setUser: zustandAuth.setUser,
    clearError: zustandAuth.clearError,
  }), [zustandAuth]);
  
  return {
    ...mainAuth,
    // Métodos de migração
    migrate: {
      toZustand: () => {
        if (mainAuth.user) {
          zustandAuth.setUser({
            id: mainAuth.user.id,
            email: mainAuth.user.email || '',
            name: mainAuth.user.user_metadata?.name,
            avatar: mainAuth.user.user_metadata?.avatar,
          });
        }
      },
      future: futureAuth,
    },
    // Método de diagnóstico
    runHealthCheck: logSystemHealth,
  };
};
