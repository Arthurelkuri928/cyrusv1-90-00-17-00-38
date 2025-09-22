
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionStatus {
  is_valid: boolean;
  status: 'active' | 'expired' | 'suspended';
  expires_at: string | null;
}

export const useSubscriptionStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const checkSubscriptionStatus = async () => {
    if (!user?.id) {
      setSubscriptionStatus(null);
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Verificando status da assinatura para:', user.id);
      
      const { data, error } = await supabase.rpc('check_subscription_status' as any, {
        user_id: user.id
      });

      if (error) {
        console.error('❌ Erro ao verificar assinatura:', error);
        toast({
          title: "Erro",
          description: "Erro ao verificar status da assinatura",
          variant: "destructive"
        });
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const status = data[0];
        console.log('📊 Status da assinatura:', status);
        setSubscriptionStatus(status);
        
        // Notificar se assinatura expirou
        if (!status.is_valid && status.status === 'expired') {
          toast({
            title: "⚠️ Assinatura Expirada",
            description: "Sua assinatura expirou. Entre em contato com o suporte.",
            variant: "destructive"
          });
        }
        
        // Notificar se assinatura vai expirar em breve (próximos 3 dias)
        if (status.is_valid && status.expires_at) {
          const expirationDate = new Date(status.expires_at);
          const now = new Date();
          const diffInDays = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffInDays <= 3 && diffInDays > 0) {
            toast({
              title: "⚠️ Assinatura Expirando",
              description: `Sua assinatura expira em ${diffInDays} dia(s)`,
              variant: "destructive"
            });
          }
        }
      }
    } catch (error) {
      console.error('💥 Erro geral ao verificar assinatura:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    } else {
      setSubscriptionStatus(null);
    }
  }, [user]);

  return {
    subscriptionStatus,
    checkSubscriptionStatus,
    loading,
    isSubscriptionValid: subscriptionStatus?.is_valid || false,
    expiresAt: subscriptionStatus?.expires_at,
    status: subscriptionStatus?.status
  };
};
