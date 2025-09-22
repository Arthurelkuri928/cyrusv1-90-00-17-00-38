import { useState, useEffect } from 'react';
import { useToolManagement } from '@/hooks/useToolManagement';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Settings, Eye } from 'lucide-react';
import DeleteToolDialog from './DeleteToolDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tool } from '@/shared/types/tool';

interface SupabaseTool {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  access_url: string;
  is_active: boolean;
  is_maintenance: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

const ConnectedToolsManagement = () => {
  const { can } = usePermissions();
  const canViewTools = can('view_tools');
  const canEditTools = can('edit_tools');
  const canCreateTools = can('create_tools');
  const canDeleteTools = can('delete_tools');
  const { 
    toggleToolStatus,
    isUpdating,
    isDeleting 
  } = useToolManagement();
  
  const [supabaseTools, setSupabaseTools] = useState<SupabaseTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);

  // Convert Supabase tool to shared Tool interface
  const mapSupabaseToolToTool = (supabaseTool: SupabaseTool): Tool => ({
    id: supabaseTool.id,
    name: supabaseTool.name,
    description: supabaseTool.description || '',
    category: supabaseTool.category || 'general',
    status: supabaseTool.is_maintenance ? 'maintenance' : 
            supabaseTool.is_active ? 'active' : 'inactive',
    access_url: supabaseTool.access_url,
    slug: supabaseTool.slug,
    is_active: supabaseTool.is_active,
    is_maintenance: supabaseTool.is_maintenance,
    created_at: supabaseTool.created_at,
    updated_at: supabaseTool.updated_at,
  });

  const tools = supabaseTools.map(mapSupabaseToolToTool);

  const loadTools = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando ferramentas...');
      
      // Use the RPC function that filters deleted tools
      const { data, error } = await supabase.rpc('get_member_tools');

      if (error) {
        console.error('❌ Erro ao carregar ferramentas:', error);
        toast.error('Erro ao carregar ferramentas');
        return;
      }

      console.log('✅ Ferramentas carregadas:', data?.length || 0);
      setSupabaseTools(data || []);
    } catch (error) {
      console.error('💥 Erro geral ao carregar ferramentas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canViewTools) {
      loadTools();
    } else {
      setLoading(false);
      console.log('🚫 Usuário não tem permissão para ver ferramentas');
    }
  }, [canViewTools]);

  // Se não tem permissão para ver ferramentas
  if (!canViewTools) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <Settings className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">Acesso Negado</h3>
              <p className="text-sm text-red-400">
                Apenas administradores podem acessar o painel de gestão de ferramentas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleToggleActive = async (tool: Tool) => {
    if (!canEditTools) {
      toast.error('Você não tem permissão para editar ferramentas');
      return;
    }

    try {
      await toggleToolStatus(Number(tool.id), 'is_active', !tool.is_active);
      loadTools();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleToggleMaintenance = async (tool: Tool) => {
    if (!canEditTools) {
      toast.error('Você não tem permissão para editar ferramentas');
      return;
    }

    try {
      await toggleToolStatus(Number(tool.id), 'is_maintenance', !tool.is_maintenance);
      loadTools();
    } catch (error) {
      console.error('Erro ao alterar manutenção:', error);
    }
  };

  const handleDelete = (tool: Tool) => {
    setToolToDelete(tool);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (toolToDelete) {
      try {
        // DeleteToolDialog will handle the actual deletion through useToolManagement
        setDeleteDialogOpen(false);
        setToolToDelete(null);
        loadTools();
      } catch (error) {
        console.error('Erro ao excluir ferramenta:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gerenciamento de Ferramentas</h2>
          <p className="text-muted-foreground">
            Gerencie as ferramentas conectadas do sistema
          </p>
        </div>
        
        {canCreateTools && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Ferramenta
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Carregando ferramentas...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {tools.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Nenhuma ferramenta encontrada</p>
              </CardContent>
            </Card>
          ) : (
            tools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tool.description || 'Sem descrição'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={tool.status === 'active' ? 'default' : 'secondary'}>
                        {tool.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                      
                      {tool.status === 'maintenance' && (
                        <Badge variant="destructive">Manutenção</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>Categoria: {tool.category}</p>
                      <p>Slug: {tool.slug}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {canEditTools && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(tool)}
                            disabled={isUpdating}
                          >
                            {tool.status === 'active' ? 'Desativar' : 'Ativar'}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleMaintenance(tool)}
                            disabled={isUpdating}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            {tool.status === 'maintenance' ? 'Sair Manutenção' : 'Manutenção'}
                          </Button>
                        </>
                      )}
                      
                      {canDeleteTools && (
                        <DeleteToolDialog
                          tool={tool}
                          onDelete={() => handleDelete(tool)}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectedToolsManagement;