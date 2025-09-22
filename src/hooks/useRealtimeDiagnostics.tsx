
import { useState, useEffect, useCallback } from 'react';
import { useAuthDiagnostics } from '@/hooks/useAuthDiagnostics';
import { useRealtimePermissions } from '@/hooks/useRealtimePermissions';

interface RealtimeDiagnosticsState {
  isMonitoring: boolean;
  lastUpdate: string | null;
  connectionHealth: 'excellent' | 'good' | 'poor' | 'critical';
  permissionsSync: 'synced' | 'syncing' | 'error';
  crossTabSync: 'active' | 'inactive' | 'error';
  issuesCount: number;
  autoRefreshEnabled: boolean;
}

/**
 * Hook para diagnósticos em tempo real
 */
export const useRealtimeDiagnostics = () => {
  const diagnostics = useAuthDiagnostics();
  const { currentRole } = useRealtimePermissions();
  
  const [realtimeState, setRealtimeState] = useState<RealtimeDiagnosticsState>({
    isMonitoring: false,
    lastUpdate: null,
    connectionHealth: 'good',
    permissionsSync: 'synced',
    crossTabSync: 'active',
    issuesCount: 0,
    autoRefreshEnabled: false
  });

  // Calcular saúde da conexão baseado nos diagnósticos
  const calculateConnectionHealth = useCallback(() => {
    let health: RealtimeDiagnosticsState['connectionHealth'] = 'excellent';
    let issues = 0;

    if (!diagnostics.hasSession) {
      health = 'critical';
      issues += 3;
    } else if (!diagnostics.profileExists) {
      health = 'poor';
      issues += 2;
    } else if (diagnostics.dbConnectionStatus === 'error') {
      health = 'poor';
      issues += 2;
    } else if (!diagnostics.isAdminUser && diagnostics.hasSession) {
      health = 'good';
      issues += 1;
    }

    return { health, issues };
  }, [diagnostics]);

  // Monitorar mudanças nos diagnósticos
  useEffect(() => {
    const { health, issues } = calculateConnectionHealth();
    
    setRealtimeState(prev => ({
      ...prev,
      connectionHealth: health,
      issuesCount: issues,
      lastUpdate: new Date().toISOString(),
      permissionsSync: diagnostics.isLoading ? 'syncing' : 'synced'
    }));
  }, [diagnostics, calculateConnectionHealth]);

  // Auto-refresh dos diagnósticos
  useEffect(() => {
    if (!realtimeState.autoRefreshEnabled) return;

    const interval = setInterval(() => {
      console.log('🔄 [RealtimeDiagnostics] Auto-refresh executado');
      diagnostics.runDiagnostics();
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, [realtimeState.autoRefreshEnabled, diagnostics]);

  // Monitorar eventos de cross-tab sync
  useEffect(() => {
    const handleStorageEvents = (e: StorageEvent) => {
      if (e.key?.includes('permissions_update') || e.key?.includes('tools_admin_update')) {
        setRealtimeState(prev => ({
          ...prev,
          crossTabSync: 'active',
          lastUpdate: new Date().toISOString()
        }));
        
        // Reset para inactive após 5 segundos
        setTimeout(() => {
          setRealtimeState(prev => ({
            ...prev,
            crossTabSync: 'inactive'
          }));
        }, 5000);
      }
    };

    window.addEventListener('storage', handleStorageEvents);
    return () => window.removeEventListener('storage', handleStorageEvents);
  }, []);

  const startMonitoring = useCallback(() => {
    console.log('▶️ [RealtimeDiagnostics] Iniciando monitoramento');
    setRealtimeState(prev => ({
      ...prev,
      isMonitoring: true,
      autoRefreshEnabled: true
    }));
  }, []);

  const stopMonitoring = useCallback(() => {
    console.log('⏹️ [RealtimeDiagnostics] Parando monitoramento');
    setRealtimeState(prev => ({
      ...prev,
      isMonitoring: false,
      autoRefreshEnabled: false
    }));
  }, []);

  const forceRefresh = useCallback(() => {
    console.log('🔄 [RealtimeDiagnostics] Refresh forçado');
    diagnostics.runDiagnostics();
    setRealtimeState(prev => ({
      ...prev,
      lastUpdate: new Date().toISOString()
    }));
  }, [diagnostics]);

  return {
    ...diagnostics,
    realtime: realtimeState,
    currentRole,
    startMonitoring,
    stopMonitoring,
    forceRefresh
  };
};
