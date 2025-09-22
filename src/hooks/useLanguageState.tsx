
import { useState, useEffect } from 'react';
import { Language } from '@/types/language';

export const useLanguageState = () => {
  const [language, setLanguageState] = useState<Language>('pt-BR');
  const [originalLanguage, setOriginalLanguage] = useState<Language>('pt-BR');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cyrus-language') as Language | null;
    const initialLanguage = savedLanguage || 'pt-BR';
    setLanguageState(initialLanguage);
    setOriginalLanguage(initialLanguage);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setOriginalLanguage(newLanguage);
    localStorage.setItem('cyrus-language', newLanguage);
  };

  const setTemporaryLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    // Não salva no localStorage
  };

  const restoreLanguage = () => {
    setLanguageState(originalLanguage);
  };

  return {
    language,
    originalLanguage,
    setLanguage,
    setTemporaryLanguage,
    restoreLanguage,
  };
};
