
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ModernSidebar from "@/components/member/ModernSidebar";
import ToolsSection from "@/components/member/ToolsSection";
import MemberFooter from "@/components/member/MemberFooter";
import { ToolCardProps } from "@/components/member/ToolCard";
import { useToolsStore } from "@/app/store/tools.store";
import { mapToolToCardProps, segregateToolsByMaintenance } from "@/utils/toolMapping";
import { useUniversalAuth } from "@/hooks/useUniversalAuth";
import { useAuth } from "@/contexts/AuthContext";

const Favorites = () => {
  const navigate = useNavigate();
  const [favoriteTools, setFavoriteTools] = useState<ToolCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { tools, fetchTools } = useToolsStore();
  const { userRole } = useUniversalAuth();
  const { user } = useAuth();
  
  // Check if user is admin based on role
  const isAdmin = userRole && userRole.length > 0 && userRole[0]?.role === 'admin';

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      
      // Ensure tools are loaded
      if (tools.length === 0) {
        await fetchTools();
      }
      
      // Get favorites from localStorage and normalize format
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        
        // Normalize favorites to array of IDs (handle both old object format and new ID format)
        const favoriteIds: number[] = parsedFavorites.map((fav: any) => 
          typeof fav === 'object' ? Number(fav.id) : Number(fav)
        );
        
        // Filter and map tools that are in favorites
        let filteredTools = tools.filter((tool) => favoriteIds.includes(Number(tool.id)));
        
        // If user is not admin, show tools that are active OR in maintenance
        if (!isAdmin) {
          filteredTools = filteredTools.filter(tool => tool.is_active === true || tool.is_maintenance === true);
          console.log(`🔐 Filtering favorite tools for end-user: ${filteredTools.length} active/maintenance favorites shown`);
        } else {
          console.log(`👑 Admin user: showing all ${filteredTools.length} favorite tools (including inactive)`);
        }
        
        // Segregate and order tools (maintenance tools at the end)
        const { orderedTools } = segregateToolsByMaintenance(filteredTools);
        const mappedFavorites = orderedTools.map(mapToolToCardProps);
        
        setFavoriteTools(mappedFavorites);
        console.log(`📱 Loaded ${mappedFavorites.length} favorite tools from ${favoriteIds.length} stored IDs with maintenance segregation`);
      } else {
        setFavoriteTools([]);
      }
      
      setIsLoading(false);
    };

    loadFavorites();
  }, [tools, fetchTools, isAdmin]);

  // Listen for favorite updates from other components
  useEffect(() => {
    const handleFavoriteUpdate = () => {
      // Reload favorites when they change
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        const favoriteIds: number[] = parsedFavorites.map((fav: any) => 
          typeof fav === 'object' ? Number(fav.id) : Number(fav)
        );
        
        let filteredTools = tools.filter((tool) => favoriteIds.includes(Number(tool.id)));
        
        // If user is not admin, show tools that are active OR in maintenance
        if (!isAdmin) {
          filteredTools = filteredTools.filter(tool => tool.is_active === true || tool.is_maintenance === true);
        }
        
        // Segregate and order tools (maintenance tools at the end)
        const { orderedTools } = segregateToolsByMaintenance(filteredTools);
        const mappedFavorites = orderedTools.map(mapToolToCardProps);
        
        setFavoriteTools(mappedFavorites);
      } else {
        setFavoriteTools([]);
      }
    };

    window.addEventListener('favoriteUpdated', handleFavoriteUpdate);
    return () => window.removeEventListener('favoriteUpdated', handleFavoriteUpdate);
  }, [tools, isAdmin]);

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <ModernSidebar 
        username={user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'}
        onProfileClick={handleProfileClick}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative md:ml-20"
      >
        <ToolsSection
          tools={favoriteTools}
          title="Suas Ferramentas Favoritas"
          filterCategory="favorites"
        />
        
        {/* Member Footer */}
        <MemberFooter />
      </motion.main>
    </div>
  );
};

export default Favorites;
