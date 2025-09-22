import React, { useState } from 'react';
import { Search, Filter, ArrowDownUp, Eye, Rows } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterState {
  group: string;
  sort: string;
  view: string;
  filter: string;
}

export const AdminDashboardTopbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');
  const [filters, setFilters] = useState<FilterState>({
    group: 'Nenhum',
    sort: 'Última modificação',
    view: 'Lista',
    filter: 'Todos'
  });

  const tabs = [
    'Todos',
    'Meus docs', 
    'Favoritos',
    'Compartilhados',
    'Removidos'
  ];

  const groupOptions = ['Nenhum', 'Tipo', 'Autor', 'Data', 'Status'];
  const sortOptions = ['Última modificação', 'Nome', 'Criado', 'Tamanho'];
  const viewOptions = ['Lista', 'Grade', 'Cartão'];
  const filterOptions = ['Todos', 'Diagnósticos', 'Usuários', 'Ferramentas', 'Notificações'];

  const FilterPopover = ({ 
    trigger, 
    options, 
    value, 
    onSelect 
  }: {
    trigger: React.ReactNode;
    options: string[];
    value: string;
    onSelect: (value: string) => void;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-modal-bg border border-border">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`
              w-full text-left px-3 py-2 rounded-md text-sm transition-colors
              ${value === option 
                ? 'bg-primary text-primary-foreground' 
                : 'text-card-foreground hover:bg-accent'
              }
            `}
          >
            {option}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );

  return (
    <nav className="flex h-16 w-full items-center justify-between bg-[#111111] px-8 text-sm font-medium text-neutral-400">
      {/* Lado Esquerdo: Abas de Navegação */}
      <div className="flex items-center gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              relative transition-colors hover:text-white
              ${activeTab === tab ? 'text-white' : ''}
            `}
          >
            {tab}
            {/* Indicador de aba ativa */}
            {activeTab === tab && (
              <div className="absolute -bottom-3 left-0 h-[2px] w-full bg-purple-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Lado Direito: Controles de Ação */}
      <div className="flex items-center gap-5">
        <FilterPopover
          trigger={
            <button className="flex items-center gap-2 transition-colors hover:text-white">
              <Rows className="h-4 w-4" />
              <span>Agrupar</span>
            </button>
          }
          options={groupOptions}
          value={filters.group}
          onSelect={(value) => setFilters(prev => ({ ...prev, group: value }))}
        />

        <FilterPopover
          trigger={
            <button className="flex items-center gap-2 transition-colors hover:text-white">
              <ArrowDownUp className="h-4 w-4" />
              <span>Ordenar</span>
            </button>
          }
          options={sortOptions}
          value={filters.sort}
          onSelect={(value) => setFilters(prev => ({ ...prev, sort: value }))}
        />

        <FilterPopover
          trigger={
            <button className="flex items-center gap-2 transition-colors hover:text-white">
              <Eye className="h-4 w-4" />
              <span>Visualizar</span>
            </button>
          }
          options={viewOptions}
          value={filters.view}
          onSelect={(value) => setFilters(prev => ({ ...prev, view: value }))}
        />

        <FilterPopover
          trigger={
            <button className="flex items-center gap-2 transition-colors hover:text-white">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </button>
          }
          options={filterOptions}
          value={filters.filter}
          onSelect={(value) => setFilters(prev => ({ ...prev, filter: value }))}
        />
        
        {/* Campo de Busca */}
        <div className="relative ml-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-48 rounded-md border border-neutral-700 bg-transparent py-1.5 pl-9 pr-3 text-sm text-white placeholder-neutral-500 transition-all duration-300 focus:w-56 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>
    </nav>
  );
};