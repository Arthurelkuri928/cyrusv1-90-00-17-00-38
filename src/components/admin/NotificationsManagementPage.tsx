import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { UserAutocomplete } from './UserAutocomplete';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { Loader2, Bell, User, Users, Clock, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  id: string;
  email: string;
  role: string;
}

export const NotificationsManagementPage = () => {
  const { notifications, createNotification, loading } = useAdminNotifications();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'ROLE' | 'USER'>('ROLE');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { id: 'gestor_operacoes', label: 'Gestor de Operações' },
    { id: 'editor_conteudo', label: 'Editor de Conteúdo' },
    { id: 'suporte', label: 'Suporte' }
  ];

  const handleRoleChange = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles(prev => [...prev, roleId]);
    } else {
      setSelectedRoles(prev => prev.filter(id => id !== roleId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      return;
    }

    const targetValues = targetType === 'ROLE' 
      ? selectedRoles 
      : selectedUsers.map(user => user.id);

    if (targetValues.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await createNotification({
        title: title.trim(),
        message: message.trim(),
        target_type: targetType,
        target_values: targetValues
      });

      if (success) {
        // Limpar formulário
        setTitle('');
        setMessage('');
        setSelectedRoles([]);
        setSelectedUsers([]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetTypeIcon = (targetType: string) => {
    return targetType === 'ROLE' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Gerenciar Notificações
          </h1>
          <p className="text-muted-foreground mt-2">
            Envie notificações para usuários e visualize o histórico de mensagens enviadas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário para Enviar Notificações */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Enviar Nova Notificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Título */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Digite o título da notificação..."
                      required
                      className="text-base"
                    />
                  </div>

                  {/* Mensagem */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Digite a mensagem da notificação..."
                      rows={6}
                      required
                      className="text-base min-h-[150px]"
                    />
                  </div>

                  {/* Tipo de Destinatário */}
                  <div className="space-y-4">
                    <Label>Destinatários</Label>
                    <RadioGroup
                      value={targetType}
                      onValueChange={(value: 'ROLE' | 'USER') => {
                        setTargetType(value);
                        setSelectedRoles([]);
                        setSelectedUsers([]);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ROLE" id="role" />
                        <Label htmlFor="role">Por Cargo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="USER" id="user" />
                        <Label htmlFor="user">Usuários Específicos</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Seleção por Cargo */}
                  {targetType === 'ROLE' && (
                    <div className="space-y-3">
                      <Label>Selecionar Cargos</Label>
                      <div className="space-y-3">
                        {roles.map((role) => (
                          <div key={role.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                            <Checkbox
                              id={role.id}
                              checked={selectedRoles.includes(role.id)}
                              onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                            />
                            <Label htmlFor={role.id} className="text-sm font-normal flex-1">
                              {role.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Seleção por Usuários Específicos */}
                  {targetType === 'USER' && (
                    <div className="space-y-3">
                      <Label>Selecionar Usuários</Label>
                      <UserAutocomplete
                        selectedUsers={selectedUsers}
                        onUsersChange={setSelectedUsers}
                        placeholder="Buscar administradores..."
                      />
                    </div>
                  )}

                  {/* Botão de Envio */}
                  <Button 
                    type="submit" 
                    disabled={
                      !title.trim() || 
                      !message.trim() || 
                      (targetType === 'ROLE' ? selectedRoles.length === 0 : selectedUsers.length === 0) ||
                      isSubmitting
                    }
                    className="w-full py-6 text-base"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Enviar Notificação
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Histórico de Notificações */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Histórico de Notificações
                  <Badge variant="secondary" className="ml-auto">
                    {notifications.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma notificação enviada ainda.</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notification, index) => (
                        <div key={notification.id || index} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium text-sm line-clamp-2">
                                {notification.title || 'Sem título'}
                              </h3>
                              <Badge 
                                variant={notification.is_read ? "secondary" : "default"}
                                className="ml-2 shrink-0"
                              >
                                {notification.is_read ? 'Lida' : 'Nova'}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-muted-foreground line-clamp-3">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>Notificação do sistema</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {notification.created_at ? 
                                formatDistanceToNow(new Date(notification.created_at), { 
                                  addSuffix: true, 
                                  locale: ptBR 
                                }) : 
                                'Data não informada'
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};