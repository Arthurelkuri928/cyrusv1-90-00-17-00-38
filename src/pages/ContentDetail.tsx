import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, ExternalLink, Bookmark, BookmarkCheck, Shield, Calendar, ChartBar, Copy, DollarSign, Tag, ChevronDown, ChevronUp, MessageSquare, Users, Zap, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToolCredentials } from "@/hooks/use-tool-credentials";
import ActionButtons from "@/components/ActionButtons";
import { useAuth } from "@/contexts/AuthContext";
import { ToolSidebar } from "@/components/tool/ToolSidebar";
import { MobileSidebarTrigger } from "@/components/tool/MobileSidebarTrigger";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SessionInjectionButton } from "@/components/ui/session-injection-button";
import { useTheme } from "@/contexts/ThemeContext";
import { useToolsStore } from "@/app/store/tools.store";
import { getContrastingTextColor } from "@/utils/toolMapping";
import { motion } from "framer-motion";

const ContentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [tool, setTool] = useState<any>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { user, session } = useAuth();
  const { theme } = useTheme();
  const { tools, fetchTools } = useToolsStore();

  const toolId = Number(id);

  // Fetch credentials for sidebar
  const { credentials, loading: loadingCredentials } = useToolCredentials(toolId || "");

  // Load tool from store or fetch if needed
  useEffect(() => {
    const loadTool = async () => {
      if (tools.length === 0) {
        await fetchTools();
      }
      
      const foundTool = tools.find(t => Number(t.id) === toolId);
      if (foundTool) {
        // Map Supabase tool to format expected by this component
        const mappedTool = {
          id: foundTool.id,
          title: foundTool.name,
          logoImage: foundTool.logo_url || foundTool.name.charAt(0),
          bgColor: foundTool.card_color || '#3B82F6',
          textColor: getContrastingTextColor(foundTool.card_color || '#3B82F6'),
          status: foundTool.is_maintenance ? 'maintenance' : 
                   foundTool.is_active ? 'online' : 'offline',
          category: foundTool.category || 'Diversos',
          access_url: foundTool.access_url,
          action_buttons: foundTool.action_buttons || []
        };
        setTool(mappedTool);
      }
    };

    if (toolId) {
      loadTool();
    }
  }, [toolId, tools, fetchTools]);

  // Support links
  const supportLinks = {
    whatsappSupport: "https://wa.me/5511999999999",
    humanSupport: "https://wa.me/5511999999998",
    networkGroup: "https://chat.whatsapp.com/network-group",
    channel: "https://t.me/channel"
  };

  // Tool benefits based on category
  const getToolBenefits = (category?: string) => {
    switch (category) {
      case "IA":
        return ["Economize até 99% em assinaturas premium de IAs", "Acesse recursos exclusivos bloqueados para usuários gratuitos", "Use sem limites de mensagens ou restrições de uso", "Todas as integrações e plugins disponíveis"];
      case "Design/Criação":
        return ["Acesse milhares de templates e recursos premium", "Baixe assets de alta qualidade sem marcas d'água", "Remova limitações de download e exportação", "Utilize todos os recursos profissionais sem pagar mensalidade"];
      case "Mineração":
        return ["Encontre produtos vencedores antes dos concorrentes", "Analise dados de mercado em tempo real", "Filtre oportunidades por taxa de conversão e lucratividade", "Descubra nichos inexplorados com alto potencial"];
      case "Espionagem":
        return ["Descubra exatamente quais anúncios seus concorrentes estão rodando", "Veja métricas de desempenho de campanhas de terceiros", "Analise estratégias de marketing dos líderes do mercado", "Identifique tendências antes que se tornem mainstream"];
      case "SEO / Análise":
        return ["Acesse dados competitivos completos sem restrições", "Analise backlinks, keywords e estratégias dos concorrentes", "Obtenha relatórios detalhados que normalmente custam centenas de reais", "Planeje estratégias baseadas em dados premium"];
      case "Streaming":
        return ["Acesse catálogo completo de filmes e séries sem mensalidade", "Compartilhe o acesso com familiares sem taxas adicionais", "Assista em múltiplos dispositivos simultaneamente", "Acesse conteúdos exclusivos de diferentes regiões"];
      default:
        return ["Economize centenas de reais em assinaturas premium", "Acesse recursos exclusivos normalmente bloqueados", "Utilize sem limitações ou restrições de uso", "Suporte técnico e atualizações constantes"];
    }
  };

  // Get theme-based styles with modern design tokens
  const getThemeStyles = () => {
    if (theme === 'light') {
      return {
        card: 'bg-white/95 border-[#E8E8E8]/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)]',
        cardHover: '',
        text: {
          primary: 'text-[#1A1A1A]',
          secondary: 'text-[#5F5F5F]',
          label: 'text-[#333333]'
        },
        button: {
          primary: 'bg-gradient-to-r from-[#6C47FF] to-[#8B5CF6] hover:from-[#5B38D8] hover:to-[#7C3AED] text-white shadow-[0_4px_16px_rgba(108,71,255,0.3)]',
          copy: 'text-[#6C47FF] hover:text-[#5B38D8] hover:bg-[#6C47FF]/5',
          white: 'bg-white/95 text-[#1A1A1A] hover:bg-white border border-[#E8E8E8]/50'
        },
        badge: {
          green: 'bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/20',
          purple: 'bg-[#6C47FF]/10 text-[#6C47FF] border-[#6C47FF]/20',
          category: 'bg-[#F5F5F5]/95 text-[#333333] border-[#E0E0E0]/50'
        },
        accordion: 'bg-white/95 border-[#E8E8E8]/40',
        supportCard: 'bg-white/95 border-[#E8E8E8]/40 hover:bg-white',
        iconBg: 'bg-[#6C47FF]/10 border-[#6C47FF]/20',
        instructionText: 'text-[#333333]',
        instructionTitle: 'text-[#6C47FF]',
        heroOverlay: 'bg-gradient-to-b from-black/20 via-transparent to-[#FAFAFA]',
        glassEffect: 'bg-white/95 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]'
      };
    } else {
      return {
        card: 'bg-zinc-900/60 border-purple-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        cardHover: '',
        text: {
          primary: 'text-foreground',
          secondary: 'text-zinc-400',
          label: 'text-zinc-300'
        },
        button: {
          primary: 'bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white shadow-[0_4px_16px_rgba(168,85,247,0.4)]',
          copy: 'text-purple-400 hover:text-white hover:bg-purple-500/10',
          white: 'bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700/80 text-white'
        },
        badge: {
          green: 'bg-green-500/10 text-green-400 border-green-500/20',
          purple: 'bg-purple-600/10 text-purple-400 border-purple-500/20',
          category: 'bg-zinc-800/70 text-zinc-300 border-zinc-700/40'
        },
        accordion: 'bg-zinc-900/60 border-purple-500/10',
        supportCard: 'bg-zinc-900/50 border-zinc-800/40 hover:bg-zinc-800/60',
        iconBg: 'bg-purple-600/10 border-purple-500/20',
        instructionText: 'text-foreground',
        instructionTitle: 'text-purple-400',
        heroOverlay: 'bg-gradient-to-b from-black/20 via-transparent to-[#18181B]',
        glassEffect: 'bg-zinc-900/80 border-zinc-800/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
      };
    }
  };

  const styles = getThemeStyles();

  // Check authentication
  useEffect(() => {
    if (!user || !session) {
      navigate("/entrar");
    } else {
      setIsAuthenticated(true);
    }

    // Check if the tool is in favorites - normalize to handle both formats
    const favorites = localStorage.getItem("favorites");
    if (favorites) {
      const parsedFavorites = JSON.parse(favorites);
      
      // Normalize favorites to array of IDs
      const favoriteIds = parsedFavorites.map((fav: any) => 
        typeof fav === 'object' ? fav.id : fav
      );
      
      setIsFavorite(favoriteIds.includes(toolId));
    }
  }, [navigate, toolId, user, session]);

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
      'Spying': t('categoryEspionagem'),
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
      'Others': t('categoryDiversos'),
      'Otros': t('categoryDiversos'),
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

  const handleCopyCookie = () => {
    navigator.clipboard.writeText("COOKIE_EXEMPLO_123");
    setJustCopied(true);
    toast({
      title: t('cookieCopied'),
      description: t('cookieCopiedDesc'),
      duration: 3000
    });
    setTimeout(() => {
      setJustCopied(false);
    }, 2000);
  };

  const handleToggleFavorite = () => {
    // Normalize favorites to always store as array of IDs
    let favoriteIds: number[] = [];
    const storedFavorites = localStorage.getItem("favorites");
    
    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites);
      favoriteIds = parsedFavorites.map((fav: any) => 
        typeof fav === 'object' ? fav.id : Number(fav)
      );
    }
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favoriteIds.filter(id => id !== toolId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      toast({
        title: t('removedFromFavorites'),
        duration: 2000
      });
    } else {
      // Add to favorites
      favoriteIds.push(toolId);
      localStorage.setItem("favorites", JSON.stringify(favoriteIds));
      toast({
        title: t('addedToFavorites'),
        duration: 2000
      });
    }
    
    setIsFavorite(!isFavorite);
  };

  // Direct access to tool function
  const handleAccessTool = () => {
    if (tool?.access_url) {
      window.open(tool.access_url, "_blank");
    } else {
      window.open("https://example.com", "_blank");
    }
  };

  if (!isAuthenticated || !tool) {
    return <div className="flex items-center justify-center h-screen bg-[#FAFAFA] dark:bg-[#18181B]">Carregando...</div>;
  }

  const toolBenefits = getToolBenefits(tool.category);

  // Map real credentials to sidebar format
  const mapCredentialsToSidebar = () => {
    if (!credentials || credentials.length === 0) {
      return {
        email: [],
        password: [],
        cookies: []
      };
    }

    const emails: string[] = [];
    const passwords: string[] = [];
    const cookies: string[] = [];

    credentials.forEach(credential => {
      if (credential.type.toLowerCase().includes('email')) {
        emails.push(credential.value);
      } else if (credential.type.toLowerCase().includes('password') || credential.type.toLowerCase().includes('senha')) {
        passwords.push(credential.value);
      } else if (credential.type.toLowerCase().includes('cookie')) {
        cookies.push(credential.value);
      }
    });

    return {
      email: emails,
      password: passwords,
      cookies: cookies
    };
  };

  const toolSidebarData = mapCredentialsToSidebar();

  return (
    <div className="relative w-full min-h-screen bg-[#FAFAFA] dark:bg-[#18181B] overflow-x-hidden">
      {/* Back button with improved styling */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
             <Button 
               variant="ghost" 
               size="icon" 
               onClick={() => navigate('/area-membro')} 
               className={`fixed top-6 left-6 z-50 rounded-full transition-all duration-300 border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.3)] ${styles.button.primary}`}
             >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Voltar para área de membro
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Sidebar components - now with real credentials data */}
      <ToolSidebar toolData={toolSidebarData} />
      
      {/* Mobile sidebar trigger */}
      <MobileSidebarTrigger />

      {/* Main content - positioned above background with no right padding to allow gradient extension */}
      <div className="relative z-10">
        {/* Hero Section - Now extends full width behind sidebar */}
        <section 
          className="relative min-h-[60vh] animate-fade-in flex flex-col items-center justify-end w-full"
          style={{
            background: `linear-gradient(to bottom, ${tool.bgColor}33, transparent)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className={`absolute inset-0 ${styles.heroOverlay}`} />
          <div className="tech-grid absolute inset-0 opacity-10"></div>
          
          {/* Content container with proper right margin for desktop */}
          <div className={`relative w-full container mx-auto px-6 flex flex-col items-center justify-end pb-16 pt-20 transition-all duration-500`}>
             <div 
               className="w-32 h-32 mb-8 flex items-center justify-center rounded-xl p-4 animate-fade-in transition-transform duration-500 hover:scale-105 shadow-md border border-white/20"
               style={{ backgroundColor: tool.bgColor }}
             >
              {tool.logoImage.startsWith('http') ? (
                <img src={tool.logoImage} alt={tool.title} className="w-full h-full object-contain" />
              ) : (
                <div className="text-5xl">{tool.logoImage}</div>
              )}
            </div>
            
            <h1 
              className={`text-4xl md:text-5xl font-bold mb-6 text-center tracking-tight animate-fade-in ${styles.text.primary}`}
              style={{ fontWeight: 700 }}
            >
              {tool.title}
            </h1>
            
            <div className="flex items-center gap-3 mb-4 animate-fade-in">
              <Badge className={`py-1 px-3 rounded-full border transition-all ${
                tool.status === "online" 
                  ? styles.badge.green
                  : tool.status === "maintenance" 
                  ? "bg-[#F39C12]/10 text-[#F39C12] border-[#F39C12]/20" 
                  : "bg-[#E74C3C]/10 text-[#E74C3C] border-[#E74C3C]/20"
              }`}>
                <span className={`mr-2 inline-block h-2 w-2 rounded-full ${
                  tool.status === "online" 
                    ? "bg-[#27AE60] animate-pulse" 
                    : tool.status === "maintenance" 
                    ? "bg-[#F39C12] animate-pulse" 
                    : "bg-[#E74C3C]"
                }`}></span>
                {getTranslatedStatus(tool.status)}
              </Badge>
              
              <Badge className={`py-1 px-3 rounded-full ${styles.badge.category} font-medium`}>
                <Tag className="w-3 h-3 mr-1" />
                {getTranslatedCategory(tool.category)}
              </Badge>
            </div>
            
            {/* Favorite button below category badges */}
            <div className="mb-8 animate-fade-in">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleFavorite}
                      className={`${styles.button.white} border transition-all duration-300 rounded-xl`}
                    >
                      {isFavorite ? (
                        <>
                          <BookmarkCheck className="mr-2 h-4 w-4 text-yellow-500" />
                          {t('saveAsFavorite')}
                        </>
                      ) : (
                        <>
                          <Bookmark className="mr-2 h-4 w-4" />
                          {t('saveAsFavorite')}
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {isFavorite ? t('removedFromFavorites') : t('addedToFavorites')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Action buttons - also with proper margin */}
          <div className={`relative w-full container mx-auto px-6 -mb-8 transition-all duration-500`}>
            <div className={`${styles.card} rounded-2xl p-4 flex flex-wrap gap-3 justify-center`}>
              <TooltipProvider>
                {/* Session Injection Button */}
                <div className="flex">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SessionInjectionButton 
                        size="default"
                        className="animate-fade-in"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {t('accessWithSession')}
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Access Tool Button */}
                <div className="flex">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="default" 
                        className={`${styles.button.primary} font-medium text-sm py-2 px-5 h-auto transition-all duration-300 min-w-[160px] rounded-xl border border-purple-500/20 animate-fade-in`}
                        onClick={handleAccessTool}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> {t('accessTool')}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {t('accessTool')}
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                {/* Copy Cookie Button */}
                <div className="flex">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className={`${styles.button.primary} min-w-[160px] py-2 px-5 h-auto rounded-xl border border-purple-500/20 animate-fade-in transition-all duration-500 text-sm font-medium ${justCopied ? 'bg-gradient-to-r from-[#27AE60] to-[#229954] hover:from-[#229954] hover:to-[#1E8449]' : ''}`}
                        onClick={handleCopyCookie}
                      >
                        {justCopied ? (
                          <>
                            <Shield className="mr-2 h-4 w-4" /> {t('cookieCopied')}
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" /> {t('copyCookie')}
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {t('copyCookie')}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </section>
        
        {/* Action buttons - new feature */}
        {tool?.action_buttons && tool.action_buttons.length > 0 && (
          <div className={`container mx-auto px-6 mt-8 transition-all duration-500`}>
            <ActionButtons buttons={tool.action_buttons} />
          </div>
        )}
        
        {/* MODERNIZED Details Section */}
        <section className={`container mx-auto px-6 py-20 transition-all duration-500 md:pr-28 lg:pr-32`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Benefits and Support - MODERNIZED */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* MODERNIZED Support Section */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center lg:text-left">
                  <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${styles.text.primary} tracking-tight flex items-center gap-3 justify-center lg:justify-start`}>
                    <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
                      <Zap className="h-6 w-6 text-[#6C47FF]" />
                    </div>
                    {t('supportAndResources')}
                  </h2>
                  <p className={`text-lg ${styles.text.secondary} max-w-2xl mx-auto lg:mx-0`}>
                    Acesse nosso suporte especializado e recursos exclusivos para maximizar sua experiência.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      href: supportLinks.whatsappSupport,
                      icon: MessageSquare,
                      title: t('whatsappSupport'),
                      desc: t('whatsappSupportDesc'),
                      gradient: 'from-[#6C47FF]/5 to-[#8B5CF6]/5'
                    },
                    {
                      href: supportLinks.humanSupport,
                      icon: Users,
                      title: t('humanSupport'),
                      desc: t('humanSupportDesc'),
                      gradient: 'from-[#6C47FF]/5 to-[#8B5CF6]/5'
                    },
                    {
                      href: supportLinks.networkGroup,
                      icon: Users,
                      title: t('networkGroup'),
                      desc: t('networkGroupDesc'),
                      gradient: 'from-[#6C47FF]/5 to-[#8B5CF6]/5'
                    },
                    {
                      href: supportLinks.channel,
                      icon: MessageSquare,
                      title: t('officialChannel'),
                      desc: t('officialChannelDesc'),
                      gradient: 'from-[#6C47FF]/5 to-[#8B5CF6]/5'
                    }
                  ].map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative overflow-hidden ${styles.supportCard} rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02]`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      <div className="relative flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl ${styles.iconBg} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className="h-6 w-6 text-[#6C47FF]" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className={`font-semibold text-lg ${styles.text.primary} group-hover:text-[#6C47FF] transition-colors duration-300`}>
                            {item.title}
                          </h3>
                          <p className={`text-sm ${styles.text.secondary} leading-relaxed`}>
                            {item.desc}
                          </p>
                        </div>
                        <ExternalLink className={`h-5 w-5 ${styles.text.secondary} group-hover:text-[#6C47FF] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`} />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
              
              {/* MODERNIZED Tutorial Section */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-center lg:text-left">
                  <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${styles.text.primary} tracking-tight flex items-center gap-3 justify-center lg:justify-start`}>
                    <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
                      <Shield className="h-6 w-6 text-[#6C47FF]" />
                    </div>
                    {t('howToUse')}
                  </h2>
                  <p className={`text-lg ${styles.text.secondary} max-w-2xl mx-auto lg:mx-0`}>
                    Siga estas etapas simples para acessar todos os recursos premium da ferramenta.
                  </p>
                </div>

                <div className={`${styles.accordion} rounded-2xl overflow-hidden`}>
                  <Collapsible open={isHowToUseOpen} onOpenChange={setIsHowToUseOpen}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={`w-full ${styles.glassEffect} flex items-center justify-between p-6 rounded-2xl ${styles.text.primary} font-semibold text-lg hover:bg-[#6C47FF]/5 transition-all duration-300 group`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center`}>
                            <Shield className="h-5 w-5 text-[#6C47FF]" />
                          </div>
                          <span>{t('viewUsageInstructions')}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: isHowToUseOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-[#6C47FF]" />
                        </motion.div>
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="overflow-hidden">
                      <motion.div 
                        className="px-6 pb-6 space-y-6 mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-[#F8F9FF]/80' : 'bg-zinc-800/40'} border ${theme === 'light' ? 'border-[#6C47FF]/10' : 'border-purple-500/10'}`}>
                          <p className={`${styles.instructionText} text-lg leading-relaxed`}>
                            {t('usageInstructionsText').replace('{toolName}', tool.title)}
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          {[t('step1'), t('step2'), t('step3'), t('step4'), t('step5')].map((step, index) => (
                            <motion.div 
                              key={index}
                              className={`flex items-start gap-4 p-4 rounded-xl ${theme === 'light' ? 'bg-[#F8F9FF]' : 'bg-zinc-800/30'} border ${theme === 'light' ? 'border-[#6C47FF]/10' : 'border-purple-500/10'}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6C47FF] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                              <span className={`text-base leading-7 ${styles.instructionText} flex-1`}>
                                {step}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </motion.div>
            </div>
            
            {/* MODERNIZED Right Column - Enhanced Info Card */}
            <div className="lg:relative md:pr-6 lg:pr-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className={`lg:sticky lg:top-8 z-30 ${styles.card} rounded-2xl p-8 space-y-8 transition-all duration-300 overflow-hidden relative max-w-sm lg:max-w-none`}>
                  {/* Decorative gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6C47FF]/3 via-transparent to-[#8B5CF6]/3 pointer-events-none" />
                  
                  {/* Savings Section */}
                  <div className="relative">
                    <h3 className={`text-xl font-bold mb-4 flex items-center gap-3 ${styles.text.primary}`}>
                      <div className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center`}>
                        <TrendingUp className="h-5 w-5 text-[#6C47FF]" />
                      </div>
                      {t('approximateSavings')}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-[#27AE60] to-[#2ECC71] bg-clip-text text-transparent">
                          R$ {tool.category === "IA" ? "297" : tool.category === "Design/Criação" ? "249" : tool.category === "Mineração" ? "345" : tool.category === "Espionagem" ? "399" : tool.category === "SEO / Análise" ? "389" : tool.category === "Streaming" ? "89" : "199"}
                        </span>
                        <span className={`text-sm ${styles.text.secondary}`}>{t('perMonth')}</span>
                      </div>
                      <p className={`text-xs ${styles.text.secondary}`}>{t('officialSubscriptionValue')}</p>
                      
                      {/* Savings indicator */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme === 'light' ? 'bg-[#27AE60]/10 text-[#27AE60]' : 'bg-green-500/10 text-green-400'} text-sm font-medium`}>
                        <Star className="h-3 w-3" />
                        Economia de 99%
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Section */}
                  <div className="relative">
                    <h3 className={`text-xl font-bold mb-4 flex items-center gap-3 ${styles.text.primary}`}>
                      <div className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center`}>
                        <Tag className="h-5 w-5 text-[#6C47FF]" />
                      </div>
                      {t('category')}
                    </h3>
                    <Badge className={`px-4 py-2 rounded-xl text-sm font-medium ${styles.badge.category}`}>
                      {getTranslatedCategory(tool.category)}
                    </Badge>
                  </div>
                  
                  {/* Benefits List */}
                  <div className="relative">
                    <h3 className={`text-xl font-bold mb-4 flex items-center gap-3 ${styles.text.primary}`}>
                      <div className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center`}>
                        <Zap className="h-5 w-5 text-[#6C47FF]" />
                      </div>
                      Principais Benefícios
                    </h3>
                    <div className="space-y-3">
                      {toolBenefits.slice(0, 3).map((benefit, index) => (
                        <motion.div 
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'light' ? 'bg-[#F8F9FF]' : 'bg-zinc-800/30'} border ${theme === 'light' ? 'border-[#6C47FF]/10' : 'border-purple-500/10'}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6C47FF] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <span className={`text-sm ${styles.text.secondary} leading-relaxed`}>
                            {benefit}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContentDetail;
