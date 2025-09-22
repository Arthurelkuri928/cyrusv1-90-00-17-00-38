import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissionsManagement } from '@/hooks/usePermissionsManagement';
import { ROLE_LABELS, ROLE_PERMISSIONS } from '@/shared/permissions';
import type { Role } from '@/shared/permissions';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  User, 
  Copy, 
  Save, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Users,
  Eye,
  Edit,
  Trash2,
  Bell,
  Database
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: Role;
  permissions: string[];
}

interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
}

interface UserPermissionsDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
}

const categoryIcons = {
  'admin': Settings,
  'admin.users': Users,
  'admin.tools': Edit,
  'admin.pages': Eye,
  'admin.ads': Trash2,
  'admin.notifications': Bell,
  'admin.audit': Database
};

export const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({
  user,
  open,
  onOpenChange,
  loading: externalLoading
}) => {
  const { 
    loading,
    adminUsers,
    allPermissions,
    updateUserPermissions,
    copyPermissions,
    getPermissionsByCategory,
    loadAdminUsers,
    loadPermissions
  } = usePermissionsManagement();

  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>('individual');
  const [showChanges, setShowChanges] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const loadedOnce = useRef(false);
  
  // Load current user info
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setCurrentUser({ id: authUser.id });
      }
    };
    getCurrentUser();
  }, []);
  
  // Load data when dialog opens
  useEffect(() => {
    if (open) {
      loadAdminUsers();
      loadPermissions();
      loadedOnce.current = true;
    }
  }, [open, loadAdminUsers, loadPermissions]);

  // Initialize selected permissions using freshest data from RPC
  useEffect(() => {
    if (!user || allPermissions.length === 0) return;

    const effective = adminUsers.find(u => u.id === user.id);
    const userPermissionCodes = new Set((effective?.permissions ?? user.permissions) as string[]);
    const permissionIds = allPermissions
      .filter(p => userPermissionCodes.has(p.code))
      .map(p => p.id);

    setSelectedPermissions(new Set(permissionIds));
    setShowChanges(false);
  }, [user, allPermissions, adminUsers]);

  const handlePermissionToggle = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
    setShowChanges(true);
  };

  const handleCategoryToggle = (categoryPermissions: Permission[]) => {
    const categoryIds = categoryPermissions.map(p => p.id);
    const allSelected = categoryIds.every(id => selectedPermissions.has(id));
    
    const newSelected = new Set(selectedPermissions);
    if (allSelected) {
      // Deselect all in category
      categoryIds.forEach(id => newSelected.delete(id));
    } else {
      // Select all in category
      categoryIds.forEach(id => newSelected.add(id));
    }
    
    setSelectedPermissions(newSelected);
    setShowChanges(true);
  };

  const handleApplyRoleTemplate = (role: Role) => {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    const permissionIds = allPermissions
      .filter(p => rolePermissions.includes(p.code as any))
      .map(p => p.id);
    
    setSelectedPermissions(new Set(permissionIds));
    setShowChanges(true);
    setActiveTab('individual');
  };

  const handleCopyFromUser = async (sourceUserId: string) => {
    if (!user) return;
    
    const success = await copyPermissions(sourceUserId, user.id);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!user) return;

    // Safety check for 0 permissions
    if (selectedPermissions.size === 0) {
      toast({
        title: 'Atenção',
        description: 'Você está prestes a remover todas as permissões deste usuário. Tem certeza?',
        variant: 'destructive'
      });
      // For now, prevent saving 0 permissions - could add confirmation dialog later
      return;
    }

    // Check if user is trying to remove their own critical permissions
    const criticalPermissions = ['admin.panel.view', 'manage_user_permissions'];
    const isCurrentUser = currentUser?.id === user.id;
    
    const baseCodes = new Set((adminUsers.find(u => u.id === user.id)?.permissions ?? user.permissions));
    const currentPermissionIds = new Set(
      allPermissions
        .filter(p => baseCodes.has(p.code))
        .map(p => p.id)
    );
    
    const removedPermissions = Array.from(currentPermissionIds).filter(id => !selectedPermissions.has(id));
    const removedCodes = allPermissions
      .filter(p => removedPermissions.includes(p.id))
      .map(p => p.code);
    
    const removingCritical = criticalPermissions.some(code => removedCodes.includes(code));
    
    if (isCurrentUser && removingCritical) {
      toast({
        title: 'Atenção',
        description: 'Você não pode remover suas próprias permissões críticas de acesso ao painel administrativo.',
        variant: 'destructive'
      });
      return;
    }

    const success = await updateUserPermissions(user.id, Array.from(selectedPermissions));
    if (success) {
      setShowChanges(false);
      onOpenChange(false);
    }
  };

  const getChangesCount = () => {
    if (!user) return 0;
    
    const baseCodes = new Set((adminUsers.find(u => u.id === user.id)?.permissions ?? user.permissions));
    const currentIds = new Set(
      allPermissions
        .filter(p => baseCodes.has(p.code))
        .map(p => p.id)
    );
    
    const added = Array.from(selectedPermissions).filter(id => !currentIds.has(id));
    const removed = Array.from(currentIds).filter(id => !selectedPermissions.has(id));
    
    return added.length + removed.length;
  };

  const renderPermissionsByCategory = () => {
    const categorizedPermissions = getPermissionsByCategory();
    
    return Object.entries(categorizedPermissions).map(([category, permissions]) => {
      const categoryName = category.replace('admin.', '').replace('admin', 'geral');
      const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Settings;
      const allSelected = permissions.every(p => selectedPermissions.has(p.id));
      const someSelected = permissions.some(p => selectedPermissions.has(p.id));
      
      return (
        <Card key={category} className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconComponent className="h-4 w-4" />
              <span className="capitalize">{categoryName}</span>
              <Badge variant="secondary" className="text-xs">
                {permissions.filter(p => selectedPermissions.has(p.id)).length}/{permissions.length}
              </Badge>
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) {
                    const input = el.querySelector('input') as HTMLInputElement;
                    if (input) input.indeterminate = someSelected && !allSelected;
                  }
                }}
                onCheckedChange={() => handleCategoryToggle(permissions)}
                className="ml-auto"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={permission.id}
                  checked={selectedPermissions.has(permission.id)}
                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={permission.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {permission.name}
                  </label>
                  {permission.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {permission.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    });
  };

  const renderRoleTemplates = () => (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Os templates aplicam um conjunto pré-definido de permissões baseado nos roles padrão.
          Isso substituirá a seleção atual.
        </AlertDescription>
      </Alert>
      
      {(Object.keys(ROLE_PERMISSIONS) as Role[])
        .filter(role => role !== 'user')
        .map((role) => {
          const permissions = ROLE_PERMISSIONS[role];
          const isCurrentRole = user?.role === role;
          
          return (
            <Card key={role} className={isCurrentRole ? 'border-primary' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {ROLE_LABELS[role]}
                      {isCurrentRole && <Badge variant="secondary">Atual</Badge>}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {permissions.length} permissões incluídas
                    </p>
                  </div>
                  <Button
                    onClick={() => handleApplyRoleTemplate(role)}
                    variant="outline"
                    size="sm"
                  >
                    Aplicar Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );

  if (!user) return null;

  const isLoading = loading || externalLoading;
  const changesCount = getChangesCount();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gerenciar Permissões - {user.email}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
            <Badge variant="outline">
              {selectedPermissions.size} permissões selecionadas
            </Badge>
            {showChanges && changesCount > 0 && (
              <Badge variant="destructive">
                {changesCount} alterações pendentes
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="individual">Permissões Individuais</TabsTrigger>
            <TabsTrigger value="templates">Templates de Role</TabsTrigger>
            <TabsTrigger value="copy">Copiar de Usuário</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="individual" className="mt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Carregando permissões...</div>
                </div>
              ) : (
                renderPermissionsByCategory()
              )}
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              {renderRoleTemplates()}
            </TabsContent>

            <TabsContent value="copy" className="mt-0">
              <div className="space-y-4">
                <Alert>
                  <Copy className="h-4 w-4" />
                  <AlertDescription>
                    Copie todas as permissões de outro usuário administrativo.
                    Isso substituirá todas as permissões atuais.
                  </AlertDescription>
                </Alert>
                
                {adminUsers
                  .filter(u => u.id !== user.id)
                  .map((sourceUser) => (
                    <Card key={sourceUser.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {sourceUser.email}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{ROLE_LABELS[sourceUser.role]}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {sourceUser.permissions.length} permissões
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleCopyFromUser(sourceUser.id)}
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Permissões
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showChanges && changesCount > 0 && (
              <Alert className="max-w-sm">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {changesCount} alteração(ões) não salva(s)
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancelar
            </Button>
            {activeTab === 'individual' && (
              <Button
                onClick={handleSavePermissions}
                disabled={isLoading || !showChanges || changesCount === 0}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};