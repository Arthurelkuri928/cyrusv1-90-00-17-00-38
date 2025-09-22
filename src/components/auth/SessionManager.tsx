
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '@/design-system';

interface SessionManagerProps {
  children: React.ReactNode;
}

/**
 * Componente simplificado para gerenciar apenas o estado de carregamento da sessão
 * Toda lógica de navegação foi movida para EnhancedProtectedRoute
 */
export const SessionManager = ({ children }: SessionManagerProps) => {
  const { loading, sessionLoading } = useAuth();

  // Mostrar loader durante verificação de sessão - com timeout
  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader variant="cyrus" size="lg" />
          <div className="text-center">
            <p className="text-muted-foreground">Verificando autenticação...</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Aguarde enquanto carregamos sua sessão
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sistema pronto - renderizar aplicação
  console.log('✅ SessionManager: Sistema pronto, renderizando aplicação');
  return <>{children}</>;
};
