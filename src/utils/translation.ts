
import { translations } from '@/constants/translations';
import { Language } from '@/types/language';

export const createTranslationFunction = (language: Language) => {
  return (key: string): string => {
    return translations[language][key] || key;
  };
};
