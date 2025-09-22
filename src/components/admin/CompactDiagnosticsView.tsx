
import React from 'react';
import { useRealtimeDiagnostics } from '@/hooks/useRealtimeDiagnostics';
import { useAuthDiagnostics } from '@/hooks/useAuthDiagnostics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  RefreshCw, 
  Play, 
  Pause,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  User,
  Shield
} from 'lucide-react';

const CompactDiagnosticsView = () => {
  const { 
    realtime, 
    currentRole, 
    hasSession, 
    isAdminUser,
    startMonitoring, 
    stopMonitoring, 
    forceRefresh 
  } = useRealtimeDiagnostics();

  const diagnostics = useAuthDiagnostics();

  const getHealthColor = () => {
    switch (realtime.connectionHealth) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'poor': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Compacto */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Status do Sistema
              {realtime.isMonitoring && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={forceRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Status Geral em linha */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Activity className={`h-4 w-4 ${getHealthColor()}`} />
              <div>
                <div className="text-sm font-medium">Conexão</div>
                <Badge variant="outline" className="text-xs">
                  {realtime.connectionHealth.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <div>
                <div className="text-sm font-medium">Autenticação</div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(hasSession)}
                  <span className="text-xs">{hasSession ? 'Ativa' : 'Inativa'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <div>
                <div className="text-sm font-medium">Banco</div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(diagnostics.dbConnectionStatus === 'connected')}
                  <span className="text-xs">
                    {diagnostics.dbConnectionStatus === 'connected' ? 'Conectado' : 'Erro'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <div>
                <div className="text-sm font-medium">Permissões</div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(isAdminUser)}
                  <span className="text-xs">{isAdminUser ? 'Admin' : 'Usuário'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Adicionais (colapsável) */}
          {realtime.issuesCount > 0 && (
            <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{realtime.issuesCount} problema(s) detectado(s)</span>
              </div>
            </div>
          )}

          {/* Status Summary - apenas informações essenciais */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <Badge variant="outline" className="text-xs">
                {currentRole || 'N/A'}
              </Badge>
            </div>
            {realtime.lastUpdate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Atualizado:</span>
                <span className="text-xs">
                  {new Date(realtime.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactDiagnosticsView;
