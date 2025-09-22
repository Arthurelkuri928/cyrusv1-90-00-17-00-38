
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUniversalAuth } from '@/hooks/useUniversalAuth';

interface AuthDiagnostics {
  // Estados básicos
  isLoading: boolean;
  hasSession: boolean;
  sessionValid: boolean;
  
  // Dados do usuário
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  profileExists: boolean;
  
  // Verificações de permissão
  canViewAdminPanel: boolean;
  canManageTools: boolean;
  canManageUsers: boolean;
  isAdminUser: boolean;
  
  // Diagnósticos técnicos
  authUidResult: string | null;
  dbConnectionStatus: 'connected' | 'error' | 'unknown';
  lastError: string | null;
  
  // Função para reexecutar diagnósticos
  runDiagnostics: () => Promise<void>;
}

export const useAuthDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<AuthDiagnostics>({
    isLoading: true,
    hasSession: false,
    sessionValid: false,
    userId: null,
    userEmail: null,
    userRole: null,
    profileExists: false,
    canViewAdminPanel: false,
    canManageTools: false,
    canManageUsers: false,
    isAdminUser: false,
    authUidResult: null,
    dbConnectionStatus: 'unknown',
    lastError: null,
    runDiagnostics: async () => {}
  });

  const { user, session, isReady } = useUniversalAuth();

  const runDiagnostics = async () => {
    try {
      setDiagnostics(prev => ({ ...prev, isLoading: true, lastError: null }));
      
      console.log('🔍 [AuthDiagnostics] Iniciando diagnósticos completos...');

      // 1. Verificar sessão básica
      const hasValidSession = !!(session && user);
      console.log('📊 [AuthDiagnostics] Sessão válida:', hasValidSession);

      if (!hasValidSession) {
        setDiagnostics(prev => ({
          ...prev,
          isLoading: false,
          hasSession: false,
          sessionValid: false,
          lastError: 'Nenhuma sessão ativa encontrada'
        }));
        return;
      }

      // 2. Testar conexão com banco via função simples
      let dbStatus: 'connected' | 'error' = 'error';
      let authUidFromDb: string | null = null;
      
      try {
        const { data: authTest, error: authError } = await supabase
          .rpc('debug_admin_check');
        
        if (!authError && authTest && authTest.length > 0) {
          dbStatus = 'connected';
          authUidFromDb = authTest[0].current_user_id;
          console.log('✅ [AuthDiagnostics] Conexão DB OK, auth.uid():', authUidFromDb);
        } else {
          console.error('❌ [AuthDiagnostics] Erro na função debug_admin_check:', authError);
        }
      } catch (error) {
        console.error('❌ [AuthDiagnostics] Erro de conexão DB:', error);
      }

      // 3. Buscar perfil do usuário diretamente
      let userProfile = null;
      let profileExists = false;
      
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!profileError && profile) {
          userProfile = profile;
          profileExists = true;
          console.log('👤 [AuthDiagnostics] Perfil encontrado:', profile);
        } else {
          console.warn('⚠️ [AuthDiagnostics] Perfil não encontrado:', profileError);
        }
      } catch (error) {
        console.error('❌ [AuthDiagnostics] Erro ao buscar perfil:', error);
      }

      // 4. Testar permissões usando a nova função debug_permissions_check
      let permissionsData = null;
      
      try {
        const { data: permissions, error: permError } = await supabase
          .rpc('debug_permissions_check');
        
        if (!permError && permissions && permissions.length > 0) {
          permissionsData = permissions[0];
          console.log('🔐 [AuthDiagnostics] Permissões obtidas:', permissionsData);
        } else {
          console.error('❌ [AuthDiagnostics] Erro ao verificar permissões:', permError);
        }
      } catch (error) {
        console.error('❌ [AuthDiagnostics] Erro geral permissões:', error);
      }

      // 5. Compilar resultado final
      const finalResult: AuthDiagnostics = {
        isLoading: false,
        hasSession: true,
        sessionValid: true,
        userId: user.id,
        userEmail: user.email || null,
        userRole: userProfile?.role || null,
        profileExists,
        canViewAdminPanel: permissionsData?.can_view_admin_panel || false,
        canManageTools: permissionsData?.can_manage_tools || false,
        canManageUsers: permissionsData?.can_manage_users || false,
        isAdminUser: permissionsData?.is_admin_result || false,
        authUidResult: authUidFromDb,
        dbConnectionStatus: dbStatus,
        lastError: null,
        runDiagnostics
      };

      console.log('📋 [AuthDiagnostics] Resultado final:', finalResult);
      setDiagnostics(finalResult);

    } catch (error) {
      console.error('💥 [AuthDiagnostics] Erro geral:', error);
      setDiagnostics(prev => ({
        ...prev,
        isLoading: false,
        lastError: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  };

  // Executar diagnósticos quando a autenticação estiver pronta
  useEffect(() => {
    if (isReady) {
      runDiagnostics();
    }
  }, [isReady, user?.id]);

  return {
    ...diagnostics,
    runDiagnostics
  };
};
