
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, ArrowUpDown } from 'lucide-react';
import { Tool } from '@/shared/types/tool';
import ToolEditDialog from './ToolEditDialog';
import DeleteToolDialog from './DeleteToolDialog';

interface ToolsListViewProps {
  tools: Tool[];
  availableCategories: Array<{ value: string; label: string; originalValue: string }>;
  updatingTool: number | null;
  deletingTool: number | null;
  canEditTools: boolean;
  canDeleteTools: boolean;
  onActivate: (toolId: number) => void;
  onDeactivate: (toolId: number) => void;
  onMaintenance: (toolId: number) => void;
  onSaveTool: (tool: Partial<Tool>) => Promise<void>;
  onDeleteTool: (toolId: number) => void;
}

const ToolsListView: React.FC<ToolsListViewProps> = ({
  tools,
  availableCategories,
  updatingTool,
  deletingTool,
  canEditTools,
  canDeleteTools,
  onActivate,
  onDeactivate,
  onMaintenance,
  onSaveTool,
  onDeleteTool
}) => {
  const [sortBy, setSortBy] = useState<string>('default');

  const sortedTools = useMemo(() => {
    let sorted = [...tools];
    
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => Number(a.id) - Number(b.id));
      case 'newest':
        return sorted.sort((a, b) => Number(b.id) - Number(a.id));
      case 'maintenance':
        return sorted.sort((a, b) => {
          if (a.is_maintenance && !b.is_maintenance) return -1;
          if (!a.is_maintenance && b.is_maintenance) return 1;
          return 0;
        });
      case 'active':
        return sorted.sort((a, b) => {
          const aActive = a.is_active && !a.is_maintenance;
          const bActive = b.is_active && !b.is_maintenance;
          if (aActive && !bActive) return -1;
          if (!aActive && bActive) return 1;
          return 0;
        });
      case 'inactive':
        return sorted.sort((a, b) => {
          const aInactive = !a.is_active && !a.is_maintenance;
          const bInactive = !b.is_active && !b.is_maintenance;
          if (aInactive && !bInactive) return -1;
          if (!aInactive && bInactive) return 1;
          return 0;
        });
      default:
        return sorted;
    }
  }, [tools, sortBy]);
  const getStatusBadge = (tool: Tool) => {
    if (tool.is_maintenance) {
      return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Em Manutenção</Badge>;
    }
    if (tool.is_active) {
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Ativada</Badge>;
    }
    return <Badge className="bg-red-500 text-white hover:bg-red-600">Inativa</Badge>;
  };

  if (sortedTools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhuma ferramenta encontrada
        </h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros ou termo de pesquisa
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ferramenta</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                Status
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] h-8">
                    <div className="flex items-center gap-1">
                      <ArrowUpDown className="h-3 w-3" />
                      <SelectValue placeholder="Ordenar" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="oldest">Mais Antiga</SelectItem>
                    <SelectItem value="newest">Mais Recente</SelectItem>
                    <SelectItem value="maintenance">Em Manutenção</SelectItem>
                    <SelectItem value="active">Ativadas</SelectItem>
                    <SelectItem value="inactive">Inativas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TableHead>
            <TableHead>Ações Rápidas</TableHead>
            <TableHead>Gerenciar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTools.map((tool) => {
            const toolIdNumber = Number(tool.id);
            const isUpdating = updatingTool === toolIdNumber;
            const isDeleting = deletingTool === toolIdNumber;

            return (
              <TableRow key={`tool-list-${toolIdNumber}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {tool.logo_url && (
                      <img 
                        src={tool.logo_url} 
                        alt={tool.name}
                        className="w-8 h-8 object-contain rounded"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {tool.id}</div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  {tool.category && (
                    <Badge variant="outline">
                      {tool.category}
                    </Badge>
                  )}
                </TableCell>
                
                <TableCell>
                  {getStatusBadge(tool)}
                </TableCell>
                
                <TableCell>
                  {canEditTools && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={tool.is_active && !tool.is_maintenance}
                          disabled={isUpdating || isDeleting || tool.is_maintenance}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              onActivate(toolIdNumber);
                            } else {
                              onDeactivate(toolIdNumber);
                            }
                          }}
                          className={`
                            data-[state=checked]:bg-green-500 
                            data-[state=unchecked]:bg-red-500
                            data-[state=checked]:border-green-500
                            data-[state=unchecked]:border-red-500
                          `}
                        />
                        <span className="text-xs text-muted-foreground">
                          {tool.is_active && !tool.is_maintenance ? 'Ativada' : 'Inativa'}
                        </span>
                      </div>
                      
                      <Button
                        onClick={() => {
                          if (tool.is_maintenance) {
                            // Se está em manutenção, ativar a ferramenta
                            onActivate(toolIdNumber);
                          } else {
                            // Se não está em manutenção, colocar em manutenção
                            onMaintenance(toolIdNumber);
                          }
                        }}
                        disabled={isUpdating || isDeleting}
                        size="sm"
                        className="h-7 px-2 bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                        title={tool.is_maintenance ? "Tirar de manutenção" : "Colocar em manutenção"}
                      >
                        <Wrench className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex gap-1">
                    {canEditTools && (
                      <ToolEditDialog 
                        tool={tool} 
                        onSave={onSaveTool}
                        isUpdating={isUpdating}
                        availableCategories={availableCategories}
                      />
                    )}
                    
                    {canDeleteTools && (
                      <DeleteToolDialog
                        tool={tool}
                        onDelete={onDeleteTool}
                        isDeleting={isDeleting}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ToolsListView;
