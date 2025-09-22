
import React from "react";
import { motion } from "framer-motion";
import { Grid3X3, Sparkles, Brain, Eye, Search, TrendingUp, Play, Palette, Package, Wrench, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryDropdownProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryDropdown = ({ activeCategory, onCategoryChange }: CategoryDropdownProps) => {
  const { t } = useLanguage();

  const categories = [
    { id: "all", label: t('allTools'), icon: Grid3X3 },
    { id: "new", label: t('newToolsFilter'), icon: Sparkles },
    { id: "ia", label: t('artificialIntelligence'), icon: Brain },
    { id: "espionagem", label: t('espionage'), icon: Eye },
    { id: "mineracao", label: t('mining'), icon: Search },
    { id: "seo", label: t('seo'), icon: TrendingUp },
    { id: "streaming", label: t('streaming'), icon: Play },
    { id: "design", label: t('design'), icon: Palette },
    { id: "diversos", label: t('miscellaneous'), icon: Package },
    { id: "manutencao", label: "Em Manutenção", icon: Wrench }
  ];

  const activeItem = categories.find(cat => cat.id === activeCategory);
  const ActiveIcon = activeItem?.icon || Grid3X3;

  return (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex justify-center">
        <Select value={activeCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-72 bg-background/80 dark:bg-zinc-800/80 border-border dark:border-zinc-700 shadow-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50">
            <div className="flex items-center gap-2">
              <ActiveIcon className="w-4 h-4 text-purple-600" />
              <SelectValue>
                <span className="font-medium">{activeItem?.label}</span>
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-background dark:bg-zinc-800 border-border dark:border-zinc-700 shadow-xl z-50 max-h-80">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 focus:bg-purple-100 dark:focus:bg-purple-900/30 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">{category.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default CategoryDropdown;
