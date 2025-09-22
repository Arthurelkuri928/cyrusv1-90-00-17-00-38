
import { useEffect, useState } from 'react';
import { useToolsStore } from '@/app/store/tools.store';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useToolsDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const { tools, isLoading, error } = useToolsStore();
  const { user } = useAuth();

  useEffect(() => {
    const runDiagnostics = async () => {
      console.log('🔍 [DIAGNÓSTICO] Iniciando diagnóstico completo...');
      
      const diagnostic = {
        timestamp: new Date().toISOString(),
        user: {
          isAuthenticated: !!user,
          userId: user?.id || 'null',
          email: user?.email || 'null'
        },
        store: {
          toolsCount: tools?.length || 0,
          isLoading,
          error: error || 'null'
        },
        database: {
          connectionTest: false,
          toolsInDatabase: 0,
          activeTools: 0,
          maintenanceTools: 0
        }
      };

      // Test database connection
      try {
        const { data: connectionTest, error: connError } = await supabase
          .from('tools')
          .select('count(*)')
          .limit(1);
        
        diagnostic.database.connectionTest = !connError;
        
        if (!connError) {
          // Count tools in database
          const { data: toolsData, error: toolsError } = await supabase
            .from('tools')
            .select('id, is_active, is_maintenance');
          
          if (!toolsError && toolsData) {
            diagnostic.database.toolsInDatabase = toolsData.length;
            diagnostic.database.activeTools = toolsData.filter(t => t.is_active === true).length;
            diagnostic.database.maintenanceTools = toolsData.filter(t => t.is_maintenance === true).length;
          }
        }
      } catch (error) {
        console.error('❌ [DIAGNÓSTICO] Erro na conexão com banco:', error);
      }

      console.log('📊 [DIAGNÓSTICO COMPLETO]:', diagnostic);
      setDiagnostics(diagnostic);
    };

    if (user) {
      runDiagnostics();
    }
  }, [user, tools, isLoading, error]);

  return diagnostics;
};
