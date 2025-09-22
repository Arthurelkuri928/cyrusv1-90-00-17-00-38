
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCrypto } from './useCrypto';
import { useCookieManager } from './useCookieManager';
import { setLocalStorageData, normalizeSessionData } from '@/utils/sessionProcessor';

const AES_KEY = "iLFB0yJSLsObtH6tNcfXMqo7L8qcEHqZ";

export const useSessionInjection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { cryptoLoaded, saveData, getData } = useCrypto();
  const { loadCookies } = useCookieManager();

  const processSessionData = (clipboardData: string): string | null => {
    if (!window.CryptoJS) {
      throw new Error('CryptoJS não está carregado');
    }

    try {
      console.log('🔍 Processando dados da sessão...');
      let sessionData;

      try {
        // Tentar parse direto primeiro
        sessionData = JSON.parse(clipboardData);
        console.log('📄 Dados parseados diretamente como JSON');
      } catch (parseError) {
        console.log('🔐 Tentando descriptografar dados...');
        
        // Procurar por string criptografada
        const encryptedMatch = clipboardData.match(/U2FsdGVkX1.*/);
        if (!encryptedMatch) {
          throw new Error("Nenhuma string criptografada encontrada.");
        }

        const encryptedString = encryptedMatch[0];
        const decryptedData = window.CryptoJS.AES.decrypt(encryptedString, AES_KEY).toString(window.CryptoJS.enc.Utf8);
        
        if (!decryptedData) {
          throw new Error("Falha na descriptografia - dados vazios");
        }

        sessionData = JSON.parse(decryptedData);
        console.log('✅ Dados descriptografados com sucesso');
      }

      // Normalizar dados de sessão
      const normalizedData = normalizeSessionData(sessionData);

      // Configurar localStorage primeiro
      if (normalizedData.localStorage) {
        setLocalStorageData(normalizedData.localStorage);
      }

      // Configurar cookies e obter URL
      const redirectUrl = loadCookies(normalizedData.cookies);

      return redirectUrl || normalizedData.url || null;
    } catch (error) {
      console.error('💥 Erro ao processar sessão:', error);
      throw error;
    }
  };

  const injectSession = async () => {
    if (!window.CryptoJS || !cryptoLoaded) {
      toast({
        title: "❌ Erro",
        description: "CryptoJS ainda não está carregado. Aguarde um momento...",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    setIsLoading(true);
    console.log('🚀 Iniciando injeção de sessão...');

    try {
      // Verificar suporte ao clipboard
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        throw new Error('API de clipboard não suportada neste navegador');
      }

      // Ler dados do clipboard
      console.log('📋 Lendo dados do clipboard...');
      const clipboardText = await navigator.clipboard.readText();
      
      if (!clipboardText || clipboardText.trim() === '') {
        throw new Error('Área de transferência vazia. Copie os dados da sessão primeiro.');
      }

      console.log('📋 Dados obtidos do clipboard');

      // Processar dados da sessão
      const redirectUrl = processSessionData(clipboardText.trim());

      if (!redirectUrl) {
        throw new Error('URL de redirecionamento não encontrada nos dados');
      }

      // Salvar dados localmente
      saveData('sessionData', { 
        timestamp: Date.now(), 
        url: redirectUrl,
        injected: true 
      });

      // Feedback de sucesso
      toast({
        title: "🎉 Sessão injetada com sucesso!",
        description: "Cookies configurados. Redirecionando para a plataforma...",
        duration: 4000
      });

      console.log(`🎯 Redirecionando para: ${redirectUrl}`);

      // Aguardar um pouco para os cookies serem processados
      setTimeout(() => {
        console.log('🔄 Executando redirecionamento...');
        window.open(redirectUrl, '_blank');
      }, 2000);

    } catch (error) {
      console.error('💥 Erro na injeção de sessão:', error);
      
      let errorMessage = 'Erro desconhecido na injeção de sessão';
      
      if (error instanceof Error) {
        if (error.message.includes('vazio') || error.message.includes('Copie')) {
          errorMessage = 'Área de transferência vazia. Copie os dados da sessão primeiro.';
        } else if (error.message.includes('descriptografar') || error.message.includes('criptografada')) {
          errorMessage = 'Falha na descriptografia. Verifique se os dados foram copiados corretamente.';
        } else if (error.message.includes('JSON') || error.message.includes('parse')) {
          errorMessage = 'Dados mal formatados. Verifique se copiou os dados corretos.';
        } else if (error.message.includes('URL')) {
          errorMessage = 'URL de redirecionamento não encontrada nos dados.';
        } else if (error.message.includes('clipboard')) {
          errorMessage = 'Seu navegador não suporta acesso à área de transferência.';
        } else if (error.message.includes('CryptoJS')) {
          errorMessage = 'Sistema de criptografia não carregado. Recarregue a página.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "❌ Erro na injeção de sessão",
        description: errorMessage,
        variant: "destructive",
        duration: 6000
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 Processo de injeção finalizado');
    }
  };

  return {
    injectSession,
    isLoading,
    saveData,
    getData,
    cryptoLoaded
  };
};
