
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUniversalAuth } from '@/hooks/useUniversalAuth';
import { useToast } from '@/hooks/use-toast';

interface ToolsValidationResult {
  canAccessTools: boolean;
  isLoading: boolean;
  error: string | null;
  isMember: boolean;
  isAdmin: boolean;
}

export const useToolsValidation = () => {
  const { user, isAuthenticated } = useUniversalAuth();
  const { toast } = useToast();
  const [result, setResult] = useState<ToolsValidationResult>({
    canAccessTools: false,
    isLoading: true,
    error: null,
    isMember: false,
    isAdmin: false
  });

  useEffect(() => {
    const validateAccess = async () => {
      if (!isAuthenticated || !user) {
        setResult({
          canAccessTools: false,
          isLoading: false,
          error: 'Usuário não autenticado',
          isMember: false,
          isAdmin: false
        });
        return;
      }

      try {
        console.log('🔍 [ToolsValidation] Validando acesso às ferramentas...');

        // Testar se consegue acessar as ferramentas
        const { data: toolsTest, error: toolsError } = await supabase
          .from('tools')
          .select('id')
          .limit(1);

        if (toolsError) {
          console.error('❌ [ToolsValidation] Erro ao acessar ferramentas:', toolsError);
          
          if (toolsError.code === 'PGRST301' || toolsError.message?.includes('permission')) {
            setResult({
              canAccessTools: false,
              isLoading: false,
              error: 'Acesso negado às ferramentas. Verifique sua assinatura.',
              isMember: false,
              isAdmin: false
            });
            
            toast({
              title: "Acesso Restrito",
              description: "Sua assinatura pode ter expirado. Entre em contato com o suporte.",
              variant: "destructive"
            });
            return;
          }
        }

        // Verificar status de membro e admin
        const { data: debugData } = await supabase.rpc('debug_permissions_check');
        const permissions = debugData?.[0];

        const isMember = toolsTest && toolsTest.length >= 0; // Se conseguiu acessar, é membro
        const isAdmin = permissions?.is_admin_result || false;

        console.log('✅ [ToolsValidation] Validação concluída:', {
          canAccessTools: isMember,
          isMember,
          isAdmin,
          toolsCount: toolsTest?.length || 0
        });

        setResult({
          canAccessTools: isMember,
          isLoading: false,
          error: null,
          isMember,
          isAdmin
        });

      } catch (error) {
        console.error('💥 [ToolsValidation] Erro geral:', error);
        setResult({
          canAccessTools: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          isMember: false,
          isAdmin: false
        });
      }
    };

    validateAccess();
  }, [isAuthenticated, user?.id, toast]);

  return result;
};
