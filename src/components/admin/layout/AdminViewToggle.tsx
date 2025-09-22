
import React from 'react';
import { LayoutGrid, List, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminViewToggleProps {
  currentView: 'grid' | 'list' | 'table';
  onViewChange: (view: 'grid' | 'list' | 'table') => void;
  availableViews?: ('grid' | 'list' | 'table')[];
}

export const AdminViewToggle: React.FC<AdminViewToggleProps> = ({
  currentView,
  onViewChange,
  availableViews = ['grid', 'list', 'table']
}) => {
  const viewOptions = [
    { key: 'grid' as const, icon: LayoutGrid, label: 'Grade' },
    { key: 'list' as const, icon: List, label: 'Lista' },
    { key: 'table' as const, icon: Table, label: 'Tabela' },
  ].filter(option => availableViews.includes(option.key));

  if (viewOptions.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
      {viewOptions.map((option) => (
        <Button
          key={option.key}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(option.key)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
            ${currentView === option.key
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }
          `}
          title={option.label}
        >
          <option.icon className="h-3.5 w-3.5" />
        </Button>
      ))}
    </div>
  );
};
