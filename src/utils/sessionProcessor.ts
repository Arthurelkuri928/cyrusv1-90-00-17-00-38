
interface SessionData {
  cookies: Array<{
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
  }>;
  localStorage?: Record<string, any> | string;
  url?: string;
}

export const setLocalStorageData = (localStorageData: any) => {
  if (!localStorageData) return;

  try {
    let parsedLocalStorage;
    
    if (typeof localStorageData === "string") {
      parsedLocalStorage = JSON.parse(localStorageData);
    } else {
      parsedLocalStorage = localStorageData;
    }

    console.log('📦 Configurando localStorage...');

    Object.entries(parsedLocalStorage).forEach(([key, value]) => {
      try {
        const storageValue = typeof value === "object" ? JSON.stringify(value) : String(value);
        localStorage.setItem(key, storageValue);
        console.log(`✅ localStorage item configurado: ${key}`);
      } catch (error) {
        console.error(`❌ Erro ao configurar item ${key}:`, error);
      }
    });
    
    console.log('📦 localStorage configurado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao processar localStorage:', error);
  }
};

export const normalizeSessionData = (data: any): SessionData => {
  if (Array.isArray(data)) {
    return { cookies: data };
  }
  
  if (data.cookies) {
    return data;
  }
  
  // Se é um objeto com cookies como propriedades
  if (typeof data === 'object' && data !== null) {
    const cookies = Object.values(data).filter((item): item is { name: string; value: string; domain?: string; path?: string; url?: string; expires?: string; expirationDate?: number; secure?: boolean; httpOnly?: boolean; sameSite?: string; } => 
      typeof item === 'object' && item !== null && 'name' in item && 'value' in item
    );
    
    if (cookies.length > 0) {
      return { cookies };
    }
  }
  
  throw new Error('Formato de dados de sessão não reconhecido');
};
