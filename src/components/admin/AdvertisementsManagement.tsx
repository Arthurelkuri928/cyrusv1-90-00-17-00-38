import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Plus, Calendar, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Advertisement } from '@/hooks/useAdvertisements';
import AdvertisementsDashboard from './AdvertisementsDashboard';
import { 
  UnifiedAdminCard, 
  UnifiedAdminCardHeader, 
  UnifiedAdminCardTitle, 
  UnifiedAdminCardContent,
  UnifiedButton,
  UnifiedBadge,
  AdminActionButtons,
  AdminSearchBar
} from '@/design-system';

// Create a type for inserting new advertisements
type AdvertisementInsert = Omit<Advertisement, 'id' | 'created_at' | 'updated_at'>;

const AdvertisementsManagement = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const emptyAd: AdvertisementInsert = {
    title_pt: '',
    title_en: '',
    title_es: '',
    description_pt: '',
    description_en: '',
    description_es: '',
    video_url: '',
    thumbnail_url: '',
    cta_button_1_text_pt: '',
    cta_button_1_text_en: '',
    cta_button_1_text_es: '',
    cta_button_1_url: '',
    cta_button_2_text_pt: '',
    cta_button_2_text_en: '',
    cta_button_2_text_es: '',
    cta_button_2_url: '',
    display_order: 0,
    is_active: true,
    start_date: undefined,
    end_date: undefined,
  };

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAdvertisements(data || []);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar anúncios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAdvertisement = async (adData: Partial<Advertisement>) => {
    try {
      if (editingAd?.id) {
        // Update existing
        const { error } = await supabase
          .from('advertisements')
          .update(adData)
          .eq('id', editingAd.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Anúncio atualizado com sucesso",
        });
      } else {
        // Create new - ensure all required fields are present
        const insertData: AdvertisementInsert = {
          title_pt: adData.title_pt || '',
          title_en: adData.title_en || '',
          title_es: adData.title_es || '',
          description_pt: adData.description_pt || '',
          description_en: adData.description_en || '',
          description_es: adData.description_es || '',
          video_url: adData.video_url || '',
          thumbnail_url: adData.thumbnail_url || '',
          cta_button_1_text_pt: adData.cta_button_1_text_pt || '',
          cta_button_1_text_en: adData.cta_button_1_text_en || '',
          cta_button_1_text_es: adData.cta_button_1_text_es || '',
          cta_button_1_url: adData.cta_button_1_url || '',
          cta_button_2_text_pt: adData.cta_button_2_text_pt || '',
          cta_button_2_text_en: adData.cta_button_2_text_en || '',
          cta_button_2_text_es: adData.cta_button_2_text_es || '',
          cta_button_2_url: adData.cta_button_2_url || '',
          display_order: adData.display_order || 0,
          is_active: adData.is_active !== undefined ? adData.is_active : true,
          start_date: adData.start_date || undefined,
          end_date: adData.end_date || undefined,
        };

        const { error } = await supabase
          .from('advertisements')
          .insert(insertData);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Anúncio criado com sucesso",
        });
      }

      setIsDialogOpen(false);
      setEditingAd(null);
      fetchAdvertisements();
    } catch (error) {
      console.error('Error saving advertisement:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar anúncio",
        variant: "destructive",
      });
    }
  };

  const deleteAdvertisement = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return;

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Anúncio excluído com sucesso",
      });
      
      fetchAdvertisements();
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir anúncio",
        variant: "destructive",
      });
    }
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: `Anúncio ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`,
      });
      
      fetchAdvertisements();
    } catch (error) {
      console.error('Error updating advertisement status:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar status do anúncio",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const openCreateDialog = () => {
    setEditingAd(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (ad: Advertisement) => {
    setEditingAd(ad);
    setIsDialogOpen(true);
  };

  // Filter advertisements based on search term
  const filteredAdvertisements = advertisements.filter(ad =>
    ad.title_pt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.description_pt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.title_es.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Dashboard de Estatísticas dos Anúncios */}
      <AdvertisementsDashboard advertisements={advertisements} />

      {/* Header Section */}
      <UnifiedAdminCard>
        <UnifiedAdminCardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <UnifiedAdminCardTitle className="text-2xl">
                Gerenciamento de Anúncios
              </UnifiedAdminCardTitle>
              <p className="text-[hsl(var(--admin-text-muted))]">
                Gerencie os vídeos de anúncios exibidos na área de membros
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[hsl(var(--admin-text-subtle))]">
                  Total: {advertisements.length} anúncios
                </span>
                <span className="text-[hsl(var(--admin-text-subtle))]">
                  Filtrados: {filteredAdvertisements.length}
                </span>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <UnifiedButton onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Anúncio
                </UnifiedButton>
              </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAd ? 'Editar Anúncio' : 'Criar Novo Anúncio'}
              </DialogTitle>
            </DialogHeader>
            
            <AdvertisementForm
              advertisement={editingAd || emptyAd}
              onSave={saveAdvertisement}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingAd(null);
              }}
            />
          </DialogContent>
            </Dialog>
          </div>
        </UnifiedAdminCardHeader>
        
        <UnifiedAdminCardContent>
          <AdminSearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar anúncios por título ou descrição..."
            className="max-w-md"
          />
        </UnifiedAdminCardContent>
      </UnifiedAdminCard>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--admin-accent))]"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAdvertisements.map((ad) => (
            <UnifiedAdminCard key={ad.id} variant="elevated">
              <UnifiedAdminCardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <UnifiedAdminCardTitle className="text-lg">
                      {ad.title_pt}
                    </UnifiedAdminCardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <UnifiedBadge variant={ad.is_active ? "success" : "secondary"}>
                        {ad.is_active ? 'Ativo' : 'Inativo'}
                      </UnifiedBadge>
                      <UnifiedBadge variant="outline">
                        Ordem: {ad.display_order}
                      </UnifiedBadge>
                      {ad.start_date && (
                        <UnifiedBadge variant="warning">
                          <Calendar className="h-3 w-3 mr-1" />
                          Agendado
                        </UnifiedBadge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={ad.is_active}
                      onCheckedChange={() => toggleActiveStatus(ad.id, ad.is_active)}
                    />
                    <AdminActionButtons
                      onEdit={() => openEditDialog(ad)}
                      onDelete={() => deleteAdvertisement(ad.id)}
                      canEdit={true}
                      canDelete={true}
                      canToggleStatus={false}
                    />
                  </div>
                </div>
              </UnifiedAdminCardHeader>
              
              <UnifiedAdminCardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-[hsl(var(--admin-text))] border-b border-[hsl(var(--admin-border-subtle))] pb-1">
                      Português
                    </h4>
                    <p className="text-sm text-[hsl(var(--admin-text-muted))]">
                      {ad.description_pt}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-[hsl(var(--admin-text))] border-b border-[hsl(var(--admin-border-subtle))] pb-1">
                      English
                    </h4>
                    <p className="text-sm text-[hsl(var(--admin-text-muted))]">
                      {ad.description_en}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-[hsl(var(--admin-text))] border-b border-[hsl(var(--admin-border-subtle))] pb-1">
                      Español
                    </h4>
                    <p className="text-sm text-[hsl(var(--admin-text-muted))]">
                      {ad.description_es}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[hsl(var(--admin-border-subtle))]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[hsl(var(--admin-accent))]" />
                      <span className="text-[hsl(var(--admin-text-subtle))]">Vídeo:</span>
                      <span className="text-[hsl(var(--admin-text))] font-mono text-xs truncate">
                        {ad.video_url}
                      </span>
                    </div>
                    {ad.cta_button_1_url && (
                      <div className="flex items-center gap-2">
                        <span className="text-[hsl(var(--admin-text-subtle))]">CTA 1:</span>
                        <span className="text-[hsl(var(--admin-text))] font-mono text-xs truncate">
                          {ad.cta_button_1_url}
                        </span>
                      </div>
                    )}
                    {ad.cta_button_2_url && (
                      <div className="flex items-center gap-2">
                        <span className="text-[hsl(var(--admin-text-subtle))]">CTA 2:</span>
                        <span className="text-[hsl(var(--admin-text))] font-mono text-xs truncate">
                          {ad.cta_button_2_url}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </UnifiedAdminCardContent>
            </UnifiedAdminCard>
          ))}
          
          {filteredAdvertisements.length === 0 && (
            <UnifiedAdminCard>
              <UnifiedAdminCardContent className="text-center py-12">
                <p className="text-[hsl(var(--admin-text-muted))]">
                  {searchTerm 
                    ? 'Nenhum anúncio encontrado para o termo buscado' 
                    : 'Nenhum anúncio criado ainda'
                  }
                </p>
                {!searchTerm && (
                  <UnifiedButton 
                    onClick={openCreateDialog} 
                    variant="outline" 
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Anúncio
                  </UnifiedButton>
                )}
              </UnifiedAdminCardContent>
            </UnifiedAdminCard>
          )}
        </div>
      )}
    </div>
  );
};

