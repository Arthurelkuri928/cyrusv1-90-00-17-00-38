import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { usePageVisibilityStore } from '@/app/store/pageVisibility.store';
import { RefreshCw, Database, Zap, Bug } from 'lucide-react';

const PageVisibilityDebug = () => {
  const { pages, loading, error, refetch, debugAdminStatus, isRealtimeConnected } = usePageVisibility();

  const handleDebugAdmin = async () => {
    console.log('🔍 [DEBUG] Botão de debug clicado...');
    await debugAdminStatus();
  };

  const handleRefresh = async () => {
    console.log('🔄 [DEBUG] Refresh manual solicitado...');
    await refetch();
  };

  const handleInvalidateCache = () => {
    usePageVisibilityStore.getState().invalidateCache();
  };

  const visiblePages = pages.filter(p => p.is_visible).length;
  const totalPages = pages.length;

  return (
    <Card className="bg-muted/30 border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Database className="h-5 w-5" />
          Debug: Estado Global das Páginas
          {isRealtimeConnected && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
              Tempo Real
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted p-3 rounded-lg border border-muted-foreground/20">
            <div className="text-sm text-muted-foreground">Total de Páginas:</div>
            <div className="text-xl font-bold text-foreground">{totalPages}</div>
          </div>
          <div className="bg-muted p-3 rounded-lg border border-muted-foreground/20">
            <div className="text-sm text-muted-foreground">Status:</div>
            <Badge variant={error ? 'destructive' : 'default'} className={error ? '' : 'bg-muted-foreground text-background'}>
              {error ? 'Erro' : 'OK'}
            </Badge>
          </div>
          <div className="bg-muted p-3 rounded-lg border border-muted-foreground/20">
            <div className="text-sm text-muted-foreground">Último Fetch:</div>
            <div className="text-sm text-foreground">{new Date().toLocaleTimeString()}</div>
          </div>
          <div className="bg-muted p-3 rounded-lg border border-muted-foreground/20">
            <div className="text-sm text-muted-foreground">Cache:</div>
            <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
              Válido
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={loading}
            className="gap-2 bg-muted border-muted-foreground text-foreground hover:bg-muted/80"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Forçar Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDebugAdmin}
            className="gap-2 bg-muted border-muted-foreground text-foreground hover:bg-muted/80"
          >
            <Bug className="h-4 w-4" />
            Debug Admin
          </Button>
          <Button 
            variant="outline" 
            onClick={handleInvalidateCache}
            className="gap-2 bg-muted border-muted-foreground text-foreground hover:bg-muted/80"
          >
            <Zap className="h-4 w-4" />
            Invalidar Cache
          </Button>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg border border-muted-foreground/20">
          <h4 className="font-medium text-foreground mb-2">Páginas no Store:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {pages.map((page) => (
              <div 
                key={page.id} 
                className={`p-2 rounded text-xs border ${
                  page.is_visible 
                    ? 'bg-green-900/40 border-green-500/40 text-green-100' 
                    : 'bg-red-900/40 border-red-500/40 text-red-100'
                }`}
              >
                <div className="font-medium">{page.name}</div>
                <div className="text-xs opacity-75">{page.slug}</div>
                <Badge 
                  variant={page.is_visible ? 'default' : 'secondary'}
                  className={`text-xs ${page.is_visible ? 'bg-green-600' : 'bg-red-600'}`}
                >
                  {page.is_visible ? 'Visível' : 'Oculta'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageVisibilityDebug;
