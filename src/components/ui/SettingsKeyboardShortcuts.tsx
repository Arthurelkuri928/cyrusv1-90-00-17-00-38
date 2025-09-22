
import React from 'react';
import { SettingsKeyboardBadge } from '@/components/ui/SettingsKeyboardBadge';
import { useLanguage } from '@/contexts/LanguageContext';

export const SettingsKeyboardShortcuts = () => {
  const { t } = useLanguage();

  const shortcuts = [
    {
      keys: ['Ctrl', 'Shift', 'H'],
      action: t('showShortcuts'),
      description: t('showShortcutsDesc')
    },
    {
      keys: ['Ctrl', 'Shift', 'F'],
      action: t('goToFavorites'),
      description: t('navigateToFavoritesPage')
    },
    {
      keys: ['Ctrl', 'Shift', 'B'],
      action: t('changeToPortuguese') || 'Mudar idioma para Português (BR)',
      description: t('switchLanguageToPortuguese') || 'Alterar idioma da interface para português'
    },
    {
      keys: ['Ctrl', 'Shift', 'I'],
      action: t('changeToEnglish'),
      description: t('switchLanguageToEnglish')
    },
    {
      keys: ['Ctrl', 'Shift', 'E'],
      action: t('changeToSpanish'),
      description: t('switchLanguageToSpanish')
    },
    {
      keys: ['Ctrl', 'Shift', 'S'],
      action: t('toggleSidebar'),
      description: t('toggleSidebarVisibility')
    },
    {
      keys: ['Ctrl', 'Shift', 'K'],
      action: t('toggleManualSidebarControl'),
      description: t('toggleManualSidebarControlDesc')
    },
    {
      keys: ['Ctrl', 'Shift', 'L'],
      action: t('activateLightMode'),
      description: t('switchToLightTheme')
    },
    {
      keys: ['Ctrl', 'Shift', 'D'],
      action: t('activateDarkMode'),
      description: t('switchToDarkTheme')
    },
    {
      keys: ['Ctrl', 'Shift', 'P'],
      action: t('openSettings'),
      description: t('navigateToSettingsPage')
    },
    {
      keys: ['Ctrl', 'Shift', 'O'],
      action: t('logout'),
      description: t('logoutFromAccount')
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-6">
        {t('keyboardShortcutsDesc')}
      </p>
      
      <div className="space-y-3">
        {shortcuts.map((shortcut, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
          >
            <div className="flex-1">
              <div className="font-medium text-foreground mb-1">
                {shortcut.action}
              </div>
              <div className="text-sm text-muted-foreground">
                {shortcut.description}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <SettingsKeyboardBadge>
                      {key}
                    </SettingsKeyboardBadge>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground text-xs mx-1">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          {t('shortcutTip')}
        </p>
      </div>
    </div>
  );
};
