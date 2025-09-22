import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tool, ActionButton } from '@/shared/types/tool';
import { Edit, Save, X, Plus, Trash2, Eye, EyeOff, ExternalLink, Copy, Play, Database } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import CookieManagerSection from './CookieManagerSection';
import { useCookieMigration } from '@/hooks/useCookieMigration';

interface Category {
  value: string;
  label: string;
  originalValue: string;
}

interface ToolCredential {
  type: string;
  label: string;
  value: string;
}

interface ToolEditDialogProps {
  tool: Tool;
  onSave: (updatedTool: Partial<Tool>) => Promise<void>;
  isUpdating: boolean;
  availableCategories: Category[];
}

const ToolEditDialog: React.FC<ToolEditDialogProps> = ({ tool, onSave, isUpdating, availableCategories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);
  const [credentials, setCredentials] = useState<ToolCredential[]>([]);
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([]);
  const [showCredentialValues, setShowCredentialValues] = useState<{[key: number]: boolean}>({});
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'credentials', 'cookies', 'actions'
  
  const { migrateCookiesToCredentials, isLoading: isMigrating, migrationResult } = useCookieMigration();
  
  const [formData, setFormData] = useState({
    name: tool.name || '',
    description: tool.description || '',
    category: tool.category || 'general',
    logo_url: tool.logo_url || '',
    card_color: tool.card_color || '#3B82F6',
    access_url: tool.access_url || '',
    email: tool.email || '',
    password: tool.password || '',
    cookies: tool.cookies || '',
    slug: tool.slug || ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: tool.name || '',
        description: tool.description || '',
        category: tool.category || 'general',
        logo_url: tool.logo_url || '',
        card_color: tool.card_color || '#3B82F6',
        access_url: tool.access_url || '',
        email: tool.email || '',
        password: tool.password || '',
        cookies: tool.cookies || '',
        slug: tool.slug || ''
      });
      
      setActionButtons(tool.action_buttons || []);
      loadCredentials();
    }
  }, [isOpen, tool]);

  const loadCredentials = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-tool-credentials', {
        body: {
          toolId: String(tool.id),
          action: 'get'
        }
      });

      if (error) throw error;
      setCredentials(data?.data || []);
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
      setCredentials([]);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error('Nome da ferramenta é obrigatório');
        return;
      }

      console.log(`🔄 Salvando alterações da ferramenta ID ${tool.id}:`, formData);
      
      const validActionButtons = actionButtons.filter(btn => 
        btn.label.trim() && (btn.value?.trim() || btn.url?.trim())
      );
      
      console.log('🎯 Action buttons before save:', {
        original_count: actionButtons.length,
        valid_count: validActionButtons.length,
        all_buttons: actionButtons.map(btn => ({ id: btn.id, label: btn.label, type: btn.type })),
        valid_buttons: validActionButtons.map(btn => ({ id: btn.id, label: btn.label, type: btn.type }))
      });
      
      const updateData = {
        id: tool.id,
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
        is_active: tool.is_active,
        is_maintenance: tool.is_maintenance,
        action_buttons: validActionButtons
      };

      console.log('📤 Sending update data to onSave:', updateData);
      
      await onSave(updateData);

      setIsOpen(false);
      toast.success('Ferramenta atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar ferramenta:', error);
      toast.error('Erro ao salvar alterações');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCredential = () => {
    setCredentials(prev => [...prev, { type: 'login', label: '', value: '' }]);
  };

  const removeCredential = (index: number) => {
    setCredentials(prev => prev.filter((_, i) => i !== index));
  };

  const updateCredential = (index: number, field: keyof ToolCredential, value: string) => {
    setCredentials(prev => prev.map((cred, i) => 
      i === index ? { ...cred, [field]: value } : cred
    ));
  };

  const toggleCredentialVisibility = (index: number) => {
    setShowCredentialValues(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const saveCredentials = async () => {
    try {
      setIsSavingCredentials(true);
      
      const { data, error } = await supabase.functions.invoke('manage-tool-credentials', {
        body: {
          toolId: String(tool.id),
          credentials: credentials.filter(c => c.label && c.value),
          action: 'update'
        }
      });

      if (error) throw error;
      
      toast.success('Credenciais salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
      toast.error('Erro ao salvar credenciais');
    } finally {
      setIsSavingCredentials(false);
    }
  };

  const addActionButton = () => {
    const newButton: ActionButton = {
      id: `btn_${Date.now()}`,
      label: '',
      type: 'copy',
      value: '',
      icon: 'Copy'
    };
    console.log('➕ Adding new action button:', newButton);
    setActionButtons(prev => [...prev, newButton]);
  };

  const removeActionButton = (buttonId: string) => {
    console.log('🗑️ Removing action button with ID:', buttonId);
    setActionButtons(prev => {
      const newButtons = prev.filter(btn => btn.id !== buttonId);
      console.log('🗑️ After removal:', {
        before_count: prev.length,
        after_count: newButtons.length,
        removed_button: prev.find(btn => btn.id === buttonId),
        remaining_buttons: newButtons.map(btn => ({ id: btn.id, label: btn.label }))
      });
      return newButtons;
    });
  };

  const updateActionButton = (buttonId: string, field: keyof ActionButton, value: string) => {
    setActionButtons(prev => prev.map(btn => 
      btn.id === buttonId ? { ...btn, [field]: value } : btn
    ));
  };

  const getCurrentCategoryValue = () => {
    if (!formData.category) return 'general';
    
    const exactMatch = availableCategories.find(cat => 
      cat.originalValue === formData.category || cat.value === formData.category
    );
    
    if (exactMatch) return exactMatch.originalValue;
    return formData.category;
  };

  const getCurrentCookies = (): string => {
    const cookieCredential = credentials.find(cred => cred.type === 'cookie');
    if (cookieCredential?.value) {
      return cookieCredential.value;
    }
    return formData.cookies;
  };

  const handleCookiesChange = (newCookies: string) => {
    const cookieCredIndex = credentials.findIndex(cred => cred.type === 'cookie');
    
    if (cookieCredIndex >= 0) {
      updateCredential(cookieCredIndex, 'value', newCookies);
    } else {
      if (newCookies.trim()) {
        setCredentials(prev => [...prev, {
          type: 'cookie',
          label: 'Cookies de Sessão',
          value: newCookies
        }]);
      }
    }
    
    handleInputChange('cookies', newCookies);
  };

  const handleMigrationClick = async () => {
    try {
      await migrateCookiesToCredentials();
      loadCredentials();
    } catch (error) {
      console.error('Erro na migração:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-[80px]">
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Ferramenta: {tool.name}
            <span className="text-sm text-muted-foreground font-normal">(ID: {tool.id})</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-6 border-b">
          {['basic', 'credentials', 'cookies', 'actions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'basic' && 'Informações Básicas'}
              {tab === 'credentials' && 'Credenciais'}
              {tab === 'cookies' && 'Cookies'}
              {tab === 'actions' && 'Botões de Ação'}
            </button>
          ))}
        </div>

        <div className="space-y-6 py-4">
          {activeTab === 'basic' && (
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
                    value={getCurrentCategoryValue()} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
                      <SelectItem value="general">Geral</SelectItem>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat.originalValue} value={cat.originalValue}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Gerenciamento de Cookies</h3>
                <Button
                  onClick={handleMigrationClick}
                  disabled={isMigrating}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  {isMigrating ? 'Migrando...' : 'Migrar Cookies'}
                </Button>
              </div>
              
              <CookieManagerSection
                cookiesData={getCurrentCookies()}
                onCookiesChange={handleCookiesChange}
                toolName={tool.name}
              />

              {migrationResult && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Resultado da Migração
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p>✅ Migradas: {migrationResult.migratedCount} ferramenta(s)</p>
                    {migrationResult.errors.length > 0 && (
                      <p>❌ Erros: {migrationResult.errors.length}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Credenciais da Ferramenta</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCredential}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Credencial
                </Button>
              </div>

              {credentials.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma credencial configurada</p>
                  <p className="text-sm">Adicione credenciais para que os usuários possam acessar a ferramenta</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {credentials.map((credential, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Credencial {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCredential(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Select
                            value={credential.type}
                            onValueChange={(value) => updateCredential(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="login">Login</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="password">Senha</SelectItem>
                              <SelectItem value="token">Token</SelectItem>
                              <SelectItem value="api_key">API Key</SelectItem>
                              <SelectItem value="cookie">Cookie</SelectItem>
                              <SelectItem value="other">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Rótulo</Label>
                          <Input
                            value={credential.label}
                            onChange={(e) => updateCredential(index, 'label', e.target.value)}
                            placeholder="Ex: Email de acesso"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Valor</Label>
                          <div className="relative">
                            <Input
                              type={showCredentialValues[index] ? 'text' : 'password'}
                              value={credential.value}
                              onChange={(e) => updateCredential(index, 'value', e.target.value)}
                              placeholder="Valor da credencial"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => toggleCredentialVisibility(index)}
                            >
                              {showCredentialValues[index] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={saveCredentials}
                      disabled={isSavingCredentials}
                      className="min-w-[120px]"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {isSavingCredentials ? 'Salvando...' : 'Salvar Credenciais'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Botões de Ação</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addActionButton}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Botão
                </Button>
              </div>

              {actionButtons.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                  <p>Nenhum botão de ação configurado</p>
                  <p className="text-sm">Adicione botões personalizados para facilitar o acesso dos usuários</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {actionButtons.map((button, index) => (
                    <div key={button.id} className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Botão {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActionButton(button.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Select
                            value={button.type}
                            onValueChange={(value: 'copy' | 'link' | 'action') => 
                              updateActionButton(button.id, 'type', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo do botão" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="copy">
                                <div className="flex items-center gap-2">
                                  <Copy className="h-4 w-4" />
                                  Copiar
                                </div>
                              </SelectItem>
                              <SelectItem value="link">
                                <div className="flex items-center gap-2">
                                  <ExternalLink className="h-4 w-4" />
                                  Link Externo
                                </div>
                              </SelectItem>
                              <SelectItem value="action">
                                <div className="flex items-center gap-2">
                                  <Play className="h-4 w-4" />
                                  Ação Personalizada
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Rótulo</Label>
                          <Input
                            value={button.label}
                            onChange={(e) => updateActionButton(button.id, 'label', e.target.value)}
                            placeholder="Ex: Copiar Email"
                          />
                        </div>

                        {button.type === 'copy' && (
                          <div className="space-y-2">
                            <Label>Valor para Copiar</Label>
                            <Input
                              value={button.value || ''}
                              onChange={(e) => updateActionButton(button.id, 'value', e.target.value)}
                              placeholder="Texto a ser copiado"
                            />
                          </div>
                        )}

                        {button.type === 'link' && (
                          <div className="space-y-2">
                            <Label>URL do Link</Label>
                            <Input
                              value={button.url || ''}
                              onChange={(e) => updateActionButton(button.id, 'url', e.target.value)}
                              placeholder="https://exemplo.com"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Ícone</Label>
                          <Input
                            value={button.icon || ''}
                            onChange={(e) => updateActionButton(button.id, 'icon', e.target.value)}
                            placeholder="Nome do ícone"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Status Atual</h3>
            <div className="text-sm space-y-1">
              <div>Ativa: <span className="font-mono">{String(tool.is_active)}</span></div>
              <div>Manutenção: <span className="font-mono">{String(tool.is_maintenance)}</span></div>
              <div>Status: <span className="font-mono">{tool.status}</span></div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isUpdating}
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="min-w-[100px]"
          >
            <Save className="h-4 w-4 mr-1" />
            {isUpdating ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToolEditDialog;
