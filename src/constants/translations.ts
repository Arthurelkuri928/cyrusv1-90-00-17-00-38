
import { Language } from '@/types/language';
import { sidebarTranslations } from './translations/sidebar';
import { navigationTranslations } from './translations/navigation';
import { toolsTranslations } from './translations/tools';
import { favoritesTranslations } from './translations/favorites';
import { profileTranslations } from './translations/profile';
import { settingsTranslations } from './translations/settings';
import { subscriptionTranslations } from './translations/subscription';
import { affiliatesTranslations } from './translations/affiliates';
import { footerTranslations } from './translations/footer';
import { videoTranslations } from './translations/video';

// Helper function to merge translation objects
const mergeTranslations = (language: Language): Record<string, string> => {
  return {
    ...navigationTranslations[language],
    ...toolsTranslations[language],
    ...favoritesTranslations[language],
    ...profileTranslations[language],
    ...settingsTranslations[language],
    ...subscriptionTranslations[language],
    ...affiliatesTranslations[language],
    ...footerTranslations[language],
    ...videoTranslations[language],
    ...sidebarTranslations[language]
  };
};

export const translations: Record<Language, Record<string, string>> = {
  'pt-BR': mergeTranslations('pt-BR'),
  'en-US': mergeTranslations('en-US'),
  'es-ES': mergeTranslations('es-ES')
};
