
import { supabase } from '@/integrations/supabase/client';

export interface SystemHealthCheck {
  timestamp: string;
  sessionStatus: 'active' | 'inactive' | 'invalid';
  databaseConnection: 'connected' | 'error' | 'timeout';
  userProfile: 'found' | 'not_found' | 'error';
  permissions: {
    canViewAdmin: boolean;
    canManageTools: boolean;
    canManageUsers: boolean;
    isAdmin: boolean;
  };
  issues: string[];
  recommendations: string[];
}

export const runSystemHealthCheck = async (): Promise<SystemHealthCheck> => {
  const result: SystemHealthCheck = {
    timestamp: new Date().toISOString(),
    sessionStatus: 'inactive',
    databaseConnection: 'error',
    userProfile: 'not_found',
    permissions: {
      canViewAdmin: false,
      canManageTools: false,
      canManageUsers: false,
      isAdmin: false
    },
    issues: [],
    recommendations: []
  };

  try {
    // 1. Verificar sessão
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      result.issues.push(`Erro ao obter sessão: ${sessionError.message}`);
      result.recommendations.push('Tente fazer logout e login novamente');
    } else if (!session) {
      result.sessionStatus = 'inactive';
      result.issues.push('Nenhuma sessão ativa encontrada');
      result.recommendations.push('Faça login para acessar funcionalidades administrativas');
    } else {
      result.sessionStatus = 'active';
      
      // 2. Testar conexão com banco
      try {
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        if (!testError) {
          result.databaseConnection = 'connected';
        } else {
          result.databaseConnection = 'error';
          result.issues.push(`Erro de conexão com banco: ${testError.message}`);
        }
      } catch (dbError) {
        result.databaseConnection = 'timeout';
        result.issues.push('Timeout na conexão com banco de dados');
      }

      // 3. Verificar perfil do usuário
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!profileError && profile) {
          result.userProfile = 'found';
          
          // 4. Testar permissões usando função debug
          try {
            const { data: permissions, error: permError } = await supabase
              .rpc('debug_permissions_check');
            
            if (!permError && permissions && permissions.length > 0) {
              const perm = permissions[0];
              result.permissions = {
                canViewAdmin: perm.can_view_admin_panel || false,
                canManageTools: perm.can_manage_tools || false,
                canManageUsers: perm.can_manage_users || false,
                isAdmin: perm.is_admin_result || false
              };
            } else {
              result.issues.push('Falha ao verificar permissões via função debug');
              result.recommendations.push('Verifique se as funções do banco estão funcionando corretamente');
            }
          } catch (permError) {
            result.issues.push('Erro ao executar verificação de permissões');
          }
        } else {
          result.userProfile = 'not_found';
          result.issues.push('Perfil do usuário não encontrado na tabela profiles');
          result.recommendations.push('Verifique se o perfil foi criado corretamente durante o registro');
        }
      } catch (profileError) {
        result.userProfile = 'error';
        result.issues.push('Erro ao buscar perfil do usuário');
      }
    }

    // 5. Análise final e recomendações
    if (result.sessionStatus === 'active' && result.userProfile === 'found' && result.permissions.isAdmin) {
      result.recommendations.push('✅ Sistema funcionando corretamente');
    }

    if (result.databaseConnection === 'error') {
      result.recommendations.push('Verifique a conectividade com o Supabase');
    }

    if (result.userProfile === 'found' && !result.permissions.isAdmin) {
      result.recommendations.push(`Usuário com role "${result.userProfile}" não tem permissões administrativas`);
    }

  } catch (error) {
    result.issues.push(`Erro geral no diagnóstico: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }

  return result;
};

export const logSystemHealth = async (): Promise<void> => {
  const health = await runSystemHealthCheck();
  
  console.group('🏥 System Health Check');
  console.log('⏰ Timestamp:', health.timestamp);
  console.log('🔐 Session Status:', health.sessionStatus);
  console.log('🗄️ Database Connection:', health.databaseConnection);
  console.log('👤 User Profile:', health.userProfile);
  console.log('🛡️ Permissions:', health.permissions);
  
  if (health.issues.length > 0) {
    console.group('❌ Issues Found:');
    health.issues.forEach(issue => console.warn('•', issue));
    console.groupEnd();
  }
  
  if (health.recommendations.length > 0) {
    console.group('💡 Recommendations:');
    health.recommendations.forEach(rec => console.info('•', rec));
    console.groupEnd();
  }
  
  console.groupEnd();
};
