
import React from 'react';
import { useRealtimeDiagnostics } from '@/hooks/useRealtimeDiagnostics';
import { useAuthDiagnostics } from '@/hooks/useAuthDiagnostics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  User,
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react';

const CardsDiagnosticsView = () => {
  const { 
    realtime, 
    currentRole, 
    hasSession, 
    isAdminUser
  } = useRealtimeDiagnostics();

  const diagnostics = useAuthDiagnostics();

  const getHealthIcon = () => {
    switch (realtime.connectionHealth) {
      case 'excellent':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'good':
        return <CheckCircle2 className="h-6 w-6 text-blue-500" />;
      case 'poor':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getHealthColor = () => {
    switch (realtime.connectionHealth) {
      case 'excellent': return 'border-green-500';
      case 'good': return 'border-blue-500';
      case 'poor': return 'border-yellow-500';
      case 'critical': return 'border-red-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Card de Saúde da Conexão */}
      <Card className={`border-l-4 ${getHealthColor()}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            {getHealthIcon()}
            Saúde da Conexão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="mb-2">
            {realtime.connectionHealth.toUpperCase()}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {realtime.issuesCount > 0 && (
              <span>{realtime.issuesCount} problema(s) detectado(s)</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card de Autenticação */}
      <Card className={`border-l-4 ${hasSession ? 'border-green-500' : 'border-red-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="h-5 w-5" />
            Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            {hasSession ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={hasSession ? 'default' : 'destructive'}>
              {hasSession ? 'ATIVA' : 'INATIVA'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Role: {currentRole || 'Desconhecido'}
          </div>
        </CardContent>
      </Card>

      {/* Card de Banco de Dados */}
      <Card className={`border-l-4 ${diagnostics.dbConnectionStatus === 'connected' ? 'border-green-500' : 'border-red-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Database className="h-5 w-5" />
            Banco de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            {diagnostics.dbConnectionStatus === 'connected' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={diagnostics.dbConnectionStatus === 'connected' ? 'default' : 'destructive'}>
              {diagnostics.dbConnectionStatus === 'connected' ? 'CONECTADO' : 'ERRO'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Profile: {diagnostics.profileExists ? 'Existe' : 'Não encontrado'}
          </div>
        </CardContent>
      </Card>

      {/* Card de Permissões */}
      <Card className={`border-l-4 ${isAdminUser ? 'border-green-500' : 'border-gray-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-5 w-5" />
            Permissões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            {isAdminUser ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <User className="h-4 w-4 text-gray-500" />
            )}
            <Badge variant={isAdminUser ? 'default' : 'secondary'}>
              {isAdminUser ? 'ADMIN' : 'USUÁRIO'}
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            {diagnostics.canViewAdminPanel && <div>✓ Painel Admin</div>}
            {diagnostics.canManageTools && <div>✓ Gerenciar Ferramentas</div>}
            {diagnostics.canManageUsers && <div>✓ Gerenciar Usuários</div>}
          </div>
        </CardContent>
      </Card>

      {/* Card de Sincronização */}
      <Card className={`border-l-4 ${realtime.crossTabSync === 'active' ? 'border-green-500' : 'border-gray-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            {realtime.crossTabSync === 'active' ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-gray-500" />
            )}
            Cross-Tab Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={realtime.crossTabSync === 'active' ? 'default' : 'secondary'}>
            {realtime.crossTabSync.toUpperCase()}
          </Badge>
          <div className="text-xs text-muted-foreground mt-1">
            Permissões: {realtime.permissionsSync.toUpperCase()}
          </div>
        </CardContent>
      </Card>

      {/* Card de Status Geral */}
      <Card className="border-l-4 border-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="h-5 w-5" />
            Status Geral
            {realtime.isMonitoring && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Monitoramento:</span>
              <Badge variant={realtime.isMonitoring ? 'default' : 'secondary'}>
                {realtime.isMonitoring ? 'ATIVO' : 'INATIVO'}
              </Badge>
            </div>
            {realtime.lastUpdate && (
              <div className="flex justify-between">
                <span>Última atualização:</span>
                <span>{new Date(realtime.lastUpdate).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardsDiagnosticsView;
