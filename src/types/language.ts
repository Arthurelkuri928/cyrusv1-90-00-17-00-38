
export type Language = 'pt-BR' | 'en-US' | 'es-ES';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  setTemporaryLanguage: (language: Language) => void;
  restoreLanguage: () => void;
  t: (key: string) => string;
}

export interface LanguageProviderProps {
  children: React.ReactNode;
}
