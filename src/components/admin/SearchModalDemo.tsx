import React, { useState, useEffect, FC, useMemo } from 'react';
import { Search, X, BarChart2, Users, Wrench, Bell, Shield, Filter, ChevronDown } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import * as Dialog from '@radix-ui/react-dialog';

// --- DADOS DE EXEMPLO PARA A BUSCA ---
const searchableData = [
  { id: 1, category: 'Diagnósticos', title: 'Relatório de Diagnósticos do Sistema', details: 'Análise completa do sistema e performance', icon: BarChart2 },
  { id: 2, category: 'Usuários', title: 'Usuários Ativos - Dashboard', details: 'Lista de usuários ativos no sistema', icon: Users },
  { id: 3, category: 'Ferramentas', title: 'Ferramentas Conectadas', details: 'Status das integrações de ferramentas', icon: Wrench },
  { id: 4, category: 'Notificações', title: 'Notificações Pendentes', details: 'Lista de notificações aguardando processamento', icon: Bell },
  { id: 5, category: 'Permissões', title: 'Configuração de Permissões', details: 'Configurações de acesso e permissoes do sistema', icon: Shield },
  { id: 6, category: 'Usuários', title: 'admin@empresa.com', details: 'Cargo: Admin Master', icon: Users },
  { id: 7, category: 'Diagnósticos', title: 'Log de Erros da API', details: 'Últimos erros registrados nas últimas 24h', icon: BarChart2 },
  { id: 8, category: 'Configurações', title: 'Configurações do Sistema', details: 'Configurações gerais da aplicação', icon: Shield },
];

const searchCategories = ['Diagnósticos', 'Usuários', 'Ferramentas', 'Notificações', 'Permissões', 'Configurações'];

// --- SUB-COMPONENTE: SearchModal ---
const SearchModal: FC<{ isOpen: boolean; onOpenChange: (open: boolean) => void; initialFilter?: string; }> = ({ isOpen, onOpenChange, initialFilter }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialFilter || 'Todos');

  const filteredData = useMemo(() => {
    if (!query && activeCategory === 'Todos') return searchableData.slice(0, 5); // Mostra recentes se não houver busca
    
    return searchableData.filter(item => {
      const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
      const matchesQuery = !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.details.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  useEffect(() => {
    if (isOpen) {
        setActiveCategory(initialFilter || 'Todos');
        setQuery('');
    }
  }, [isOpen, initialFilter]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/4 z-50 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-modal-bg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="flex items-center gap-4 p-4 border-b border-border">
            <Search className="h-5 w-5 text-nav-item" />
            <input 
              type="text" 
              placeholder="Buscar no painel admin..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="w-full bg-transparent text-foreground placeholder-nav-item focus:outline-none"
              autoFocus
            />
            <Dialog.Close className="text-nav-item hover:text-foreground">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Filter Categories */}
            <div className="flex flex-wrap items-center gap-2">
              {['Todos', ...searchCategories].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)} 
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    activeCategory === cat 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Results */}
            <div>
              <p className="text-xs font-semibold text-nav-item mb-3">
                {query ? 'Resultados da busca' : 'Resultados recentes'}
              </p>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredData.length > 0 ? filteredData.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-hover cursor-pointer transition-colors">
                    <item.icon className="h-5 w-5 text-nav-item flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-nav-item">{item.category} • {item.details}</p>
                    </div>
                    <span className="text-xs text-nav-item bg-muted px-2 py-1 rounded">
                      {index + 1}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-nav-item">Nenhum resultado encontrado para "{query}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with keyboard shortcuts */}
            <div className="border-t border-border pt-3 mt-4">
              <div className="flex items-center justify-between text-xs text-nav-item">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd>
                    <span>Navegar</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd>
                    <span>Abrir</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">ESC</kbd>
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

// --- COMPONENTE PRINCIPAL COM A SIDEBAR E O MODAL ---
export function SearchModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('Todos');

  return (
    <div className="flex h-screen w-full bg-background font-sans">
      <aside className="w-64 bg-sidebar-bg p-4 border-r border-border">
        <h1 className="text-xl font-bold text-foreground px-2 mb-6">Cyrus Admin</h1>
        
        <div className="relative mb-6">
          <div className="absolute left-0 top-0 h-full flex items-center z-10">
            {/* Dropdown de Filtro */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex items-center gap-1 p-2 text-nav-item hover:text-foreground transition-colors">
                  <Filter className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content 
                  side="bottom" 
                  align="start" 
                  sideOffset={8} 
                  className="w-48 rounded-lg border border-border bg-modal-bg p-2 shadow-lg z-50 animate-in fade-in-0 zoom-in-95"
                >
                  {['Todos', ...searchCategories].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setSearchFilter(cat)} 
                      className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                        searchFilter === cat 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
          
          <input 
            type="text" 
            placeholder="Buscar..." 
            onFocus={() => setIsModalOpen(true)}
            className="w-full rounded-md border border-border bg-transparent py-2 pl-14 pr-3 text-sm text-foreground placeholder-nav-item focus:outline-none focus:ring-2 focus:ring-primary" 
            readOnly
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-nav-item px-2">
            Filtro ativo: <span className="font-semibold text-foreground">{searchFilter}</span>
          </p>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-2">Dica:</p>
            <p className="text-xs text-nav-item">Clique na barra de busca para abrir o modal de busca avançada.</p>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 p-8 bg-background">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-4">Demo da Busca Funcional</h1>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground mb-4">
              Esta demonstração implementa uma funcionalidade de busca avançada com:
            </p>
            <ul className="space-y-2 text-sm text-nav-item">
              <li>• <strong>Modal de busca</strong> com overlay escuro (bg-black/80)</li>
              <li>• <strong>Filtragem em tempo real</strong> por texto e categoria</li>
              <li>• <strong>Dropdown de filtro</strong> na sidebar</li>
              <li>• <strong>Interface responsiva</strong> com animações suaves</li>
              <li>• <strong>Atalhos de teclado</strong> para melhor usabilidade</li>
            </ul>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Como usar:</strong> Clique na barra de busca na sidebar para abrir o modal de busca funcional.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <SearchModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        initialFilter={searchFilter} 
      />
    </div>
  );
}