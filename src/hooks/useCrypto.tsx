
import { useState, useEffect } from 'react';

// Declarar o CryptoJS global
declare global {
  interface Window {
    CryptoJS: any;
  }
}

const AES_KEY = "iLFB0yJSLsObtH6tNcfXMqo7L8qcEHqZ";

export const useCrypto = () => {
  const [cryptoLoaded, setCryptoLoaded] = useState(false);

  // Carregar CryptoJS dinamicamente
  useEffect(() => {
    const loadCryptoJS = async () => {
      try {
        if (window.CryptoJS) {
          setCryptoLoaded(true);
          return;
        }

        // Tentar carregar via CDN primeiro
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js';
        script.crossOrigin = 'anonymous';
        
        const loadPromise = new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('✅ CryptoJS carregado via CDN');
            setCryptoLoaded(true);
            resolve(true);
          };
          script.onerror = reject;
        });

        document.head.appendChild(script);
        await loadPromise;
      } catch (error) {
        console.log('⚠️ CDN falhou, tentando arquivo local...');
        try {
          // Fallback para arquivo local
          const localScript = document.createElement('script');
          localScript.src = '/src/lib/crypto-js.min.js';
          
          const localLoadPromise = new Promise((resolve, reject) => {
            localScript.onload = () => {
              console.log('✅ CryptoJS carregado via arquivo local');
              setCryptoLoaded(true);
              resolve(true);
            };
            localScript.onerror = reject;
          });

          document.head.appendChild(localScript);
          await localLoadPromise;
        } catch (localError) {
          console.error('❌ Erro ao carregar CryptoJS:', localError);
        }
      }
    };

    loadCryptoJS();
  }, []);

  const saveData = (key: string, value: any) => {
    if (!window.CryptoJS) return;
    const encryptedData = window.CryptoJS.AES.encrypt(JSON.stringify(value), AES_KEY).toString();
    localStorage.setItem(key, encryptedData);
  };

  const getData = (key: string) => {
    if (!window.CryptoJS) return null;
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return null;
    
    try {
      const decryptedBytes = window.CryptoJS.AES.decrypt(encryptedData, AES_KEY);
      const decryptedData = decryptedBytes.toString(window.CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('❌ Erro ao descriptografar dados:', error);
      return null;
    }
  };

  return {
    cryptoLoaded,
    saveData,
    getData
  };
};
