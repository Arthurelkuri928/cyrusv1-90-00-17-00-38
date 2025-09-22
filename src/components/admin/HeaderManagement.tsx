import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Wrench, 
  AlertTriangle, 
  Edit3, 
  Save, 
  X,
  ChevronDown,
  ChevronRight 
} from 'lucide-react';
import { useHeaderManagement } from '@/hooks/useHeaderManagement';
import { 
  CreateHeaderActionButtonRequest, 
  CreateHeaderNavItemRequest, 
  HeaderActionButton, 
  HeaderNavItem,
  UpdateHeaderActionButtonRequest,
  UpdateHeaderNavItemRequest 
} from '@/shared/types/header';
import { ROUTES } from '@/constants/routes';
import RouteSelector from './RouteSelector';
import { useToast } from '@/hooks/use-toast';

interface EditingState {
  id: string;
  data: any;
}

const HeaderManagement: React.FC = () => {
  const { toast } = useToast();
  const {
    headerSettings,
    loadingSettings,
    updateSettings,
    updatingSettings,
    actionButtons,
    loadingButtons,
    createButton,
    creatingButton,
    updateButton,
    updatingButton,
    deleteButton,
    deletingButton,
    navItems,
    loadingNavItems,
    createNavItem,
    creatingNavItem,
    updateNavItem,
    updatingNavItem,
    deleteNavItem,
    deletingNavItem,
  } = useHeaderManagement();

  // State management
  const [logoUrl, setLogoUrl] = useState('');
  const [editingButton, setEditingButton] = useState<EditingState | null>(null);
  const [editingNavItem, setEditingNavItem] = useState<EditingState | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<{ type: 'button' | 'nav'; id: string } | null>(null);

  // New item forms
  const [newButtonData, setNewButtonData] = useState<CreateHeaderActionButtonRequest>({
    label: '',
    url: '',
    style: 'primary',
    is_visible: true,
    position: 0,
  });

  const [newNavItemData, setNewNavItemData] = useState<CreateHeaderNavItemRequest>({
    label: '',
    type: 'link',
    url: '',
    page_slug: '',
    parent_id: undefined,
    is_visible: true,
    position: 0,
  });

  // Effects
  useEffect(() => {
    if (headerSettings?.logo_url !== undefined) {
      setLogoUrl(headerSettings.logo_url || '');
    }
  }, [headerSettings]);

  // Helper functions
  const resetNewButtonForm = () => {
    setNewButtonData({
      label: '',
      url: '',
      style: 'primary',
      is_visible: true,
      position: 0,
    });
  };

  const resetNewNavItemForm = () => {
    setNewNavItemData({
      label: '',
      type: 'link',
      url: '',
      page_slug: '',
      parent_id: undefined,
      is_visible: true,
      position: 0,
    });
  };

  const getRootNavItems = () => {
    return navItems.filter(item => !item.parent_id);
  };

  const getProblematicLinksCount = () => {
    let count = 0;
    
    actionButtons.forEach(button => {
      const isLoginButton = button.label.toLowerCase().includes('entrar') || 
                           button.label.toLowerCase().includes('login');
      if (isLoginButton && button.url === '/login') {
        count++;
      }
    });
    
    navItems.forEach(item => {
      const isLoginItem = item.label.toLowerCase().includes('entrar') || 
                         item.label.toLowerCase().includes('login');
      if (isLoginItem && item.url === '/login') {
        count++;
      }
    });
    
    return count;
  };

  // Event handlers
  const handleUpdateLogo = () => {
    if (logoUrl !== headerSettings?.logo_url) {
      updateSettings({ logo_url: logoUrl || null });
    }
  };

  const handleCreateButton = () => {
    if (newButtonData.label && newButtonData.url) {
      const maxPosition = Math.max(...actionButtons.map(b => b.position), -1);
      createButton({
        ...newButtonData,
        position: maxPosition + 1,
      });
      resetNewButtonForm();
    }
  };

  const handleCreateNavItem = () => {
    if (newNavItemData.label) {
      const maxPosition = Math.max(...navItems.map(n => n.position), -1);
      createNavItem({
        ...newNavItemData,
        position: maxPosition + 1,
      });
      resetNewNavItemForm();
    }
  };

  const handleFixLinks = async () => {
    let fixedCount = 0;
    
    // Fix action buttons
    for (const button of actionButtons) {
      const isLoginButton = button.label.toLowerCase().includes('entrar') || 
                           button.label.toLowerCase().includes('login');
      
      if (isLoginButton && button.url === '/login') {
        await updateButton({ 
          id: button.id, 
          updates: { url: ROUTES.LOGIN } 
        });
        fixedCount++;
      }
    }
    
    // Fix navigation items
    for (const item of navItems) {
      const isLoginItem = item.label.toLowerCase().includes('entrar') || 
                         item.label.toLowerCase().includes('login');
      
      if (isLoginItem && item.url === '/login') {
        await updateNavItem({ 
          id: item.id, 
          updates: { url: ROUTES.LOGIN } 
        });
        fixedCount++;
      }
    }
    
    if (fixedCount > 0) {
      toast({
        title: 'Links Corrigidos',
        description: `${fixedCount} link(s) foram corrigidos de "/login" para "/entrar"`,
      });
    } else {
      toast({
        title: 'Nenhuma Correção Necessária',
        description: 'Todos os links já estão corretos',
      });
    }
  };

  const startEditingButton = (button: HeaderActionButton) => {
    setEditingButton({
      id: button.id,
      data: {
        label: button.label,
        url: button.url,
        style: button.style,
        is_visible: button.is_visible,
      },
    });
  };

  const startEditingNavItem = (item: HeaderNavItem) => {
    setEditingNavItem({
      id: item.id,
      data: {
        label: item.label,
        type: item.type,
        url: item.url || '',
        page_slug: item.page_slug || '',
        parent_id: item.parent_id,
        is_visible: item.is_visible,
      },
    });
  };

  const saveButtonEdit = () => {
    if (editingButton) {
      updateButton({
        id: editingButton.id,
        updates: editingButton.data,
      });
      setEditingButton(null);
    }
  };

  const saveNavItemEdit = () => {
    if (editingNavItem) {
      updateNavItem({
        id: editingNavItem.id,
        updates: editingNavItem.data,
      });
      setEditingNavItem(null);
    }
  };

  const cancelButtonEdit = () => {
    setEditingButton(null);
  };

  const cancelNavItemEdit = () => {
    setEditingNavItem(null);
  };

  const confirmDelete = () => {
    if (showDeleteDialog) {
      if (showDeleteDialog.type === 'button') {
        deleteButton(showDeleteDialog.id);
      } else {
        deleteNavItem(showDeleteDialog.id);
      }
      setShowDeleteDialog(null);
    }
  };

  // Render functions
  const renderActionButton = (button: HeaderActionButton) => {
    const isEditing = editingButton?.id === button.id;
    const isProblematic = button.url === '/login' && button.label.toLowerCase().includes('entrar');

    if (isEditing) {
      return (
        <Card key={button.id} className="border-violet-500/30 bg-zinc-800/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-white">Editando Botão</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={saveButtonEdit}
                    disabled={updatingButton}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelButtonEdit}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texto do Botão</Label>
                  <Input
                    value={editingButton.data.label}
                    onChange={(e) => 
                      setEditingButton(prev => prev ? {
                        ...prev,
                        data: { ...prev.data, label: e.target.value }
                      } : null)
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Estilo</Label>
                  <Select 
                    value={editingButton.data.style}
                    onValueChange={(value) =>
                      setEditingButton(prev => prev ? {
                        ...prev,
                        data: { ...prev.data, style: value }
                      } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primário</SelectItem>
                      <SelectItem value="secondary">Secundário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <RouteSelector
                label={editingButton.data.label}
                url={editingButton.data.url}
                onUrlChange={(url) =>
                  setEditingButton(prev => prev ? {
                    ...prev,
                    data: { ...prev.data, url }
                  } : null)
                }
                placeholder="/entrar, /cadastro, etc."
              />
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingButton.data.is_visible}
                  onCheckedChange={(checked) =>
                    setEditingButton(prev => prev ? {
                      ...prev,
                      data: { ...prev.data, is_visible: checked }
                    } : null)
                  }
                />
                <Label>Visível</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div key={button.id} className="flex items-center justify-between p-4 border border-zinc-700/50 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
        <div className="flex items-center space-x-3">
          <GripVertical className="h-4 w-4 text-zinc-400" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-white">{button.label}</span>
              <Badge variant={button.style === 'primary' ? 'default' : 'secondary'}>
                {button.style}
              </Badge>
              {button.is_visible ? (
                <Eye className="h-4 w-4 text-green-400" />
              ) : (
                <EyeOff className="h-4 w-4 text-zinc-400" />
              )}
              {isProblematic && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  URL Incorreta
                </Badge>
              )}
            </div>
            <p className="text-sm text-zinc-400">{button.url}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            checked={button.is_visible}
            onCheckedChange={(checked) => 
              updateButton({ id: button.id, updates: { is_visible: checked } })
            }
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => startEditingButton(button)}
            className="border-zinc-700/50 hover:bg-zinc-700/50"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog({ type: 'button', id: button.id })}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderNavItem = (item: HeaderNavItem) => {
    const isEditing = editingNavItem?.id === item.id;
    const isProblematic = item.url === '/login' && item.label.toLowerCase().includes('entrar');

    if (isEditing) {
      return (
        <Card key={item.id} className="border-violet-500/30 bg-zinc-800/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-white">Editando Item de Navegação</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={saveNavItemEdit}
                    disabled={updatingNavItem}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelNavItemEdit}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={editingNavItem.data.label}
                    onChange={(e) => 
                      setEditingNavItem(prev => prev ? {
                        ...prev,
                        data: { ...prev.data, label: e.target.value }
                      } : null)
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select 
                    value={editingNavItem.data.type}
                    onValueChange={(value) =>
                      setEditingNavItem(prev => prev ? {
                        ...prev,
                        data: { ...prev.data, type: value }
                      } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link Simples</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Item Pai (Para Sub-menus)</Label>
                <Select 
                  value={editingNavItem.data.parent_id || 'none'}
                  onValueChange={(value) =>
                    setEditingNavItem(prev => prev ? {
                      ...prev,
                      data: { ...prev.data, parent_id: value === 'none' ? undefined : value }
                    } : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um item pai (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum (Item raiz)</SelectItem>
                    {getRootNavItems()
                      .filter(rootItem => rootItem.id !== item.id)
                      .map(rootItem => (
                        <SelectItem key={rootItem.id} value={rootItem.id}>
                          {rootItem.label}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              {editingNavItem.data.type === 'link' && (
                <RouteSelector
                  label={editingNavItem.data.label}
                  url={editingNavItem.data.url}
                  onUrlChange={(url) =>
                    setEditingNavItem(prev => prev ? {
                      ...prev,
                      data: { ...prev.data, url }
                    } : null)
                  }
                  placeholder="/, /planos, /sobre, etc."
                />
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingNavItem.data.is_visible}
                  onCheckedChange={(checked) =>
                    setEditingNavItem(prev => prev ? {
                      ...prev,
                      data: { ...prev.data, is_visible: checked }
                    } : null)
                  }
                />
                <Label>Visível</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div key={item.id} className="flex items-center justify-between p-4 border border-zinc-700/50 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
        <div className="flex items-center space-x-3">
          <GripVertical className="h-4 w-4 text-zinc-400" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-white">{item.label}</span>
              <Badge variant={item.type === 'dropdown' ? 'default' : 'secondary'}>
                {item.type}
              </Badge>
              {item.parent_id && (
                <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-300">
                  Sub-item
                </Badge>
              )}
              {item.is_visible ? (
                <Eye className="h-4 w-4 text-green-400" />
              ) : (
                <EyeOff className="h-4 w-4 text-zinc-400" />
              )}
              {isProblematic && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  URL Incorreta
                </Badge>
              )}
            </div>
            <p className="text-sm text-zinc-400">
              {item.url || item.page_slug || 'Dropdown menu'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            checked={item.is_visible}
            onCheckedChange={(checked) => 
              updateNavItem({ id: item.id, updates: { is_visible: checked } })
            }
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => startEditingNavItem(item)}
            className="border-zinc-700/50 hover:bg-zinc-700/50"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog({ type: 'nav', id: item.id })}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loadingSettings || loadingButtons || loadingNavItems) {
    return <div className="p-6">Carregando configurações do cabeçalho...</div>;
  }

  const problematicLinksCount = getProblematicLinksCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Gerenciamento do Cabeçalho</h2>
          <p className="text-muted-foreground">
            Configure o logo, botões de ação e itens de navegação do cabeçalho do site.
          </p>
        </div>
        
        {problematicLinksCount > 0 && (
          <div className="flex items-center space-x-3">
            <Badge variant="destructive" className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{problematicLinksCount} link(s) com problema</span>
            </Badge>
            <Button 
              onClick={handleFixLinks}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Wrench className="h-4 w-4" />
              <span>Corrigir Links</span>
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="logo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="buttons">Botões de Ação</TabsTrigger>
          <TabsTrigger value="navigation">Navegação</TabsTrigger>
        </TabsList>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>Logo do Cabeçalho</CardTitle>
              <CardDescription>
                Configure a URL da imagem do logo que aparece no cabeçalho.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-url">URL da Logo</Label>
                <Input
                  id="logo-url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
              
              {logoUrl && (
                <div className="space-y-2">
                  <Label>Preview da Logo</Label>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <img 
                      src={logoUrl} 
                      alt="Logo Preview" 
                      className="h-12 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <Button 
                onClick={handleUpdateLogo}
                disabled={updatingSettings || logoUrl === headerSettings?.logo_url}
              >
                {updatingSettings ? 'Salvando...' : 'Salvar Logo'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buttons">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Botão</CardTitle>
                <CardDescription>
                  Crie um novo botão de ação para o cabeçalho.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="button-label">Texto do Botão</Label>
                    <Input
                      id="button-label"
                      value={newButtonData.label}
                      onChange={(e) => setNewButtonData(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Ex: Entrar, Cadastrar"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="button-style">Estilo</Label>
                    <Select 
                      value={newButtonData.style} 
                      onValueChange={(value: 'primary' | 'secondary') => 
                        setNewButtonData(prev => ({ ...prev, style: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primário</SelectItem>
                        <SelectItem value="secondary">Secundário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <RouteSelector
                  label={newButtonData.label}
                  url={newButtonData.url}
                  onUrlChange={(url) => setNewButtonData(prev => ({ ...prev, url }))}
                  placeholder="/entrar, /cadastro, etc."
                />
                
                <Button 
                  onClick={handleCreateButton}
                  disabled={creatingButton || !newButtonData.label || !newButtonData.url}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {creatingButton ? 'Criando...' : 'Adicionar Botão'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Botões Existentes</CardTitle>
                <CardDescription>
                  Gerencie os botões de ação existentes no cabeçalho.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actionButtons.map(renderActionButton)}
                  {actionButtons.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum botão de ação configurado.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="navigation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Item de Navegação</CardTitle>
                <CardDescription>
                  Crie um novo item de navegação para o menu principal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nav-label">Título</Label>
                    <Input
                      id="nav-label"
                      value={newNavItemData.label}
                      onChange={(e) => setNewNavItemData(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Ex: Início, Sobre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nav-type">Tipo</Label>
                    <Select 
                      value={newNavItemData.type} 
                      onValueChange={(value: 'link' | 'dropdown') => 
                        setNewNavItemData(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">Link Simples</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Item Pai (Para Sub-menus)</Label>
                  <Select 
                    value={newNavItemData.parent_id || 'none'}
                    onValueChange={(value) => 
                      setNewNavItemData(prev => ({ 
                        ...prev, 
                        parent_id: value === 'none' ? undefined : value 
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um item pai (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum (Item raiz)</SelectItem>
                      {getRootNavItems().map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {newNavItemData.type === 'link' && (
                  <RouteSelector
                    label={newNavItemData.label}
                    url={newNavItemData.url || ''}
                    onUrlChange={(url) => setNewNavItemData(prev => ({ ...prev, url }))}
                    placeholder="/, /planos, /sobre, etc."
                  />
                )}
                
                <Button 
                  onClick={handleCreateNavItem}
                  disabled={creatingNavItem || !newNavItemData.label}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {creatingNavItem ? 'Criando...' : 'Adicionar Item'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Itens de Navegação Existentes</CardTitle>
                <CardDescription>
                  Gerencie os itens de navegação existentes no cabeçalho.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {navItems.map(renderNavItem)}
                  {navItems.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum item de navegação configurado.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este {showDeleteDialog?.type === 'button' ? 'botão' : 'item de navegação'}? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deletingButton || deletingNavItem}
            >
              {(deletingButton || deletingNavItem) ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeaderManagement;