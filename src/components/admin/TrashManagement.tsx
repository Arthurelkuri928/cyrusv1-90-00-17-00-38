import { useState, useEffect } from 'react';
import { useToolManagement } from '@/hooks/useToolManagement';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, RefreshCw, RotateCcw, Loader2, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tool } from '@/shared/types/tool';

interface DeletedSupabaseTool {
  id: number;
  name: string;
  description: string;
  category: string;
  deleted_at: string;
}

const TrashManagement = () => {
  const { can } = usePermissions();
  const canDeleteTools = can('delete_tools');
  const { restoreTool, permanentDeleteTool, isDeleting } = useToolManagement();
  
  const [deletedTools, setDeletedTools] = useState<DeletedSupabaseTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [ageFilter, setAgeFilter] = useState<'all' | '7' | '15' | '30'>('all');

  const loadDeletedTools = async () => {
    try {
      setLoading(true);
      console.log('🗑️ Carregando ferramentas deletadas...');
      
      // Primeiro, limpar itens antigos (>30 dias)
      try {
        const { data: purged } = await (supabase as any).rpc('purge_old_deleted_tools');
        if (purged && (purged as number) > 0) {
          console.log(`🧹 ${purged} ferramentas antigas removidas automaticamente`);
        }
      } catch (purgeError) {
        console.warn('Aviso ao limpar itens antigos:', purgeError);
      }
      
      const { data, error } = await supabase.rpc('get_deleted_tools');

      if (error) {
        console.error('❌ Erro ao carregar ferramentas deletadas:', error);
        toast.error('Erro ao carregar lixeira');
        return;
      }

      console.log('✅ Ferramentas deletadas carregadas:', data?.length || 0);
      setDeletedTools(data || []);
    } catch (error) {
      console.error('💥 Erro geral ao carregar lixeira:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular dias desde a exclusão
  const calculateDaysInTrash = (deletedAt: string) => {
    const now = new Date();
    const deletedDate = new Date(deletedAt);
    return Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Calcular dias restantes para exclusão automática
  const calculateDaysUntilRemoval = (deletedAt: string) => {
    const daysInTrash = calculateDaysInTrash(deletedAt);
    return Math.max(0, 30 - daysInTrash);
  };

  // Filtrar ferramentas por idade
  const filteredTools = deletedTools.filter(tool => {
    if (ageFilter === 'all') return true;
    const daysInTrash = calculateDaysInTrash(tool.deleted_at);
    const maxDays = parseInt(ageFilter);
    return daysInTrash <= maxDays;
  });

  useEffect(() => {
    if (canDeleteTools) {
      loadDeletedTools();
    } else {
      setLoading(false);
    }
  }, [canDeleteTools]);

  const handleRestore = async (toolId: number, toolName: string) => {
    try {
      await restoreTool(toolId, toolName);
      loadDeletedTools();
    } catch (error) {
      console.error('Erro ao restaurar ferramenta:', error);
    }
  };

  const handlePermanentDelete = async (toolId: number) => {
    if (window.confirm('Esta ação é irreversível! Tem certeza que deseja excluir permanentemente esta ferramenta?')) {
      try {
        await permanentDeleteTool(toolId);
        loadDeletedTools();
      } catch (error) {
        console.error('Erro ao excluir permanentemente:', error);
      }
    }
  };

  if (!canDeleteTools) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <Trash2 className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">Acesso Negado</h3>
              <p className="text-sm text-red-400">
                Apenas administradores com permissão de exclusão podem acessar a lixeira.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lixeira - Ferramentas Deletadas</h2>
          <p className="text-muted-foreground">
            Gerencie ferramentas que foram movidas para a lixeira
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={ageFilter} onValueChange={(value: 'all' | '7' | '15' | '30') => setAgeFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por idade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os itens</SelectItem>
                <SelectItem value="7">até 7 dias</SelectItem>
                <SelectItem value="15">até 15 dias</SelectItem>
                <SelectItem value="30">até 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={loadDeletedTools} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Carregando lixeira...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTools.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Trash2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">A lixeira está vazia</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Nenhuma ferramenta foi deletada recentemente
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTools.map((tool) => {
              const daysUntilRemoval = calculateDaysUntilRemoval(tool.deleted_at);
              const daysInTrash = calculateDaysInTrash(tool.deleted_at);
              
              return (
              <Card key={tool.id} className="border-orange-200 bg-orange-50/30 dark:border-orange-800 dark:bg-orange-950/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-orange-500" />
                        {tool.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tool.description || 'Sem descrição'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Badge variant="destructive">Deletada</Badge>
                      <Badge variant="outline" className="text-xs">
                        {daysUntilRemoval > 0 ? `Remove em: ${daysUntilRemoval}d` : 'Remoção pendente'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>Categoria: {tool.category}</p>
                      <p>Deletada em: {new Date(tool.deleted_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(tool.id, tool.name)}
                        disabled={isDeleting}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restaurar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handlePermanentDelete(tool.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir Permanentemente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default TrashManagement;