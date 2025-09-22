import React, { useMemo } from 'react';
import { Eye, EyeOff, Users, Database, Globe } from 'lucide-react';
import { AdminStatsCard } from '@/design-system';
import { usePageVisibility } from '@/hooks/usePageVisibility';

const PageVisibilityDashboard = () => {
  const { pages, isRealtimeConnected } = usePageVisibility();

  // Calculate stats for dashboard
  const pageStats = useMemo(() => {
    const visibleCount = pages.filter(p => p.is_visible).length;
    const hiddenCount = pages.filter(p => !p.is_visible).length;
    
    return {
      total: pages.length,
      visible: visibleCount,
      hidden: hiddenCount,
      visibilityPercentage: pages.length > 0 ? Math.round((visibleCount / pages.length) * 100) : 0
    };
  }, [pages]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminStatsCard
        title="Total de Páginas"
        value={pageStats.total}
        description="No sistema"
        icon={Database}
      />
      <AdminStatsCard
        title="Páginas Visíveis"
        value={pageStats.visible}
        description={`${pageStats.visibilityPercentage}% do total`}
        icon={Eye}
      />
      <AdminStatsCard
        title="Páginas Ocultas"
        value={pageStats.hidden}
        description={`${100 - pageStats.visibilityPercentage}% do total`}
        icon={EyeOff}
      />
      <AdminStatsCard
        title="Status do Sistema"
        value={isRealtimeConnected ? "Online" : "Offline"}
        description={isRealtimeConnected ? "Tempo real ativo" : "Reconectando..."}
        icon={Globe}
      />
      <AdminStatsCard
        title="Usuários Afetados"
        value="Todos"
        description="Mudanças globais"
        icon={Users}
      />
    </div>
  );
};

export default PageVisibilityDashboard;