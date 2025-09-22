import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const unifiedInputVariants = cva(
  'admin-input flex h-10 w-full px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--admin-text-subtle))] disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        search: 'pl-10',
      },
      inputSize: {
        default: 'h-10',
        sm: 'h-8 text-xs',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface UnifiedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof unifiedInputVariants> {}

const UnifiedInput = React.forwardRef<HTMLInputElement, UnifiedInputProps>(
  ({ className, variant, inputSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(unifiedInputVariants({ variant, inputSize }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
UnifiedInput.displayName = 'UnifiedInput';

export { UnifiedInput, unifiedInputVariants };