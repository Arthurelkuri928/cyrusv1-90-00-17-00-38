import React, { useMemo } from 'react';
import { Users, UserCheck, UserX, AlertTriangle, Globe } from 'lucide-react';
import { AdminStatsCard } from '@/design-system';

interface UsersDashboardProps {
  users: any[];
  totalUsers: number;
}

const UsersDashboard: React.FC<UsersDashboardProps> = ({ users, totalUsers }) => {
  // Calculate stats for dashboard
  const userStats = useMemo(() => {
    const activeCount = users.filter(u => u.subscription_status === 'active').length;
    const expiredCount = users.filter(u => u.subscription_status === 'expired').length;
    const suspendedCount = users.filter(u => u.subscription_status === 'suspended').length;
    
    return {
      total: totalUsers,
      active: activeCount,
      expired: expiredCount,
      suspended: suspendedCount,
      activePercentage: totalUsers > 0 ? Math.round((activeCount / totalUsers) * 100) : 0
    };
  }, [users, totalUsers]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminStatsCard
        title="Total de Usuários"
        value={userStats.total}
        description="No sistema"
        icon={Users}
      />
      <AdminStatsCard
        title="Usuários Ativos"
        value={userStats.active}
        description={`${userStats.activePercentage}% do total`}
        icon={UserCheck}
      />
      <AdminStatsCard
        title="Usuários Expirados"
        value={userStats.expired}
        description={`${userStats.total > 0 ? Math.round((userStats.expired / userStats.total) * 100) : 0}% do total`}
        icon={UserX}
      />
      <AdminStatsCard
        title="Usuários Suspensos"
        value={userStats.suspended}
        description={`${userStats.total > 0 ? Math.round((userStats.suspended / userStats.total) * 100) : 0}% do total`}
        icon={AlertTriangle}
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

export default UsersDashboard;