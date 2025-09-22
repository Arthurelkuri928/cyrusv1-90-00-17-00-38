
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSubscriptionInvoice = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const downloadInvoice = async (transactionId: string) => {
    setIsDownloading(true);
    
    try {
      console.log('🔄 Iniciando download de fatura de assinatura...', { transactionId });
      
      const payload = { id_transacao: transactionId };
      console.log('📝 Payload para envio:', payload);

      // MÉTODO 1: Tentar com fetch() direto primeiro
      try {
        console.log('🚀 Tentativa 1: Usando fetch() direto...');
        
        // Obter token de autenticação
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('Usuário não autenticado');
        }

        const response = await fetch('https://gkqyyaejdshpbzjiqmib.supabase.co/functions/v1/generate-subscription-invoice', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/pdf',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrcXl5YWVqZHNocGJ6amlxbWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTg1MTMsImV4cCI6MjA3MDYzNDUxM30.xz15lc_t-zoW65n85a90ztB2w89aECpoyYwOIUtzXYw'
          },
          body: JSON.stringify(payload)
        });

        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Fetch response error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Processar resposta como ArrayBuffer para PDF
        const pdfData = await response.arrayBuffer();
        console.log('✅ PDF recebido via fetch, tamanho:', pdfData.byteLength);

        // Criar blob e fazer download
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `fatura_assinatura_${transactionId}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);

        console.log('✅ Download concluído com sucesso via fetch()');
        
        toast({
          title: "Download concluído",
          description: "Sua fatura de assinatura foi baixada com sucesso.",
        });

        return; // Sucesso, não precisa do fallback

      } catch (fetchError) {
        console.warn('⚠️ Método fetch() falhou, tentando fallback...', fetchError);
        
        // MÉTODO 2: Fallback com supabase.functions.invoke()
        console.log('🔄 Tentativa 2: Usando supabase.functions.invoke()...');
        
        const { data, error } = await supabase.functions.invoke('generate-subscription-invoice', {
          body: payload,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
          }
        });

        if (error) {
          console.error('❌ Erro na função fallback:', error);
          throw new Error(error.message || 'Erro ao gerar fatura via fallback');
        }

        // Processar dados do fallback
        if (!data) {
          throw new Error('Nenhum dado recebido da função fallback');
        }

        console.log('📄 Dados recebidos via fallback, tipo:', typeof data);

        // Converter para ArrayBuffer para garantir compatibilidade com Blob
        let pdfArrayBuffer: ArrayBuffer;
        if (data instanceof ArrayBuffer) {
          pdfArrayBuffer = data;
        } else if (data instanceof Uint8Array) {
          // Garantir que temos um ArrayBuffer real, não SharedArrayBuffer
          if (data.buffer instanceof ArrayBuffer) {
            pdfArrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
          } else {
            // Fallback: copiar dados para um novo ArrayBuffer
            pdfArrayBuffer = new ArrayBuffer(data.length);
            new Uint8Array(pdfArrayBuffer).set(data);
          }
        } else {
          throw new Error('Formato de dados do PDF não reconhecido no fallback');
        }

        // Criar blob e fazer download
        const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `fatura_assinatura_${transactionId}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);

        console.log('✅ Download concluído com sucesso via fallback');
        
        toast({
          title: "Download concluído",
          description: "Sua fatura de assinatura foi baixada com sucesso.",
        });
      }

    } catch (error) {
      console.error('💥 Erro geral no download da fatura:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      console.error('🔍 Error details completos:', {
        transactionId,
        errorMessage,
        errorType: typeof error,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      toast({
        title: "Erro no download",
        description: `Não foi possível baixar a fatura: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadInvoice,
    isDownloading
  };
};
