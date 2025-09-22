
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';

interface EditUserCredentialsDialogProps {
  user: {
    id: string;
    email: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCredentials: (userId: string, credentials: { email?: string; password?: string }) => Promise<{ success: boolean }>;
  loading: boolean;
}

const EditUserCredentialsDialog: React.FC<EditUserCredentialsDialogProps> = ({ 
  user, 
  open,
  onOpenChange,
  onUpdateCredentials, 
  loading 
}) => {
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Update email when user changes
  React.useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validar se pelo menos um campo foi alterado
    const emailChanged = email !== user.email;
    const passwordProvided = password.trim() !== '';
    
    if (!emailChanged && !passwordProvided) {
      return;
    }

    // Validar senha se fornecida
    if (passwordProvided && password !== confirmPassword) {
      return;
    }

    const updateData: { email?: string; password?: string } = {};
    if (emailChanged) updateData.email = email;
    if (passwordProvided) updateData.password = password;

    const result = await onUpdateCredentials(user.id, updateData);

    if (result.success) {
      setPassword('');
      setConfirmPassword('');
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setEmail(user?.email || '');
    setPassword('');
    setConfirmPassword('');
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Credenciais do Usuário</DialogTitle>
          <DialogDescription>
            Altere o email e/ou senha do usuário. Deixe a senha em branco se não quiser alterá-la.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@exemplo.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Nova Senha (opcional)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixe em branco para não alterar"
            />
          </div>
          
          {password && (
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                required
              />
              {password !== confirmPassword && confirmPassword && (
                <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={
                loading || 
                (email === user?.email && !password) ||
                (password && password !== confirmPassword)
              }
            >
              {loading ? 'Atualizando...' : 'Atualizar Credenciais'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserCredentialsDialog;
