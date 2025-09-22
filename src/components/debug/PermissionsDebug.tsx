import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import type { Action } from '@/shared/permissions';

/**
 * Componente de debug para testar o sistema de permissões em tempo real
 */
export const PermissionsDebug: React.FC = () => {
  const { 
    role, 
    isLoading, 
    isAuthenticated, 
    can, 
    canAccessAdmin, 
    isAdmin, 
    refreshPermissions,
    getAllPermissions,
    getRoleName 
  } = usePermissions();

  const handleClearCache = () => {
    // Limpar todos os caches de permissões
    const allKeys = Object.keys(sessionStorage);
    allKeys.forEach(key => {
      if (key.startsWith('permissions_') || key === 'current_user_id') {
        sessionStorage.removeItem(key);
      }
    });
    console.log('🧹 Cache de permissões limpo');
    refreshPermissions();
  };

  const permissionsToTest: Action[] = [
    'admin.panel.view',
    'view_users',
    'edit_tools',
    'manage_users'
  ];

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">Debug de Permissões</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <strong>Estado Atual:</strong>
          <ul className="text-sm mt-1">
            <li>Role: <code>{role || 'N/A'}</code></li>
            <li>Autenticado: <code>{isAuthenticated ? 'Sim' : 'Não'}</code></li>
            <li>Carregando: <code>{isLoading ? 'Sim' : 'Não'}</code></li>
            <li>É Admin: <code>{isAdmin() ? 'Sim' : 'Não'}</code></li>
            <li>Pode Acessar Admin: <code>{canAccessAdmin() ? 'Sim' : 'Não'}</code></li>
            <li>Nome do Role: <code>{getRoleName()}</code></li>
          </ul>
        </div>
        
        <div>
          <strong>Permissões Testadas:</strong>
          <ul className="text-sm mt-1">
            {permissionsToTest.map(permission => (
              <li key={permission}>
                <code>{permission}</code>: 
                <span className={can(permission) ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                  {can(permission) ? '✓' : '✗'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-4">
        <strong>Todas as Permissões ({getAllPermissions().length}):</strong>
        <div className="text-xs mt-1 max-h-20 overflow-y-auto bg-white dark:bg-gray-900 p-2 rounded border">
          {getAllPermissions().length > 0 ? (
            getAllPermissions().join(', ')
          ) : (
            <em>Nenhuma permissão encontrada</em>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={refreshPermissions} variant="outline" size="sm">
          Recarregar Permissões
        </Button>
        <Button onClick={handleClearCache} variant="destructive" size="sm">
          Limpar Cache
        </Button>
      </div>
    </div>
  );
};