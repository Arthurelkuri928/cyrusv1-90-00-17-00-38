import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/ui/loader';
import { UserPermissionsDialog } from './UserPermissionsDialog';
import { usePermissionsManagement } from '@/hooks/usePermissionsManagement';
import { ROLE_LABELS } from '@/shared/permissions';
import type { Role } from '@/shared/permissions';
import { 
  Shield, 
  Search, 
  Settings, 
  User,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Edit,
  Users
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: Role;
  permissions: string[];
}

export const PermissionsManagement = () => {
  const {
    loading,
    adminUsers,
    allPermissions,
    loadAdminUsers,
    loadPermissions,
    getPermissionsByCategory
  } = usePermissionsManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadAdminUsers();
    loadPermissions();
  }, [loadAdminUsers, loadPermissions]);

  const handleRefresh = () => {
    loadAdminUsers();
    loadPermissions();
  };

  const handleManageUser = (user: AdminUser) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  // Filter users by search term
  const filteredUsers = adminUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ROLE_LABELS[user.role].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalCategories = Object.keys(getPermissionsByCategory()).length;
  const totalPermissions = allPermissions.length;
  const activeAdmins = adminUsers.length;

  const getRoleBadgeVariant = (role: Role) => {
    const variants = {
      admin_master: 'bg-purple-100 text-purple-800',
      gestor_operacoes: 'bg-blue-100 text-blue-800',
      editor_conteudo: 'bg-indigo-100 text-indigo-800',
      suporte: 'bg-orange-100 text-orange-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return variants[role] || 'bg-gray-100 text-gray-800';
  };

  const getPermissionsCoverage = (userPermissions: string[]) => {
    const coverage = (userPermissions.length / totalPermissions) * 100;
    return Math.round(coverage);
  };

  const getPermissionsStatus = (coverage: number) => {
    if (coverage >= 90) return { color: 'text-green-600', icon: CheckCircle, label: 'Completo' };
    if (coverage >= 50) return { color: 'text-yellow-600', icon: AlertTriangle, label: 'Parcial' };
    return { color: 'text-red-600', icon: AlertTriangle, label: 'Limitado' };
  };

  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Administradores</p>
                <p className="text-2xl font-bold">{activeAdmins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Permissões</p>
                <p className="text-2xl font-bold text-blue-600">{totalPermissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-muted-foreground">Categorias</p>
                <p className="text-2xl font-bold text-indigo-600">{totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gerenciamento de Permissões
          </CardTitle>
          <CardDescription>
            Gerencie permissões específicas para cada administrador do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Buscar por email ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={handleRefresh} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Admin Users List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const coverage = getPermissionsCoverage(user.permissions);
                const status = getPermissionsStatus(coverage);
                const StatusIcon = status.icon;
                
                return (
                  <Card key={user.id} className="border border-border/40">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-primary">{user.email}</span>
                            <Badge className={getRoleBadgeVariant(user.role)}>
                              {ROLE_LABELS[user.role]}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              <span>{user.permissions.length} permissões</span>
                            </div>
                            
                            <div className={`flex items-center gap-1 ${status.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span>{status.label} ({coverage}%)</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            ID: {user.id.slice(0, 8)}...
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleManageUser(user)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Gerenciar Permissões
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'Nenhum usuário encontrado com o termo de busca' : 'Nenhum usuário administrativo encontrado'}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Permissions Dialog */}
      <UserPermissionsDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedUser(null);
            // Refresh users list after dialog closes to reflect changes
            loadAdminUsers();
          }
        }}
        loading={loading}
      />
    </div>
  );
};