import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setTemporaryTheme: (theme: 'light' | 'dark') => void;
  restoreTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [savedTheme, setSavedTheme] = useState<'light' | 'dark'>('dark');
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  // Função para verificar se estamos em uma página da área de membros
  const isMemberArea = useCallback(() => {
    const memberRoutes = [
      '/area-membro',
      '/ferramentas', 
      '/content/',
      '/ferramenta/',
      '/favoritos',
      '/suporte-membro',
      '/afiliados',
      '/dashboard-afiliados',
      '/assinatura',
      '/configuracoes',
      '/perfil',
      '/editar-perfil'
    ];
    
    return memberRoutes.some(route => location.pathname.startsWith(route));
  }, [location.pathname]);

  const applyThemeToDocument = useCallback((newTheme: 'light' | 'dark') => {
    console.log('Aplicando tema ao documento:', newTheme, 'Área de membros:', isMemberArea());
    
    // Remove todas as classes de tema
    document.documentElement.classList.remove('light', 'dark');
    
    // Para área de membros, aplica o tema selecionado
    // Para páginas públicas, sempre aplica o tema escuro (comportamento do design)
    const themeToApply = isMemberArea() ? newTheme : 'dark';
    
    // Aplica a classe de tema
    document.documentElement.classList.add(themeToApply);
    document.documentElement.setAttribute('data-theme', themeToApply);
    
    // Força atualização síncrona para garantir aplicação
    requestAnimationFrame(() => {
      document.documentElement.classList.add(themeToApply);
      document.documentElement.setAttribute('data-theme', themeToApply);
      
      // Verifica se foi aplicado corretamente
      const hasCorrectClass = document.documentElement.classList.contains(themeToApply);
      console.log('Tema aplicado com sucesso:', themeToApply, 'Verificação:', hasCorrectClass);
      
      if (!hasCorrectClass) {
        console.warn('Reaplicando tema após falha na verificação');
        document.documentElement.classList.add(themeToApply);
      }
    });
    
    console.log('Tema aplicado:', themeToApply, 'Classes atuais:', document.documentElement.classList.toString());
  }, [isMemberArea]);

  // Inicialização única e robusta
  useEffect(() => {
    if (!isInitialized) {
      const storedTheme = localStorage.getItem('cyrus-theme') as 'light' | 'dark' | null;
      const initialTheme = storedTheme || 'dark';
      
      console.log('Inicializando sistema de tema:', {
        storedTheme,
        initialTheme,
        isMemberArea: isMemberArea(),
        pathname: location.pathname
      });
      
      setThemeState(initialTheme);
      setSavedTheme(initialTheme);
      
      // Aplica o tema com um pequeno delay para garantir que o DOM esteja pronto
      setTimeout(() => {
        applyThemeToDocument(initialTheme);
      }, 50);
      
      setIsInitialized(true);
    }
  }, [isInitialized, applyThemeToDocument, isMemberArea, location.pathname]);

  // Aplicar tema quando mudar de rota (apenas se já inicializado)
  useEffect(() => {
    if (isInitialized) {
      console.log('Rota mudou, reaplicando tema:', {
        theme,
        isMemberArea: isMemberArea(),
        pathname: location.pathname
      });
      
      // Aplica o tema após mudança de rota
      setTimeout(() => {
        applyThemeToDocument(theme);
      }, 100);
    }
  }, [location.pathname, theme, isInitialized, applyThemeToDocument, isMemberArea]);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    console.log('Definindo tema permanente:', newTheme);
    
    // Atualiza estado atual
    setThemeState(newTheme);
    // Atualiza estado salvo
    setSavedTheme(newTheme);
    
    // Salva no localStorage com tratamento de erro
    try {
      localStorage.setItem('cyrus-theme', newTheme);
      console.log('Tema salvo no localStorage:', newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema no localStorage:', error);
    }
    
    // Aplica ao documento imediatamente
    applyThemeToDocument(newTheme);
    
    // Verifica aplicação após um breve delay
    setTimeout(() => {
      const currentThemeClass = document.documentElement.classList.contains(newTheme);
      if (!currentThemeClass && isMemberArea()) {
        console.warn('Tema não aplicado corretamente, reaplicando...');
        applyThemeToDocument(newTheme);
      }
    }, 200);
  }, [applyThemeToDocument, isMemberArea]);

  const setTemporaryTheme = useCallback((newTheme: 'light' | 'dark') => {
    console.log('Definindo tema temporário:', newTheme);
    setThemeState(newTheme);
    applyThemeToDocument(newTheme);
    // NÃO salva no localStorage - apenas visual
  }, [applyThemeToDocument]);

  const restoreTheme = useCallback(() => {
    console.log('Restaurando tema para:', savedTheme);
    setThemeState(savedTheme);
    applyThemeToDocument(savedTheme);
  }, [savedTheme, applyThemeToDocument]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Alternando tema para:', newTheme);
    setTheme(newTheme);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme, 
      setTemporaryTheme,
      restoreTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
