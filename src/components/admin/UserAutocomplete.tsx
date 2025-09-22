
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  email: string;
  role: string;
}

interface UserAutocompleteProps {
  selectedUsers: User[];
  onUsersChange: (users: User[]) => void;
  placeholder?: string;
}

export const UserAutocomplete: React.FC<UserAutocompleteProps> = ({
  selectedUsers,
  onUsersChange,
  placeholder = "Buscar administradores..."
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar usuários administradores
  useEffect(() => {
    const fetchAdminUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_admin_users');
        if (error) {
          console.error('Erro ao buscar usuários:', error);
          return;
        }
        setAllUsers(data || []);
      } catch (error) {
        console.error('Erro geral ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUsers();
  }, []);

  // Filtrar usuários baseado na busca
  const filteredUsers = useMemo(() => {
    const selectedIds = new Set(selectedUsers.map(u => u.id));
    return allUsers
      .filter(user => !selectedIds.has(user.id))
      .filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [allUsers, selectedUsers, searchTerm]);

  const handleSelectUser = (user: User) => {
    onUsersChange([...selectedUsers, user]);
    setSearchTerm('');
    setOpen(false);
  };

  const handleRemoveUser = (userId: string) => {
    onUsersChange(selectedUsers.filter(u => u.id !== userId));
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'gestor_operacoes': 'Gestor de Operações',
      'editor_conteudo': 'Editor de Conteúdo',
      'suporte': 'Suporte'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="space-y-2">
      {/* Usuários Selecionados */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
              {user.email}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveUser(user.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Campo de Busca */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="text-muted-foreground">{placeholder}</span>
            </div>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 focus:ring-0 focus:outline-0"
              />
            </div>
            <CommandList>
              <CommandEmpty>
                {loading ? 'Carregando...' : 'Nenhum usuário encontrado.'}
              </CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelectUser(user)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{user.email}</span>
                      <span className="text-sm text-muted-foreground">
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
