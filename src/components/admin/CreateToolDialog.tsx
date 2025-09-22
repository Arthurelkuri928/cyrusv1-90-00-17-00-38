
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tool } from '@/shared/types/tool';
import { Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  value: string;
  label: string;
  originalValue: string;
}

interface CreateToolDialogProps {
  onSave: (newTool: Partial<Tool>) => Promise<void>;
  availableCategories: Category[];
}

const CreateToolDialog: React.FC<CreateToolDialogProps> = ({ onSave, availableCategories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    logo_url: '',
    card_color: '#3B82F6',
    access_url: '',
    email: '',
    password: '',
    cookies: '',
    slug: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      logo_url: '',
      card_color: '#3B82F6',
      access_url: '',
      email: '',
      password: '',
      cookies: '',
      slug: ''
    });
  };

  const handleCreate = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error('Nome da ferramenta é obrigatório');
        return;
      }

      setIsCreating(true);
      console.log('🆕 Criando nova ferramenta:', formData);
      
      await onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        logo_url: formData.logo_url.trim() || undefined,
        card_color: formData.card_color,
        access_url: formData.access_url.trim() || undefined,
        email: formData.email.trim() || undefined,
        password: formData.password.trim() || undefined,
        cookies: formData.cookies.trim() || undefined,
        slug: formData.slug.trim() || undefined,
        is_active: true,
        is_maintenance: false
      });

      resetForm();
      setIsOpen(false);
      toast.success('Ferramenta criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar ferramenta:', error);
      toast.error('Erro ao criar ferramenta');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isCreating) {
      resetForm();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Ferramenta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Nova Ferramenta
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Ferramenta *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite o nome da ferramenta"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
                    {/* Always include 'general' as fallback */}
                    <SelectItem value="general">Geral</SelectItem>
                    
                    {/* Show real categories from database */}
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat.originalValue} value={cat.originalValue}>
                        {cat.label}
                      </SelectItem>
                    ))}
                    
                    {/* Separator for common additional categories */}
                    <SelectItem value="ai">Inteligência Artificial</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="productivity">Produtividade</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="development">Desenvolvimento</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="social">Redes Sociais</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
                
                <p className="text-xs text-muted-foreground">
                  📊 {availableCategories.length > 0 ? 
                    `${availableCategories.length} categorias existentes + opções padrão` : 
                    'Usando categorias padrão'
                  }
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva a funcionalidade da ferramenta"
                rows={3}
              />
            </div>
          </div>

          {/* Aparência Visual */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aparência Visual</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo_url">URL do Logo</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card_color">Cor do Card</Label>
                <div className="flex gap-2">
                  <Input
                    id="card_color"
                    type="color"
                    value={formData.card_color}
                    onChange={(e) => handleInputChange('card_color', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.card_color}
                    onChange={(e) => handleInputChange('card_color', e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Acesso e Configurações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Acesso e Configurações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="access_url">URL de Acesso</Label>
                <Input
                  id="access_url"
                  value={formData.access_url}
                  onChange={(e) => handleInputChange('access_url', e.target.value)}
                  placeholder="https://ferramenta.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="nome-da-ferramenta"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de Acesso</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="usuario@exemplo.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha de Acesso</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookies">Cookies/Sessão</Label>
              <Textarea
                id="cookies"
                value={formData.cookies}
                onChange={(e) => handleInputChange('cookies', e.target.value)}
                placeholder="Dados de cookies ou sessão (opcional)"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isCreating}
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="min-w-[100px]"
          >
            <Save className="h-4 w-4 mr-1" />
            {isCreating ? 'Criando...' : 'Criar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateToolDialog;
