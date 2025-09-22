
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Normalizar a tecla para minúscula para evitar problemas com Caps Lock
      const normalizedKey = event.key.toLowerCase();
      
      // Ctrl + Shift + H - Mostrar lista de comandos
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'h') {
        event.preventDefault();
        console.log('Executando atalho: Mostrar atalhos');
        window.dispatchEvent(new CustomEvent('showKeyboardShortcuts'));
        toast({
          title: t('shortcutActivated'),
          description: t('showShortcuts'),
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + F - Ir para Favoritos
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'f') {
        event.preventDefault();
        console.log('Executando atalho: Navegar para Favoritos');
        navigate('/favoritos');
        toast({
          title: t('shortcutActivated'),
          description: t('navigatingToFavorites'),
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + B - Mudar idioma para Português (BR)
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'b') {
        event.preventDefault();
        console.log('Executando atalho: Alterar idioma para Português (BR)');
        setLanguage('pt-BR');
        toast({
          title: t('shortcutActivated'),
          description: 'Idioma alterado para Português (BR)',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + I - Mudar idioma para Inglês
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'i') {
        event.preventDefault();
        console.log('Executando atalho: Alterar idioma para Inglês');
        setLanguage('en-US');
        toast({
          title: t('shortcutActivated'),
          description: 'Language changed to English',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + E - Mudar idioma para Espanhol
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'e') {
        event.preventDefault();
        console.log('Executando atalho: Alterar idioma para Espanhol');
        setLanguage('es-ES');
        toast({
          title: t('shortcutActivated'),
          description: 'Idioma cambiado a Español',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + S - Abrir/Fechar Sidebar
      if (event.ctrlKey && event.shiftKey && normalizedKey === 's') {
        event.preventDefault();
        console.log('Executando atalho: Toggle Sidebar');
        
        // Buscar o elemento do sidebar e disparar evento de toggle
        const sidebarToggleEvent = new CustomEvent('toggleSidebar');
        window.dispatchEvent(sidebarToggleEvent);
        
        // Como fallback, tentar clicar no botão do sidebar se existir
        const sidebarButton = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
        if (sidebarButton) {
          sidebarButton.click();
        }
        
        toast({
          title: t('shortcutActivated'),
          description: t('toggleSidebar'),
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + M - Ativar/Desativar Controle Manual da Sidebar
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'm') {
        event.preventDefault();
        console.log('Executando atalho: Toggle Controle Manual da Sidebar');
        
        const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        const newManualControl = !currentSettings.layout?.manualSidebarControl;
        
        const newSettings = {
          ...currentSettings,
          layout: {
            ...currentSettings.layout,
            manualSidebarControl: newManualControl
          }
        };
        
        localStorage.setItem('userSettings', JSON.stringify(newSettings));
        
        toast({
          title: t('shortcutActivated'),
          description: newManualControl 
            ? t('manualSidebarEnabled')
            : t('manualSidebarDisabled'),
          duration: 3000
        });
        
        // Recarregar página após um tempo para aplicar mudanças
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return;
      }

      // Ctrl + Shift + L - Modo Claro
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'l') {
        event.preventDefault();
        console.log('Executando atalho: Alterar para Modo Claro');
        setTheme('light');
        toast({
          title: t('shortcutActivated'),
          description: t('lightModeActivated'),
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + D - Modo Escuro
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'd') {
        event.preventDefault();
        console.log('Executando atalho: Alterar para Modo Escuro');
        setTheme('dark');
        toast({
          title: t('shortcutActivated'),
          description: t('darkModeActivated'),
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + P - Abrir Configurações
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'p') {
        event.preventDefault();
        console.log('Executando atalho: Navegar para Configurações');
        navigate('/configuracoes');
        toast({
          title: t('shortcutActivated'),
          description: t('navigatingToSettings'),
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + O - Logout/Sair
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'o') {
        event.preventDefault();
        console.log('Executando atalho: Logout via signOut do AuthContext');
        
        // Usar o método signOut do contexto de autenticação
        signOut().then(() => {
          console.log('Logout executado com sucesso via atalho');
        }).catch((error) => {
          console.error('Erro ao executar logout via atalho:', error);
          // Fallback: limpar localStorage manualmente
          localStorage.removeItem('auth-token');
          localStorage.removeItem('user-session');
          localStorage.removeItem('supabase.auth.token');
          navigate('/entrar');
        });
        
        toast({
          title: t('shortcutActivated'),
          description: t('loggingOut'),
          duration: 2000
        });
        return;
      }
    };

    // Adicionar listener com capture true para garantir que seja executado
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [navigate, language, setLanguage, theme, setTheme, toast, t, signOut]);
};
