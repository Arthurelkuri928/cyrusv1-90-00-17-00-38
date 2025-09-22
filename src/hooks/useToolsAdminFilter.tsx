
import { useState, useEffect, useMemo } from "react";
import { Tool } from "@/shared/types/tool";

interface UseToolsAdminFilterProps {
  tools: Tool[];
}

export const useToolsAdminFilter = ({ tools }: UseToolsAdminFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // Padrão para "grid"
  const [isLoading, setIsLoading] = useState(false);

  // Extrair categorias dinamicamente das ferramentas
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>();
    tools.forEach(tool => {
      if (tool.category && tool.category.trim()) {
        categorySet.add(tool.category.trim());
      }
    });
    
    const sortedCategories = Array.from(categorySet).sort();
    return [
      { value: "all", label: "Todas as Categorias", originalValue: "all" },
      ...sortedCategories.map(cat => ({
        value: cat.toLowerCase().replace(/\s+/g, '_'),
        label: cat,
        originalValue: cat
      }))
    ];
  }, [tools]);

  // Filtrar ferramentas baseado nos critérios
  const filteredTools = useMemo(() => {
    let result = tools;

    // Filtro por termo de pesquisa
    if (searchTerm) {
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (tool.category && tool.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por categoria
    if (selectedCategory !== "all") {
      result = result.filter(tool => {
        if (!tool.category) return false;
        const normalizedCategory = tool.category.toLowerCase().replace(/\s+/g, '_');
        return normalizedCategory === selectedCategory;
      });
    }

    // Filtro por status
    if (selectedStatus !== "all") {
      result = result.filter(tool => {
        if (selectedStatus === "active") return tool.is_active && !tool.is_maintenance;
        if (selectedStatus === "inactive") return !tool.is_active && !tool.is_maintenance;
        if (selectedStatus === "maintenance") return tool.is_maintenance;
        return true;
      });
    }

    return result;
  }, [tools, searchTerm, selectedCategory, selectedStatus]);

  // Carregar preferência de visualização no localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('admin_tools_view_mode');
    if (savedViewMode && ['grid', 'list'].includes(savedViewMode)) {
      setViewMode(savedViewMode as "grid" | "list");
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setIsLoading(true);
    setSearchTerm(value);
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleStatusChange = (status: string) => {
    setIsLoading(true);
    setSelectedStatus(status);
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    console.log('🔄 Mudando modo de visualização de', viewMode, 'para', mode);
    setViewMode(mode);
    localStorage.setItem('admin_tools_view_mode', mode);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  return {
    searchTerm,
    selectedCategory,
    selectedStatus,
    viewMode,
    filteredTools,
    availableCategories,
    isLoading,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleViewModeChange,
    resetFilters
  };
};
