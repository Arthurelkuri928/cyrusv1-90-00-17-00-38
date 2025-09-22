
import React from 'react';
import AdvancedDiagnosticsPanel from './AdvancedDiagnosticsPanel';
import RealtimeDiagnosticsPanel from './RealtimeDiagnosticsPanel';
import { Separator } from '@/components/ui/separator';

const EnhancedDiagnostics = () => {
  return (
    <div className="space-y-6">
      {/* Painel em tempo real - nova funcionalidade */}
      <RealtimeDiagnosticsPanel />
      
      <Separator />
      
      {/* Painel avançado existente */}
      <AdvancedDiagnosticsPanel />
    </div>
  );
};

export default EnhancedDiagnostics;
