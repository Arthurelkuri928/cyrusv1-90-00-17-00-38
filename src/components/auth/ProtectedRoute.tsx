
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = () => {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  // Verificação adicional de sessão para conexões reais com Supabase
  useEffect(() => {
    const checkSession = async () => {
      // Só verifica sessão real se não for mock
      if (user && session && !session.access_token.includes('mock_token_')) {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          console.warn("⚠️ Sessão inválida detectada:", error?.message);
        } else {
          console.log("✅ Sessão válida confirmada");
        }
      } else if (user && session?.access_token.includes('mock_token_')) {
        console.log("🧪 Usando sessão de teste - validação saltada");
      }
    };

    if (user) {
      checkSession();
    }
  }, [user, session]);

  if (loading) {
    console.log("⏳ ProtectedRoute: Verificando autenticação...");
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A259FF]"></div>
      </div>
    );
  }

  if (!user) {
    console.log("🚫 ProtectedRoute: Usuário não autenticado, redirecionando...");
    return <Navigate to="/entrar" state={{ from: location.pathname }} replace />;
  }

  console.log("✅ ProtectedRoute: Usuário autenticado, permitindo acesso");
  return <Outlet />;
};

export default ProtectedRoute;
