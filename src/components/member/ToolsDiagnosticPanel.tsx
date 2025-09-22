
import { useToolsDiagnostics } from '@/hooks/useToolsDiagnostics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToolsStore } from '@/app/store/tools.store';

const ToolsDiagnosticPanel = () => {
  const diagnostics = useToolsDiagnostics();
  const { refreshTools, fetchTools } = useToolsStore();

  const handleForceRefresh = async () => {
    console.log('🔄 [DIAGNÓSTICO] Forçando refresh das ferramentas...');
    await fetchTools(undefined, true);
  };

  // Only show in development or when there are issues
  const shouldShow = process.env.NODE_ENV === 'development' || 
    (diagnostics.store?.toolsCount === 0 && diagnostics.database?.toolsInDatabase > 0);

  if (!shouldShow) return null;

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          🔍 Diagnóstico de Ferramentas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-medium text-orange-900 dark:text-orange-100">Autenticação</p>
            <Badge variant={diagnostics.user?.isAuthenticated ? "default" : "destructive"}>
              {diagnostics.user?.isAuthenticated ? "✓ Logado" : "✗ Não logado"}
            </Badge>
          </div>
          
          <div>
            <p className="font-medium text-orange-900 dark:text-orange-100">Banco de Dados</p>
            <Badge variant={diagnostics.database?.connectionTest ? "default" : "destructive"}>
              {diagnostics.database?.connectionTest ? "✓ Conectado" : "✗ Erro conexão"}
            </Badge>
          </div>
          
          <div>
            <p className="font-medium text-orange-900 dark:text-orange-100">Ferramentas no DB</p>
            <Badge variant="outline">
              {diagnostics.database?.toolsInDatabase || 0} total
            </Badge>
          </div>
          
          <div>
            <p className="font-medium text-orange-900 dark:text-orange-100">Ferramentas Carregadas</p>
            <Badge variant={diagnostics.store?.toolsCount > 0 ? "default" : "destructive"}>
              {diagnostics.store?.toolsCount || 0} carregadas
            </Badge>
          </div>
        </div>

        {diagnostics.store?.toolsCount === 0 && diagnostics.database?.toolsInDatabase > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-orange-800 dark:text-orange-200 font-medium">
              ⚠️ Problema detectado: Há {diagnostics.database?.toolsInDatabase} ferramentas no banco, mas 0 carregadas na interface
            </p>
            <Button onClick={handleForceRefresh} variant="outline" size="sm">
              🔄 Forçar Recarregamento
            </Button>
          </div>
        )}

        {diagnostics.store?.error && (
          <div className="p-3 bg-red-100 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">Erro:</p>
            <p className="text-red-700 dark:text-red-300 text-sm">{diagnostics.store.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToolsDiagnosticPanel;
