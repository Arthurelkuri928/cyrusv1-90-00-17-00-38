
import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Hook para otimizações de performance
 */
export const usePerformanceOptimization = () => {
  const renderCountRef = useRef(0);
  
  useEffect(() => {
    renderCountRef.current++;
    if (process.env.NODE_ENV === 'development') {
      console.log(`Component rendered ${renderCountRef.current} times`);
    }
  });

  // Throttle function para eventos frequentes
  const useThrottle = useCallback((func: Function, delay: number) => {
    const lastCall = useRef(0);
    
    return useCallback((...args: any[]) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return func(...args);
      }
    }, [func, delay]);
  }, []);

  // Debounce function para inputs
  const useDebounce = useCallback((func: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    return useCallback((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    }, [func, delay]);
  }, []);

  // Memoização de objetos complexos
  const useMemoizedObject = useCallback((obj: Record<string, any>, deps: any[]) => {
    return useMemo(() => obj, deps);
  }, []);

  return {
    renderCount: renderCountRef.current,
    useThrottle,
    useDebounce,
    useMemoizedObject,
  };
};
