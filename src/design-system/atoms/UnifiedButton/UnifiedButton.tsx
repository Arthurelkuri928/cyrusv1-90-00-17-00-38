import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const unifiedButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'admin-button-primary',
        secondary: 'admin-button-secondary',
        success: 'admin-button-success',
        destructive: 'admin-button-destructive',
        warning: 'bg-[hsl(var(--admin-warning))] text-white border border-[hsl(var(--admin-warning))] hover:bg-[hsl(var(--admin-warning-hover))] hover:transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_hsl(var(--admin-warning)/0.3)] rounded-[10px] font-medium',
        outline: 'border border-[hsl(var(--admin-border))] bg-transparent text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-card-hover))] hover:border-[hsl(var(--admin-accent)/0.5)] rounded-[10px]',
        ghost: 'text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-card-hover))] rounded-[10px]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface UnifiedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof unifiedButtonVariants> {
  asChild?: boolean;
}

const UnifiedButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'button';
    return (
      <Comp
        className={cn(unifiedButtonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
UnifiedButton.displayName = 'UnifiedButton';

export { UnifiedButton, unifiedButtonVariants };