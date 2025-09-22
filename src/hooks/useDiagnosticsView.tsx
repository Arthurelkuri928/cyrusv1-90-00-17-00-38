
import { useState } from 'react';

export type DiagnosticsViewMode = 'compact' | 'detailed' | 'cards';

export const useDiagnosticsView = () => {
  const [viewMode, setViewMode] = useState<DiagnosticsViewMode>('compact');

  return {
    viewMode,
    setViewMode
  };
};
