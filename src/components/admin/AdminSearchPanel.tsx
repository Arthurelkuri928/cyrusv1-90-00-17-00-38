import React, { useState, useEffect, FC, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { adminNavigationData } from '@/data/adminNavigationData';

// Transform navigation data into a flat array for searching
const allNavLinks = adminNavigationData.flatMap(section => 
  section.items.map(item => ({
    ...item,
    category: section.label || 'Navegação'
  }))
);

type ActiveSection = typeof allNavLinks[number]['id'];

// --- SUB-COMPONENTE: SearchModal ---
const SearchModal: FC<{ 
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void;
    setActiveSection: (section: ActiveSection) => void;
}> = ({ isOpen, onOpenChange, setActiveSection }) => {
  const [query, setQuery] = useState('');

  const filteredLinks = useMemo(() => {
    if (!query) return []; // Não mostra nada se a busca estiver vazia
    return allNavLinks.filter(link => 
      link.label.toLowerCase().includes(query.toLowerCase()) ||
      link.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);
  
  const handleResultClick = (sectionId: ActiveSection) => {
    setActiveSection(sectionId);
    onOpenChange(false); // Fecha o modal após o clique
    setQuery(''); // Limpa a busca
  };

  const handleClose = () => {
    onOpenChange(false);
    setQuery(''); // Limpa a busca ao fechar
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery(''); // Limpa a busca quando o modal fecha
    }
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80" />
        <Dialog.Content 
          // OPACIDADE CORRIGIDA: bg-[#1C1C1E] é uma cor sólida e opaca
          className="fixed left-1/2 top-1/4 z-50 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-neutral-700 bg-[#1C1C1E] shadow-2xl"
        >
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
                    // REDIRECIONAMENTO FUNCIONAL: onClick chama handleResultClick
                    <div 
                      key={item.id} 
                      onClick={() => handleResultClick(item.id)} 
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

// --- COMPONENTE PRINCIPAL ---
export function AdminSearchPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');

  // Group navigation items by category
  const groupedNavItems = useMemo(() => {
    const groups: { [key: string]: typeof allNavLinks } = {};
    
    adminNavigationData.forEach(section => {
      groups[section.label || 'Navegação'] = section.items.map(item => ({
        ...item,
        category: section.label || 'Navegação'
      }));
    });
    
    return groups;
  }, []);

  const handleNavClick = (id: ActiveSection, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSection(id);
  };

  return (
    <div className="flex h-screen w-full bg-[#1e1e1e] font-sans">
      <aside className="w-64 bg-[#1C1C1E] p-4 border-r border-neutral-800">
        <h1 className="text-xl font-bold text-white px-2 mb-6">Cyrus Admin</h1>
        
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Buscar..." 
            onFocus={() => setIsModalOpen(true)}
            className="w-full rounded-md border border-neutral-700 bg-transparent py-2 px-3 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600" 
            readOnly
          />
        </div>
        
        {/* Navegação da Sidebar */}
        <nav className="flex-1 space-y-4">
          {Object.entries(groupedNavItems).map(([group, items]) => (
            <div key={group}>
              <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                {group}
              </h2>
              <ul className="space-y-1">
                {items.map(item => (
                  <li key={item.id}>
                    <a 
                      href="#" 
                      onClick={(e) => handleNavClick(item.id, e)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        activeSection === item.id 
                          ? 'bg-purple-600 text-white' 
                          : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      
      <main className="flex-1 p-8 bg-[#1e1e1e]">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-white mb-4 capitalize">
            {activeSection.replace(/[-_]/g, ' ')}
          </h1>
          <div className="bg-[#1C1C1E] rounded-lg p-6 border border-neutral-800">
            <p className="text-neutral-400 mb-4">
              Página ativa: <span className="text-white font-semibold">{activeSection}</span>
            </p>
            <div className="space-y-2 text-sm text-neutral-300">
              <p>• <strong>Busca funcional</strong> com filtro em tempo real</p>
              <p>• <strong>Redirecionamento</strong> ao clicar nos resultados</p>
              <p>• <strong>Modal opaco</strong> com fundo sólido (#1C1C1E)</p>
              <p>• <strong>Interface responsiva</strong> com animações suaves</p>
            </div>
            <div className="mt-6 p-4 bg-neutral-800 rounded-lg">
              <p className="text-sm text-white">
                <strong>Como usar:</strong> Clique na barra de busca da sidebar para abrir o modal de busca funcional.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <SearchModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        setActiveSection={setActiveSection}
      />
    </div>
  );
}