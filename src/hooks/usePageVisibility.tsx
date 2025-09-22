
import { useEffect } from 'react';
import { usePageVisibilityStore } from '@/app/store/pageVisibility.store';
import { usePageVisibilityRealtime } from '@/hooks/usePageVisibilityRealtime';
import { useUniversalAuth } from '@/hooks/useUniversalAuth';
import { supabase } from '@/integrations/supabase/client';

export const usePageVisibility = () => {
  const {
    pages,
    loading,
    error,
    fetchPages,
    updatePageVisibility,
    isPageVisible,
    shouldRefetch
  } = usePageVisibilityStore();
  
  const { isAuthenticated } = useUniversalAuth();
  
  // Setup realtime subscription
  const { isConnected } = usePageVisibilityRealtime();

  // Debug function for admin status
  const debugAdminStatus = async () => {
    if (!isAuthenticated) {
      console.log('🔍 [DEBUG] User not authenticated');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('debug_admin_check');
      console.log('🔍 [DEBUG] Admin status:', data);
      if (error) {
        console.error('❌ [DEBUG] Error checking admin status:', error);
      }
    } catch (error) {
      console.error('💥 [DEBUG] Unexpected error checking admin:', error);
    }
  };

  // Initial data fetch com retry automático
  useEffect(() => {
    console.log('🎯 [usePageVisibility] Hook inicializado, verificando necessidade de fetch...', {
      shouldRefetch: shouldRefetch(),
      pagesLength: pages.length,
      loading,
      error
    });
    
    const performFetch = async () => {
      if (shouldRefetch() || pages.length === 0) {
        console.log('📥 [usePageVisibility] Iniciando fetch de páginas...');
        try {
          await fetchPages();
          console.log('✅ [usePageVisibility] Fetch concluído com sucesso');
        } catch (fetchError) {
          console.error('❌ [usePageVisibility] Erro no fetch:', fetchError);
          
          // Retry após 2 segundos em caso de erro
          setTimeout(() => {
            console.log('🔄 [usePageVisibility] Tentando fetch novamente após erro...');
            fetchPages();
          }, 2000);
        }
      } else {
        console.log('📋 [usePageVisibility] Usando dados em cache');
      }
    };

    performFetch();
  }, [fetchPages, shouldRefetch, pages.length]);

  // Debug admin status on auth change
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔍 [DEBUG] Auth alterado, verificando status de admin...');
      debugAdminStatus();
    }
  }, [isAuthenticated]);

  // Log do estado atual para debugging
  useEffect(() => {
    console.log('📊 [usePageVisibility] Estado atual do hook:', {
      pagesCount: pages.length,
      loading,
      error: error || 'none',
      isRealtimeConnected: isConnected,
      isAuthenticated
    });
  }, [pages.length, loading, error, isConnected, isAuthenticated]);

  return {
    pages,
    loading,
    error,
    isPageVisible,
    updatePageVisibility,
    refetch: fetchPages,
    isAuthenticated,
    debugAdminStatus,
    isRealtimeConnected: isConnected
  };
};
