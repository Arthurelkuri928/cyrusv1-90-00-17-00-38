
import React from 'react';
import { Search, Grid, List, Plus, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CreateToolDialog from './CreateToolDialog';
import { Tool } from '@/shared/types/tool';

interface ToolsAdminHeaderProps {
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  viewMode: "grid" | "list";
  filteredCount: number;
  totalCount: number;
  availableCategories: Array<{ value: string; label: string; originalValue: string }>;
  canCreateTools: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onResetFilters: () => void;
  onCreateTool: (tool: Partial<Tool>) => Promise<void>;
}

const ToolsAdminHeader: React.FC<ToolsAdminHeaderProps> = ({
  searchTerm,
  selectedCategory,
  selectedStatus,
  viewMode,
  filteredCount,
  totalCount,
  availableCategories,
  canCreateTools,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onViewModeChange,
  onResetFilters,
  onCreateTool
}) => {
  const statusOptions = [
    { value: "all", label: "Todos os Status" },
    { value: "active", label: "Ativa" },
    { value: "inactive", label: "Inativa" },
    { value: "maintenance", label: "Em Manutenção" }
  ];

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedStatus !== "all";

  return (
    <div className="space-y-6">
      {/* Título e contador */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Gerenciamento de Ferramentas
          </h2>
          <p className="text-muted-foreground">
            Mostrando <span className="font-semibold text-foreground">{filteredCount}</span> de{" "}
            <span className="font-semibold text-foreground">{totalCount}</span> ferramentas
          </p>
        </div>
        
        {canCreateTools && (
          <CreateToolDialog 
            onSave={onCreateTool} 
            availableCategories={availableCategories}
          />
        )}
      </div>

      {/* Controles de pesquisa e filtros */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Campo de pesquisa */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Pesquisar ferramentas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por categoria */}
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro por status */}
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Botão para limpar filtros */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Toggle de visualização */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-8 px-3"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-8 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Badges de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              "{searchTerm}"
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {availableCategories.find(c => c.value === selectedCategory)?.label}
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {statusOptions.find(s => s.value === selectedStatus)?.label}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolsAdminHeader;
