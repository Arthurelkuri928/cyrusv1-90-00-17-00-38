
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminDiagnostics = () => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagnosticsComplete, setDiagnosticsComplete] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setUserRole(null);
        setUserId(null);
        setDiagnosticsComplete(true);
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = profile?.role?.trim();
      setUserRole(role || 'user');
      
      // Corrigir validação para incluir todos os roles administrativos
      const adminRoles = ['admin_master', 'gestor_operacoes', 'editor_conteudo', 'suporte'];
      const isUserAdmin = adminRoles.includes(role || '');
      
      setIsAdmin(isUserAdmin);
      setDiagnosticsComplete(true);
      
      console.log('🔍 Admin Status Check:', {
        userId: user.id,
        role: role,
        isAdmin: isUserAdmin,
        adminRoles
      });
      
    } catch (error) {
      console.error('❌ Erro ao verificar status de admin:', error);
      setIsAdmin(false);
      setUserRole(null);
      setUserId(null);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      setDiagnosticsComplete(true);
      toast({
        title: "Erro",
        description: "Erro ao verificar permissões de administrador",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  return {
    isAdmin,
    userRole,
    loading,
    diagnosticsComplete,
    userId,
    error,
    refreshAdminStatus: checkAdminStatus
  };
};
