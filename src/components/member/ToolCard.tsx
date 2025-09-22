import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ToolCardProps {
  id: number;
  title: string;
  logoImage: string;
  bgColor: string;
  textColor: string;
  status: "online" | "maintenance" | "offline" | "active" | "inactive";
  category: string;
  viewMode?: "grid" | "list";
}

const ToolCard = ({ id, title, logoImage, bgColor, textColor, status, category, viewMode = "grid" }: ToolCardProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  // Check if this tool is in favorites on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(savedFavorites.includes(id));
  }, [id]);
  
  // Function to translate category
  const getTranslatedCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'IA': t('categoryIA'),
      'Inteligência Artificial': t('categoryIA'),
      'Artificial Intelligence': t('categoryIA'),
      'Inteligencia Artificial': t('categoryIA'),
      'Espionagem': t('categoryEspionagem'),
      'Espionage': t('categoryEspionagem'),
      'Espionaje': t('categoryEspionagem'),
      'Mineração': t('categoryMineracao'),
      'Mining': t('categoryMineracao'),
      'Minería': t('categoryMineracao'),
      'SEO': t('categorySEO'),
      'SEO / Análise': t('categorySEO'),
      'Streaming': t('categoryStreaming'),
      'Design': t('categoryDesign'),
      'Design/Criação': t('categoryDesignCriacao'),
      'Design/Creation': t('categoryDesignCriacao'),
      'Diseño/Creación': t('categoryDesignCriacao'),
      'Diversos': t('categoryDiversos'),
      'Miscellaneous': t('categoryDiversos'),
      'Varios': t('categoryDiversos'),
      'Offline': t('categoryOffline'),
      'Manutenção': t('categoryManutencao'),
      'Maintenance': t('categoryManutencao'),
      'Mantenimiento': t('categoryManutencao')
    };
    
    return categoryMap[category] || category;
  };
  
  // Function to translate status
  const getTranslatedStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'online': t('statusOnline'),
      'maintenance': t('statusMaintenance'),
      'offline': t('statusOffline')
    };
    
    return statusMap[status] || status;
  };
  
  const getStatusInfo = () => {
    switch(status) {
      case "online":
      case "active":
        return { 
          color: "bg-green-500", 
          label: getTranslatedStatus("online"),
          glow: "shadow-green-500/30"
        };
      case "maintenance":
        return { 
          color: "bg-orange-500", 
          label: getTranslatedStatus("maintenance"),
          glow: "shadow-orange-500/30"
        };
      case "offline":
      case "inactive":
        return { 
          color: "bg-gray-500", 
          label: getTranslatedStatus("offline"),
          glow: "shadow-gray-500/30"
        };
      default:
        return { 
          color: "bg-gray-500", 
          label: "Desconhecido",
          glow: "shadow-gray-500/30"
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  // Toggle favorite status with global event dispatch
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // Save to localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (newFavoriteState) {
      localStorage.setItem('favorites', JSON.stringify([...savedFavorites, id]));
    } else {
      localStorage.setItem('favorites', JSON.stringify(savedFavorites.filter((favId: number) => favId !== id)));
    }

    // Dispatch custom event to notify other components/pages about the favorite change
    window.dispatchEvent(new CustomEvent('favoriteUpdated', { detail: { id, isFavorite: newFavoriteState } }));
  };

  const cardVariants = {
    rest: {
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    rest: {
      opacity: 0,
      transition: { duration: 0.2 }
    },
    hover: {
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden h-[130px] w-full cursor-pointer group shadow-lg dark:shadow-none light:shadow-black/15 hover:shadow-xl light:hover:shadow-black/20 transition-shadow duration-300"
      style={{ 
        backgroundColor: bgColor || "#111"
      }}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      onClick={() => navigate(`/ferramenta/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status indicator - Simplified and fixed positioning */}
      <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
        <div className={`h-2 w-2 rounded-full ${statusInfo.color} animate-pulse`} />
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-sm">
          {statusInfo.label}
        </span>
      </div>
      
      {/* Favorite button */}
      <motion.div
        className="absolute top-2 left-2 z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setIsFavoriteHovered(true)}
        onMouseLeave={() => setIsFavoriteHovered(false)}
        onClick={toggleFavorite}
      >
        <motion.div 
          className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer backdrop-blur-sm transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500/80' 
              : 'bg-zinc-900/60 hover:bg-zinc-800/60 dark:bg-zinc-700/60 dark:hover:bg-zinc-600/60'
          }`}
        >
          <Heart 
            size={10} 
            className={`transition-all duration-200 ${
              isFavorite ? 'text-white' : 'text-zinc-300 dark:text-zinc-400'
            }`}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </motion.div>
      </motion.div>
      
      {/* Card layout */}
      <div className="flex h-full relative z-10">
        {/* Logo side */}
        <div className="w-2/5 flex items-center justify-center p-4 border-r border-white/10 relative">
          {logoImage && !logoError ? (
            <motion.div 
              className="flex items-center justify-center w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={logoImage} 
                alt={title} 
                className="max-w-[90%] max-h-[90%] object-contain" 
                onError={() => setLogoError(true)}
              />
            </motion.div>
          ) : (
            <motion.div 
              className={`text-4xl font-bold flex items-center justify-center ${textColor === 'white' ? 'text-white' : 'text-black'}`}
              whileHover={{ scale: 1.05 }}
            >
              {title.charAt(0)}
            </motion.div>
          )}
        </div>
        
        {/* Content side */}
        <div className="w-3/5 flex flex-col justify-center p-4 relative">
          <motion.h3 
            className={`text-lg font-bold ${textColor === 'white' ? 'text-white' : 'text-black'} line-clamp-1 mb-1`}
          >
            {title}
          </motion.h3>
          
          <motion.div 
            className={`text-xs ${textColor === 'white' ? 'text-white/70' : 'text-black/70'} flex items-center gap-1`}
          >
            <Zap size={10} className="opacity-70" />
            {getTranslatedCategory(category)}
          </motion.div>
          
          {/* Hover overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-r-xl"
                variants={overlayVariants}
                initial="rest"
                animate="hover"
                exit="rest"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="purpleDark"
                    size="sm"
                    className="text-white bg-purple-600 hover:bg-purple-700 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/ferramenta/${id}`);
                    }}
                  >
                    <span className="mr-2">{t('accessButton')}</span>
                    <ArrowRight size={14} />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolCard;