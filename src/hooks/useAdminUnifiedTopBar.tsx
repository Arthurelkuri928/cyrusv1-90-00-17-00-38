
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useAdminUnifiedTopBar = () => {
  const location = useLocation();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false);
  }, []);

  // Close command palette on navigation
  useEffect(() => {
    setCommandPaletteOpen(false);
  }, [location.pathname]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      // Close on escape
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    commandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    setCommandPaletteOpen
  };
};
