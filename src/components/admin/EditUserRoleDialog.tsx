
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface UserWithSubscription {
  id: string;
  email: string;
  role: string;
  subscription_end_at: string | null;
  subscription_status: string;
  subscription_type: string;
  created_at: string;
  updated_at: string | null;
}

interface EditUserRoleDialogProps {
  user: UserWithSubscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRole: (userId: string, newRole: string) => Promise<{ success: boolean }>;
  loading: boolean;
}

const roleLabels = {
  admin_master: 'Administrador Master',
  gestor_operacoes: 'Gestor de Operações',
  editor_conteudo: 'Editor de Conteúdo',
  suporte: 'Suporte',
  user: 'Usuário'
};

const roleDescriptions = {
  admin_master: 'Acesso total ao sistema',
  gestor_operacoes: 'Gerenciar ferramentas e usuários',
  editor_conteudo: 'Gerenciar páginas e anúncios',
  suporte: 'Visualizar usuários e dar suporte',
  user: 'Acesso básico ao sistema'
};

export const EditUserRoleDialog = ({
  user,
  open,
  onOpenChange,
  onUpdateRole,
  loading
}: EditUserRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedRole) return;

    const result = await onUpdateRole(user.id, selectedRole);
    
    if (result.success) {
      onOpenChange(false);
      setSelectedRole('');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedRole('');
    }
    onOpenChange(newOpen);
  };

  // Set initial role when dialog opens
  useEffect(() => {
    if (user && open) {
      setSelectedRole(user.role);
    }
  }, [user, open]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Cargo do Usuário</DialogTitle>
          <DialogDescription>
            Alterar o cargo de <strong>{user.email}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Cargo Atual: {roleLabels[user.role as keyof typeof roleLabels] || user.role}</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um novo cargo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{label}</span>
                      <span className="text-sm text-muted-foreground">
                        {roleDescriptions[value as keyof typeof roleDescriptions]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedRole || selectedRole === user.role}
            >
              {loading ? 'Atualizando...' : 'Alterar Cargo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserRoleDialog;
