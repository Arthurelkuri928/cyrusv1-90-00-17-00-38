
import { useState, useCallback } from 'react';

interface UseAdminContextualTopBarProps {
  initialView?: 'grid' | 'list' | 'table';
  initialSearch?: string;
}

export const useAdminContextualTopBar = ({
  initialView = 'grid',
  initialSearch = ''
}: UseAdminContextualTopBarProps = {}) => {
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'table'>(initialView);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleViewChange = useCallback((view: 'grid' | 'list' | 'table') => {
    setCurrentView(view);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchValue(query);
  }, []);

  const handleRefresh = useCallback(async (refreshFn?: () => Promise<void>) => {
    setIsRefreshing(true);
    try {
      if (refreshFn) {
        await refreshFn();
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
  }, []);

  return {
    // State
    currentView,
    searchValue,
    isRefreshing,
    
    // Actions
    handleViewChange,
    handleSearch,
    handleRefresh,
    handleClearSearch,
    setSearchValue,
    setCurrentView,
  };
};
