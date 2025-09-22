import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const unifiedAdminCardVariants = cva(
  'admin-card',
  {
    variants: {
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
        none: 'p-0',
      },
      variant: {
        default: '',
        elevated: 'shadow-lg hover:shadow-xl',
        interactive: 'cursor-pointer hover:scale-[1.02]',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface UnifiedAdminCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof unifiedAdminCardVariants> {}

const UnifiedAdminCard = React.forwardRef<HTMLDivElement, UnifiedAdminCardProps>(
  ({ className, size, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(unifiedAdminCardVariants({ size, variant }), className)}
      {...props}
    />
  )
);

UnifiedAdminCard.displayName = 'UnifiedAdminCard';

const UnifiedAdminCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
UnifiedAdminCardHeader.displayName = 'UnifiedAdminCardHeader';

const UnifiedAdminCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold text-[hsl(var(--admin-text))]', className)}
    {...props}
  />
));
UnifiedAdminCardTitle.displayName = 'UnifiedAdminCardTitle';

const UnifiedAdminCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[hsl(var(--admin-text-muted))]', className)}
    {...props}
  />
));
UnifiedAdminCardDescription.displayName = 'UnifiedAdminCardDescription';

const UnifiedAdminCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
UnifiedAdminCardContent.displayName = 'UnifiedAdminCardContent';

const UnifiedAdminCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
UnifiedAdminCardFooter.displayName = 'UnifiedAdminCardFooter';

export {
  UnifiedAdminCard,
  UnifiedAdminCardHeader,
  UnifiedAdminCardTitle,
  UnifiedAdminCardDescription,
  UnifiedAdminCardContent,
  UnifiedAdminCardFooter,
  unifiedAdminCardVariants,
};