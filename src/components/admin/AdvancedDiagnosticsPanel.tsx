
import React from 'react';
import { useAuthDiagnostics } from '@/hooks/useAuthDiagnostics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  User, 
  Shield,
  Eye,
  Settings,
  Users
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdvancedDiagnosticsPanel = () => {
  const diagnostics = useAuthDiagnostics();

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === null) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return status ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const StatusBadge = ({ status, trueText, falseText }: { 
    status: boolean | null; 
    trueText: string; 
    falseText: string;
  }) => {
    if (status === null) return <Badge variant="outline">Desconhecido</Badge>;
    return (
      <Badge className={status ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
        {status ? trueText : falseText}
      </Badge>
    );
  };

  if (diagnostics.isLoading) {
    return (
      <Card className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300">
                Executando Diagnósticos Avançados
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Verificando autenticação, permissões e conectividade...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com ação de refresh */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Diagnósticos Avançados do Sistema
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={diagnostics.runDiagnostics}
              disabled={diagnostics.isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reexecutar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Status Geral da Sessão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Status da Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Sessão Ativa:</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.hasSession} />
                <StatusBadge 
                  status={diagnostics.hasSession} 
                  trueText="Ativa" 
                  falseText="Inativa" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Sessão Válida:</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.sessionValid} />
                <StatusBadge 
                  status={diagnostics.sessionValid} 
                  trueText="Válida" 
                  falseText="Inválida" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Perfil Existe:</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.profileExists} />
                <StatusBadge 
                  status={diagnostics.profileExists} 
                  trueText="Existe" 
                  falseText="Não Existe" 
                />
              </div>
            </div>
          </div>

          {diagnostics.hasSession && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">User ID:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {diagnostics.userId ? `${diagnostics.userId.substring(0, 8)}...` : 'N/A'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Email:</span>
                <Badge variant="outline">{diagnostics.userEmail || 'N/A'}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Role:</span>
                <Badge variant="outline" className="font-mono">
                  {diagnostics.userRole ? `"${diagnostics.userRole}"` : 'N/A'}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status da Conexão com Banco */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Conectividade do Banco
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Status da Conexão:</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.dbConnectionStatus === 'connected'} />
                <Badge 
                  className={
                    diagnostics.dbConnectionStatus === 'connected' 
                      ? "bg-green-500 text-white" 
                      : "bg-red-500 text-white"
                  }
                >
                  {diagnostics.dbConnectionStatus === 'connected' ? 'Conectado' : 'Erro'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">auth.uid() Resultado:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {diagnostics.authUidResult ? 
                  `${diagnostics.authUidResult.substring(0, 8)}...` : 
                  'NULL'
                }
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verificações de Permissão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verificação de Permissões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Acessar Painel Admin:</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.canViewAdminPanel} />
                <StatusBadge 
                  status={diagnostics.canViewAdminPanel} 
                  trueText="Permitido" 
                  falseText="Negado" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Gerenciar Ferramentas:</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.canManageTools} />
                <StatusBadge 
                  status={diagnostics.canManageTools} 
                  trueText="Permitido" 
                  falseText="Negado" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Gerenciar Usuários:</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.canManageUsers} />
                <StatusBadge 
                  status={diagnostics.canManageUsers} 
                  trueText="Permitido" 
                  falseText="Negado" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">É Administrador:</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.isAdminUser} />
                <StatusBadge 
                  status={diagnostics.isAdminUser} 
                  trueText="Admin" 
                  falseText="Usuário" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Erros */}
      {diagnostics.lastError && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            <strong>Erro:</strong> {diagnostics.lastError}
          </AlertDescription>
        </Alert>
      )}

      {!diagnostics.hasSession && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            <strong>Atenção:</strong> Nenhuma sessão de usuário ativa foi detectada. 
            Faça login para executar os diagnósticos completos.
          </AlertDescription>
        </Alert>
      )}

      {diagnostics.hasSession && !diagnostics.profileExists && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            <strong>Problema:</strong> Usuário autenticado mas perfil não encontrado na tabela profiles. 
            Isso pode indicar um problema na criação do perfil do usuário.
          </AlertDescription>
        </Alert>
      )}

      {diagnostics.hasSession && diagnostics.profileExists && !diagnostics.isAdminUser && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <strong>Info:</strong> Usuário autenticado com perfil válido, mas sem permissões administrativas. 
            Role atual: {diagnostics.userRole || 'não definido'}.
          </AlertDescription>
        </Alert>
      )}

      {diagnostics.isAdminUser && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            <strong>✅ Sistema Operacional:</strong> Todas as verificações foram bem-sucedidas. 
            O usuário possui permissões administrativas e o sistema está funcionando corretamente.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdvancedDiagnosticsPanel;
