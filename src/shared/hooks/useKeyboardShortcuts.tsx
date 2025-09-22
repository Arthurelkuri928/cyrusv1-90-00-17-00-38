
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUIStore } from '@/app/store/ui.store';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setLanguage, toggleSidebar, setManualSidebarControl, manualSidebarControl } = useUIStore();
  const { signOut } = useAuth();
  const { t, setLanguage: setContextLanguage } = useLanguage();
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 🔧 CORREÇÃO: Verificar se event.key existe antes de chamar toLowerCase()
      if (!event.key) {
        console.warn('🔧 useKeyboardShortcuts: event.key is undefined, skipping');
        return;
      }
      
      // Normalizar a tecla para minúscula para evitar problemas com Caps Lock
      const normalizedKey = event.key.toLowerCase();
      
      // Ctrl + Shift + H - Mostrar lista de comandos
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'h') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Mostrar atalhos');
        window.dispatchEvent(new CustomEvent('showKeyboardShortcuts'));
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: t('showShortcuts') || 'Exibindo lista de atalhos',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + F - Ir para Favoritos
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'f') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Navegar para Favoritos');
        navigate('/favoritos');
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: t('navigatingToFavorites') || 'Navegando para Favoritos',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + S - Toggle Sidebar
      if (event.ctrlKey && event.shiftKey && normalizedKey === 's') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Toggle Sidebar');
        
        try {
          toggleSidebar();
        } catch (error) {
          console.log('Fallback: usando evento customizado para sidebar');
          window.dispatchEvent(new CustomEvent('toggleSidebar'));
        }
        
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: t('toggleSidebar') || 'Alternar Sidebar',
          duration: 2000
        });
        return;
      }

      // 🔧 ATUALIZADO: Ctrl + Shift + K - Ativar/Desativar Controle Manual da Sidebar
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'k') {
        event.preventDefault();
        console.log('🔧 Executando atalho compartilhado: Toggle Controle Manual da Sidebar');
        console.log('🔧 Estado atual de manualSidebarControl:', manualSidebarControl);
        
        const newManualControl = !manualSidebarControl;
        console.log('🔧 Novo valor de manualSidebarControl:', newManualControl);
        
        try {
          setManualSidebarControl(newManualControl);
          console.log('🔧 setManualSidebarControl executado com sucesso');
        } catch (error) {
          console.error('🔧 Erro ao executar setManualSidebarControl:', error);
        }
        
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: newManualControl 
            ? (t('manualSidebarEnabled') || 'Controle Manual da Sidebar Ativado')
            : (t('manualSidebarDisabled') || 'Controle Manual da Sidebar Desativado'),
          duration: 3000
        });
        return;
      }

      // Ctrl + Shift + B - Mudar idioma para Português (BR)
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'b') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Alterar idioma para Português (BR)');
        
        try {
          setLanguage('pt-BR');
          setContextLanguage('pt-BR');
        } catch (error) {
          console.log('Erro ao alterar idioma:', error);
        }
        
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: 'Idioma alterado para Português (BR)',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + I - Mudar idioma para Inglês
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'i') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Alterar idioma para Inglês');
        
        try {
          setLanguage('en-US');
          setContextLanguage('en-US');
        } catch (error) {
          console.log('Erro ao alterar idioma:', error);
        }
        
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: 'Language changed to English',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + E - Mudar idioma para Espanhol
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'e') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Alterar idioma para Espanhol');
        
        try {
          setLanguage('es-ES');
          setContextLanguage('es-ES');
        } catch (error) {
          console.log('Erro ao alterar idioma:', error);
        }
        
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: 'Idioma cambiado a Español',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + L - Modo Claro
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'l') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Alterar para Modo Claro');
        setTheme('light');
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: t('lightModeActivated') || 'Modo Claro Ativado',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + D - Modo Escuro
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'd') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Alterar para Modo Escuro');
        setTheme('dark');
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: t('darkModeActivated') || 'Modo Escuro Ativado',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + P - Abrir Configurações
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'p') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Navegar para Configurações');
        navigate('/configuracoes');
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: t('navigatingToSettings') || 'Navegando para Configurações',
          duration: 2000
        });
        return;
      }

      // Ctrl + Shift + O - Logout
      if (event.ctrlKey && event.shiftKey && normalizedKey === 'o') {
        event.preventDefault();
        console.log('Executando atalho compartilhado: Logout via AuthContext');
        
        // Usar o método signOut do contexto de autenticação
        signOut().then(() => {
          console.log('Logout compartilhado executado com sucesso via atalho');
        }).catch((error) => {
          console.error('Erro ao executar logout compartilhado via atalho:', error);
          // Fallback: limpeza manual
          localStorage.removeItem('auth-token');
          localStorage.removeItem('user-session');
          localStorage.removeItem('supabase.auth.token');
          navigate('/entrar');
        });
        
        toast({
          title: t('shortcutActivated') || 'Atalho Ativado',
          description: t('loggingOut') || 'Saindo da conta...',
          duration: 2000
        });
        return;
      }
    };

    // Adicionar listener com prioridade alta
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [navigate, toast, t, setLanguage, setContextLanguage, toggleSidebar, signOut, setTheme, setManualSidebarControl, manualSidebarControl]);
};
