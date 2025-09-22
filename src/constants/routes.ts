
// Canonical route definitions for the application
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/entrar',
  REGISTER: '/cadastro',
  PLANS: '/planos',
  PARTNERSHIP: '/parceria',
  AFFILIATES: '/afiliados',
  SUPPORT: '/suporte',
  
  // Plan-specific routes
  INITIAL_PLANS: '/planos-iniciais',
  STANDARD_PLANS: '/planos-padroes',
  PREMIUM_PLANS: '/planos-premium',
  
  // Protected routes
  MEMBER_AREA: '/area-membro',
  PROFILE: '/perfil',
  EDIT_PROFILE: '/editar-perfil',
  SETTINGS: '/configuracoes',
  TOOLS: '/ferramentas',
  FAVORITES: '/favoritos',
  SUPPORT_MEMBER: '/suporte-membro',
  AFFILIATES_DASHBOARD: '/dashboard-afiliados',
  SUBSCRIPTION: '/assinatura',
  CHECKOUT: '/checkout/:priceId',
  PAYMENT_SUCCESS: '/pagamento-sucesso',
  PAYMENT_FAILURE: '/pagamento-falha',
  ADMIN_PANEL: '/painel-admin',
  
  // Legacy routes for compatibility
  LEGACY_LOGIN: '/login',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];

// Helper function to get route by key
export const getRoute = (key: RouteKey): RouteValue => ROUTES[key];

// Helper function to check if a path is a valid route
export const isValidRoute = (path: string): boolean => {
  return Object.values(ROUTES).includes(path as RouteValue);
};

// Helper function to get route label for admin interface
export const getRouteLabel = (path: string): string => {
  const routeLabels: Record<string, string> = {
    '/': 'Página Inicial',
    '/entrar': 'Login/Entrar',
    '/cadastro': 'Cadastro/Registro',
    '/planos': 'Planos',
    '/parceria': 'Parceria',
    '/afiliados': 'Afiliados',
    '/suporte': 'Suporte',
    '/planos-iniciais': 'Planos Iniciais',
    '/planos-padroes': 'Planos Padrões',
    '/planos-premium': 'Planos Premium',
    '/area-membro': 'Área do Membro',
    '/perfil': 'Perfil',
    '/configuracoes': 'Configurações',
    '/assinatura': 'Assinatura',
  };
  
  return routeLabels[path] || path;
};
