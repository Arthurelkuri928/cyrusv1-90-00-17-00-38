
import React from 'react';
import { useAdminDiagnostics } from '@/hooks/useAdminDiagnostics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';

const AdminDiagnosticsPanel = () => {
  const diagnostics = useAdminDiagnostics();

  if (!diagnostics.diagnosticsComplete) {
    return (
      <Card className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-blue-700 dark:text-blue-300">Executando diagnósticos de admin...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Diagnósticos de Administrador
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium">Status Admin:</span>
            <div className="flex items-center gap-2">
              {diagnostics.isAdmin ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Badge className="bg-green-500 text-white">Admin</Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <Badge className="bg-red-500 text-white">Não Admin</Badge>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium">Role:</span>
            <Badge variant="outline" className="font-mono">
              {diagnostics.userRole ? `"${diagnostics.userRole}"` : 'null'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium">User ID:</span>
            <Badge variant="outline" className="font-mono text-xs">
              {diagnostics.userId ? diagnostics.userId.substring(0, 8) + '...' : 'null'}
            </Badge>
          </div>
        </div>

        {diagnostics.error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-700 dark:text-red-300 text-sm">{diagnostics.error}</span>
          </div>
        )}

        {diagnostics.isAdmin && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                ✅ Permissões administrativas confirmadas! O sistema de UPDATE deve funcionar.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDiagnosticsPanel;
