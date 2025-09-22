import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSidebarLinks } from '@/hooks/useSidebarLinks';
import { SidebarLinksService } from '@/shared/services/SidebarLinksService';
import { SidebarLink, CreateSidebarLinkRequest } from '@/shared/types/sidebarLink';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const SidebarLinksManagement = () => {
  const { sidebarLinks, isLoading, refetch } = useSidebarLinks(undefined, true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SidebarLink | null>(null);
  const [formData, setFormData] = useState<CreateSidebarLinkRequest>({
    title: '',
    description: '',
    url: '',
    category: '',
    icon: 'ExternalLink',
    is_visible: true,
    is_external: true,
  });

  const sidebarLinksService = SidebarLinksService.getInstance();
  const queryClient = useQueryClient();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      category: '',
      icon: 'ExternalLink',
      is_visible: true,
      is_external: true,
    });
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sidebarLinksService.createLink(formData);
      toast.success('Link criado com sucesso!');
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Erro ao criar link:', error);
      toast.error('Erro ao criar link');
    }
  };

  const handleEditLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    try {
      await sidebarLinksService.updateLink(editingLink.id, formData);
      toast.success('Link atualizado com sucesso!');
      setIsEditDialogOpen(false);
      setEditingLink(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar link:', error);
      toast.error('Erro ao atualizar link');
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await sidebarLinksService.deleteLink(id);
      toast.success('Link excluído com sucesso!');
      refetch();
    } catch (error) {
      console.error('Erro ao excluir link:', error);
      toast.error('Erro ao excluir link');
    }
  };

  const handleToggleVisibility = async (link: SidebarLink) => {
    try {
      await sidebarLinksService.updateLink(link.id, {
        is_visible: !link.is_visible
      });
      toast.success(`Link ${!link.is_visible ? 'ativado' : 'desativado'} com sucesso!`);
      refetch();
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
      toast.error('Erro ao alterar visibilidade');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sidebarLinks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updateData = items.map((item, index) => ({
      id: item.id,
      position: index
    }));

    try {
      await sidebarLinksService.updatePositions(updateData);
      toast.success('Ordem dos links atualizada!');
      refetch();
    } catch (error) {
      console.error('Erro ao reordenar links:', error);
      toast.error('Erro ao reordenar links');
    }
  };

  const openEditDialog = (link: SidebarLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      description: link.description || '',
      url: link.url,
      category: link.category,
      icon: link.icon,
      is_visible: link.is_visible,
      is_external: link.is_external,
    });
    setIsEditDialogOpen(true);
  };

  const categories = [...new Set(sidebarLinks.map(link => link.category))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gerenciar Links da Sidebar</h2>
          <p className="text-muted-foreground">
            Gerencie os links exibidos na barra lateral da aplicação
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Link</DialogTitle>
              <DialogDescription>
                Adicione um novo link à barra lateral
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://exemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="ex: links, help_support"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Ícone</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="ExternalLink"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({...formData, is_visible: checked})}
                />
                <Label htmlFor="is_visible">Visível</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_external"
                  checked={formData.is_external}
                  onCheckedChange={(checked) => setFormData({...formData, is_external: checked})}
                />
                <Label htmlFor="is_external">Link Externo</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar Link</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sidebar-links">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {sidebarLinks.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-all ${
                          snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                        } ${
                          !link.is_visible ? 'opacity-60 bg-muted/50 border-dashed' : ''
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div
                              {...provided.dragHandleProps}
                              className="text-muted-foreground hover:text-foreground cursor-move"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className={`font-medium truncate ${
                                  !link.is_visible ? 'text-muted-foreground line-through' : 'text-foreground'
                                }`}>
                                  {link.title}
                                </h3>
                                <Badge variant={link.is_visible ? "default" : "secondary"}>
                                  {link.category}
                                </Badge>
                                {!link.is_visible && (
                                  <Badge variant="outline" className="text-xs">
                                    Oculto
                                  </Badge>
                                )}
                                {link.is_external && (
                                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                              <p className={`text-sm truncate ${
                                !link.is_visible ? 'text-muted-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {link.description || 'Sem descrição'}
                              </p>
                              <p className={`text-xs truncate mt-1 ${
                                !link.is_visible ? 'text-muted-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {link.url}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleVisibility(link)}
                                className="p-2"
                                title={link.is_visible ? 'Ocultar link' : 'Mostrar link'}
                              >
                                {link.is_visible ? (
                                  <Eye className="h-4 w-4 text-green-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-red-500" />
                                )}
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(link)}
                                className="p-2"
                                title="Editar link"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-2 text-destructive"
                                    title="Excluir link permanentemente"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o link "{link.title}"? 
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteLink(link.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Link</DialogTitle>
            <DialogDescription>
              Modifique as informações do link
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL *</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoria *</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">Ícone</Label>
              <Input
                id="edit-icon"
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData({...formData, is_visible: checked})}
              />
              <Label htmlFor="edit-is_visible">Visível</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_external"
                checked={formData.is_external}
                onCheckedChange={(checked) => setFormData({...formData, is_external: checked})}
              />
              <Label htmlFor="edit-is_external">Link Externo</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingLink(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SidebarLinksManagement;
