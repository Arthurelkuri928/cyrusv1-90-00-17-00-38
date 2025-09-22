import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const unifiedBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[hsl(var(--admin-accent))] text-white',
        secondary: 'border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-card))] text-[hsl(var(--admin-text))]',
        success: 'border-transparent bg-[hsl(var(--admin-success))] text-white',
        destructive: 'border-transparent bg-[hsl(var(--admin-destructive))] text-white',
        warning: 'border-transparent bg-[hsl(var(--admin-warning))] text-white',
        outline: 'border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]',
        accent: 'border-transparent bg-gradient-to-r from-[hsl(var(--admin-accent))] to-[hsl(var(--cyrus-primary-light))] text-white',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface UnifiedBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof unifiedBadgeVariants> {}

const UnifiedBadge = React.forwardRef<HTMLDivElement, UnifiedBadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(unifiedBadgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
UnifiedBadge.displayName = 'UnifiedBadge';

export { UnifiedBadge, unifiedBadgeVariants };