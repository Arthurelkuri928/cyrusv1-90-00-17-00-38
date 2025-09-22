
import { useState, useEffect, useMemo } from "react";
import { ToolCardProps } from "@/components/member/ToolCard";
import { segregateToolsByMaintenance } from "@/utils/toolMapping";

interface UseToolsFilterProps {
  tools: ToolCardProps[];
  filterCategory?: string;
}

export const useToolsFilter = ({ tools, filterCategory }: UseToolsFilterProps) => {
  const [activeCategory, setActiveCategory] = useState(filterCategory || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFavoritesPage = filterCategory === "favorites";

  const filteredTools = useMemo(() => {
    let result: ToolCardProps[] = [];

    if (isFavoritesPage) {
      if (searchTerm) {
        result = tools.filter(tool => 
          tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          tool.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        result = tools;
      }
    } else {
      // First apply search filter
      let searchFiltered = tools;
      if (searchTerm) {
        searchFiltered = tools.filter(tool => 
          tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          tool.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (activeCategory === "all") {
        // For "all" category, segregate and order tools
        const normalTools = searchFiltered.filter(tool => tool.category !== 'Manutenção');
        const maintenanceTools = searchFiltered.filter(tool => tool.category === 'Manutenção');
        result = [...normalTools, ...maintenanceTools];
      } else if (activeCategory === "new") {
        // For "new" category, exclude maintenance tools and sort by ID
        const nonMaintenanceTools = searchFiltered.filter(tool => tool.category !== 'Manutenção');
        result = [...nonMaintenanceTools].sort((a, b) => b.id - a.id).slice(0, 12);
      } else if (activeCategory === "manutencao") {
        // Show only maintenance tools
        result = searchFiltered.filter(tool => tool.category === 'Manutenção');
      } else {
        // For other specific categories, exclude maintenance tools
        result = searchFiltered.filter(tool => {
          // Exclude maintenance tools from original categories
          if (tool.category === 'Manutenção') return false;
          
          const category = tool.category.toLowerCase();
          if (activeCategory === "ia" && category.includes("ia")) return true;
          if (activeCategory === "espionagem" && category.includes("espionagem")) return true;
          if (activeCategory === "mineracao" && category.includes("mineração")) return true;
          if (activeCategory === "seo" && category.includes("seo")) return true;
          if (activeCategory === "streaming" && category.includes("streaming")) return true;
          if (activeCategory === "design" && (category.includes("design") || category.includes("criação"))) return true;
          if (activeCategory === "diversos" && category.includes("diversos")) return true;
          return false;
        });
      }
    }

    return result;
  }, [tools, activeCategory, searchTerm, isFavoritesPage]);

  const handleCategoryChange = (categoryId: string) => {
    if (!isFavoritesPage) {
      setIsLoading(true);
      setActiveCategory(categoryId);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleSearchChange = (value: string) => {
    setIsLoading(true);
    setSearchTerm(value);
    setTimeout(() => setIsLoading(false), 300);
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchTerm("");
  };

  return {
    activeCategory,
    searchTerm,
    filteredTools,
    isLoading,
    isFavoritesPage,
    handleCategoryChange,
    handleSearchChange,
    resetFilters
  };
};
