
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

interface CreateUserDialogProps {
  onCreateUser: (userData: { email: string; password: string; subscription_days: number }) => Promise<{ success: boolean }>;
  loading: boolean;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ onCreateUser, loading }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionDays, setSubscriptionDays] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    const result = await onCreateUser({
      email,
      password,
      subscription_days: subscriptionDays
    });

    if (result.success) {
      setEmail('');
      setPassword('');
      setSubscriptionDays(30);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Criar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogDescription>
            Adicione um novo usuário à plataforma com assinatura ativa
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
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha do usuário"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="subscriptionDays">Duração da Assinatura (dias)</Label>
            <Input
              id="subscriptionDays"
              type="number"
              value={subscriptionDays}
              onChange={(e) => setSubscriptionDays(Number(e.target.value))}
              min="1"
              max="3650"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !email || !password}>
              {loading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
