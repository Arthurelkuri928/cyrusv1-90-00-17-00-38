
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const loaderVariants = cva(
  'animate-spin',
  {
    variants: {
      variant: {
        default: 'text-primary',
        cyrus: 'text-[#A259FF]',
        white: 'text-white',
        muted: 'text-muted-foreground',
      },
      size: {
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  text?: string;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, variant, size, text, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn(loaderVariants({ variant, size }))} />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  )
);

Loader.displayName = 'Loader';

export { Loader, loaderVariants };
