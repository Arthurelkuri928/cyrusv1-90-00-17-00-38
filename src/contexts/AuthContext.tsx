
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  sessionLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🚀 AuthProvider: Inicializando...');
    
    let isInitialized = false;
    const initTimeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn('⚠️ AuthProvider: Timeout na inicialização, forçando estado');
        setLoading(false);
        setSessionLoading(false);
      }
    }, 8000); // 8 segundos timeout

    // Verificar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
        } else {
          console.log('📊 Sessão inicial:', session ? 'Encontrada' : 'Não encontrada');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('💥 Erro geral ao obter sessão:', error);
      } finally {
        if (!isInitialized) {
          setLoading(false);
          setSessionLoading(false);
          isInitialized = true;
          clearTimeout(initTimeout);
        }
      }
    };

    getInitialSession();

    // Listener para mudanças de autenticação - CALLBACK SÍNCRONO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 AuthProvider: Evento de autenticação:', event);
        
        // Atualizações síncronas de estado
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!isInitialized) {
          setLoading(false);
          setSessionLoading(false);
          isInitialized = true;
          clearTimeout(initTimeout);
        }

        // Ações assíncronas diferidas
        if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            console.log('👋 Usuário desconectado - limpando dados locais');
            localStorage.removeItem('lastRoute');
            localStorage.removeItem('redirectAfterLogin');
          }, 0);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(initTimeout);
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    try {
      console.log('🔐 Tentativa de login para:', email);
      
      // Primeiro, validar se o usuário pode fazer login
      const { data: validationData, error: validationError } = await supabase.rpc('validate_user_login' as any, {
        user_email: email
      });

      if (validationError) {
        console.error('❌ Erro na validação de login:', validationError);
        return { 
          success: false, 
          error: 'Erro interno na validação. Tente novamente.' 
        };
      }

      if (validationData && Array.isArray(validationData) && validationData.length > 0) {
        const validation = validationData[0];
        
        if (!validation.can_login) {
          console.warn('🚫 Login negado:', validation.message);
          return { 
            success: false, 
            error: validation.message || 'Login não autorizado'
          };
        }

        console.log('✅ Validação passou, prosseguindo com autenticação...');
      }

      // Prosseguir com o login no Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      clearTimeout(timeoutId);

      if (error) {
        console.error('❌ Erro no login Supabase:', error);
        
        let errorMessage = 'Erro no login. Verifique suas credenciais.';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        }
        
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        console.log('🎉 Login realizado com sucesso');
        
        // Verificar se há rota para redirecionamento
        setTimeout(() => {
          const redirectRoute = localStorage.getItem('redirectAfterLogin');
          if (redirectRoute && redirectRoute !== '/entrar') {
            console.log('📍 Redirecionando para rota salva:', redirectRoute);
            localStorage.removeItem('redirectAfterLogin');
          }
        }, 0);
        
        return { success: true };
      }

      return { success: false, error: 'Falha inesperada no login' };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout no login');
        return { success: false, error: 'Timeout na operação. Tente novamente.' };
      }
      console.error('💥 Erro geral no login:', error);
      return { 
        success: false, 
        error: 'Erro inesperado. Tente novamente.' 
      };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📝 Tentativa de cadastro para:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro no cadastro:', error);
        
        let errorMessage = 'Erro no cadastro. Tente novamente.';
        if (error.message.includes('already registered')) {
          errorMessage = 'Este email já está cadastrado.';
        }
        
        return { success: false, error: errorMessage };
      }

      console.log('✅ Cadastro realizado:', data.user ? 'Usuário criado' : 'Confirmação pendente');
      return { success: true };
    } catch (error) {
      console.error('💥 Erro geral no cadastro:', error);
      return { 
        success: false, 
        error: 'Erro inesperado. Tente novamente.' 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Fazendo logout...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Erro no logout:', error);
        toast({
          title: "Erro",
          description: "Erro ao fazer logout",
          variant: "destructive"
        });
      } else {
        console.log('✅ Logout realizado com sucesso');
        // Limpeza será feita pelo listener onAuthStateChange
      }
    } catch (error) {
      console.error('💥 Erro geral no logout:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    sessionLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
