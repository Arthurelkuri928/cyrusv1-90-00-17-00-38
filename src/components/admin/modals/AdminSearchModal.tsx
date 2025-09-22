import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../../../contexts/AdminDashboardContext';
import { adminNavigationData } from '../../../data/adminNavigationData';

export const AdminSearchModal: React.FC = () => {
  const { isSearchModalOpen, setSearchModalOpen } = useAdminDashboard();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Flatten navigation data for search
  const allPages = useMemo(() => {
    const pages: Array<{
      id: string;
      label: string;
      href: string;
      icon: React.ElementType;
      category: string;
    }> = [];

    adminNavigationData.forEach(section => {
      section.items.forEach(item => {
        pages.push({
          id: item.id,
          label: item.label,
          href: item.href,
          icon: item.icon,
          category: section.label || 'Navegação'
        });
      });
    });

    return pages;
  }, []);

  // Filter categories based on actual sections
  const filterCategories = useMemo(() => {
    return [...new Set(adminNavigationData.map(section => section.label).filter(Boolean))];
  }, []);

  // Filter pages based on search query and active filters
  const filteredResults = useMemo(() => {
    return allPages.filter(page => {
      const matchesQuery = !searchQuery || 
        page.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = activeFilters.length === 0 || 
        activeFilters.some(filter => page.category === filter);

      return matchesQuery && matchesFilter;
    });
  }, [allPages, searchQuery, activeFilters]);

  const toggleFilter = useCallback((filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const handlePageClick = useCallback((href: string) => {
    navigate(href);
    setSearchModalOpen(false);
    setSearchQuery('');
    setActiveFilters([]);
  }, [navigate, setSearchModalOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchModalOpen(false);
    } else if (e.key === 'Enter' && filteredResults.length > 0) {
      handlePageClick(filteredResults[0].href);
    }
  }, [filteredResults, handlePageClick, setSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSearchModalOpen(false)}
          className="absolute inset-0 bg-overlay backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-[52rem] mx-4 bg-modal-bg rounded-lg border border-border shadow-xl"
          onKeyDown={handleKeyDown}
        >
          <div className="p-4">
            {/* Search Input */}
            <div className="flex items-center border-b border-border pb-4 mb-4">
              <Search className="h-5 w-5 text-nav-item mr-3" />
              <input
                type="text"
                placeholder="Buscar no painel admin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg bg-transparent text-foreground placeholder-nav-item focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 hover:bg-accent rounded-md transition-colors ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {filterCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleFilter(category)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${activeFilters.includes(category)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchQuery || activeFilters.length > 0 ? (
                <div>
                  <p className="text-sm text-nav-item mb-3 px-1">
                    {searchQuery ? `Resultados para "${searchQuery}"` : 'Páginas filtradas'}
                  </p>
                  {filteredResults.length > 0 ? (
                    <div className="space-y-2">
                      {filteredResults.map((page, index) => {
                        const IconComponent = page.icon;
                        return (
                          <button
                            key={page.id}
                            onClick={() => handlePageClick(page.href)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent-hover transition-colors text-left"
                          >
                            <IconComponent className="h-4 w-4 text-nav-item flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {page.label}
                              </p>
                              <p className="text-sm text-nav-item">
                                {page.category}
                              </p>
                            </div>
                            <span className="text-xs text-nav-item bg-muted px-2 py-1 rounded">
                              {index + 1}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-nav-item">
                        Nenhuma página encontrada
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-nav-item">
                    Comece a digitar para buscar páginas...
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
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
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">⌘K</kbd>
                    <span>Ações</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">ESC</kbd>
                  <span>Fechar</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};