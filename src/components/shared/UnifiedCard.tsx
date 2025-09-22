
import React from 'react';
import { BaseCard, BaseCardProps } from '@/design-system';
import { cn } from '@/lib/utils';

interface UnifiedCardProps extends Omit<BaseCardProps, 'variant'> {
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
  variant?: 'default' | 'admin' | 'settings' | 'profile' | 'subscription' | 'empty-state';
}

const UnifiedCard = React.forwardRef<HTMLDivElement, UnifiedCardProps>(
  ({ 
    title, 
    description, 
    headerAction, 
    children, 
    className, 
    variant = 'default',
    size,
    hover,
    ...props 
  }, ref) => {
    
    // Auto-adjust size for empty-state variant
    const cardSize = variant === 'empty-state' ? 'empty-state' : (size || 'default');
    
    return (
      <BaseCard
        ref={ref}
        className={cn("w-full", className)}
        variant={variant}
        size={cardSize}
        hover={hover}
        {...props}
      >
        {/* Inner content container with proper z-index for empty-state */}
        <div className={cn(
          variant === 'empty-state' ? 'relative z-10' : '',
          variant === 'empty-state' ? 'text-center' : ''
        )}>
          {(title || description || headerAction) && (
            <div className="mb-6 pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {title && (
                    <h3 className={cn(
                      "font-semibold text-foreground mb-1",
                      variant === 'empty-state' ? 'text-xl text-muted-foreground mb-2' : 'text-lg'
                    )}>
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className={cn(
                      "text-muted-foreground",
                      variant === 'empty-state' ? 'mb-6' : 'text-sm'
                    )}>
                      {description}
                    </p>
                  )}
                </div>
                {headerAction && (
                  <div className="ml-4">
                    {headerAction}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className={cn(
            variant === 'empty-state' ? '' : 'space-y-4'
          )}>
            {children}
          </div>
        </div>
      </BaseCard>
    );
  }
);

UnifiedCard.displayName = 'UnifiedCard';

export { UnifiedCard };
