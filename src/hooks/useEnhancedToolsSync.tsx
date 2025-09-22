
import { useEffect } from 'react';
import { useToolsStore } from '@/app/store/tools.store';
import { useToolsSync } from '@/hooks/useToolsSync';

// Hook aprimorado que combina o sistema atual com melhorias
export const useEnhancedToolsSync = () => {
  const { refreshTools } = useToolsStore();
  const { broadcastAdminUpdate } = useToolsSync();

  useEffect(() => {
    // Enhanced cross-tab communication with better reliability
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tools_admin_update' && e.newValue) {
        try {
          const updateData = JSON.parse(e.newValue);
          console.log('🔄 ENHANCED: Detectada mudança administrativa cross-tab:', updateData);
          
          // Force immediate refresh with better timing
          setTimeout(() => {
            refreshTools();
          }, 100); // Reduced delay for faster sync
          
          // Clear trigger after processing
          setTimeout(() => {
            localStorage.removeItem('tools_admin_update');
          }, 1000);
        } catch (error) {
          console.error('❌ Erro ao processar update cross-tab:', error);
        }
      }
    };

    // Enhanced same-window communication
    const handleCustomEvent = (e: CustomEvent) => {
      console.log('📢 ENHANCED: Evento admin recebido (same-window):', e.detail);
      
      // Immediate refresh for same-window updates
      setTimeout(() => {
        refreshTools();
      }, 50); // Even faster for same-window
    };

    // Enhanced visibility change handler for better sync when returning to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ ENHANCED: Tab ativa novamente, verificando sync...');
        // Check if there were any missed updates
        const lastUpdate = localStorage.getItem('tools_admin_update');
        if (lastUpdate) {
          console.log('🔄 Processando update perdido:', lastUpdate);
          refreshTools();
          localStorage.removeItem('tools_admin_update');
        }
      }
    };

    // Setup enhanced listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('toolsAdminUpdate', handleCustomEvent as EventListener);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('toolsAdminUpdate', handleCustomEvent as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshTools]);

  return {
    broadcastAdminUpdate
  };
};
