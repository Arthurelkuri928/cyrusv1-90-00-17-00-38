
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToolsStore } from '@/app/store/tools.store';

export const useRealtimeTools = () => {
  const { refreshTools, forceGlobalRefresh } = useToolsStore();
  const adminUpdateFlagRef = useRef<boolean>(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToolsChange = useCallback((payload: any) => {
    console.log('🔥 REALTIME UPDATE DETECTADO:', payload);
    
    // Check if this is an admin update to avoid conflicts
    if (adminUpdateFlagRef.current) {
      console.log('⚠️ IGNORANDO REALTIME: Admin update em progresso');
      return;
    }
    
    // Clear any existing debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce realtime updates to avoid rapid fire
    debounceTimeoutRef.current = setTimeout(() => {
      switch (payload.eventType) {
        case 'UPDATE':
          const updatedTool = payload.new;
          console.log(`⚡ Tool ${updatedTool.id} atualizada em tempo real:`, {
            name: updatedTool.name,
            is_active: updatedTool.is_active,
            is_maintenance: updatedTool.is_maintenance,
            timestamp: new Date().toISOString()
          });
          
          // Force immediate refresh with delay tracking
          console.log('🚀 INICIANDO forceGlobalRefresh via REALTIME...');
          forceGlobalRefresh();
          break;
          
        case 'INSERT':
          console.log('➕ Nova ferramenta adicionada:', payload.new);
          refreshTools();
          break;
          
        case 'DELETE':
          console.log('🗑️ Ferramenta removida:', payload.old);
          refreshTools();
          break;
      }
    }, 300); // 300ms debounce
    
  }, [refreshTools, forceGlobalRefresh]);

  // Function to set admin update flag
  const setAdminUpdateFlag = useCallback((isAdminUpdate: boolean) => {
    console.log(`🔧 ADMIN FLAG: ${isAdminUpdate ? 'ATIVADA' : 'DESATIVADA'}`);
    adminUpdateFlagRef.current = isAdminUpdate;
    
    // Auto-clear the flag after 2 seconds as safety measure
    if (isAdminUpdate) {
      setTimeout(() => {
        if (adminUpdateFlagRef.current) {
          console.log('🔧 ADMIN FLAG: Auto-cleared após timeout');
          adminUpdateFlagRef.current = false;
        }
      }, 2000);
    }
  }, []);

  useEffect(() => {
    console.log('🎯 Iniciando listener Realtime para tabela tools...');
    
    // Setup realtime subscription
    const channel = supabase
      .channel('tools-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'tools'
        },
        handleToolsChange
      )
      .subscribe((status) => {
        console.log('📡 Status do canal Realtime:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime conectado com sucesso para tools!');
        }
      });

    return () => {
      console.log('🔌 Desconectando listener Realtime...');
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [handleToolsChange]);

  return {
    forceRefresh: forceGlobalRefresh,
    setAdminUpdateFlag
  };
};
