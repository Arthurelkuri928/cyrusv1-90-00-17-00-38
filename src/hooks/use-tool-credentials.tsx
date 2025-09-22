
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeCredentials } from '@/hooks/useRealtimeCredentials';

export type ToolCredential = {
  type: string;
  label: string;
  value: string;
};

export const useToolCredentials = (toolId: string | number) => {
  const [credentials, setCredentials] = useState<ToolCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  const { credentialsUpdateInProgress } = useRealtimeCredentials(toolId);

  const fetchCredentials = async () => {
    if (!session) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }

    // If no toolId is provided or empty string, return empty credentials
    if (!toolId) {
      setCredentials([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`🔍 Buscando credenciais para ferramenta ID: ${toolId}`);
      
      const { data, error } = await supabase
        .from('tool_credentials')
        .select('credentials')
        .eq('tool_id', String(toolId))
        .single();

      if (error) {
        console.error("Erro ao buscar credenciais:", error);
        setError("Erro ao carregar credenciais");
        setCredentials([]);
      } else if (data) {
        if (data.credentials && Array.isArray(data.credentials)) {
          const validatedCredentials = data.credentials
            .filter((cred: any) => 
              cred && typeof cred === 'object' && 
              'type' in cred && 
              'label' in cred && 
              'value' in cred
            )
            .map((cred: any) => ({
              type: String(cred.type),
              label: String(cred.label),
              value: String(cred.value)
            }));
          
          console.log(`✅ Credenciais carregadas: ${validatedCredentials.length} encontradas para ferramenta ${toolId}`);
          
          // Log specific cookie credentials for debugging
          const cookieCredentials = validatedCredentials.filter(cred => 
            cred.type.toLowerCase().includes('cookie')
          );
          if (cookieCredentials.length > 0) {
            console.log(`🍪 Cookies encontrados: ${cookieCredentials.length} para ferramenta ${toolId}`);
          }
          
          setCredentials(validatedCredentials);
        } else {
          console.log(`📭 Nenhuma credencial estruturada encontrada para ferramenta ${toolId}`);
          setCredentials([]);
        }
      } else {
        console.log(`📭 Nenhum registro de credenciais encontrado para ferramenta ${toolId}`);
        setCredentials([]);
      }
    } catch (err) {
      console.error("Erro ao buscar credenciais:", err);
      setError("Erro inesperado ao carregar credenciais");
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCredentials();
    }
  }, [toolId, session, credentialsUpdateInProgress]);

  // Listen for specific tool credential updates
  useEffect(() => {
    const handleCredentialsUpdate = (event: CustomEvent) => {
      if (event.detail.toolId === String(toolId)) {
        console.log(`🔄 Refreshing credentials for tool ${toolId} due to update event`);
        // Re-fetch credentials when update is detected
        fetchCredentials();
      }
    };

    // Listen for general credential updates
    const handleGeneralCredentialsUpdate = (event: CustomEvent) => {
      console.log(`🔄 General credentials update detected, refreshing for tool ${toolId}`);
      fetchCredentials();
    };

    window.addEventListener('toolCredentialsUpdate', handleCredentialsUpdate as EventListener);
    window.addEventListener('toolCredentialsUpdate', handleGeneralCredentialsUpdate as EventListener);

    return () => {
      window.removeEventListener('toolCredentialsUpdate', handleCredentialsUpdate as EventListener);
      window.removeEventListener('toolCredentialsUpdate', handleGeneralCredentialsUpdate as EventListener);
    };
  }, [toolId]);

  return { credentials, loading, error };
};
