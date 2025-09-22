// Configuração centralizada da aplicação
export const APP_CONFIG = {
  // Layout Constants
  NAVBAR: {
    HEIGHT: '72px',
    WIDTH_PERCENTAGE: 100, // Agora ocupa 100% da largura
    MAX_WIDTH: '100%', // Largura máxima total
    BORDER_RADIUS: '0.5rem', // Bordas arredondadas (rounded-lg)
    Z_INDEX: 40,
    BLUR_BACKDROP: 'none', // Sem blur
    BACKGROUND_OPACITY: 1, // Fundo sólido
  },
  
  // Z-Index Hierarchy
  Z_INDEX: {
    BACKGROUND: 0,
    CONTENT: 10,
    STICKY: 20,
    NAVBAR: 40,
    FLOATING: 50,
    MODAL: 60,
    NOTIFICATION: 70,
    TOOLTIP: 80,
    DEBUG: 9999,
  },
  
  // Responsive Breakpoints
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  
  // Animation Durations
  ANIMATIONS: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },
  
  // Spacing Scale
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
  },
} as const;

// Design Tokens
export const DESIGN_TOKENS = {
  COLORS: {
    PRIMARY: 'hsl(var(--cyrus-primary))',
    PRIMARY_LIGHT: 'hsl(var(--cyrus-primary-light))',
    PRIMARY_DARK: 'hsl(var(--cyrus-primary-dark))',
    BACKGROUND: 'hsl(var(--background))',
    FOREGROUND: 'hsl(var(--foreground))',
    BORDER: 'hsl(var(--border))',
    MUTED: 'hsl(var(--muted))',
  },
  
  SHADOWS: {
    GLOW: 'var(--shadow-glow)',
    CARD: 'var(--shadow-card)',
  },
  
  GRADIENTS: {
    PRIMARY: 'var(--gradient-primary)',
    BRAND: 'var(--gradient-brand)',
    GLASS: 'var(--gradient-glass)',
  },
} as const;

// Utility Functions
export const getResponsiveWidth = (percentage: number) => {
  return `clamp(320px, ${percentage}vw, ${APP_CONFIG.NAVBAR.MAX_WIDTH})`;
};

export const getZIndex = (layer: keyof typeof APP_CONFIG.Z_INDEX) => {
  return APP_CONFIG.Z_INDEX[layer];
};
