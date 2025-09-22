
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePageVisibilityStore, PageVisibility } from '@/app/store/pageVisibility.store';

// Sistema de controle melhorado para evitar conflitos
let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;
let subscriberCount = 0;
let isConnecting = false;

// Função para verificar se um objeto tem a estrutura de PageVisibility
const isValidPageVisibility = (obj: any): obj is PageVisibility => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.is_visible === 'boolean' &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string';
};

export const usePageVisibilityRealtime = () => {
  const { fetchPages, invalidateCache, setPages } = usePageVisibilityStore();
  const isSubscribedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    // Evitar múltiplas conexões simultâneas
    if (isConnecting || isSubscribedRef.current) {
      subscriberCount++;
      console.log(`👥 [REALTIME] Subscriber count increased: ${subscriberCount}`);
      return;
    }

    // Só criar uma conexão global
    if (!realtimeChannel && !isConnecting) {
      isConnecting = true;
      console.log('📡 [REALTIME] Creating global page visibility subscription...');
      
      realtimeChannel = supabase
        .channel('global_pages_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pages'
          },
          async (payload) => {
            console.log('🔥 [REALTIME] Page change detected:', {
              event: payload.eventType,
              table: payload.table,
              old: payload.old,
              new: payload.new
            });
            
            // Invalidar cache imediatamente
            invalidateCache();
            
            // Para mudanças específicas, otimizar a atualização local
            if (payload.eventType === 'UPDATE' && payload.new && isValidPageVisibility(payload.new)) {
              console.log('⚡ [REALTIME] Applying immediate local update...');
              
              // Buscar estado atual para fazer merge inteligente
              const currentState = usePageVisibilityStore.getState();
              const updatedPages = currentState.pages.map(page => 
                page.id === payload.new.id ? payload.new as PageVisibility : page
              );
              
              // Atualizar estado local imediatamente
              setPages(updatedPages);
              
              // Forçar re-render em componentes que dependem da visibilidade
              window.dispatchEvent(new CustomEvent('pageVisibilityChanged', {
                detail: {
                  pageId: payload.new.id,
                  oldValue: payload.old?.is_visible,
                  newValue: payload.new.is_visible,
                  timestamp: Date.now()
                }
              }));
            } else if (payload.eventType === 'INSERT' && payload.new && isValidPageVisibility(payload.new)) {
              console.log('➕ [REALTIME] Adding new page to local state...');
              
              const currentState = usePageVisibilityStore.getState();
              const newPages = [...currentState.pages, payload.new as PageVisibility];
              setPages(newPages);
            } else if (payload.eventType === 'DELETE' && payload.old) {
              console.log('🗑️ [REALTIME] Removing page from local state...');
              
              const currentState = usePageVisibilityStore.getState();
              const filteredPages = currentState.pages.filter(page => page.id !== payload.old.id);
              setPages(filteredPages);
            }
            
            // Backup: Refetch completo após delay pequeno para garantir consistência
            setTimeout(async () => {
              try {
                await fetchPages();
                console.log('✅ [REALTIME] Backup data refresh completed');
              } catch (error) {
                console.warn('⚠️ [REALTIME] Backup refresh failed:', error);
              }
            }, 1000);
          }
        )
        .subscribe((status) => {
          console.log('📡 [REALTIME] Subscription status:', status);
          isConnecting = false;
          
          if (status === 'SUBSCRIBED') {
            console.log('✅ [REALTIME] Successfully connected to page changes');
            retryCountRef.current = 0;
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ [REALTIME] Channel error, will retry...');
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current++;
              setTimeout(() => {
                if (realtimeChannel) {
                  supabase.removeChannel(realtimeChannel);
                  realtimeChannel = null;
                  isConnecting = false;
                }
              }, 2000 * retryCountRef.current);
            }
          }
        });

      isSubscribedRef.current = true;
    }

    subscriberCount++;
    console.log(`👥 [REALTIME] Subscriber count: ${subscriberCount}`);

    return () => {
      subscriberCount--;
      console.log(`👥 [REALTIME] Subscriber count decreased: ${subscriberCount}`);
      
      // Só limpar quando não há mais subscribers
      if (subscriberCount === 0 && realtimeChannel) {
        console.log('🔌 [REALTIME] Cleaning up global subscription');
        supabase.removeChannel(realtimeChannel);
        realtimeChannel = null;
        isSubscribedRef.current = false;
        isConnecting = false;
        retryCountRef.current = 0;
      }
    };
  }, [fetchPages, invalidateCache, setPages]);

  return {
    isConnected: !!realtimeChannel && !isConnecting
  };
};
