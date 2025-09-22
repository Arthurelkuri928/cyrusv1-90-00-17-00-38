import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, Clock, AlertTriangle, CheckCircle, UserPlus, MoreHorizontal, Mail, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUsersAdminFilter, User } from '@/hooks/useUsersAdminFilter';
import { getTopBarTabs } from '../config/topBarConfig';

// Mock data - replace with real data from your API
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'dbsqhj0ebz@chefafalicious.com',
    role: 'Editor Conteúdo',
    status: 'active',
    expires: '25/01/2026 10:29',
    created_at: '2024-01-15',
    last_login: '2024-12-01'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'teste@exemplo.com',
    role: 'Suporte',
    status: 'active',
    expires: '06/03/2026 08:08',
    created_at: '2024-02-20',
    last_login: '2024-11-30'
  },
  {
    id: '3',
    name: 'Admin Empresa',
    email: 'admin@empresa.com',
    role: 'Admin Master',
    status: 'active',
    expires: 'Sem data de expiração',
    created_at: '2024-01-01',
    last_login: '2024-12-05'
  },
  {
    id: '4',
    name: 'Usuário Suspenso',
    email: 'usuario.suspenso@cyrus.com',
    role: 'Suporte',
    status: 'suspended',
    expires: 'N/A',
    created_at: '2024-03-10',
    last_login: '2024-10-15'
  },
  {
    id: '5',
    name: 'Ex Colaborador',
    email: 'ex.colaborador@cyrus.com',
    role: 'Editor Conteúdo',
    status: 'expired',
    expires: '01/01/2024 12:00',
    created_at: '2023-06-15',
    last_login: '2024-01-01'
  }
];

const StatusCard = ({ title, count, icon: Icon, variant }: {
  title: string;
  count: number;
  icon: React.ElementType;
  variant: 'default' | 'success' | 'destructive' | 'warning';
}) => (
  <Card className="bg-card border-border">
    <CardContent className="flex items-center justify-between p-6">
      <div className="flex items-center space-x-3">
        <Icon className={`h-8 w-8 ${
          variant === 'success' ? 'text-green-500' :
          variant === 'destructive' ? 'text-red-500' :
          variant === 'warning' ? 'text-yellow-500' :
          'text-primary'
        }`} />
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold ${
            variant === 'success' ? 'text-green-500' :
            variant === 'destructive' ? 'text-red-500' :
            variant === 'warning' ? 'text-yellow-500' :
            'text-foreground'
          }`}>{count}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const UserCard = ({ user }: { user: User }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">ativo</Badge>;
      case 'expired':
        return <Badge variant="destructive">expirado</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin Master':
        return <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Admin Master</Badge>;
      case 'Editor Conteúdo':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Editor Conteúdo</Badge>;
      case 'Suporte':
        return <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Suporte</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <Card className="bg-card border-border hover:bg-accent/5 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground text-lg">{user.email}</h3>
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>
              <p className="text-sm text-muted-foreground mb-1">ID: {user.id}</p>
              <p className="text-sm text-muted-foreground">Expira em: {user.expires}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-1" />
              Cargo
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-1" />
              Credenciais
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-1" />
              Permissões
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              +30 dias
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              +7 dias
            </Button>
            <Button variant="destructive" size="sm">
              Excluir
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                <DropdownMenuItem>Editar usuário</DropdownMenuItem>
                <DropdownMenuItem>Alterar permissões</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Suspender</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const UsersManagement: React.FC = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  
  const {
    searchTerm,
    selectedStatus,
    filteredUsers,
    statusCounts,
    isLoading,
    handleSearchChange,
    handleStatusChange,
    resetFilters
  } = useUsersAdminFilter({ users: mockUsers });

  // Handle topbar tab changes from URL or external state
  useEffect(() => {
    const handleUserFilterChange = (event: CustomEvent) => {
      const { status } = event.detail;
      handleStatusChange(status);
    };

    // Listen for custom events from topbar
    window.addEventListener('userFilterChange', handleUserFilterChange as EventListener);
    
    // Handle initial hash-based filtering
    const hash = location.hash.replace('#', '');
    if (hash) {
      const currentPath = location.pathname;
      const tabs = getTopBarTabs(currentPath);
      const activeTab = tabs.find(tab => tab.id === hash);
      
      if (activeTab && 'filterStatus' in activeTab) {
        handleStatusChange(activeTab.filterStatus);
      }
    }

    return () => {
      window.removeEventListener('userFilterChange', handleUserFilterChange as EventListener);
    };
  }, [location, handleStatusChange]);

  // Sync search with local state
  useEffect(() => {
    handleSearchChange(searchValue);
  }, [searchValue, handleSearchChange]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total"
          count={statusCounts.total}
          icon={Users}
          variant="default"
        />
        <StatusCard
          title="Ativos"
          count={statusCounts.active}
          icon={CheckCircle}
          variant="success"
        />
        <StatusCard
          title="Expirados"
          count={statusCounts.expired}
          icon={Clock}
          variant="destructive"
        />
        <StatusCard
          title="Suspensos"
          count={statusCounts.suspended}
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gerenciamento de Usuários
          </h2>
          <p className="text-muted-foreground mt-1">
            Gerencie usuários, assinaturas e permissões do sistema
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <UserPlus className="h-4 w-4 mr-2" />
          Criar Usuário
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Buscar por email ou cargo..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-background border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          {(selectedStatus || searchTerm) && (
            <Button variant="outline" onClick={resetFilters} size="sm">
              Limpar filtros
            </Button>
          )}
          <Button variant="outline" size="sm" className="bg-card hover:bg-accent text-foreground border-border">
            <UserPlus className="h-4 w-4 mr-2" />
            Criar Usuário
          </Button>
          <Button variant="outline" size="sm">
            Atualizar
          </Button>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Nenhum usuário encontrado</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {selectedStatus ? 
                  `Nenhum usuário encontrado com o status "${selectedStatus}".` :
                  "Nenhum usuário encontrado com os filtros aplicados."
                }
              </p>
              {(selectedStatus || searchTerm) && (
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Limpar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Disable Expired Signatures Section */}
      {statusCounts.expired > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Desativar Assinaturas Expiradas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Há {statusCounts.expired} usuário(s) com assinaturas expiradas que podem ser desativados.
            </p>
            <Button variant="outline">
              Desativar Automaticamente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};