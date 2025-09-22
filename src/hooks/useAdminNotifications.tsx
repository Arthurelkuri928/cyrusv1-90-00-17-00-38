
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUniversalAuth } from '@/hooks/useUniversalAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  created_by: string;
  is_read: boolean;
}

interface CreateNotificationData {
  title: string;
  message: string;
  target_type: 'ROLE' | 'USER';
  target_values: string[];
}

export const useAdminNotifications = () => {
  const { user } = useUniversalAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Buscar notificações do usuário
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log('🔔 Buscando notificações para o usuário:', user.id);
      
      const { data, error } = await supabase.rpc('get_my_admin_notifications', {
        p_limit: 50,
        p_offset: 0
      });

      if (error) {
        console.error('❌ Erro ao buscar notificações:', error);
        return;
      }

      console.log('✅ Notificações recebidas:', data);
      
      // Garantir que os dados estão estruturados corretamente
      const processedNotifications = (data || []).map(notification => ({
        id: notification.id,
        title: notification.title || 'Sem título',
        message: notification.message || '',
        created_at: notification.created_at,
        created_by: notification.created_by,
        is_read: notification.is_read || false
      }));

      setNotifications(processedNotifications);
    } catch (error) {
      console.error('💥 Erro geral ao buscar notificações:', error);
    }
  }, [user?.id]);

  // Buscar contador de não lidas
  const fetchUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log('📊 Buscando contador de não lidas...');
      
      const { data, error } = await supabase.rpc('get_my_unread_notifications_count');

      if (error) {
        console.error('❌ Erro ao buscar contador:', error);
        return;
      }

      console.log('✅ Contador recebido:', data);
      setUnreadCount(data || 0);
    } catch (error) {
      console.error('💥 Erro geral ao buscar contador:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Marcar notificações como lidas
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (!user?.id || notificationIds.length === 0) return;

    try {
      console.log('📖 Marcando como lidas:', notificationIds);
      
      const { error } = await supabase.rpc('mark_notifications_as_read', {
        p_notification_ids: notificationIds
      });

      if (error) {
        console.error('❌ Erro ao marcar como lida:', error);
        return;
      }

      console.log('✅ Marcadas como lidas com sucesso');

      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif.id) 
            ? { ...notif, is_read: true }
            : notif
        )
      );

      // Atualizar contador
      await fetchUnreadCount();
    } catch (error) {
      console.error('💥 Erro geral ao marcar como lida:', error);
    }
  }, [user?.id, fetchUnreadCount]);

  // Criar nova notificação (apenas admin_master)
  const createNotification = useCallback(async (data: CreateNotificationData) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('📝 Criando nova notificação:', data);
      
      const { error } = await supabase.rpc('create_admin_notification', {
        p_title: data.title,
        p_message: data.message,
        p_target_type: data.target_type,
        p_target_values: data.target_values
      });

      if (error) {
        console.error('❌ Erro ao criar notificação:', error);
        toast({
          title: "Erro",
          description: "Falha ao enviar notificação: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      console.log('✅ Notificação criada com sucesso');
      toast({
        title: "Sucesso",
        description: "Notificação enviada com sucesso!",
        variant: "default"
      });
      return true;
    } catch (error) {
      console.error('💥 Erro geral ao criar notificação:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao enviar notificação",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast]);

  // Configurar realtime para novas notificações
  useEffect(() => {
    if (!user?.id) return;

    console.log('🔔 Configurando realtime para notificações...');

    const channel = supabase
      .channel('admin-notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_notifications'
        },
        (payload) => {
          console.log('📢 Nova notificação recebida:', payload);
          // Recarregar dados quando há mudanças
          fetchNotifications();
          fetchUnreadCount();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notification_read_status'
        },
        (payload) => {
          console.log('📖 Status de leitura alterado:', payload);
          // Recarregar contador quando status muda
          fetchUnreadCount();
        }
      )
      .subscribe((status) => {
        console.log('📡 Status do canal de notificações:', status);
      });

    return () => {
      console.log('🔌 Desconectando canal de notificações...');
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchNotifications, fetchUnreadCount]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user?.id, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    createNotification
  };
};
