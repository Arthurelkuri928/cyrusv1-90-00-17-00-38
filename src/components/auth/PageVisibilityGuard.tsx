
import { Navigate, useLocation } from 'react-router-dom';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import Loader from '@/components/ui/loader';
import { useEffect, useState } from 'react';

interface PageVisibilityGuardProps {
  pageKey: string;
  children: React.ReactNode;
  redirectTo?: string;
}

// Sistema de detecção de loops de redirecionamento
const redirectHistory: string[] = [];
const MAX_REDIRECTS = 3;
const REDIRECT_RESET_TIME = 5000; // 5 segundos

const addToRedirectHistory = (path: string) => {
  redirectHistory.push(path);
  if (redirectHistory.length > MAX_REDIRECTS) {
    redirectHistory.shift();
  }
  
  // Reset do histórico após um tempo
  setTimeout(() => {
    redirectHistory.length = 0;
  }, REDIRECT_RESET_TIME);
};

const isInRedirectLoop = (targetPath: string) => {
  const recentRedirects = redirectHistory.filter(path => path === targetPath);
  return recentRedirects.length >= MAX_REDIRECTS;
};

const PageVisibilityGuard = ({ 
  pageKey, 
  children, 
  redirectTo = '/' 
}: PageVisibilityGuardProps) => {
  const { isPageVisible, loading, error } = usePageVisibility();
  const { user } = useAuth();
  const { canAccessAdmin, isLoading: permissionsLoading } = usePermissions();
  const location = useLocation();
  const [hasTimeout, setHasTimeout] = useState(false);
  const [loadingStartTime] = useState(Date.now());

  // Timeout para situações de carregamento excessivo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading || permissionsLoading) {
        console.warn(`⏰ [PAGE GUARD] Loading timeout (10s) for "${pageKey}"`, {
          loadingTime: Date.now() - loadingStartTime,
          hasError: !!error,
          isAuthenticated: !!user,
          currentPath: location.pathname
        });
        setHasTimeout(true);
      }
    }, 10000); // 10 segundos

    return () => clearTimeout(timer);
  }, [loading, permissionsLoading, pageKey, loadingStartTime, error, user, location.pathname]);

  // Verificar se o usuário é admin real (não apenas mock)
  const isRealAdmin = canAccessAdmin() && user && user.id !== 'mock_user_id';
  const isMockAdmin = user?.id === 'mock_user_id';

  console.log('🛡️ [PageVisibilityGuard] Admin check:', {
    canAccessAdmin: canAccessAdmin(),
    userId: user?.id,
    isRealAdmin,
    isMockAdmin,
    isAdmin: isRealAdmin || isMockAdmin
  });

  // Logs detalhados para diagnóstico
  console.log(`🛡️ [PAGE GUARD] Status completo para "${pageKey}":`, {
    loading,
    permissionsLoading,
    hasTimeout,
    error,
    isVisible: !loading ? isPageVisible(pageKey) : 'checking...',
    userId: user?.id,
    userEmail: user?.email,
    isRealAdmin,
    isMockAdmin,
    canAccessAdmin,
    currentPath: location.pathname,
    redirectTo,
    loadingTime: Date.now() - loadingStartTime
  });

  // Se timeout ocorreu, permitir acesso para admins ou usuários autenticados como fallback de emergência
  if (hasTimeout) {
    if (isRealAdmin || isMockAdmin) {
      console.log(`⚠️ [PAGE GUARD] Timeout atingido para "${pageKey}" - permitindo acesso de emergência para admin`, {
        reason: 'timeout_emergency_access_admin',
        userId: user?.id,
        loadingTime: Date.now() - loadingStartTime
      });
      return <>{children}</>;
    } else if (user) {
      console.log(`⚠️ [PAGE GUARD] Timeout atingido para "${pageKey}" - permitindo acesso de emergência para usuário autenticado`, {
        reason: 'timeout_emergency_access_user',
        userId: user?.id,
        loadingTime: Date.now() - loadingStartTime
      });
      return <>{children}</>;
    } else {
      console.log(`❌ [PAGE GUARD] Timeout e sem autenticação para "${pageKey}", redirecionando`);
      return <Navigate to="/entrar" replace />;
    }
  }

  // Se há erro e usuário não está autenticado, redirecionar para login
  if (error && !user) {
    console.log(`❌ [PAGE GUARD] Erro sem autenticação para "${pageKey}", redirecionando para login`, {
      error,
      redirectTo: "/entrar"
    });
    return <Navigate to="/entrar" replace />;
  }

  // Se há erro mas usuário está autenticado, negar acesso mas não redirecionar para login
  if (error && user && !isRealAdmin && !isMockAdmin) {
    console.log(`⚠️ [PAGE GUARD] Erro no sistema para "${pageKey}" - usuário autenticado mas negando acesso por segurança`, {
      error,
      userId: user?.id
    });
    return <Navigate to="/area-membro" replace />;
  }

  if (loading || permissionsLoading) {
    console.log(`⏳ [PAGE GUARD] Carregando dados de visibilidade para "${pageKey}"`, {
      loadingTime: Date.now() - loadingStartTime,
      loading,
      permissionsLoading
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader variant="spinner" size="lg" />
          <div className="text-center text-white">
            <p className="text-sm">Verificando permissões...</p>
            <p className="text-xs text-gray-400 mt-1">
              Carregando há {Math.round((Date.now() - loadingStartTime) / 1000)}s
            </p>
          </div>
        </div>
      </div>
    );
  }

  // LÓGICA PRINCIPAL: Admin sempre vê tudo, usuário comum respeita visibilidade
  const pageIsVisible = isPageVisible(pageKey);
  
  console.log(`🔍 [PAGE GUARD] Decisão de acesso para "${pageKey}":`, {
    pageIsVisible,
    isRealAdmin,
    isMockAdmin,
    isAuthenticated: !!user,
    willAllow: isRealAdmin || isMockAdmin || pageIsVisible,
    hasError: !!error
  });
  
  // ADMIN SEMPRE VÊ TUDO (seja admin real ou mock para testes)
  if (isRealAdmin || isMockAdmin) {
    const reason = isRealAdmin ? 'real_admin' : 'mock_admin';
    console.log(`👑 [PAGE GUARD] Acesso concedido para "${pageKey}" - motivo: ${reason}`);
    return <>{children}</>;
  }
  
  // USUÁRIO COMUM: Só vê se a página estiver visível
  if (pageIsVisible) {
    console.log(`✅ [PAGE GUARD] Acesso concedido para "${pageKey}" - página visível para usuários`);
    return <>{children}</>;
  }

  // Lógica de redirecionamento seguro apenas se usuário não está autenticado
  if (!user) {
    console.log(`🚫 [PAGE GUARD] Usuário não autenticado tentando acessar "${pageKey}", redirecionando para login`);
    return <Navigate to="/entrar" replace />;
  }

  // Se usuário está autenticado mas página não está visível
  const currentPath = location.pathname;
  let safeRedirectPath = redirectTo;

  // Evitar redirecionamento circular
  if (currentPath === redirectTo) {
    console.warn(`🔄 [PAGE GUARD] Redirecionamento circular detectado: ${currentPath} -> ${redirectTo}`);
    safeRedirectPath = '/area-membro'; // Redirecionar para área de membros em vez de home
  }

  // Detectar loop de redirecionamentos
  if (isInRedirectLoop(safeRedirectPath)) {
    console.error(`🚨 [PAGE GUARD] Loop de redirecionamento detectado para "${safeRedirectPath}", usando rota de escape`);
    safeRedirectPath = '/area-membro'; // Rota de escape segura
  }

  // Adicionar ao histórico de redirecionamentos
  addToRedirectHistory(currentPath);

  console.log(`🚫 [PAGE GUARD] Acesso negado para "${pageKey}" (usuário comum, página não visível), redirecionando ${currentPath} -> ${safeRedirectPath}`);
  return <Navigate to={safeRedirectPath} replace />;
};

export default PageVisibilityGuard;
