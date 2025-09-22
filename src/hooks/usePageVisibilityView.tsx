
import { useState } from 'react';

export type PageViewMode = 'table' | 'compact';

export const usePageVisibilityView = () => {
  const [viewMode, setViewMode] = useState<PageViewMode>('table');

  return {
    viewMode,
    setViewMode
  };
};
