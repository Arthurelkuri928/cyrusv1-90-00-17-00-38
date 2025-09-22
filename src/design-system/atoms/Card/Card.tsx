
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: '',
        cyrus: 'bg-[#1A1A1A] border-[#A259FF]/20 hover:border-[#A259FF]/40 transition-all duration-300',
        glass: 'glass-card',
        'glass-subtle': 'glass-card-subtle',
        'glass-strong': 'glass-card-strong',
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
        none: 'p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size }),
        hover && 'hover:shadow-lg transition-shadow',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export { Card, cardVariants };
