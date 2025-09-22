import React from 'react';
import { LucideIcon } from 'lucide-react';
import { UnifiedAdminCard, UnifiedAdminCardContent, UnifiedAdminCardHeader, UnifiedAdminCardTitle } from '../../atoms/UnifiedAdminCard/UnifiedAdminCard';
import { cn } from '@/lib/utils';

export interface AdminStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
}

const AdminStatsCard = React.forwardRef<HTMLDivElement, AdminStatsCardProps>(
  ({ title, value, description, icon: Icon, trend, className }, ref) => {
    return (
      <UnifiedAdminCard ref={ref} className={cn('relative overflow-hidden', className)}>
        <UnifiedAdminCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <UnifiedAdminCardTitle className="text-sm font-medium text-[hsl(var(--admin-text-muted))]">
            {title}
          </UnifiedAdminCardTitle>
          {Icon && (
            <Icon className="h-4 w-4 text-[hsl(var(--admin-accent))]" />
          )}
        </UnifiedAdminCardHeader>
        <UnifiedAdminCardContent>
          <div className="text-2xl font-bold text-[hsl(var(--admin-text))]">{value}</div>
          {(description || trend) && (
            <div className="flex items-center gap-2 mt-1">
              {trend && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive
                      ? 'text-[hsl(var(--admin-success))]'
                      : 'text-[hsl(var(--admin-destructive))]'
                  )}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}% {trend.label}
                </span>
              )}
              {description && (
                <p className="text-xs text-[hsl(var(--admin-text-muted))]">
                  {description}
                </p>
              )}
            </div>
          )}
        </UnifiedAdminCardContent>
      </UnifiedAdminCard>
    );
  }
);
AdminStatsCard.displayName = 'AdminStatsCard';

export { AdminStatsCard };