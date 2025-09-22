
import { motion } from "framer-motion";
import { Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ToolsHeaderProps {
  title: string;
  toolCount: number;
  searchTerm: string;
  viewMode: "grid" | "list";
  isFavoritesPage: boolean;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
}

const ToolsHeader = ({
  title,
  toolCount,
  searchTerm,
  viewMode,
  isFavoritesPage,
  onSearchChange,
  onViewModeChange
}: ToolsHeaderProps) => {
  const { t } = useLanguage();

  return (
    <motion.div 
      className="flex flex-col md:flex-row md:items-center justify-between mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-foreground via-purple-600 to-foreground bg-clip-text dark:text-white light:text-black">
          {title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-500 mb-6"></div>
        <p className="text-muted-foreground text-lg">
          <span className="text-purple-600 font-semibold">{toolCount}</span>{" "}
          {isFavoritesPage ? t('favoriteToolsCount') : t('toolsAvailable')}
        </p>
      </motion.div>
      
      <div className="flex items-center gap-4 mt-6 md:mt-0">
        <motion.div className="relative" whileHover={{ scale: 1.02 }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={isFavoritesPage ? t('searchInFavorites') : t('searchTools')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 dark:bg-zinc-800/60 dark:backdrop-blur-xl dark:border-zinc-700 light:bg-white light:border-gray-300 light:focus:border-purple-500 shadow-lg light:shadow-black/10"
          />
        </motion.div>
        
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-1 dark:bg-zinc-800/60 dark:backdrop-blur-xl dark:border-zinc-700 light:bg-white light:border-gray-300 shadow-lg light:shadow-black/10">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={viewMode === "grid" ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-muted dark:hover:bg-zinc-700/50 light:hover:bg-gray-100"}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={viewMode === "list" ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-muted dark:hover:bg-zinc-700/50 light:hover:bg-gray-100"}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolsHeader;
