
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAffiliateStatement = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const downloadStatement = async (transactionId?: string) => {
    setIsDownloading(true);
    
    try {
      console.log('🔄 Iniciando download de extrato de afiliado...', { transactionId });
      
      // Se não temos transaction ID, usar um simulado para demonstração
      const idToUse = transactionId || 'demo-affiliate-transaction-id';
      
      const { data, error } = await supabase.functions.invoke('generate-affiliate-statement', {
        body: { id_transacao: idToUse }
      });

      if (error) {
        console.error('❌ Erro na função de afiliados:', error);
        throw error;
      }

      // Criar blob do PDF e fazer download
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `extrato_afiliado_${idToUse}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ Download de extrato de afiliado concluído com sucesso');
      
      toast({
        title: "Download concluído",
        description: "Seu extrato de afiliado foi baixado com sucesso.",
      });

    } catch (error) {
      console.error('💥 Erro no download do extrato de afiliado:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o extrato de afiliado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadStatement,
    isDownloading
  };
};
