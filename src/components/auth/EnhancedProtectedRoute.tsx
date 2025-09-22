
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from '@/design-system';

const EnhancedProtectedRoute = () => {
  const { user, loading, sessionLoading, session } = useAuth();
  const location = useLocation();
  const [sessionValidated, setSessionValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Validação de sessão otimizada com timeout
  useEffect(() => {
    const validateSession = async () => {
      if (user && session && !isValidating) {
        setIsValidating(true);
        
        // Só valida sessão real (não mock)
        if (!session.access_token.includes('mock_token_')) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout

          try {
            const { data, error } = await supabase.auth.getSession();
            
            clearTimeout(timeoutId);
            
            if (error || !data.session) {
              console.warn("⚠️ Sessão inválida detectada, fazendo logout...");
              await supabase.auth.signOut();
              return;
            }
            
            console.log("✅ Sessão válida confirmada");
          } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
              console.warn("⏰ Timeout na validação de sessão");
            } else {
              console.error("❌ Erro ao validar sessão:", error);
            }
          }
        } else {
          console.log("🧪 Sessão de teste detectada - validação saltada");
        }
        
        setSessionValidated(true);
        setIsValidating(false);
      }
    };

    if (user && !sessionValidated && !loading && !sessionLoading && !isValidating) {
      validateSession();
    } else if (!user) {
      setSessionValidated(false);
      setIsValidating(false);
    }
  }, [user, session, sessionValidated, loading, sessionLoading, isValidating]);

  // Aguardar carregamento completo da autenticação
  if (loading || sessionLoading || isValidating) {
    console.log("⏳ EnhancedProtectedRoute: Verificando autenticação...");
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader variant="cyrus" size="lg" text="Verificando permissões..." />
      </div>
    );
  }

  // ÚNICA LÓGICA DE REDIRECIONAMENTO: Para usuários não autenticados
  if (!user) {
    console.log("🚫 EnhancedProtectedRoute: Usuário não autenticado, redirecionando...");
    
    // Salvar rota atual APENAS se não for página de login
    if (location.pathname !== '/entrar' && location.pathname !== '/cadastro') {
      localStorage.setItem('redirectAfterLogin', location.pathname);
      console.log('📍 Rota salva para redirecionamento pós-login:', location.pathname);
    }
    
    return <Navigate to="/entrar" state={{ from: location.pathname }} replace />;
  }

  // Usuário autenticado - permitir acesso à rota atual
  console.log("✅ EnhancedProtectedRoute: Acesso autorizado para:", location.pathname);
  return <Outlet />;
};

export default EnhancedProtectedRoute;
