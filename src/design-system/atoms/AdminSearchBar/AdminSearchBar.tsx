import React from 'react';
import { Search } from 'lucide-react';
import { UnifiedInput } from '../UnifiedInput/UnifiedInput';
import { cn } from '@/lib/utils';

export interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const AdminSearchBar = React.forwardRef<HTMLDivElement, AdminSearchBarProps>(
  ({ value, onChange, placeholder = "Buscar...", className }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-text-subtle))]" />
        <UnifiedInput
          variant="search"
          inputSize="default"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
    );
  }
);
AdminSearchBar.displayName = 'AdminSearchBar';

export { AdminSearchBar };