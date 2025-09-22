import React from 'react';
import { FileText, Users, Stethoscope, Shield, Circle } from 'lucide-react';
import { adminDocumentsData, AdminDocument } from '../../data/adminNavigationData';

interface AdminDocumentViewProps {
  searchQuery?: string;
  activeFilter?: string;
}

const getDocumentIcon = (type: AdminDocument['type']) => {
  switch (type) {
    case 'diagnostics':
      return Stethoscope;
    case 'users':
      return Users;
    case 'tools':
      return FileText;
    case 'notifications':
      return FileText;
    case 'permissions':
      return Shield;
    default:
      return FileText;
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'connected':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return '';
  }
};

export const AdminDocumentView: React.FC<AdminDocumentViewProps> = ({ 
  searchQuery = '',
  activeFilter = 'Todos'
}) => {
  const filteredDocuments = adminDocumentsData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'Todos' || 
                         doc.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
                         doc.type.toLowerCase().includes(activeFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-nav-item">
          Resultados recentes: <span className="font-medium text-foreground">{filteredDocuments.length} resultados</span>
        </p>
      </div>

      <div className="space-y-3">
        {filteredDocuments.map((document, index) => {
          const IconComponent = getDocumentIcon(document.type);

          return (
            <div
              key={document.id}
              className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:bg-accent-hover transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                {index + 1}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-nav-item" />
                  <h3 className="font-medium text-foreground">
                    {document.title}
                  </h3>
                  {document.status && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-nav-item">
                  <span>{document.category}</span>
                  <Circle className="h-1 w-1 fill-current" />
                  <span>{document.time}, {document.date}</span>
                </div>
                
                {document.description && (
                  <p className="text-sm text-nav-item">
                    {document.description}
                  </p>
                )}
              </div>

              <button className="px-4 py-2 text-sm text-nav-item hover:text-foreground border border-border rounded-lg hover:bg-accent-hover transition-colors">
                Selecionar
              </button>
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-nav-item mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum documento encontrado
          </h3>
          <p className="text-nav-item">
            Tente ajustar sua busca ou filtros
          </p>
        </div>
      )}
    </div>
  );
};