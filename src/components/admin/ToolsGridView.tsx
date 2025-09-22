
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Power, Wrench } from 'lucide-react';
import { Tool } from '@/shared/types/tool';
import ToolEditDialog from './ToolEditDialog';
import DeleteToolDialog from './DeleteToolDialog';
import { cn } from '@/lib/utils';

interface ToolsGridViewProps {
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

const ToolsGridView: React.FC<ToolsGridViewProps> = ({
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
  const getStatusBadge = (tool: Tool) => {
    if (tool.is_maintenance) {
      return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Em Manutenção</Badge>;
    }
    if (tool.is_active) {
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Ativa</Badge>;
    }
    return <Badge className="bg-red-500 text-white hover:bg-red-600">Inativa</Badge>;
  };

  const handleSwitchChange = (tool: Tool, checked: boolean) => {
    if (checked && !tool.is_active) {
      onActivate(Number(tool.id));
    } else if (!checked && tool.is_active) {
      onDeactivate(Number(tool.id));
    }
  };

  const getCardBorderColor = (tool: Tool) => {
    if (tool.is_maintenance) return "border-orange-200 dark:border-orange-800";
    if (tool.is_active) return "border-green-200 dark:border-green-800";
    return "border-red-200 dark:border-red-800";
  };

  if (tools.length === 0) {
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tools.map((tool) => {
        const toolIdNumber = Number(tool.id);
        const isUpdating = updatingTool === toolIdNumber;
        const isDeleting = deletingTool === toolIdNumber;

        return (
          <Card 
            key={`tool-grid-${toolIdNumber}`} 
            className={`relative transition-all hover:shadow-md ${getCardBorderColor(tool)}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {tool.logo_url && (
                    <img 
                      src={tool.logo_url} 
                      alt={tool.name}
                      className="w-10 h-10 object-contain rounded flex-shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm truncate" title={tool.name}>
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      ID: {tool.id}
                    </p>
                  </div>
                </div>
                {getStatusBadge(tool)}
              </div>
              
              {tool.category && (
                <Badge variant="outline" className="w-fit text-xs">
                  {tool.category}
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="pt-0">
              {tool.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {tool.description}
                </p>
              )}
              
              <div className="space-y-3 mb-4">
                {canEditTools && (
                  <>
                    {/* Switch para Ativar/Desativar */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Power className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {tool.is_active && !tool.is_maintenance ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <Switch
                        checked={tool.is_active && !tool.is_maintenance}
                        onCheckedChange={(checked) => handleSwitchChange(tool, checked)}
                        disabled={isUpdating || isDeleting}
                        className={cn(
                          "transition-colors duration-200",
                          tool.is_active && !tool.is_maintenance 
                            ? "data-[state=checked]:bg-green-500" 
                            : "data-[state=unchecked]:bg-red-500"
                        )}
                      />
                    </div>
                    
                    {/* Botão de Manutenção */}
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
                      className="w-full text-xs h-8 bg-orange-500 hover:bg-orange-600 text-white border-0"
                    >
                      <Wrench className="h-3 w-3 mr-1" />
                      {isUpdating ? 'Atualizando...' : (tool.is_maintenance ? 'Sair Manutenção' : 'Manutenção')}
                    </Button>
                  </>
                )}
              </div>
              
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ToolsGridView;
