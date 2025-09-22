
import React, { useEffect, useState, useMemo } from 'react';
import { SupabaseToolsRepository } from '@/infrastructure/repositories/tools.repository';
import { Tool } from '@/shared/types/tool';
import { toast } from 'sonner';
import { 
  UnifiedAdminCard, 
  UnifiedAdminCardHeader, 
  UnifiedAdminCardTitle, 
  UnifiedAdminCardContent,
  UnifiedButton,
  UnifiedBadge,
  AdminActionButtons,
  AdminStatsCard
} from '@/design-system';
import { usePermissions } from '@/hooks/usePermissions';
import { useToolsStore } from '@/app/store/tools.store';
import { useToolManagement } from '@/hooks/useToolManagement';
import { useToolsAdminFilter } from '@/hooks/useToolsAdminFilter';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeTools } from '@/hooks/useRealtimeTools';
import { Wrench, CheckCircle, XCircle, Settings, Grid3X3 } from 'lucide-react';

import ToolEditDialog from './ToolEditDialog';
import CreateToolDialog from './CreateToolDialog';
import DeleteToolDialog from './DeleteToolDialog';
import ToolsAdminHeader from './ToolsAdminHeader';
import ToolsGridView from './ToolsGridView';
import ToolsListView from './ToolsListView';

const toolsRepository = new SupabaseToolsRepository();

