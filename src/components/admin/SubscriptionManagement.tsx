
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/ui/loader';
import { useEnhancedSubscriptionManagement } from '@/hooks/useEnhancedSubscriptionManagement';
import { usePermissions } from '@/hooks/usePermissions';
import EditUserRoleDialog from './EditUserRoleDialog';
import EditUserCredentialsDialog from './EditUserCredentialsDialog';
import CreateUserDialog from './CreateUserDialog';
import { UserPermissionsDialog } from './UserPermissionsDialog';
import UsersDashboard from './UsersDashboard';
import { format } from 'date-fns';
import { 
  Search, 
  Settings, 
  Trash2, 
  Calendar, 
  RefreshCw,
  Shield,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Edit3
} from 'lucide-react';

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

export const SubscriptionManagement = () => {
  const {
    users,
    totalUsers,
    loading,
    canViewSubscriptions,
    canManageUsers,
    searchTerm,
    currentPage,
    pageSize,
    loadUsers,
    createUser,
    deleteUser,
    updateUserCredentials,
    updateUserRole,
    extendSubscription,
    changeSubscriptionStatus,
    setCustomExpiration,
    deactivateExpiredSubscriptions
  } = useEnhancedSubscriptionManagement();
  
  const { can } = usePermissions();

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editRoleUser, setEditRoleUser] = useState<UserWithSubscription | null>(null);
  const [editCredentialsUser, setEditCredentialsUser] = useState<UserWithSubscription | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<UserWithSubscription | null>(null);

  // Carregamento inicial
  useEffect(() => {
    if (canViewSubscriptions) {
      loadUsers();
    }
  }, [canViewSubscriptions]);

  const handleSearch = () => {
    loadUsers(localSearchTerm, 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (newPage: number) => {
    loadUsers(searchTerm, newPage);
  };

  // Calcular estatísticas
  const activeUsers = users.filter(u => u.subscription_status === 'active').length;
  const expiredUsers = users.filter(u => u.subscription_status === 'expired').length;
  const suspendedUsers = users.filter(u => u.subscription_status === 'suspended').length;
  
  // Filtrar usuários por status
  const filteredUsers = statusFilter === 'all' 
    ? users 
    : users.filter(u => u.subscription_status === statusFilter);

  const totalPages = Math.ceil(totalUsers / pageSize);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-muted text-muted-foreground border border-border',
      expired: 'bg-muted text-muted-foreground border border-border',
      suspended: 'bg-muted text-muted-foreground border border-border'
    };
    return variants[status as keyof typeof variants] || 'bg-muted text-muted-foreground border border-border';
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin_master: 'bg-accent text-accent-foreground border border-border',
      gestor_operacoes: 'bg-accent text-accent-foreground border border-border',
      editor_conteudo: 'bg-accent text-accent-foreground border border-border',
      suporte: 'bg-accent text-accent-foreground border border-border',
      user: 'bg-muted text-muted-foreground border border-border'
    };
    return variants[role as keyof typeof variants] || 'bg-muted text-muted-foreground border border-border';
  };

  const roleLabels = {
    admin_master: 'Admin Master',
    gestor_operacoes: 'Gestor Operações',
    editor_conteudo: 'Editor Conteúdo',
    suporte: 'Suporte',
    user: 'Usuário'
  };

  const handleDeleteUser = async (user: UserWithSubscription) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.email}?`)) {
      await deleteUser(user.id, user.email);
    }
  };

  if (!canViewSubscriptions) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Shield className="mx-auto h-12 w-12 mb-4" />
            <p>Acesso negado. Apenas Gestor de Operações e Administrador Master podem gerenciar assinaturas.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard de Estatísticas dos Usuários */}
      <UsersDashboard users={users} totalUsers={totalUsers} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie usuários, assinaturas e permissões do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search, Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Buscar por email ou cargo..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 items-center">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm text-white border-border"
                style={{ backgroundColor: '#181818' }}
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="expired">Expirados</option>
                <option value="suspended">Suspensos</option>
              </select>
              
              {canManageUsers && (
                <CreateUserDialog 
                  onCreateUser={createUser}
                  loading={loading}
                />
              )}
              
              <Button onClick={() => loadUsers(searchTerm, currentPage)} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border border-border/40">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">{user.email}</span>
                          <Badge className={getRoleBadge(user.role)}>
                            {roleLabels[user.role as keyof typeof roleLabels] || user.role}
                          </Badge>
                          <Badge className={getStatusBadge(user.subscription_status)}>
                            {user.subscription_status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span>ID: {user.id.slice(0, 8)}...</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.subscription_end_at ? (
                            <span className={user.subscription_status === 'expired' ? 'text-red-600 font-medium' : ''}>
                              Expira em: {format(new Date(user.subscription_end_at), 'dd/MM/yyyy HH:mm')}
                            </span>
                          ) : (
                            <span>Sem data de expiração</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {can('change_user_role') && (
                          <Button
                            onClick={() => setEditRoleUser(user)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Shield className="h-3 w-3" />
                            Cargo
                          </Button>
                        )}
                        
                        {canManageUsers && (
                          <Button
                            onClick={() => setEditCredentialsUser(user)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            Credenciais
                          </Button>
                        )}
                        
                        {can('manage_user_permissions') && user.role !== 'user' && (
                          <Button
                            onClick={() => setPermissionsUser(user)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Settings className="h-3 w-3" />
                            Permissões
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => extendSubscription(user.id, 30)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Calendar className="h-3 w-3" />
                          +30 dias
                        </Button>
                        
                        <Button
                          onClick={() => extendSubscription(user.id, 7)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Calendar className="h-3 w-3" />
                          +7 dias
                        </Button>
                        
                        {canManageUsers && (
                          <Button
                            onClick={() => handleDeleteUser(user)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  {statusFilter === 'all' ? 'Nenhum usuário encontrado' : `Nenhum usuário com status "${statusFilter}" encontrado`}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} ({totalUsers} usuários total)
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  variant="outline"
                  size="sm"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Cleanup Actions */}
          {canManageUsers && (
            <div className="pt-4 border-t">
              <Button 
                onClick={deactivateExpiredSubscriptions} 
                variant="outline"
                className="w-full sm:w-auto"
              >
                Desativar Assinaturas Expiradas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditUserRoleDialog
        user={editRoleUser}
        open={!!editRoleUser}
        onOpenChange={(open) => !open && setEditRoleUser(null)}
        onUpdateRole={updateUserRole}
        loading={loading}
      />
      
      <EditUserCredentialsDialog
        user={editCredentialsUser}
        open={!!editCredentialsUser}
        onOpenChange={(open) => !open && setEditCredentialsUser(null)}
        onUpdateCredentials={updateUserCredentials}
        loading={loading}
      />
      
      <UserPermissionsDialog
        user={permissionsUser ? {
          id: permissionsUser.id,
          email: permissionsUser.email,
          role: permissionsUser.role as any,
          permissions: []
        } : null}
        open={!!permissionsUser}
        onOpenChange={(open) => !open && setPermissionsUser(null)}
        loading={loading}
      />
    </div>
  );
};

export default SubscriptionManagement;
