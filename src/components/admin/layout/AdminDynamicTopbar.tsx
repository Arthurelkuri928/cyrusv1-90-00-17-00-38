import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, Filter, ArrowDownUp, Eye, Rows, 
  Download, UserPlus, Plus, Check, Send 
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getTopBarTabs, getTopBarActions } from '../config/topBarConfig';

interface FilterState {
  group: string;
  sort: string;
  view: string;
  filter: string;
}

const iconMap = {
  Rows,
  ArrowDownUp,
  Eye,
  Filter,
  Download,
  UserPlus,
  Plus,
  Check,
  Send,
};

export const AdminDynamicTopbar: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    group: 'Nenhum',
    sort: 'Última modificação',
    view: 'Lista',
    filter: 'Todos'
  });

  // Obter configuração baseada na rota atual
  const currentPath = location.pathname;
  const tabs = getTopBarTabs(currentPath);
  const actions = getTopBarActions(currentPath);

  // Atualizar aba ativa quando a rota muda
  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [currentPath, tabs]);

  // Handle user tab filtering
  const handleTabClick = (tab: any) => {
    setActiveTab(tab.id);
    
    // For users page, update URL hash to trigger filtering
    if (currentPath === '/painel-admin/usuarios' && 'filterStatus' in tab) {
      window.location.hash = tab.id;
      // Trigger a custom event for the users component to listen to
      window.dispatchEvent(new CustomEvent('userFilterChange', { 
        detail: { status: tab.filterStatus, tabId: tab.id }
      }));
    }
  };

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
      <PopoverContent className="w-48 p-2 bg-card border border-border">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`
              w-full text-left px-3 py-2 rounded-md text-sm transition-colors
              ${value === option 
                ? 'bg-accent text-foreground' 
                : 'text-foreground hover:bg-accent-hover'
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
      {/* Lado Esquerdo: Abas de Navegação Dinâmicas */}
      <div className="flex items-center gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`
              relative transition-colors hover:text-white
              ${activeTab === tab.id ? 'text-white' : ''}
            `}
          >
            {tab.label}
            {/* Indicador de aba ativa */}
            {activeTab === tab.id && (
              <div className="absolute -bottom-3 left-0 h-[2px] w-full bg-purple-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Lado Direito: Ações Dinâmicas */}
      <div className="flex items-center gap-5">
        {actions.map((action) => {
          const IconComponent = iconMap[action.icon as keyof typeof iconMap];
          
          // Para ações que usam popover (filtros padrão do sistema)
          if (action.id === 'agrupar') {
            return (
              <FilterPopover
                key={action.id}
                trigger={
                  <button className="flex items-center gap-2 transition-colors hover:text-white">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span>{action.label}</span>
                  </button>
                }
                options={groupOptions}
                value={filters.group}
                onSelect={(value) => setFilters(prev => ({ ...prev, group: value }))}
              />
            );
          }

          if (action.id === 'ordenar') {
            return (
              <FilterPopover
                key={action.id}
                trigger={
                  <button className="flex items-center gap-2 transition-colors hover:text-white">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span>{action.label}</span>
                  </button>
                }
                options={sortOptions}
                value={filters.sort}
                onSelect={(value) => setFilters(prev => ({ ...prev, sort: value }))}
              />
            );
          }

          if (action.id === 'visualizar') {
            return (
              <FilterPopover
                key={action.id}
                trigger={
                  <button className="flex items-center gap-2 transition-colors hover:text-white">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span>{action.label}</span>
                  </button>
                }
                options={viewOptions}
                value={filters.view}
                onSelect={(value) => setFilters(prev => ({ ...prev, view: value }))}
              />
            );
          }

          if (action.id === 'filtrar' || action.id === 'filtrar_cargo' || action.id === 'filtrar_categoria') {
            return (
              <FilterPopover
                key={action.id}
                trigger={
                  <button className="flex items-center gap-2 transition-colors hover:text-white">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span>{action.label}</span>
                  </button>
                }
                options={filterOptions}
                value={filters.filter}
                onSelect={(value) => setFilters(prev => ({ ...prev, filter: value }))}
              />
            );
          }

          // Para ações primárias (botões de ação)
          if (action.primary) {
            return (
              <button
                key={action.id}
                onClick={() => console.log(`Ação: ${action.id}`)}
                className="h-9 rounded-md bg-[#8A2BE2] px-4 text-white hover:bg-purple-700 flex items-center gap-2 transition-colors"
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{action.label}</span>
              </button>
            );
          }

          // Para ações secundárias
          return (
            <button
              key={action.id}
              onClick={() => console.log(`Ação: ${action.id}`)}
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span>{action.label}</span>
            </button>
          );
        })}
        
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