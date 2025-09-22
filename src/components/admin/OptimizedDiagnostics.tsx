
import React from 'react';
import { useDiagnosticsView } from '@/hooks/useDiagnosticsView';
import DiagnosticsViewSelector from './DiagnosticsViewSelector';
import CompactDiagnosticsView from './CompactDiagnosticsView';
import CardsDiagnosticsView from './CardsDiagnosticsView';
import EnhancedDiagnostics from './EnhancedDiagnostics';

const OptimizedDiagnostics = () => {
  const { viewMode, setViewMode } = useDiagnosticsView();

  const renderDiagnosticsView = () => {
    switch (viewMode) {
      case 'compact':
        return <CompactDiagnosticsView />;
      case 'cards':
        return <CardsDiagnosticsView />;
      case 'detailed':
        return <EnhancedDiagnostics />;
      default:
        return <CompactDiagnosticsView />;
    }
  };

  return (
    <div className="space-y-6">
      <DiagnosticsViewSelector 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />
      {renderDiagnosticsView()}
    </div>
  );
};

export default OptimizedDiagnostics;
