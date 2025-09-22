
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { useUIStore } from '@/app/store/ui.store';

/**
 * Hook de migração gradual do ThemeContext para Zustand
 */
export const useThemeMigration = () => {
  const contextTheme = useThemeContext();
  const uiStore = useUIStore();
  
  return {
    // Context API (atual)
    theme: contextTheme.theme,
    toggleTheme: contextTheme.toggleTheme,
    setTheme: contextTheme.setTheme,
    setTemporaryTheme: contextTheme.setTemporaryTheme,
    restoreTheme: contextTheme.restoreTheme,
    
    // Zustand Store (futuro)
    zustand: {
      theme: uiStore.theme,
      setTheme: uiStore.setTheme,
    }
  };
};
