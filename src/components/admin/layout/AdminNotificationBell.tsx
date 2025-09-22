
import React, { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AdminNotificationBell = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead 
  } = useAdminNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = async (notificationIds: string[]) => {
    await markAsRead(notificationIds);
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter(n => !n.is_read)
      .map(n => n.id);
    
    if (unreadIds.length > 0) {
      await handleMarkAsRead(unreadIds);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'Agora';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2 h-auto hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs min-w-[16px] font-medium bg-gradient-to-r from-purple-600 to-violet-600 border-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-96 bg-[#1C1C1E] border border-zinc-700/50 shadow-xl text-white z-50"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between py-3 px-4 border-b border-zinc-800/50">
          <span className="font-semibold text-white">Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-6 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-zinc-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-0 focus:bg-zinc-800/50 ${!notification.is_read ? 'bg-zinc-800/30' : ''}`}
                onSelect={(e) => e.preventDefault()}
              >
                <div 
                  className="w-full p-3 cursor-pointer hover:bg-zinc-800/70 transition-colors"
                  onClick={() => {
                    if (!notification.is_read) {
                      handleMarkAsRead([notification.id]);
                    }
                  }}
                >
                  <div className="space-y-1">
                    {/* Título da Notificação */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-white leading-tight">
                        {notification.title || 'Sem título'}
                      </h4>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    
                    {/* Mensagem da Notificação */}
                    {notification.message && (
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {notification.message}
                      </p>
                    )}
                    
                    {/* Data/Hora */}
                    <p className="text-xs text-zinc-500">
                      {formatRelativeTime(notification.created_at)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