const ToolsManagement = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTool, setUpdatingTool] = useState<number | null>(null);
  const [deletingTool, setDeletingTool] = useState<number | null>(null);
  
  // Usar o sistema de permissões moderno
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { forceGlobalRefresh, setAdminUpdateInProgress } = useToolsStore();
  const { setAdminUpdateFlag } = useRealtimeTools();
  const { updateTool, toggleToolStatus, deleteTool, isUpdating } = useToolManagement();

  // Hook para gerenciar filtros e visualizações
  const {
    searchTerm,
    selectedCategory,
    selectedStatus,
    viewMode,
    filteredTools,
    availableCategories,
    isLoading: filterLoading,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleViewModeChange,
    resetFilters
  } = useToolsAdminFilter({ tools });

  // Verificações de permissão usando o sistema moderno
  const canViewTools = can('view_tools');
  const canEditTools = can('edit_tools');
  const canCreateTools = can('create_tools');
  const canDeleteTools = can('delete_tools');

  console.log('🔧 [ToolsManagement] Modo de visualização atual:', viewMode);
  console.log('🔧 [ToolsManagement] Permissões verificadas:', {
    canViewTools,
    canEditTools,
    canCreateTools,
    canDeleteTools,
    permissionsLoading
  });

  // Dynamically extract categories from tools for compatibility
  const realCategories = useMemo(() => {
    return availableCategories.map(cat => ({
      value: cat.value,
      label: cat.label,
      originalValue: cat.label
    }));
  }, [availableCategories]);

  useEffect(() => {
    // Só carregar se as permissões foram verificadas e o usuário pode ver ferramentas
    if (!permissionsLoading && canViewTools) {
      fetchTools();
    } else if (!permissionsLoading && !canViewTools) {
      console.log('🚫 Usuário não tem permissão para ver ferramentas');
      setLoading(false);
    }
  }, [canViewTools, permissionsLoading]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const fetchedTools = await toolsRepository.getAll();
      console.log('🔄 Ferramentas carregadas do Supabase para Admin Panel:', fetchedTools.length);
      
      const sortedTools = fetchedTools.sort((a, b) => Number(a.id) - Number(b.id));
      console.log('📋 Ferramentas ordenadas por ID:', sortedTools.map(t => `ID:${t.id} - ${t.name}`));
      
      setTools(sortedTools);
    } catch (error) {
      console.error('❌ Erro ao buscar ferramentas:', error);
      toast.error('Erro ao carregar ferramentas');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTool = async (toolId: number) => {
    if (!canDeleteTools) {
      toast.error('Você não tem permissão para deletar ferramentas');
      return;
    }

    try {
      setDeletingTool(toolId);
      await deleteTool(toolId);
      await fetchTools(); // Refresh after delete
    } catch (error) {
      // Error handling is done in useToolManagement
    } finally {
      setDeletingTool(null);
    }
  };

  const handleActivate = async (toolId: number) => {
    const tool = tools.find(t => Number(t.id) === toolId);
    console.log(`🟢 AÇÃO: ATIVAR - ID: ${toolId}, Nome: ${tool?.name || 'Não encontrada'}`);
    try {
      await toggleToolStatus(toolId, 'is_active', true);
      await toggleToolStatus(toolId, 'is_maintenance', false);
      await fetchTools();
    } catch (error) {
      // Error handling is done in useToolManagement
    }
  };

  const handleDeactivate = async (toolId: number) => {
    const tool = tools.find(t => Number(t.id) === toolId);
    console.log(`🔴 AÇÃO: DESATIVAR - ID: ${toolId}, Nome: ${tool?.name || 'Não encontrada'}`);
    try {
      await toggleToolStatus(toolId, 'is_active', false);
      await toggleToolStatus(toolId, 'is_maintenance', false);
      await fetchTools();
    } catch (error) {
      // Error handling is done in useToolManagement
    }
  };

  const handleMaintenance = async (toolId: number) => {
    const tool = tools.find(t => Number(t.id) === toolId);
    console.log(`🟡 AÇÃO: MANUTENÇÃO - ID: ${toolId}, Nome: ${tool?.name || 'Não encontrada'}`);
    try {
      await toggleToolStatus(toolId, 'is_active', false);
      await toggleToolStatus(toolId, 'is_maintenance', true);
      await fetchTools();
    } catch (error) {
      // Error handling is done in useToolManagement
    }
  };

  const handleSaveTool = async (updatedTool: Partial<Tool>) => {
    try {
      await updateTool(Number(updatedTool.id), updatedTool);
      await fetchTools(); // Refresh after update
    } catch (error) {
      // Error handling is done in useToolManagement
    }
  };

  const handleCreateTool = async (newTool: Partial<Tool>) => {
    if (!canCreateTools) {
      toast.error('Você não tem permissão para criar ferramentas');
      return;
    }

    try {
      console.log('🆕 Criando nova ferramenta:', newTool);
      
      setAdminUpdateInProgress(true);
      setAdminUpdateFlag(true);
      
      const createdTool = await toolsRepository.insertTool(newTool);
      
      console.log('✅ Nova ferramenta criada:', createdTool);
      
      setTools(prevTools => [...prevTools, createdTool].sort((a, b) => Number(a.id) - Number(b.id)));
      
      toast.success(`${newTool.name} criada com sucesso!`);
      
      setTimeout(() => {
        setAdminUpdateInProgress(false);
        setAdminUpdateFlag(false);
      }, 1500);
      
    } catch (error) {
      console.error('❌ Erro ao criar ferramenta:', error);
      toast.error('Erro ao criar ferramenta');
      
      setAdminUpdateInProgress(false);
      setAdminUpdateFlag(false);
    }
  };

  const getStatusBadge = (tool: Tool) => {
    if (tool.is_maintenance) {
      return <UnifiedBadge variant="warning">Em Manutenção</UnifiedBadge>;
    }
    if (tool.is_active) {
      return <UnifiedBadge variant="success">Ativa</UnifiedBadge>;
    }
    return <UnifiedBadge variant="destructive">Inativa</UnifiedBadge>;
  };

  // Calculate stats for dashboard
  const toolStats = useMemo(() => {
    const activeCount = tools.filter(t => t.is_active && !t.is_maintenance).length;
    const maintenanceCount = tools.filter(t => t.is_maintenance).length;
    const inactiveCount = tools.filter(t => !t.is_active && !t.is_maintenance).length;
    
    return {
      total: tools.length,
      active: activeCount,
      maintenance: maintenanceCount,
      inactive: inactiveCount,
      categories: realCategories.length
    };
  }, [tools, realCategories]);

  // Se as permissões ainda estão carregando
  if (permissionsLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Verificando permissões...</p>
      </div>
    );
  }

  // Se não tem permissão para ver ferramentas
  if (!canViewTools) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Acesso negado. Você não tem permissão para ver ferramentas.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando ferramentas...</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Dashboard de Estatísticas das Ferramentas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminStatsCard
          title="Total de Ferramentas"
          value={toolStats.total}
          description="No sistema"
          icon={Wrench}
        />
        <AdminStatsCard
          title="Ferramentas Ativas"
          value={toolStats.active}
          description={`${toolStats.total > 0 ? Math.round((toolStats.active / toolStats.total) * 100) : 0}% do total`}
          icon={CheckCircle}
        />
        <AdminStatsCard
          title="Ferramentas Inativas"
          value={toolStats.inactive}
          description={`${toolStats.total > 0 ? Math.round((toolStats.inactive / toolStats.total) * 100) : 0}% do total`}
          icon={XCircle}
        />
        <AdminStatsCard
          title="Em Manutenção"
          value={toolStats.maintenance}
          description={`${toolStats.total > 0 ? Math.round((toolStats.maintenance / toolStats.total) * 100) : 0}% do total`}
          icon={Settings}
        />
        <AdminStatsCard
          title="Categorias"
          value={toolStats.categories}
          description="Disponíveis"
          icon={Grid3X3}
        />
      </div>

      {/* SEMPRE mostrar o header com controles, independente da visualização */}
      <ToolsAdminHeader
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        viewMode={viewMode}
        filteredCount={filteredTools.length}
        totalCount={tools.length}
        availableCategories={availableCategories}
        canCreateTools={canCreateTools}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onViewModeChange={handleViewModeChange}
        onResetFilters={resetFilters}
        onCreateTool={handleCreateTool}
      />

      {filterLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Filtrando ferramentas...</p>
        </div>
      ) : (
        <div className="mt-6">
          {viewMode === "grid" && (
            <ToolsGridView
              tools={filteredTools}
              availableCategories={realCategories}
              updatingTool={updatingTool}
              deletingTool={deletingTool}
              canEditTools={canEditTools}
              canDeleteTools={canDeleteTools}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              onMaintenance={handleMaintenance}
              onSaveTool={handleSaveTool}
              onDeleteTool={handleDeleteTool}
            />
          )}
          {viewMode === "list" && (
            <ToolsListView
              tools={filteredTools}
              availableCategories={realCategories}
              updatingTool={updatingTool}
              deletingTool={deletingTool}
              canEditTools={canEditTools}
              canDeleteTools={canDeleteTools}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              onMaintenance={handleMaintenance}
              onSaveTool={handleSaveTool}
              onDeleteTool={handleDeleteTool}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ToolsManagement;
