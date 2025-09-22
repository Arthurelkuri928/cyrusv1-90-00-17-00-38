import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ModernSidebar from "@/components/member/ModernSidebar";
import VimeoCarousel from "@/components/member/VimeoCarousel";
import ToolsSection from "@/components/member/ToolsSection";
import MemberFooter from "@/components/member/MemberFooter";
import ToolsDiagnosticPanel from "@/components/member/ToolsDiagnosticPanel";
import { ToolCardProps } from "@/components/member/ToolCard";
import { useToolsStore } from "@/app/store/tools.store";
import { useRealtimeTools } from "@/hooks/useRealtimeTools";
import { mapToolToCardProps, segregateToolsByMaintenance } from "@/utils/toolMapping";
import { useAuth } from "@/contexts/AuthContext";
import { useUniversalAuth } from "@/hooks/useUniversalAuth";
const MemberArea = () => {
  const navigate = useNavigate();
  const [enhancedTools, setEnhancedTools] = useState<ToolCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    user
  } = useAuth();
  const {
    userRole
  } = useUniversalAuth();

  // Check if user is admin based on role
  const isAdmin = userRole && userRole.length > 0 && userRole[0]?.role === 'admin';
  const {
    tools,
    isLoading: storeLoading,
    fetchTools,
    setAdminUpdateInProgress
  } = useToolsStore();
  const {
    setAdminUpdateFlag
  } = useRealtimeTools();

  // Page visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Load tools on component mount
  useEffect(() => {
    const loadTools = async () => {
      setIsLoading(true);
      try {
        await fetchTools(undefined, true); // Force refresh on initial load
      } catch (error) {
        console.error('Failed to load tools:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTools();
  }, [fetchTools]);

  // Map Supabase tools to ToolCardProps when tools change
  useEffect(() => {
    console.log('🔄 [MEMBER AREA] Processando ferramentas:', {
      totalTools: tools.length,
      isAdmin,
      timestamp: new Date().toISOString()
    });
    if (tools.length > 0) {
      // Filter tools based on user role
      let filteredTools = tools;

      // If user is not admin, show tools that are active OR in maintenance
      if (!isAdmin) {
        const beforeFilter = filteredTools.length;
        filteredTools = tools.filter(tool => {
          const shouldShow = tool.is_active === true || tool.is_maintenance === true;
          console.log(`🔍 Tool ${tool.id} (${tool.name}): is_active=${tool.is_active}, is_maintenance=${tool.is_maintenance}, shouldShow=${shouldShow}`);
          return shouldShow;
        });
        console.log(`🔐 Filtering tools for end-user: ${filteredTools.length}/${beforeFilter} tools shown after filtering`);
      } else {
        console.log(`👑 Admin user: showing all ${tools.length} tools (including inactive)`);
      }

      // Segregate and order tools (maintenance tools at the end)
      const {
        orderedTools
      } = segregateToolsByMaintenance(filteredTools);
      const mappedTools = orderedTools.map(mapToolToCardProps);
      console.log(`✅ Final result: ${mappedTools.length} tools mapped and ready for display`);
      setEnhancedTools(mappedTools);
    } else {
      console.log('⚠️ [MEMBER AREA] No tools found in store');
      setEnhancedTools([]);
    }
  }, [tools, isAdmin]);

  // Refresh when page becomes visible
  useEffect(() => {
    if (isVisible) {
      console.log('📱 Page became visible, refreshing tools...');
      fetchTools(undefined, true);
    }
  }, [isVisible, fetchTools]);

  // Sync admin update flags between store and realtime hook
  useEffect(() => {
    setAdminUpdateFlag(false); // Initialize realtime flag
  }, [setAdminUpdateFlag]);
  const handleNavigateToTool = useCallback((toolId: string | number) => {
    navigate(`/ferramenta/${toolId}`);
  }, [navigate]);
  const handleProfileClick = () => {
    navigate('/perfil');
  };
  return <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <ModernSidebar username={user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'} onProfileClick={handleProfileClick} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <motion.main initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5
    }} className="relative md:ml-20">
        {/* Video Carousel */}
        <VimeoCarousel />
        
        {/* Diagnostic Panel - Only shows when there are issues */}
        
        
        {/* Tools Section */}
        <ToolsSection tools={enhancedTools} title="Catálogo de Ferramentas Premium" />
        
        {/* Member Footer */}
        <MemberFooter />
      </motion.main>
    </div>;
};
export default MemberArea;