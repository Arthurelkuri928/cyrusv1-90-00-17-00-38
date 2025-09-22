
interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: string;
  expirationDate?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
}

interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  url?: string;
  expires?: string;
  expirationDate?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
}

export const useCookieManager = () => {
  const setCookieHelper = (name: string, value: string, options: CookieOptions = {}) => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    // Configurar domínio
    if (options.domain) {
      // Remover protocolo se presente
      const cleanDomain = options.domain.replace(/^https?:\/\//, '');
      cookieString += `; domain=${cleanDomain}`;
    }
    
    // Configurar path
    cookieString += `; path=${options.path || '/'}`;
    
    // Configurar expiração
    if (options.expires) {
      cookieString += `; expires=${options.expires}`;
    } else if (options.expirationDate) {
      const date = new Date(options.expirationDate * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      // Se não há expiração, configurar para 1 ano
      const oneYear = new Date();
      oneYear.setFullYear(oneYear.getFullYear() + 1);
      cookieString += `; expires=${oneYear.toUTCString()}`;
    }
    
    // Configurar secure apenas se estivermos em HTTPS
    if (options.secure && window.location.protocol === 'https:') {
      cookieString += `; secure`;
    }
    
    // Configurar SameSite
    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    } else {
      cookieString += `; samesite=Lax`;
    }

    console.log(`🍪 Configurando cookie: ${name} = ${value.substring(0, 20)}...`);
    
    try {
      document.cookie = cookieString;
      
      // Verificar se o cookie foi definido
      const verification = document.cookie.split(';').find(c => c.trim().startsWith(`${encodeURIComponent(name)}=`));
      if (verification) {
        console.log(`✅ Cookie ${name} configurado com sucesso`);
        return true;
      } else {
        console.warn(`⚠️ Cookie ${name} pode não ter sido configurado corretamente`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Erro ao configurar cookie ${name}:`, error);
      return false;
    }
  };

  const loadCookies = (cookies: Cookie[]): string | null => {
    console.log('🍪 Iniciando configuração de cookies...');
    
    let targetUrl: string | null = null;
    let cookiesSet = 0;

    cookies.forEach((cookie: Cookie, index: number) => {
      console.log(`🍪 Processando cookie ${index + 1}/${cookies.length}: ${cookie.name}`);
      
      const success = setCookieHelper(cookie.name, cookie.value, {
        domain: cookie.domain,
        path: cookie.path,
        expires: cookie.expires,
        expirationDate: cookie.expirationDate,
        secure: cookie.secure,
        sameSite: cookie.sameSite
      });

      if (success) {
        cookiesSet++;
      }

      // Se não temos URL ainda, tentar extrair do cookie
      if (!targetUrl && cookie.url) {
        targetUrl = cookie.url;
      } else if (!targetUrl && cookie.domain) {
        const protocol = cookie.secure || window.location.protocol === 'https:' ? "https://" : "http://";
        const domain = cookie.domain.startsWith(".") ? cookie.domain.substring(1) : cookie.domain;
        targetUrl = `${protocol}${domain}`;
      }
    });

    console.log(`🎯 Configurados ${cookiesSet}/${cookies.length} cookies com sucesso`);
    console.log(`🔗 URL de redirecionamento: ${targetUrl}`);
    
    return targetUrl;
  };

  return {
    setCookieHelper,
    loadCookies
  };
};
