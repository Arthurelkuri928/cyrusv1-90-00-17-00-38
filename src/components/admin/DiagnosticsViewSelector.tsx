
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Minimize2 } from 'lucide-react';
import { DiagnosticsViewMode } from '@/hooks/useDiagnosticsView';

interface DiagnosticsViewSelectorProps {
  viewMode: DiagnosticsViewMode;
  onViewModeChange: (mode: DiagnosticsViewMode) => void;
}

const DiagnosticsViewSelector: React.FC<DiagnosticsViewSelectorProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground mr-2">Visualização:</span>
      
      <Button
        variant={viewMode === 'compact' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('compact')}
        className="flex items-center gap-2"
      >
        <Minimize2 className="h-4 w-4" />
        Compacta
      </Button>
      
      <Button
        variant={viewMode === 'cards' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('cards')}
        className="flex items-center gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Cards
      </Button>
      
      <Button
        variant={viewMode === 'detailed' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('detailed')}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        Detalhada
      </Button>
    </div>
  );
};

export default DiagnosticsViewSelector;
