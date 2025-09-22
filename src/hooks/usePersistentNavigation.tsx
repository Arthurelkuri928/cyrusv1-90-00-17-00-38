
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook exclusivamente para preservação de rotas (SEM redirecionamento)
 * Responsabilidade única: salvar rota atual para preservação
 */
export const usePersistentNavigation = () => {
  const { user, loading, sessionLoading } = useAuth();
  const location = useLocation();

  // Rotas públicas que não precisam ser preservadas
  const publicRoutes = [
    '/', '/entrar', '/cadastro', '/planos', '/suporte', '/parceria', 
    '/afiliados', '/planos-iniciais', '/planos-padroes', '/planos-premium'
  ];

  const isPublicRoute = publicRoutes.includes(location.pathname);
  const isProtectedRoute = !isPublicRoute;

  // ÚNICA RESPONSABILIDADE: Salvar rota atual para preservação
  useEffect(() => {
    if (!loading && !sessionLoading && user && isProtectedRoute) {
      localStorage.setItem('lastRoute', location.pathname);
      console.log('📍 Rota preservada:', location.pathname);
    }
  }, [location.pathname, loading, sessionLoading, user, isProtectedRoute]);

  // Limpar dados quando usuário não está autenticado
  useEffect(() => {
    if (!loading && !sessionLoading && !user) {
      // Limpeza completa para evitar estados fantasma
      localStorage.removeItem('lastRoute');
      localStorage.removeItem('redirectAfterLogin');
      console.log('🧹 Cache de navegação limpo');
    }
  }, [user, loading, sessionLoading]);

  return {
    isLoading: loading || sessionLoading,
    isReady: !loading && !sessionLoading,
    isProtectedRoute
  };
};
