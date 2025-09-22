
export const colors = {
  // Primary colors - baseado no theme existente do projeto
  primary: {
    50: '#f3e8ff',
    100: '#e9d5ff',
    200: '#d8b4fe',
    300: '#c084fc',
    400: '#a855f7',
    500: '#9333ea', // primary
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  
  // Purple variations - cores específicas do CYRUS
  purple: {
    cyrus: '#A259FF',
    dark: '#6F4AC5',
    light: '#B388FF',
    accent: '#8E24AA',
  },
  
  // Grayscale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Dark theme colors
  dark: {
    bg: '#0A0A0A',
    bgSecondary: '#0D0D0D',
    bgTertiary: '#1A1A1A',
    border: 'rgba(162, 89, 255, 0.2)',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textMuted: '#9CA3AF',
  },
  
  // Status colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
} as const;
