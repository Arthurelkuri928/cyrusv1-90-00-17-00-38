
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  renderCount: number;
  memoryUsage?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    renderCount: 0,
  });
  
  const renderStartRef = useRef<number>();
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef<number>();

  useEffect(() => {
    mountTimeRef.current = performance.now();
    renderStartRef.current = performance.now();
  }, []);

  useEffect(() => {
    renderCountRef.current++;
    
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        renderCount: renderCountRef.current,
        memoryUsage: (performance as any).memory?.usedJSHeapSize,
      }));

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName}:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          renderCount: renderCountRef.current,
          totalTime: mountTimeRef.current ? 
            `${(performance.now() - mountTimeRef.current).toFixed(2)}ms` : 'N/A'
        });
      }
    }

    renderStartRef.current = performance.now();
  });

  useEffect(() => {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              setMetrics(prev => ({
                ...prev,
                largestContentfulPaint: entry.startTime
              }));
              break;
            case 'first-input':
              setMetrics(prev => ({
                ...prev,
                firstInputDelay: (entry as any).processingStart - entry.startTime
              }));
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                setMetrics(prev => ({
                  ...prev,
                  cumulativeLayoutShift: (prev.cumulativeLayoutShift || 0) + (entry as any).value
                }));
              }
              break;
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        // Some browsers might not support all entry types
        console.warn('Performance monitoring not fully supported');
      }

      return () => observer.disconnect();
    }
  }, []);

  return metrics;
};
