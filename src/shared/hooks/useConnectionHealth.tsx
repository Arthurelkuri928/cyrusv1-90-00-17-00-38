
import { useState, useEffect } from 'react';
import { SupabaseService } from '../services/SupabaseService';

interface ConnectionHealth {
  isOnline: boolean;
  isSupabaseConnected: boolean;
  lastChecked: Date;
  retryCount: number;
}

export const useConnectionHealth = (checkInterval: number = 30000) => {
  const [health, setHealth] = useState<ConnectionHealth>({
    isOnline: navigator.onLine,
    isSupabaseConnected: true,
    lastChecked: new Date(),
    retryCount: 0,
  });

  const supabaseService = SupabaseService.getInstance();

  const checkHealth = async () => {
    const isOnline = navigator.onLine;
    let isSupabaseConnected = false;
    let retryCount = health.retryCount;

    if (isOnline) {
      try {
        isSupabaseConnected = await supabaseService.healthCheck();
        retryCount = 0; // Reset retry count on success
      } catch {
        isSupabaseConnected = false;
        retryCount++;
      }
    }

    setHealth({
      isOnline,
      isSupabaseConnected,
      lastChecked: new Date(),
      retryCount,
    });
  };

  useEffect(() => {
    // Initial check
    checkHealth();

    // Set up interval for periodic checks
    const interval = setInterval(checkHealth, checkInterval);

    // Listen for online/offline events
    const handleOnline = () => {
      setHealth(prev => ({ ...prev, isOnline: true }));
      checkHealth();
    };

    const handleOffline = () => {
      setHealth(prev => ({ 
        ...prev, 
        isOnline: false,
        isSupabaseConnected: false 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkInterval]);

  return {
    ...health,
    refresh: checkHealth,
  };
};
