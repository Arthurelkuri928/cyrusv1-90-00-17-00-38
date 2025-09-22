
import { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG } from '@/config/appConfig';
import { useDebug } from '@/utils/debugSystem';

interface UseResponsiveNavbarOptions {
  baseWidth?: number;
  minWidth?: number;
  maxWidth?: string;
}

export const useResponsiveNavbar = (options: UseResponsiveNavbarOptions = {}) => {
  const {
    baseWidth = APP_CONFIG.NAVBAR.WIDTH_PERCENTAGE,
    minWidth = 320,
    maxWidth = APP_CONFIG.NAVBAR.MAX_WIDTH,
  } = options;

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [navbarWidth, setNavbarWidth] = useState(baseWidth);
  const [isMobile, setIsMobile] = useState(false);
  const { logNavbarResize } = useDebug();

  const calculateNavbarWidth = useCallback((screenWidth: number) => {
    // Mobile: largura quase total
    if (screenWidth < 768) {
      setIsMobile(true);
      return 95;
    }
    
    // Tablet: largura ajustada
    if (screenWidth < 1024) {
      setIsMobile(false);
      return Math.min(baseWidth + 5, 95);
    }
    
    // Desktop: largura base
    setIsMobile(false);
    return baseWidth;
  }, [baseWidth]);

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    const newNavbarWidth = calculateNavbarWidth(newWidth);
    
    setWindowWidth(newWidth);
    setNavbarWidth(newNavbarWidth);
    
    logNavbarResize(newNavbarWidth, 'useResponsiveNavbar');
  }, [calculateNavbarWidth, logNavbarResize]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Configuração inicial
    handleResize();

    // Listener para redimensionamento
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const getNavbarStyles = useCallback(() => ({
    width: `clamp(${minWidth}px, ${navbarWidth}vw, ${maxWidth})`,
    zIndex: APP_CONFIG.Z_INDEX.NAVBAR,
    position: isMobile ? 'fixed' as const : 'fixed' as const,
  }), [navbarWidth, minWidth, maxWidth, isMobile]);

  return {
    windowWidth,
    navbarWidth,
    isMobile,
    getNavbarStyles,
    refresh: handleResize,
  };
};
