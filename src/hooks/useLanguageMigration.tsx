
import { useLanguage as useLanguageContext } from '@/contexts/LanguageContext';
import { useUIStore } from '@/app/store/ui.store';

/**
 * Hook de migração gradual do LanguageContext para Zustand
 */
export const useLanguageMigration = () => {
  const contextLanguage = useLanguageContext();
  const uiStore = useUIStore();
  
  return {
    // Context API (atual)
    language: contextLanguage.language,
    setLanguage: contextLanguage.setLanguage,
    setTemporaryLanguage: contextLanguage.setTemporaryLanguage,
    restoreLanguage: contextLanguage.restoreLanguage,
    t: contextLanguage.t,
    
    // Zustand Store (futuro)
    zustand: {
      language: uiStore.language,
      setLanguage: uiStore.setLanguage,
    }
  };
};
