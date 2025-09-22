
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { adminNavigationData } from '@/data/adminNavigationData';

interface AdminCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (href: string) => void;
}

export const AdminCommandPalette: React.FC<AdminCommandPaletteProps> = ({
  open,
  onOpenChange,
  onNavigate
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Transform navigation data into a flat array for searching
  const allNavLinks = useMemo(() => {
    const items: Array<{
      id: string;
      label: string;
      href: string;
      icon: React.ElementType;
      category: string;
    }> = [];

    adminNavigationData.forEach(section => {
      section.items.forEach(item => {
        items.push({
          id: item.id,
          label: item.label,
          href: item.href,
          icon: item.icon,
          category: section.label || 'Navegação'
        });
      });
    });

    return items;
  }, []);

  // Filter links based on search query
  const filteredLinks = useMemo(() => {
    if (!query) return []; // Don't show anything if search is empty
    return allNavLinks.filter(link => 
      link.label.toLowerCase().includes(query.toLowerCase()) ||
      link.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allNavLinks]);

  const handleResultClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      navigate(href);
    }
    onOpenChange(false); // Close modal after click
    setQuery(''); // Reset search
  };

  const handleClose = () => {
    onOpenChange(false);
    setQuery(''); // Reset search when closing
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/4 z-50 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-neutral-700 bg-[#1C1C1E] shadow-2xl">
          <div className="flex items-center gap-4 p-4 border-b border-neutral-800">
            <Search className="h-5 w-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Buscar no painel admin..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="w-full bg-transparent text-white placeholder-neutral-400 focus:outline-none"
              autoFocus
            />
            <Dialog.Close onClick={handleClose} className="text-neutral-500 hover:text-white">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          
          <div className="p-4">
            {query && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 mb-2">
                  Resultados para "{query}"
                </p>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {filteredLinks.length > 0 ? filteredLinks.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => handleResultClick(item.href)} 
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800 cursor-pointer transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-neutral-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.label}</p>
                        <p className="text-xs text-neutral-400">{item.category}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-neutral-500">Nenhuma página encontrada para "{query}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!query && (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-400">Comece a digitar para buscar páginas...</p>
              </div>
            )}

            {/* Keyboard shortcuts footer */}
            <div className="border-t border-neutral-800 pt-3 mt-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300">↑↓</kbd>
                    <span>Navegar</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300">↵</kbd>
                    <span>Abrir</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-300">ESC</kbd>
                  <span>Fechar</span>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
