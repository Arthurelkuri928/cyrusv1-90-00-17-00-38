
import { useCallback } from 'react';
import { useUIStore } from '@/app/store/ui.store';

export const useToolSidebar = () => {
  const {
    sidebarExpanded,
    setSidebarExpanded,
    showMobileSidebar,
    setShowMobileSidebar,
    manualSidebarControl,
    toggleSidebar: storeToggleSidebar
  } = useUIStore();

  // Use the store's toggle function directly
  const toggleSidebar = useCallback(() => {
    console.log('🔧 useToolSidebar: toggleSidebar called, manualSidebarControl:', manualSidebarControl);
    storeToggleSidebar();
  }, [storeToggleSidebar, manualSidebarControl]);

  console.log('🔧 useToolSidebar: current state', {
    sidebarExpanded,
    showMobileSidebar,
    manualSidebarControl
  });

  return {
    sidebarExpanded,
    setSidebarExpanded,
    showMobileSidebar,
    setShowMobileSidebar,
    manualSidebarControl,
    toggleSidebar
  };
};