interface AdvertisementFormProps {
  advertisement: Partial<Advertisement>;
  onSave: (data: Partial<Advertisement>) => void;
  onCancel: () => void;
}

const AdvertisementForm: React.FC<AdvertisementFormProps> = ({
  advertisement,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Advertisement>>(advertisement);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: keyof Advertisement, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
          <TabsTrigger value="cta">CTAs</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Título (Português)</Label>
              <Input
                value={formData.title_pt || ''}
                onChange={(e) => updateField('title_pt', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Título (English)</Label>
              <Input
                value={formData.title_en || ''}
                onChange={(e) => updateField('title_en', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Título (Español)</Label>
              <Input
                value={formData.title_es || ''}
                onChange={(e) => updateField('title_es', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Descrição (Português)</Label>
              <Textarea
                value={formData.description_pt || ''}
                onChange={(e) => updateField('description_pt', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição (English)</Label>
              <Textarea
                value={formData.description_en || ''}
                onChange={(e) => updateField('description_en', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição (Español)</Label>
              <Textarea
                value={formData.description_es || ''}
                onChange={(e) => updateField('description_es', e.target.value)}
                required
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          <div className="space-y-2">
            <Label>URL do Vídeo</Label>
            <Input
              value={formData.video_url || ''}
              onChange={(e) => updateField('video_url', e.target.value)}
              placeholder="https://vimeo.com/123456789"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>URL da Thumbnail (opcional)</Label>
            <Input
              value={formData.thumbnail_url || ''}
              onChange={(e) => updateField('thumbnail_url', e.target.value)}
              placeholder="https://vumbnail.com/123456789.jpg"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="cta" className="space-y-4">
          <div className="space-y-4">
            <h3 className="font-medium">CTA Button 1</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Texto (PT)</Label>
                <Input
                  value={formData.cta_button_1_text_pt || ''}
                  onChange={(e) => updateField('cta_button_1_text_pt', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Texto (EN)</Label>
                <Input
                  value={formData.cta_button_1_text_en || ''}
                  onChange={(e) => updateField('cta_button_1_text_en', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Texto (ES)</Label>
                <Input
                  value={formData.cta_button_1_text_es || ''}
                  onChange={(e) => updateField('cta_button_1_text_es', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL do CTA 1</Label>
              <Input
                value={formData.cta_button_1_url || ''}
                onChange={(e) => updateField('cta_button_1_url', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">CTA Button 2</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Texto (PT)</Label>
                <Input
                  value={formData.cta_button_2_text_pt || ''}
                  onChange={(e) => updateField('cta_button_2_text_pt', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Texto (EN)</Label>
                <Input
                  value={formData.cta_button_2_text_en || ''}
                  onChange={(e) => updateField('cta_button_2_text_en', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Texto (ES)</Label>
                <Input
                  value={formData.cta_button_2_text_es || ''}
                  onChange={(e) => updateField('cta_button_2_text_es', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL do CTA 2</Label>
              <Input
                value={formData.cta_button_2_url || ''}
                onChange={(e) => updateField('cta_button_2_url', e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ordem de Exibição</Label>
              <Input
                type="number"
                value={formData.display_order || 0}
                onChange={(e) => updateField('display_order', parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active || false}
                  onCheckedChange={(checked) => updateField('is_active', checked)}
                />
                <Label>Anúncio Ativo</Label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início (opcional)</Label>
              <Input
                type="datetime-local"
                value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
                onChange={(e) => updateField('start_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Fim (opcional)</Label>
              <Input
                type="datetime-local"
                value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
                onChange={(e) => updateField('end_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {advertisement.id ? 'Atualizar' : 'Criar'} Anúncio
        </Button>
      </div>
    </form>
  );
};

export default AdvertisementsManagement;
