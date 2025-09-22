
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPayment {
  id_transacao: string;
  valor_pago: number;
  moeda: string;
  data_pagamento: string;
  status_pagamento: string;
}

export const useSubscriptionHistory = () => {
  const [invoices, setInvoices] = useState<SubscriptionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadInvoiceHistory = async () => {
    if (!user) return;

    try {
      console.log('🔄 Carregando histórico de faturas de assinatura...');
      
      const { data, error } = await supabase
        .from('assinaturas_pagamentos')
        .select('id_transacao, valor_pago, moeda, data_pagamento, status_pagamento')
        .eq('id_usuario', user.id)
        .order('data_pagamento', { ascending: false })
        .limit(12);

      if (error) {
        console.error('❌ Erro ao carregar histórico:', error);
        throw error;
      }

      console.log('✅ Histórico carregado:', data?.length, 'faturas encontradas');
      setInvoices(data || []);

    } catch (error) {
      console.error('💥 Erro ao carregar histórico de faturas:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de faturas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoiceHistory();
  }, [user]);

  return {
    invoices,
    loading,
    refreshHistory: loadInvoiceHistory
  };
};
