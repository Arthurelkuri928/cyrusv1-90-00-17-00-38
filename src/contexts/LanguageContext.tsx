
import React, { createContext, useContext } from 'react';
import { LanguageContextType, LanguageProviderProps } from '@/types/language';
import { useLanguageState } from '@/hooks/useLanguageState';
import { createTranslationFunction } from '@/utils/translation';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const {
    language,
    setLanguage,
    setTemporaryLanguage,
    restoreLanguage,
  } = useLanguageState();

  const t = createTranslationFunction(language);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      setTemporaryLanguage,
      restoreLanguage,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
