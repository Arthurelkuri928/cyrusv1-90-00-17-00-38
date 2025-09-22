
import React, { useEffect } from 'react';
import { useRealtimeDiagnostics } from '@/hooks/useRealtimeDiagnostics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  RefreshCw, 
  Play, 
  Pause,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock
} from 'lucide-react';

const RealtimeDiagnosticsPanel = () => {
  const { 
    realtime, 
    currentRole, 
    hasSession, 
    isAdminUser,
    startMonitoring, 
    stopMonitoring, 
    forceRefresh 
  } = useRealtimeDiagnostics();

  // Auto-iniciar monitoramento quando componente carrega
  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  const getHealthIcon = () => {
    switch (realtime.connectionHealth) {
      case 'excellent':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'poor':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getHealthColor = () => {
    switch (realtime.connectionHealth) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'poor': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
    }
  };

  const getSyncIcon = () => {
    switch (realtime.permissionsSync) {
      case 'synced':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Diagnósticos em Tempo Real
            {realtime.isMonitoring && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getHealthColor()} animate-pulse`} />
                <span className="text-xs text-muted-foreground">LIVE</span>
              </div>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={realtime.isMonitoring ? stopMonitoring : startMonitoring}
            >
              {realtime.isMonitoring ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Iniciar
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={forceRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Status da Conexão */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              {getHealthIcon()}
              <span className="text-sm font-medium">Saúde da Conexão</span>
            </div>
            <Badge className={getHealthColor() + ' text-white'}>
              {realtime.connectionHealth.toUpperCase()}
            </Badge>
          </div>

          {/* Sincronização de Permissões */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              {getSyncIcon()}
              <span className="text-sm font-medium">Sync Permissões</span>
            </div>
            <Badge variant="outline">
              {realtime.permissionsSync.toUpperCase()}
            </Badge>
          </div>

          {/* Cross-Tab Sync */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              {realtime.crossTabSync === 'active' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm font-medium">Cross-Tab</span>
            </div>
            <Badge variant={realtime.crossTabSync === 'active' ? 'default' : 'secondary'}>
              {realtime.crossTabSync.toUpperCase()}
            </Badge>
          </div>

          {/* Issues Count */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${realtime.issuesCount > 0 ? 'text-yellow-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">Problemas</span>
            </div>
            <Badge variant={realtime.issuesCount > 0 ? 'destructive' : 'secondary'}>
              {realtime.issuesCount}
            </Badge>
          </div>
        </div>

        {/* Status Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Role Atual:</span>
            <Badge variant="outline" className="font-mono">
              {currentRole || 'N/A'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sessão Ativa:</span>
            <Badge variant={hasSession ? 'default' : 'destructive'}>
              {hasSession ? 'SIM' : 'NÃO'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Admin:</span>
            <Badge variant={isAdminUser ? 'default' : 'secondary'}>
              {isAdminUser ? 'SIM' : 'NÃO'}
            </Badge>
          </div>
          
          {realtime.lastUpdate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Última Atualização:</span>
              <div className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                {new Date(realtime.lastUpdate).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        {realtime.isMonitoring && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">
                Monitoramento ativo • Auto-refresh a cada 30s
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeDiagnosticsPanel;
