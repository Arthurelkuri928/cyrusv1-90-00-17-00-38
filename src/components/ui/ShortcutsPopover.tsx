
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ShortcutsPopover = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const shortcuts = [
    {
      keys: ['Ctrl', 'Shift', 'H'],
      action: t('showShortcuts') || 'Mostrar Atalhos',
      description: t('showShortcutsDesc') || 'Exibir esta lista de comandos'
    },
    {
      keys: ['Ctrl', 'Shift', 'F'],
      action: t('goToFavorites') || 'Ir para Favoritos',
      description: t('navigateToFavoritesPage') || 'Navegar para a página de favoritos'
    },
    {
      keys: ['Ctrl', 'Shift', 'B'],
      action: t('changeToPortuguese') || 'Mudar idioma para Português (BR)',
      description: t('switchLanguageToPortuguese') || 'Alterar idioma da interface para português'
    },
    {
      keys: ['Ctrl', 'Shift', 'I'],
      action: t('changeToEnglish') || 'Mudar idioma para Inglês',
      description: t('switchLanguageToEnglish') || 'Alterar idioma da interface para inglês'
    },
    {
      keys: ['Ctrl', 'Shift', 'E'],
      action: t('changeToSpanish') || 'Mudar idioma para Espanhol',
      description: t('switchLanguageToSpanish') || 'Alterar idioma da interface para espanhol'
    },
    {
      keys: ['Ctrl', 'Shift', 'S'],
      action: t('toggleSidebar') || 'Abrir/Fechar Sidebar',
      description: t('toggleSidebarVisibility') || 'Alternar visibilidade da barra lateral'
    },
    {
      keys: ['Ctrl', 'Shift', 'K'],
      action: t('toggleManualSidebarControl') || 'Ativar/Desativar Controle Manual da Sidebar',
      description: t('toggleManualSidebarControlDesc') || 'Alternar entre controle automático e manual da sidebar'
    },
    {
      keys: ['Ctrl', 'Shift', 'L'],
      action: t('activateLightMode') || 'Modo Claro',
      description: t('switchToLightTheme') || 'Alterar para tema claro'
    },
    {
      keys: ['Ctrl', 'Shift', 'D'],
      action: t('activateDarkMode') || 'Modo Escuro',
      description: t('switchToDarkTheme') || 'Alterar para tema escuro'
    },
    {
      keys: ['Ctrl', 'Shift', 'P'],
      action: t('openSettings') || 'Abrir Configurações',
      description: t('navigateToSettingsPage') || 'Navegar para a página de configurações'
    },
    {
      keys: ['Ctrl', 'Shift', 'O'],
      action: t('logout') || 'Logout / Sair',
      description: t('logoutFromAccount') || 'Sair da conta atual'
    }
  ];

  const startTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    setTimeoutId(id);
  };

  const stopTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  useEffect(() => {
    const handleShowShortcuts = () => {
      setIsVisible(true);
      startTimeout();
    };

    window.addEventListener('showKeyboardShortcuts', handleShowShortcuts);

    return () => {
      window.removeEventListener('showKeyboardShortcuts', handleShowShortcuts);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  useEffect(() => {
    if (isVisible) {
      startTimeout();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md">
      <Card 
        ref={popoverRef}
        className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-2xl animate-in slide-in-from-top-2 duration-300"
        onMouseEnter={stopTimeout}
        onMouseLeave={startTimeout}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <Keyboard className="h-5 w-5 text-[#A855F7]" />
              {t('keyboardShortcuts') || 'Atalhos do Teclado'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {shortcuts.map((shortcut, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm truncate">
                  {shortcut.action}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {shortcut.description}
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <Badge 
                      variant="outline" 
                      className="bg-background/50 text-foreground border-transparent px-1.5 py-0.5 text-xs font-mono"
                    >
                      {key}
                    </Badge>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground text-xs">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-md">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              💡 {t('shortcutTip') || 'Dica: Use Ctrl + Shift + H para mostrar esta lista a qualquer momento.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
