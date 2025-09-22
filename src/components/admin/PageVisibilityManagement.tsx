import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { usePermissions } from '@/hooks/usePermissions';
import { Eye, EyeOff, Settings, Users, RefreshCw, Bug, CheckCircle, AlertCircle, Table, List } from 'lucide-react';
import { toast } from 'sonner';
import PageVisibilityDashboard from './PageVisibilityDashboard';
import PageVisibilityTable from './PageVisibilityTable';
import PageVisibilityCompact from './PageVisibilityCompact';
import { usePageVisibilityView, PageViewMode } from '@/hooks/usePageVisibilityView';
import { useState, useEffect } from 'react';

const PageVisibilityManagement = () => {
  const { 
    pages, 
    loading, 
    updatePageVisibility, 
    refetch, 
    debugAdminStatus,
    isRealtimeConnected 
  } = usePageVisibility();

  const { can, isLoading: permissionsLoading } = usePermissions();
  const { viewMode, setViewMode } = usePageVisibilityView();
  const [updatingPages, setUpdatingPages] = useState<Set<string>>(new Set());
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  // Verificações de permissão
  const canViewPages = can('view_pages');
  const canEditPages = can('edit_pages');

  // Listener para mudanças em tempo real
  useEffect(() => {
    const handleVisibilityChange = (event: CustomEvent) => {
      console.log('🔔 [PAINEL ADMIN] Mudança detectada via evento:', event.detail);
      setLastUpdateTime(Date.now());
      
      toast.success('Configuração atualizada!', {
        description: `A página foi ${event.detail.newValue ? 'ativada' : 'desativada'} em tempo real.`,
        icon: <CheckCircle className="h-4 w-4" />
      });
    };

    window.addEventListener('pageVisibilityChanged', handleVisibilityChange as EventListener);
    window.addEventListener('pageVisibilityUpdated', handleVisibilityChange as EventListener);

    return () => {
      window.removeEventListener('pageVisibilityChanged', handleVisibilityChange as EventListener);
      window.removeEventListener('pageVisibilityUpdated', handleVisibilityChange as EventListener);
    };
  }, []);

  console.log('🎛️ [PAINEL ADMIN] PageVisibilityManagement renderizado:', {
    loading,
    permissionsLoading,
    pagesCount: pages.length,
    isRealtimeConnected,
    canViewPages,
    canEditPages,
    lastUpdateTime,
    pages: pages.map(p => ({ name: p.name, slug: p.slug, is_visible: p.is_visible }))
  });

  // Se as permissões ainda estão carregando
  if (permissionsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader variant="spinner" size="md" />
          <span className="ml-2 text-muted-foreground">Verificando permissões...</span>
        </CardContent>
      </Card>
    );
  }

  // Se não tem permissão para ver páginas
  if (!canViewPages) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <Settings className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">Acesso Negado</h3>
              <p className="text-sm text-red-400">
                Você não tem permissão para visualizar o gerenciamento de páginas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    console.log('⏳ [PAINEL ADMIN] Carregando dados das páginas...');
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader variant="spinner" size="md" />
          <span className="ml-2 text-muted-foreground">Carregando configurações...</span>
        </CardContent>
      </Card>
    );
  }

  const handleToggleVisibility = async (pageId: string, currentVisibility: boolean) => {
    if (!canEditPages) {
      toast.error('Você não tem permissão para editar páginas', {
        description: 'Apenas usuários com permissão adequada podem alterar a visibilidade das páginas.'
      });
      return;
    }

    const newVisibility = !currentVisibility;
    const page = pages.find(p => p.id === pageId);
    
    setUpdatingPages(prev => new Set(prev).add(pageId));
    
    console.log(`🔄 [PAINEL ADMIN] Toggle iniciado para ${page?.name}:`, {
      pageId,
      currentVisibility,
      newVisibility,
      pageData: page,
      canEditPages
    });
    
    try {
      const result = await updatePageVisibility(pageId, newVisibility);
      
      if (result.success) {
        toast.success(
          `Página ${newVisibility ? 'ativada' : 'desativada'} com sucesso!`,
          {
            description: `"${page?.name}" foi ${newVisibility ? 'habilitada' : 'desabilitada'}. A mudança será aplicada em tempo real para todos os usuários.`,
            icon: <CheckCircle className="h-4 w-4" />,
            duration: 4000
          }
        );
        
        setLastUpdateTime(Date.now());
      } else {
        console.error('❌ [PAINEL ADMIN] FALHA na atualização:', result.error);
        toast.error('Erro ao atualizar visibilidade da página', {
          description: result.error || 'Tente novamente. Verifique suas permissões.',
          icon: <AlertCircle className="h-4 w-4" />
        });
      }
    } catch (error) {
      console.error('💥 [PAINEL ADMIN] Erro no handleToggleVisibility:', error);
      toast.error('Erro inesperado no sistema', {
        description: 'Ocorreu um erro inesperado. Verifique o console para detalhes.',
        icon: <AlertCircle className="h-4 w-4" />
      });
    } finally {
      setUpdatingPages(prev => {
        const newSet = new Set(prev);
        newSet.delete(pageId);
        return newSet;
      });
    }
  };

  const handleDebugAdmin = async () => {
    console.log('🔍 [DEBUG] Botão de debug clicado...');
    await debugAdminStatus();
    toast.info('Status de admin verificado - veja o console para detalhes');
  };

  const handleRefresh = async () => {
    console.log('🔄 [PAINEL ADMIN] Refresh manual solicitado...');
    await refetch();
    toast.success('Dados atualizados!', {
      description: 'As configurações foram recarregadas do banco de dados.'
    });
  };

  const visiblePages = pages.filter(p => p.is_visible).length;
  const totalPages = pages.length;

  const renderPageView = () => {
    const commonProps = {
      pages,
      updatingPages,
      canEditPages,
      onToggleVisibility: handleToggleVisibility
    };

    switch (viewMode) {
      case 'table':
        return <PageVisibilityTable {...commonProps} />;
      case 'compact':
        return <PageVisibilityCompact {...commonProps} />;
      default:
        return <PageVisibilityTable {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard de Estatísticas das Páginas */}
      <PageVisibilityDashboard />

      {/* Controles de visualização */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="gap-2"
            >
              <Table className="h-4 w-4" />
              Tabela
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('compact')}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Compacto
            </Button>
          </div>
          {!canEditPages && (
            <div className="mt-3 text-center text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 p-2 rounded">
              ⚠️ Visualização apenas - sem permissão para editar
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visualização das páginas */}
      {renderPageView()}

      {pages.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Nenhuma página encontrada na base de dados.</p>
            <Button variant="outline" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Recarregar dados
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PageVisibilityManagement;
