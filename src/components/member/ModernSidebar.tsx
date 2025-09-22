import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, Star, DollarSign, Users, Menu, X, Settings, User, MessageCircle, HelpCircle, LogOut, MoreHorizontal, BookOpen, FileText, Video, Mail, Phone, Lightbulb, ChevronDown, ExternalLink, Shield } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUniversalAuth } from "@/hooks/useUniversalAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAvatar } from "@/hooks/useAvatar";
import { useUIStore } from "@/app/store/ui.store";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useSidebarLinks } from "@/hooks/useSidebarLinks";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

interface ModernSidebarProps {
  username: string;
  selectedAvatar?: string;
  onProfileClick: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  username,
  selectedAvatar: propSelectedAvatar,
  onProfileClick,
  sidebarOpen,
  setSidebarOpen
}) => {
  // 🔧 CORREÇÃO: Usar hook reativo para window width
  const windowWidth = useWindowWidth();
  
  // Integração com UI Store para controle manual
  const {
    sidebarExpanded,
    setSidebarExpanded,
    manualSidebarControl
  } = useUIStore();
  
  const avatarUrl = useAvatar();
  
  const [hovered, setHovered] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({
    main: true,
    account: true,
    links: false
  });
  const { signOut } = useAuth();
  const { userRole } = useUniversalAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const helpDropdownRef = useRef<HTMLDivElement>(null);
  const { isPageVisible } = usePageVisibility();

  // Hook de permissões para controle de acesso
  const { can, canAccessAdmin, isAdmin: hasAdminRole, role, isLoading: permissionsLoading } = usePermissions();
  
  // Log específico para debug do painel admin
  console.log('🔐 [ModernSidebar] Verificação de permissões para painel admin:', {
    role,
    canViewAdminPanel: can('admin.panel.view'),
    canAccessAdmin: canAccessAdmin(),
    hasAdminRole: hasAdminRole(),
    permissionsLoading,
    userRole: userRole?.[0]?.role
  });
  
  // Buscar links dinâmicos da sidebar para ambas as categorias
  const { sidebarLinks, isLoading: linksLoading, error: linksError } = useSidebarLinks('links');
  const { sidebarLinks: helpLinks, isLoading: helpLoading, error: helpError } = useSidebarLinks('help_support');

  // Mapa de ícones para renderização dinâmica
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    ExternalLink,
    BookOpen,
    HelpCircle,
    Video,
    MessageCircle,
    Mail,
    Phone,
    Lightbulb,
    FileText
  };

  // 🔧 NOVA FUNÇÃO: Validação robusta de URLs
  const validateAndPrepareUrl = (url: string): { 
    isValid: boolean; 
    finalUrl: string; 
    isExternal: boolean;
    errorMessage?: string;
  } => {
    if (!url || url.trim() === '' || url === '#' || url === 'javascript:void(0)') {
      return { 
        isValid: false, 
        finalUrl: '', 
        isExternal: false,
        errorMessage: 'Link indisponível no momento'
      };
    }
    
    // URLs internas (começam com /)
    if (url.startsWith('/')) {
      return { 
        isValid: true, 
        finalUrl: url, 
        isExternal: false 
      };
    }
    
    // URLs externas completas
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return { 
        isValid: true, 
        finalUrl: url, 
        isExternal: true 
      };
    }
    
    // URLs que parecem ser externas mas sem protocolo
    if (url.includes('.') && !url.startsWith('/')) {
      return { 
        isValid: true, 
        finalUrl: `https://${url}`, 
        isExternal: true 
      };
    }
    
    // URL inválida
    return { 
      isValid: false, 
      finalUrl: '', 
      isExternal: false,
      errorMessage: 'Link inválido'
    };
  };

  // Verificar se o usuário é admin usando o novo sistema de permissões
  const isAdmin = React.useMemo(() => {
    // Usar tanto o sistema novo quanto o antigo para compatibilidade
    const newSystemAdmin = hasAdminRole();
    const oldSystemAdmin = userRole?.[0]?.role?.trim() === "admin";
    
    console.log('🔐 [ModernSidebar] Verificação de admin', {
      newSystemAdmin,
      oldSystemAdmin,
      role,
      userRole: userRole?.[0]?.role,
      finalResult: newSystemAdmin || oldSystemAdmin
    });
    
    return newSystemAdmin || oldSystemAdmin;
  }, [hasAdminRole, userRole, role]);

  // 🔧 CORREÇÃO: Reset forçado do hovered quando modo manual estiver ativo
  useEffect(() => {
    if (manualSidebarControl) {
      console.log('🔧 ModernSidebar: Modo manual ativo - forçando hovered = false');
      setHovered(false);
    }
  }, [manualSidebarControl]);

  // 🔧 CORREÇÃO: Lógica de expansão reativa e corrigida
  const isExpanded = (() => {
    const isMobile = windowWidth < 768;
    const isDesktop = windowWidth >= 768;
    
    console.log('🔧 ModernSidebar: Calculando isExpanded', {
      windowWidth,
      isMobile,
      isDesktop,
      manualSidebarControl,
      sidebarExpanded,
      hovered,
      sidebarOpen
    });

    if (isMobile) {
      return sidebarOpen;
    }
    
    if (isDesktop) {
      const result = manualSidebarControl ? sidebarExpanded : hovered;
      console.log('🔧 ModernSidebar: Desktop expansion result:', result);
      return result;
    }
    
    return false;
  })();

  // Log de debug detalhado
  useEffect(() => {
    console.log('🔧 ModernSidebar: Estado atual completo', {
      windowWidth,
      manualSidebarControl,
      sidebarExpanded,
      hovered,
      sidebarOpen,
      isExpanded,
      timestamp: new Date().toISOString()
    });
  }, [windowWidth, manualSidebarControl, sidebarExpanded, hovered, sidebarOpen, isExpanded]);

  const navigationStructure = [
    {
      id: 'main',
      label: t('main'),
      items: [
        {
          id: 'dashboard',
          label: t('dashboard'),
          icon: Home,
          path: '/area-membro',
          pageKey: 'dashboard'
        },
        {
          id: 'favorites',
          label: t('favorites'),
          icon: Star,
          path: '/favoritos',
          pageKey: 'favorites'
        }
      ]
    },
    {
      id: 'account',
      label: t('account'),
      items: [
        {
          id: 'billing',
          label: t('subscription'),
          icon: DollarSign,
          path: '/assinatura',
          pageKey: 'subscription'
        },
        {
          id: 'affiliates',
          label: t('affiliates'),
          icon: Users,
          path: '/dashboard-afiliados',
          pageKey: 'affiliates'
        }
        // REMOVIDO: Acesso ao painel administrativo foi movido para o dropdown do usuário
      ]
    }
  ];

  const userMenuItems = [
    {
      id: 'view-profile',
      label: t('viewProfile'),
      icon: User,
      path: '/perfil',
      pageKey: 'profile'
    },
    {
      id: 'account-settings',
      label: t('accountSettings'),
      icon: Settings,
      path: '/configuracoes',
      pageKey: 'settings'
    },
    // NOVO: Painel Administrativo no dropdown do usuário
    ...(can('admin.panel.view') ? [{
      id: 'admin-panel',
      label: t('adminPanel'),
      icon: Shield,
      path: '/painel-admin',
      pageKey: null // Admin sempre pode acessar
    }] : [])
  ];

  const userStatusText = t('premiumUser');

  const getThemeStyles = () => {
    if (theme === 'light') {
      return {
        sidebar: 'bg-white border-[#E0E0E0]',
        text: {
          primary: 'text-[#1A1A1A]',
          secondary: 'text-[#6C757D]',
          inactive: 'text-[#7D7D7D]',
          sectionHeader: 'text-[#999999]'
        },
        button: {
          inactive: 'text-[#7D7D7D] hover:text-[#7F1DFF] hover:bg-[#EFEAFE]',
          active: 'bg-[#EFEAFE] text-[#7F1DFF] border-[#D0D0D0]',
          hover: 'hover:bg-[#F0F0F0]',
          disabled: 'text-[#CCCCCC] cursor-not-allowed'
        },
        dropdown: {
          bg: 'bg-white border-[#E0E0E0]',
          item: 'hover:bg-[#F0F0F0]'
        },
        divider: 'border-[#E0E0E0]'
      };
    } else {
      return {
        sidebar: 'bg-[#18181B] border-zinc-800/50',
        text: {
          primary: 'text-white',
          secondary: 'text-zinc-400',
          inactive: 'text-zinc-400',
          sectionHeader: 'text-zinc-500'
        },
        button: {
          inactive: 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
          active: 'bg-gradient-to-r from-[#A855F7]/20 to-[#A855F7]/10 text-white border-[#A855F7]/30',
          hover: 'hover:bg-zinc-800/50',
          disabled: 'text-zinc-600 cursor-not-allowed'
        },
        dropdown: {
          bg: 'bg-[#1C1C1E] border-zinc-800/50',
          item: 'hover:bg-zinc-800/60'
        },
        divider: 'border-zinc-800/30'
      };
    }
  };

  const styles = getThemeStyles();

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    if (!isExpanded) return;
    
    navigate(path);
    if (windowWidth < 768) {
      setSidebarOpen(false);
    }
    setUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (isExpanded) {
      setUserMenuOpen(!userMenuOpen);
    } else {
      onProfileClick();
    }
  };

  const handleHelpDropdownClick = () => {
    if (!isExpanded) return;
    setHelpDropdownOpen(!helpDropdownOpen);
  };

  const handleUserMenuAction = (item: typeof userMenuItems[0]) => {
    if (!isExpanded) return;
    
    // ADMIN VÊ TUDO - Verificar se a página está visível OU se é admin
    if (item.path && item.pageKey && !isPageVisible(item.pageKey) && !isAdmin) {
      toast.error('Esta página está temporariamente indisponível');
      return;
    }
    
    if (item.path) {
      handleNavigation(item.path);
    }
    setUserMenuOpen(false);
  };

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'links' && !isExpanded) {
      setSidebarOpen(true);
      setExpandedCategories(prev => ({
        ...prev,
        [categoryId]: true
      }));
    } else {
      setExpandedCategories(prev => ({
        ...prev,
        [categoryId]: !prev[categoryId]
      }));
    }
  };

  // ✅ Implementação do controle manual igual à ToolSidebar
  const handleLogoClick = () => {
    if (manualSidebarControl) {
      console.log('🔧 ModernSidebar: Logo clicado, toggleando sidebar', {
        antes: sidebarExpanded,
        depois: !sidebarExpanded
      });
      setSidebarExpanded(!sidebarExpanded);
    }
  };

  // 🔧 CORREÇÃO: Eventos de mouse com proteção aprimorada
  const handleMouseEnter = () => {
    if (windowWidth >= 768 && !manualSidebarControl) {
      console.log('🔧 ModernSidebar: Mouse enter - hover habilitado (modo automático)');
      setHovered(true);
    } else {
      console.log('🔧 ModernSidebar: Mouse enter ignorado', {
        windowWidth,
        manualSidebarControl,
        motivo: windowWidth < 768 ? 'mobile' : 'modo manual'
      });
    }
  };

  const handleMouseLeave = () => {
    if (windowWidth >= 768 && !manualSidebarControl) {
      console.log('🔧 ModernSidebar: Mouse leave - hover desabilitado (modo automático)');
      setHovered(false);
    } else {
      console.log('🔧 ModernSidebar: Mouse leave ignorado', {
        windowWidth,
        manualSidebarControl,
        motivo: windowWidth < 768 ? 'mobile' : 'modo manual'
      });
    }
  };

  const renderNavigationCategory = (category: typeof navigationStructure[0]) => (
    <div key={category.id} className="mb-4">
      <AnimatePresence>
        {isExpanded && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onClick={() => toggleCategory(category.id)}
            className={`w-full flex items-center justify-between px-4 py-2 mb-2 text-xs font-medium uppercase tracking-wider transition-colors ${styles.text.sectionHeader} hover:text-[#7F1DFF]`}
          >
            <span>{category.label}</span>
            <motion.div
              animate={{ rotate: expandedCategories[category.id] ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isExpanded || expandedCategories[category.id]) && (
          <motion.div
            initial={isExpanded ? { opacity: 0, height: 0 } : { opacity: 1, height: "auto" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-1 px-3 overflow-hidden"
          >
            {category.items
              .filter(item => {
                // Se não tem pageKey (como admin), sempre mostrar
                if (!item.pageKey) return true;
                // ADMIN VÊ TUDO - Verificar se a página está visível OU se é admin
                return isPageVisible(item.pageKey) || isAdmin;
              })
              .map(item => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    disabled={!isExpanded}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${
                      isActive 
                        ? styles.button.active
                        : `${styles.button.inactive} ${isExpanded ? styles.button.hover : 'cursor-default'}`
                    } ${!isExpanded ? 'pointer-events-none' : ''}`}
                    whileHover={isExpanded ? { scale: 1.01 } : {}}
                    whileTap={isExpanded ? { scale: 0.99 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`flex items-center justify-center flex-shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-full'}`}>
                      <IconComponent className={`h-5 w-5 transition-colors duration-300 ${
                        isActive ? 'text-[#7F1DFF]' : ''
                      }`} />
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.15 }}
                          className="font-medium text-sm flex-1 text-left select-none"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isActive && theme === 'dark' && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#A855F7] rounded-full" />
                    )}
                  </motion.button>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderLinksSection = () => (
    <div className="mb-4">
      <AnimatePresence>
        {isExpanded && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onClick={() => toggleCategory('links')}
            className={`w-full flex items-center justify-between px-4 py-2 mb-2 text-xs font-medium uppercase tracking-wider transition-colors ${styles.text.sectionHeader} hover:text-[#7F1DFF]`}
          >
            <span>{t('links')}</span>
            <motion.div
              animate={{ rotate: expandedCategories['links'] ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && expandedCategories['links'] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-1 px-3 overflow-hidden"
          >
            {linksLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className={`text-sm ${styles.text.secondary}`}>
                  {t('loading') || 'Carregando...'}
                </div>
              </div>
            ) : linksError ? (
              <div className="flex items-center justify-center py-4">
                <div className={`text-sm text-red-500`}>
                  {t('errorLoadingLinks') || 'Erro ao carregar links'}
                </div>
              </div>
            ) : sidebarLinks.length === 0 ? (
              <div className="flex items-center justify-center py-4">
                <div className={`text-sm ${styles.text.secondary}`}>
                  {t('noLinksAvailable') || 'Nenhum link disponível'}
                </div>
              </div>
            ) : (
              sidebarLinks.map(link => {
                const IconComponent = iconMap[link.icon] || ExternalLink;
                const urlInfo = validateAndPrepareUrl(link.url);
                
                // 🔧 CORREÇÃO: Esconder links inválidos completamente
                if (!urlInfo.isValid) {
                  return null;
                }
                
                return (
                  <motion.a
                    key={link.id}
                    href={urlInfo.isValid && urlInfo.isExternal ? urlInfo.finalUrl : undefined}
                    target={urlInfo.isValid && urlInfo.isExternal ? "_blank" : undefined}
                    rel={urlInfo.isValid && urlInfo.isExternal ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!isExpanded) { 
                        e.preventDefault(); 
                        return; 
                      }
                      if (!urlInfo.isValid) {
                        e.preventDefault();
                        return;
                      }
                      if (!urlInfo.isExternal) {
                        e.preventDefault();
                        navigate(urlInfo.finalUrl);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${
                      !urlInfo.isValid 
                        ? styles.button.disabled 
                        : `${styles.button.inactive} ${isExpanded ? styles.button.hover : 'cursor-default'}`
                    } ${!isExpanded ? 'pointer-events-none' : ''}`}
                    whileHover={isExpanded && urlInfo.isValid ? { scale: 1.01 } : {}}
                    whileTap={isExpanded && urlInfo.isValid ? { scale: 0.99 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`flex items-center justify-center flex-shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-full'}`}>
                      <IconComponent className="h-5 w-5 transition-colors duration-300" />
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.15 }}
                          className="font-medium text-sm flex-1 text-left select-none"
                        >
                          {link.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.a>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="ghost"
          size="icon"
          className={`backdrop-blur-lg rounded-xl transition-colors ${
            theme === 'light' 
              ? 'bg-white/90 hover:bg-gray-100/90 text-[#1A1A1A] border border-[#E0E0E0]' 
              : 'bg-zinc-900/90 hover:bg-zinc-800/90 text-white border border-zinc-700/50'
          }`}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="fixed left-4 top-4 bottom-4 z-40 pointer-events-none">
        <motion.aside
          ref={sidebarRef}
          initial={false}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={{
            width: windowWidth >= 768 ? (isExpanded ? 280 : 72) : (sidebarOpen ? 280 : 0),
            x: windowWidth < 768 && !sidebarOpen ? -100 : 0
          }}
          className={`h-full backdrop-blur-xl shadow-xl border flex flex-col overflow-hidden rounded-2xl pointer-events-auto ${styles.sidebar}`}
          style={{
            background: theme === 'light' ? '#FFFFFF' : 'rgba(24, 24, 27, 0.95)',
            backdropFilter: 'blur(20px)',
            clipPath: 'inset(0)',
            boxShadow: theme === 'light' ? 'rgba(0, 0, 0, 0.04) 0px 2px 6px' : undefined
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {/* Header com logo */}
          <div className={`flex items-center p-4 min-h-[80px] border-b bg-transparent ${styles.divider} ${!isExpanded ? 'justify-center' : 'gap-3'}`}>
            <motion.button
              onClick={handleLogoClick}
              className={`relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] shadow-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                manualSidebarControl 
                  ? 'cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]' 
                  : 'cursor-default'
              }`}
              whileHover={manualSidebarControl ? { scale: 1.05 } : {}}
              whileTap={manualSidebarControl ? { scale: 0.95 } : {}}
              transition={{ duration: 0.2 }}
            >
              <img src="https://i.postimg.cc/sf0yGXBJ/2.png" alt="Cyrus" className="h-6 w-6 filter brightness-0 invert" />
            </motion.button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <span className={`text-lg font-bold ${styles.text.primary}`}>
                    Cyrus
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User profile section */}
          <div className={`relative px-4 py-4 border-b bg-transparent ${styles.divider}`} ref={userMenuRef}>
            <motion.button
              onClick={handleProfileClick}
              disabled={!isExpanded}
              className={`group relative transition-all duration-300 w-full ${!isExpanded ? 'flex justify-center pointer-events-none' : 'flex items-center gap-3'} ${isExpanded ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
              whileHover={isExpanded ? { scale: 1.02 } : {}}
              whileTap={isExpanded ? { scale: 0.98 } : {}}
              transition={{ duration: 0.2 }}
            >
              <Avatar className="border-2 border-[#A855F7]/50 group-hover:border-[#A855F7] transition-all duration-300 w-12 h-12 flex-shrink-0">
                <AvatarImage src={avatarUrl} alt="Profile" className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white text-sm font-bold">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className={`text-sm font-semibold truncate ${styles.text.primary}`}>
                      {username}
                    </div>
                    <div className={`text-xs ${styles.text.secondary}`}>
                      {userStatusText}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: userMenuOpen ? 180 : 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className={`h-4 w-4 ${styles.text.secondary}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User dropdown menu */}
            <AnimatePresence>
              {userMenuOpen && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full left-4 right-4 mt-2 rounded-xl border shadow-lg z-50 ${styles.dropdown.bg}`}
                >
                  <div className="py-2">
                    {userMenuItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleUserMenuAction(item)}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${styles.dropdown.item} ${styles.text.primary}`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                    <div className={`border-t my-1 ${styles.divider}`} />
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-red-500 hover:bg-red-500 dark:hover:bg-red-900/20`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation content - Scrollbar hidden with proper CSS */}
          <div className="flex-1 py-4 overflow-hidden">
            <div 
              className="h-full overflow-y-auto px-0 scrollbar-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {navigationStructure.map(renderNavigationCategory)}
              {/* Only render links section when expanded */}
              {isExpanded && renderLinksSection()}
            </div>
          </div>

          {/* Footer with help - Now dynamic from database with CORRECTED URL logic */}
          <div className={`p-4 border-t bg-transparent ${styles.divider}`} ref={helpDropdownRef}>
            <div className="relative">
              <motion.button
                onClick={handleHelpDropdownClick}
                disabled={!isExpanded}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${styles.button.inactive} ${isExpanded ? styles.button.hover : 'cursor-default'} ${!isExpanded ? 'pointer-events-none justify-center' : ''}`}
                whileHover={isExpanded ? { scale: 1.01 } : {}}
                whileTap={isExpanded ? { scale: 0.99 } : {}}
                transition={{ duration: 0.2 }}
              >
                <HelpCircle className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="font-medium text-sm flex-1 text-left"
                    >
                      {t('helpSupportTitle')}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: helpDropdownOpen ? 180 : 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* 🔧 CORREÇÃO CRÍTICA: Help dropdown com lógica de URL corrigida */}
              <AnimatePresence>
                {helpDropdownOpen && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute bottom-full left-0 right-0 mb-2 rounded-xl border shadow-lg z-50 max-h-80 overflow-y-auto scrollbar-none ${styles.dropdown.bg}`}
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    <div className="py-2">
                      {helpLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <div className={`text-sm ${styles.text.secondary}`}>
                            {t('loading') || 'Carregando...'}
                          </div>
                        </div>
                      ) : helpError ? (
                        <div className="flex items-center justify-center py-4">
                          <div className={`text-sm text-red-500`}>
                            {t('errorLoadingLinks') || 'Erro ao carregar links'}
                          </div>
                        </div>
                      ) : helpLinks.length === 0 ? (
                        <div className="flex items-center justify-center py-4">
                          <div className={`text-sm ${styles.text.secondary}`}>
                            {t('noLinksAvailable') || 'Nenhum link disponível'}
                          </div>
                        </div>
                      ) : (
                        helpLinks.map(link => {
                          const IconComponent = iconMap[link.icon] || ExternalLink;
                          const urlInfo = validateAndPrepareUrl(link.url);
                          
                          const content = (
                            <>
                              <IconComponent className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                urlInfo.isValid ? styles.text.secondary : 'text-gray-400'
                              }`} />
                              <div className="flex-1 text-left">
                                <div className={`font-medium ${
                                  urlInfo.isValid ? styles.text.primary : 'text-gray-500'
                                }`}>{link.title}</div>
                                {link.description && (
                                  <div className={`text-xs mt-1 ${
                                    urlInfo.isValid ? styles.text.secondary : 'text-gray-400'
                                  }`}>{link.description}</div>
                                )}
                                {!urlInfo.isValid && (
                                  <div className="text-xs mt-1 text-red-400">
                                    {urlInfo.errorMessage}
                                  </div>
                                )}
                              </div>
                            </>
                          );

                          // 🔧 CORREÇÃO ESPECÍFICA: Esconder links inválidos completamente
                          if (!urlInfo.isValid) {
                            return null;
                          }

                          // URL válida e externa
                          if (urlInfo.isExternal) {
                            return (
                              <a
                                key={link.id}
                                href={urlInfo.finalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full flex items-start gap-3 px-4 py-3 text-sm transition-colors ${styles.dropdown.item}`}
                                onClick={() => setHelpDropdownOpen(false)}
                              >
                                {content}
                              </a>
                            );
                          }

                          // URL válida e interna
                          return (
                            <button
                              key={link.id}
                              onClick={() => { 
                                navigate(urlInfo.finalUrl); 
                                setHelpDropdownOpen(false); 
                              }}
                              className={`w-full flex items-start gap-3 px-4 py-3 text-sm transition-colors ${styles.dropdown.item}`}
                            >
                              {content}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.aside>
      </div>
    </>
  );
};

export default ModernSidebar;
