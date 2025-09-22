
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { UserAutocomplete } from './UserAutocomplete';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
}

export const CreateNotificationForm = () => {
  const { createNotification } = useAdminNotifications();
  
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Enviar Nova Notificação</CardTitle>
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
              rows={4}
              required
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
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={role.id}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                    />
                    <Label htmlFor={role.id} className="text-sm font-normal">
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
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Notificação'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
