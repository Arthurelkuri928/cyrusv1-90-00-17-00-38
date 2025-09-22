
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { testSupabaseConnection } from '@/lib/supabase-test';
import { useToolsValidation } from '@/hooks/useToolsValidation';
import { Badge } from '@/components/ui/badge';

export const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const { canAccessTools, isLoading, error, isMember, isAdmin } = useToolsValidation();

  const handleTest = async () => {
    setConnectionStatus('testing');
    setErrorMessage('');
    
    try {
      const isConnected = await testSupabaseConnection();
      setConnectionStatus(isConnected ? 'success' : 'error');
      
      if (!isConnected) {
        setErrorMessage('Falha na conexão com Supabase');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'testing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Teste de Conexão Supabase
          <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionStatus)}`}></div>
        </CardTitle>
        <CardDescription>
          Verificar conectividade e permissões
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleTest} 
          disabled={connectionStatus === 'testing'}
          className="w-full"
        >
          {connectionStatus === 'testing' ? 'Testando...' : 'Testar Conexão'}
        </Button>

        {connectionStatus !== 'idle' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status da Conexão:</span>
              <Badge variant={connectionStatus === 'success' ? 'default' : 'destructive'}>
                {connectionStatus === 'success' ? 'Conectado' : 'Erro'}
              </Badge>
            </div>
            
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <h4 className="text-sm font-medium">Permissões de Ferramentas:</h4>
          
          {isLoading ? (
            <p className="text-sm text-gray-500">Verificando...</p>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">Acesso às Ferramentas:</span>
                <Badge variant={canAccessTools ? 'default' : 'destructive'}>
                  {canAccessTools ? 'Permitido' : 'Negado'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Status de Membro:</span>
                <Badge variant={isMember ? 'default' : 'secondary'}>
                  {isMember ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Administrador:</span>
                <Badge variant={isAdmin ? 'default' : 'secondary'}>
                  {isAdmin ? 'Sim' : 'Não'}
                </Badge>
              </div>
              
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
