
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyStateProps {
  isFavoritesPage?: boolean;
  searchTerm?: string;
  onResetFilters: () => void;
  onNavigateToTools: () => void;
}

const EmptyState = ({ 
  isFavoritesPage, 
  searchTerm, 
  onResetFilters, 
  onNavigateToTools 
}: EmptyStateProps) => {
  const { t } = useLanguage();

  console.log('🔍 [EMPTY STATE] Renderizando estado vazio:', {
    isFavoritesPage,
    searchTerm,
    timestamp: new Date().toISOString()
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-24 h-24 mb-6 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-purple-600 dark:text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {isFavoritesPage ? t('noFavorites') : t('noToolsFound')}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {isFavoritesPage 
          ? t('addToolsToFavorites')
          : searchTerm 
            ? t('tryDifferentSearch')
            : t('loadingError')
        }
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {searchTerm && (
          <Button 
            onClick={onResetFilters} 
            variant="outline"
            className="px-6"
          >
            {t('clearFilters')}
          </Button>
        )}
        
        {!isFavoritesPage && (
          <Button 
            onClick={onNavigateToTools}
            className="px-6"
          >
            {searchTerm ? t('exploreAllTools') : t('tryAgain')}
          </Button>
        )}
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded border text-xs text-yellow-800 dark:text-yellow-200">
          <strong>Debug Info:</strong> Empty state renderizado. 
          Verifique os logs do console para mais detalhes sobre o carregamento das ferramentas.
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
