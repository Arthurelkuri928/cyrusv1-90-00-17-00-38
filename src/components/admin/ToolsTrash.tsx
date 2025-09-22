import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Trash2, AlertTriangle, Filter } from 'lucide-react';
import { Tool } from '@/shared/types/tool';
import { SupabaseToolsRepository } from '@/infrastructure/repositories/tools.repository';
import { useToolManagement } from '@/hooks/useToolManagement';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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

const toolsRepository = new SupabaseToolsRepository();

const ToolsTrash: React.FC = () => {
  const [deletedTools, setDeletedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [ageFilter, setAgeFilter] = useState<'all' | '7' | '15' | '30'>('all');
  const { restoreTool, permanentDeleteTool, isDeleting } = useToolManagement();

  const fetchDeletedTools = async () => {
    try {
      setLoading(true);
      
      // Primeiro, limpar itens antigos (>30 dias)
      try {
        await (supabase as any).rpc('purge_old_deleted_tools');
      } catch (purgeError) {
        console.warn('Aviso ao limpar itens antigos:', purgeError);
      }
      
      const tools = await toolsRepository.getDeletedTools();
      setDeletedTools(tools);
    } catch (error) {
      console.error('Erro ao carregar lixeira:', error);
      toast.error('Erro ao carregar ferramentas excluídas');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (toolId: number, toolName: string) => {
    try {
      await restoreTool(toolId, toolName);
      await fetchDeletedTools(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao restaurar ferramenta:', error);
    }
  };

  const handlePermanentDelete = async (toolId: number) => {
    try {
      await permanentDeleteTool(toolId);
      await fetchDeletedTools(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir permanentemente:', error);
    }
  };

  // Calcular dias desde a exclusão
  const calculateDaysInTrash = (deletedAt: string | undefined) => {
    if (!deletedAt) return 0;
    const now = new Date();
    const deletedDate = new Date(deletedAt);
    return Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Calcular dias restantes para exclusão automática
  const calculateDaysUntilRemoval = (deletedAt: string | undefined) => {
    const daysInTrash = calculateDaysInTrash(deletedAt);
    return Math.max(0, 30 - daysInTrash);
  };

  // Filtrar ferramentas por idade
  const filteredTools = deletedTools.filter(tool => {
    if (ageFilter === 'all') return true;
    const daysInTrash = calculateDaysInTrash((tool as any).deleted_at);
    const maxDays = parseInt(ageFilter);
    return daysInTrash <= maxDays;
  });

  useEffect(() => {
    fetchDeletedTools();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trash2 className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold">Lixeira de Ferramentas</h1>
            <p className="text-muted-foreground">
              Ferramentas excluídas que podem ser restauradas ou removidas permanentemente
            </p>
          </div>
        </div>
        
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
      </div>

      {filteredTools.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Trash2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Lixeira vazia</h3>
              <p className="text-muted-foreground">
                Não há ferramentas excluídas no momento.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const daysUntilRemoval = calculateDaysUntilRemoval((tool as any).deleted_at);
            const daysInTrash = calculateDaysInTrash((tool as any).deleted_at);
            
            return (
            <Card key={tool.id} className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {tool.logo_url && (
                      <img 
                        src={tool.logo_url} 
                        alt={tool.name}
                        className="w-10 h-10 object-contain rounded flex-shrink-0 opacity-60"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate opacity-75" title={tool.name}>
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        ID: {tool.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="destructive" className="text-xs">
                      Excluída
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {daysUntilRemoval > 0 ? `Remove em: ${daysUntilRemoval}d` : 'Remoção pendente'}
                    </Badge>
                  </div>
                </div>
                
                {tool.category && (
                  <Badge variant="outline" className="w-fit text-xs opacity-60">
                    {tool.category}
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                {tool.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 opacity-75">
                    {tool.description}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRestore(Number(tool.id), tool.name)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={isDeleting}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restaurar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Excluir Permanentemente
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>
                            Tem certeza que deseja excluir permanentemente a ferramenta{' '}
                            <span className="font-semibold text-foreground">"{tool.name}"</span>?
                          </p>
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <p className="text-sm font-medium text-destructive mb-1">
                              ⚠️ Esta ação é irreversível!
                            </p>
                            <p className="text-sm text-muted-foreground">
                              A ferramenta será removida permanentemente do sistema e não poderá ser recuperada.
                            </p>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handlePermanentDelete(Number(tool.id))}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          Excluir Permanentemente
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ToolsTrash;