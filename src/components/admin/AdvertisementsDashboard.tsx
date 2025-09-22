import React, { useMemo } from 'react';
import { Megaphone, Play, Pause, Calendar, Globe } from 'lucide-react';
import { AdminStatsCard } from '@/design-system';

interface AdvertisementsDashboardProps {
  advertisements: any[];
}

const AdvertisementsDashboard: React.FC<AdvertisementsDashboardProps> = ({ advertisements }) => {
  // Calculate stats for dashboard
  const adStats = useMemo(() => {
    const activeCount = advertisements.filter(ad => ad.is_active).length;
    const inactiveCount = advertisements.filter(ad => !ad.is_active).length;
    const scheduledCount = advertisements.filter(ad => ad.start_date && new Date(ad.start_date) > new Date()).length;
    
    return {
      total: advertisements.length,
      active: activeCount,
      inactive: inactiveCount,
      scheduled: scheduledCount,
      activePercentage: advertisements.length > 0 ? Math.round((activeCount / advertisements.length) * 100) : 0
    };
  }, [advertisements]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminStatsCard
        title="Total de Anúncios"
        value={adStats.total}
        description="No sistema"
        icon={Megaphone}
      />
      <AdminStatsCard
        title="Anúncios Ativos"
        value={adStats.active}
        description={`${adStats.activePercentage}% do total`}
        icon={Play}
      />
      <AdminStatsCard
        title="Anúncios Inativos"
        value={adStats.inactive}
        description={`${100 - adStats.activePercentage}% do total`}
        icon={Pause}
      />
      <AdminStatsCard
        title="Programados"
        value={adStats.scheduled}
        description="Para exibição futura"
        icon={Calendar}
      />
      <AdminStatsCard
        title="Status do Sistema"
        value="Online"
        description="Tempo real ativo"
        icon={Globe}
      />
    </div>
  );
};

export default AdvertisementsDashboard;