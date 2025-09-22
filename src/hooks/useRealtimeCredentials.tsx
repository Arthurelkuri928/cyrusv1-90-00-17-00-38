
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToolsStore } from '@/app/store/tools.store';

export const useRealtimeCredentials = (toolId?: string | number) => {
  const { credentialsUpdateInProgress } = useToolsStore();

  useEffect(() => {
    console.log('🔄 Setting up realtime for credentials...');
    
    // Listen for changes to tool_credentials table
    const credentialsChannel = supabase
      .channel('tool-credentials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tool_credentials'
        },
        (payload) => {
          console.log('🔄 Tool credentials changed:', payload);
          
          // Dispatch custom event for general credential updates
          window.dispatchEvent(new CustomEvent('toolCredentialsUpdate', { 
            detail: { payload } 
          }));
        }
      )
      .subscribe();

    // If specific toolId is provided, listen for changes to that tool's credentials
    let specificChannel: any = null;
    
    if (toolId) {
      console.log(`🔄 Setting up realtime for tool ${toolId} credentials...`);
      
      specificChannel = supabase
        .channel(`tool-${toolId}-credentials`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tool_credentials',
            filter: `tool_id=eq.${toolId}`
          },
          (payload) => {
            console.log(`🔄 Credentials updated for tool ${toolId}:`, payload);
            
            // Dispatch custom event for specific tool credential updates
            window.dispatchEvent(new CustomEvent('toolCredentialsUpdate', { 
              detail: { toolId, payload } 
            }));
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(credentialsChannel);
      if (specificChannel) {
        supabase.removeChannel(specificChannel);
      }
    };
  }, [toolId]);

  return {
    credentialsUpdateInProgress
  };
};
