
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const baseCardVariants = cva(
  'rounded-2xl transition-all duration-300 ease-in-out relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-card border border-border shadow-sm',
        cyrus: 'bg-[#1A1A1A] border border-[#A259FF]/20 shadow-sm',
        glass: 'glass-card',
        'glass-subtle': 'glass-card-subtle',
        'glass-strong': 'glass-card-strong',
        'empty-state': 'bg-background/60 backdrop-blur-xl border border-border shadow-lg dark:bg-zinc-800/40 dark:border-zinc-700 light:bg-white light:border-gray-200 light:shadow-black/10',
        admin: 'bg-background/60 backdrop-blur-xl border border-border shadow-lg dark:bg-zinc-800/40 dark:border-zinc-700 light:bg-white light:border-gray-200 light:shadow-black/10',
        subscription: 'bg-background/60 backdrop-blur-xl border border-border shadow-lg dark:bg-zinc-800/40 dark:border-zinc-700 light:bg-white light:border-gray-200 light:shadow-black/10',
        profile: 'bg-background/60 backdrop-blur-xl border border-border shadow-lg dark:bg-zinc-800/40 dark:border-zinc-700 light:bg-white light:border-gray-200 light:shadow-black/10',
        settings: 'bg-background/60 backdrop-blur-xl border border-border shadow-lg dark:bg-zinc-800/40 dark:border-zinc-700 light:bg-white light:border-gray-200 light:shadow-black/10',
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
        xl: 'p-10',
        none: 'p-0',
        'empty-state': 'py-24 px-6',
      },
      hover: {
        none: '',
        subtle: 'hover:scale-[1.01]',
        moderate: 'hover:scale-[1.02]',
        strong: 'hover:scale-105',
      },
      borderColor: {
        default: '',
        purple: 'border-[#A259FF]/30',
        green: 'border-green-500/30',
        blue: 'border-blue-500/30',
        red: 'border-red-500/30',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hover: 'none',
      borderColor: 'default',
    },
  }
);

export interface BaseCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof baseCardVariants> {
  children: React.ReactNode;
}

const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, variant, size, hover, borderColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          baseCardVariants({ variant, size, hover, borderColor }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BaseCard.displayName = 'BaseCard';

export { BaseCard, baseCardVariants };
