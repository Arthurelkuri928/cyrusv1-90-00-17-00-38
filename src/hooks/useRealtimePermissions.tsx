import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/usePermissions';

/**
 * Hook para monitorar mudanças de permissões em tempo real
 */
export const useRealtimePermissions = () => {
  const { refreshPermissions, role, isAuthenticated } = usePermissions();

  const handlePermissionsChanges = useCallback((payload: any) => {
    console.log('🔄 [RealtimePermissions] Mudança detectada nas permissões:', payload);
    
    // Se for uma mudança na tabela admin_permissions
    if (payload.table === 'admin_permissions') {
      const affectedUserId = payload.new?.admin_id || payload.old?.admin_id;
      
      // Verificar se é o usuário atual
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.id === affectedUserId) {
          console.log('🎯 [RealtimePermissions] Permissões do usuário atual alteradas');
          
          // Broadcast para outras abas
          const updateData = {
            userId: affectedUserId,
            action: payload.eventType,
            timestamp: Date.now()
          };
          
          // Notificar outras abas via localStorage
          localStorage.setItem('permissions_update', JSON.stringify(updateData));
          
          // Dispatch evento personalizado para mesma aba
          window.dispatchEvent(new CustomEvent('permissionsUpdate', { 
            detail: updateData 
          }));
          
          // Recarregar permissões após delay
          setTimeout(() => {
            refreshPermissions();
          }, 500);
        }
      });
    }

    // Se for mudança no role do usuário (profiles)
    if (payload.table === 'profiles' && payload.eventType === 'UPDATE' && payload.new?.role !== payload.old?.role) {
      console.log(`👤 [RealtimePermissions] Role alterado: ${payload.old?.role} → ${payload.new?.role}`);
      
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.id === payload.new?.id) {
          // Broadcast mudança de role
          const updateData = {
            userId: payload.new.id,
            oldRole: payload.old?.role,
            newRole: payload.new?.role,
            timestamp: Date.now()
          };
          
          localStorage.setItem('permissions_update', JSON.stringify(updateData));
          
          window.dispatchEvent(new CustomEvent('permissionsUpdate', { 
            detail: updateData 
          }));
          
          setTimeout(() => {
            refreshPermissions();
          }, 500);
        }
      });
    }
  }, [refreshPermissions]);

  // Listener para mudanças cross-tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'permissions_update' && e.newValue) {
        try {
          const updateData = JSON.parse(e.newValue);
          console.log('📢 [RealtimePermissions] Update recebido de outra aba:', updateData);
          
          // Recarregar permissões
          setTimeout(() => {
            refreshPermissions();
          }, 100);
          
          // Limpar trigger após processamento
          setTimeout(() => {
            localStorage.removeItem('permissions_update');
          }, 1000);
        } catch (error) {
          console.error('❌ Erro ao processar update de permissões:', error);
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      console.log('📡 [RealtimePermissions] Evento custom recebido:', e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('permissionsUpdate', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('permissionsUpdate', handleCustomEvent as EventListener);
    };
  }, [refreshPermissions]);

  // Configurar listener do Supabase para admin_permissions e profiles
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('🎯 [RealtimePermissions] Configurando listener para permissões...');
    
    const channel = supabase
      .channel('permissions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_permissions'
        },
        handlePermissionsChanges
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        handlePermissionsChanges
      )
      .subscribe((status) => {
        console.log('📡 [RealtimePermissions] Status do canal:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime conectado para monitoramento de permissões!');
        }
      });

    return () => {
      console.log('🔌 [RealtimePermissions] Desconectando listener...');
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, handlePermissionsChanges]);

  return {
    currentRole: role,
    refreshPermissions
  };
};