
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useAuthStore } from '@/app/store/auth.store';

/**
 * Hook de migração gradual do AuthContext para Zustand
 * Permite transição suave mantendo compatibilidade
 * 
 * NOTA: Este hook é apenas para migração futura, não substitui o useAuth principal
 */
export const useAuthMigration = () => {
  const contextAuth = useAuthContext();
  const zustandAuth = useAuthStore();
  
  const migrateToZustand = () => {
    if (contextAuth.user) {
      console.log('🔄 Migrando dados do Context para Zustand...');
      zustandAuth.setUser({
        id: contextAuth.user.id,
        email: contextAuth.user.email || '',
        name: contextAuth.user.user_metadata?.name,
        avatar: contextAuth.user.user_metadata?.avatar,
      });
      console.log('✅ Migração concluída');
    }
  };
  
  return {
    // Sistema atual (Context API)
    current: {
      user: contextAuth.user,
      session: contextAuth.session,
      loading: contextAuth.loading,
      signIn: contextAuth.signIn,
      signOut: contextAuth.signOut,
    },
    
    // Sistema futuro (Zustand)
    future: {
      user: zustandAuth.user,
      isAuthenticated: zustandAuth.isAuthenticated,
      isLoading: zustandAuth.isLoading,
      error: zustandAuth.error,
      login: zustandAuth.login,
      logout: zustandAuth.logout,
      setUser: zustandAuth.setUser,
      clearError: zustandAuth.clearError,
    },
    
    // Utilitários de migração
    utils: {
      migrateToZustand,
      isCurrentSystemActive: !!contextAuth.user,
      isFutureSystemActive: zustandAuth.isAuthenticated,
    }
  };
};
