
import { useEffect } from 'react';
import { useToolsStore } from '@/app/store/tools.store';

// Custom hook for cross-component tools synchronization
export const useToolsSync = () => {
  const { refreshTools } = useToolsStore();

  useEffect(() => {
    // Listen for admin tool updates via localStorage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tools_admin_update' && e.newValue) {
        const updateData = JSON.parse(e.newValue);
        console.log('🔄 Detectada mudança administrativa, refreshing tools...', updateData);
        
        // Force refresh tools from Supabase
        refreshTools();
        
        // Clear the trigger to avoid repeated refreshes
        setTimeout(() => {
          localStorage.removeItem('tools_admin_update');
        }, 1000);
      }
    };

    // Listen for admin updates from the same window
    const handleCustomEvent = (e: CustomEvent) => {
      console.log('📢 Evento admin recebido na área de membros:', e.detail);
      refreshTools();
    };

    // Setup listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('toolsAdminUpdate', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('toolsAdminUpdate', handleCustomEvent as EventListener);
    };
  }, [refreshTools]);

  // Function to broadcast admin changes
  const broadcastAdminUpdate = (toolId: number, updates: any) => {
    const updateData = {
      toolId,
      updates,
      timestamp: Date.now()
    };

    // Dispatch custom event for same-window communication
    window.dispatchEvent(new CustomEvent('toolsAdminUpdate', { 
      detail: updateData 
    }));

    // Use localStorage for cross-tab communication
    localStorage.setItem('tools_admin_update', JSON.stringify(updateData));
    
    console.log('📡 Broadcasting admin update:', updateData);
  };

  return {
    broadcastAdminUpdate
  };
};
