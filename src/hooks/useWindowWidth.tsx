
import { useState, useEffect } from 'react';

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      console.log('🔧 useWindowWidth: Window resized to', newWidth);
      setWindowWidth(newWidth);
    };

    // Configuração inicial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};
