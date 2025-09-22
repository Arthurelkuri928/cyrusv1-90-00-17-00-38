
import { useLanguage } from '@/contexts/LanguageContext';
import { useLanguageMigration } from '@/hooks/useLanguageMigration';
import { useMemo } from 'react';

/**
 * Hook universal de tradução que unifica todos os sistemas de idioma
 */
export const useUniversalTranslation = () => {
  const contextLanguage = useLanguage();
  const migrationLanguage = useLanguageMigration();
  
  const translation = useMemo(() => ({
    // Sistema principal
    language: contextLanguage.language,
    t: contextLanguage.t,
    setLanguage: contextLanguage.setLanguage,
    
    // Funcionalidades avançadas
    setTemporaryLanguage: contextLanguage.setTemporaryLanguage,
    restoreLanguage: contextLanguage.restoreLanguage,
    
    // Sistema futuro
    zustand: migrationLanguage.zustand,
  }), [contextLanguage, migrationLanguage]);
  
  return translation;
};

// Hook simplificado
export const useTranslation = () => {
  const { t, language } = useUniversalTranslation();
  return { t, language };
};
