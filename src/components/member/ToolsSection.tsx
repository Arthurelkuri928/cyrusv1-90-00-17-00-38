
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToolsFilter } from "@/hooks/useToolsFilter";
import { ToolCardProps } from "./ToolCard";
import ToolsHeader from "./ToolsHeader";
import CategoryDropdown from "./CategoryDropdown";
import ToolsGrid from "./ToolsGrid";
import EmptyState from "./EmptyState";
import { Loader } from "@/design-system/atoms/Loader/Loader";
import { useLanguage } from "@/contexts/LanguageContext";

interface ToolsSectionProps {
  title?: string;
  tools: ToolCardProps[];
  filterCategory?: string;
}

const ToolsSection = ({
  title,
  tools,
  filterCategory
}: ToolsSectionProps) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const {
    activeCategory,
    searchTerm,
    filteredTools,
    isLoading,
    isFavoritesPage,
    handleCategoryChange,
    handleSearchChange,
    resetFilters
  } = useToolsFilter({ tools, filterCategory });

  const handleNavigateToTools = () => {
    window.location.href = "/area-membro";
  };

  // Use translated catalog title if no title is provided
  const displayTitle = title || t('catalogTitle');

  return (
    <motion.section 
      className="w-full bg-background dark:bg-zinc-900 relative overflow-hidden py-8 sm:py-12 md:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div id="catalog-section" className="container mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <ToolsHeader
          title={displayTitle}
          toolCount={filteredTools.length}
          searchTerm={searchTerm}
          viewMode={viewMode}
          isFavoritesPage={isFavoritesPage}
          onSearchChange={handleSearchChange}
          onViewModeChange={setViewMode}
        />
        
        {!isFavoritesPage && (
          <CategoryDropdown
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-16"
            >
              <Loader size="lg" variant="cyrus" />
            </motion.div>
          ) : filteredTools.length === 0 ? (
            <EmptyState
              key="empty"
              isFavoritesPage={isFavoritesPage}
              searchTerm={searchTerm}
              onResetFilters={resetFilters}
              onNavigateToTools={handleNavigateToTools}
            />
          ) : (
            <ToolsGrid
              key="content"
              tools={filteredTools}
              viewMode={viewMode}
            />
          )}
        </AnimatePresence>
        
        {filteredTools.length > 0 && (
          <motion.div
            className="mt-8 sm:mt-12 md:mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-muted-foreground text-base sm:text-lg">
              {isFavoritesPage ? t('showingFavorites') : t('showing')}{" "}
              <span className="text-purple-600 font-semibold">
                {filteredTools.length}
              </span>{" "}
              {isFavoritesPage 
                ? `${filteredTools.length === 1 ? t('favoriteToolsCountSingle') : t('favoriteToolsCount')}` 
                : `${t('of')} ${tools.length} ${t('toolsAvailable')}`
              }
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default ToolsSection;
