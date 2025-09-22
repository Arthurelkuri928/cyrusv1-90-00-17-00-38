
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Cookie, 
  Chrome
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUIStore } from '@/app/store/ui.store';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { SidebarHeader } from './SidebarHeader';
import { ToolSidebarItem } from './ToolSidebarItem';

type SidebarItem = {
  id: string;
  title: string;
  icon: JSX.Element;
  action?: () => void;
  content?: {
    type: string;
    value: string;
    label?: string;
  }[];
};

export interface ToolSidebarProps {
  toolData: {
    email?: string | string[];
    password?: string | string[];
    cookies?: string | string[];
  };
}

export const ToolSidebar = ({ toolData }: ToolSidebarProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [openItems, setOpenItems] = useState<{[key: string]: boolean}>({});
  const [hovered, setHovered] = useState(false);

  // Get state from UI Store
  const {
    sidebarExpanded,
    showMobileSidebar,
    setShowMobileSidebar,
    manualSidebarControl
  } = useUIStore();

  // 🔧 DEBUG: Logs detalhados para debug
  console.log('🔧 ToolSidebar: === RENDER STATE ===', {
    sidebarExpanded,
    showMobileSidebar,
    manualSidebarControl,
    hovered,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'SSR'
  });

  // 🔧 CORREÇÃO: Escutar mudanças no controle manual
  useEffect(() => {
    const handleManualControlChange = (event: CustomEvent) => {
      console.log('🔧 ToolSidebar: Recebido evento de mudança no controle manual:', event.detail);
      // Forçar re-render
      setHovered(false);
    };

    window.addEventListener('manualSidebarControlChanged', handleManualControlChange as EventListener);
    return () => {
      window.removeEventListener('manualSidebarControlChanged', handleManualControlChange as EventListener);
    };
  }, []);

  // Get theme-based styles with transparent background
  const getThemeStyles = () => {
    if (theme === 'light') {
      return {
        sidebar: 'bg-white/80 backdrop-blur-xl border-[#EAEAEA]/30',
        sidebarMobile: 'bg-gradient-to-b from-white/95 via-[#F9F9F9]/95 to-white/95 backdrop-blur-xl',
        text: 'text-[#2B2B2B]',
        textSecondary: 'text-[#7D7D7D]',
        hover: 'hover:bg-[#F2F2F2]/50',
        activeIcon: 'text-[#A259FF]',
        contentBg: 'bg-[#F9F9F9]/80 border-[#E0E0E0]/50',
        copyButton: 'hover:bg-[#A259FF]/10 text-[#A259FF]'
      };
    } else {
      return {
        sidebar: 'bg-zinc-900/70 backdrop-blur-xl border-zinc-800/30',
        sidebarMobile: 'bg-gradient-to-b from-zinc-950/90 via-zinc-900/90 to-zinc-950/90 backdrop-blur-xl',
        text: 'text-white',
        textSecondary: 'text-zinc-400',
        hover: 'hover:bg-violet-500/10',
        activeIcon: 'text-violet-400',
        contentBg: 'bg-zinc-800/30 border-zinc-700/30',
        copyButton: 'hover:bg-violet-500/20 text-white'
      };
    }
  };

  const styles = getThemeStyles();

  // Helper for copying content to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('success'),
      description: `${label} ${t('copyCookie')}`,
      duration: 3000
    });
  };

  // Handle download extension
  const handleDownloadExtension = () => {
    window.open("https://chrome.google.com/webstore/category/extensions", "_blank");
    toast({
      title: t('downloadExtension'),
      description: t('downloadExtension'),
      duration: 3000
    });
  };

  // Normalize toolData to ensure arrays
  const normalizeData = (data: string | string[] | undefined): string[] => {
    if (!data) return [];
    if (typeof data === 'string') return [data];
    return data;
  };

  const emails = normalizeData(toolData.email);
  const passwords = normalizeData(toolData.password);
  const cookies = normalizeData(toolData.cookies);

  // Build sidebar items with accounts grouped (email + password per account)
  const getSidebarItems = (): SidebarItem[] => {
    const items: SidebarItem[] = [];
    
    // Determine number of accounts (max between emails and passwords)
    const maxAccounts = Math.max(emails.length, passwords.length);
    
    // Create account items grouping email and password together
    for (let i = 0; i < maxAccounts; i++) {
      const accountNumber = i + 1;
      const accountContent: { type: string; value: string; label: string }[] = [];
      
      // Add email if exists for this account
      if (emails[i]) {
        accountContent.push({
          type: 'email',
          value: emails[i],
          label: 'Email'
        });
      }
      
      // Add password if exists for this account
      if (passwords[i]) {
        accountContent.push({
          type: 'password',
          value: passwords[i],
          label: 'Senha'
        });
      }
      
      // Only add account if it has at least email or password
      if (accountContent.length > 0) {
        items.push({
          id: `account-${accountNumber}`,
          title: `Conta ${accountNumber}`,
          icon: <User className="h-5 w-5" />,
          content: accountContent
        });
      }
    }
    
    // Add Cookies item if exists
    if (cookies.length > 0) {
      items.push({
        id: 'cookies',
        title: t('cookiesReservas'),
        icon: <Cookie className="h-5 w-5" />,
        content: cookies.map((cookie, index) => ({
          type: 'cookie',
          value: cookie,
          label: `Cookie ${index + 1}`
        }))
      });
    }
    
    // Always add extension item
    items.push({
      id: 'extension',
      title: t('downloadExtension'),
      icon: <Chrome className="h-5 w-5" />,
      action: handleDownloadExtension
    });
    
    return items;
  };
  
  const sidebarItems = getSidebarItems();
  
  // Toggle item expansion
  const toggleItem = (itemId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // 🔧 CORREÇÃO: Lógica de expansão mais clara
  const isExpanded = (() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile) {
      const result = showMobileSidebar;
      console.log('🔧 ToolSidebar: Mobile - isExpanded =', result);
      return result;
    }
    
    // Desktop
    if (manualSidebarControl) {
      const result = sidebarExpanded;
      console.log('🔧 ToolSidebar: Desktop + Manual Control - isExpanded =', result, '(ignorando hover)');
      return result;
    } else {
      const result = hovered;
      console.log('🔧 ToolSidebar: Desktop + Auto Control - isExpanded =', result, '(usando hover)');
      return result;
    }
  })();

  console.log('🔧 ToolSidebar: === FINAL isExpanded ===', isExpanded);

  // Handle mouse enter - APENAS quando controle manual está DESATIVO
  const handleMouseEnter = () => {
    console.log('🔧 ToolSidebar: handleMouseEnter called', { 
      manualSidebarControl,
      shouldIgnore: manualSidebarControl 
    });
    
    if (window.innerWidth >= 768 && !manualSidebarControl) {
      console.log('🔧 ToolSidebar: Setting hovered to true (auto mode)');
      setHovered(true);
    } else {
      console.log('🔧 ToolSidebar: Ignorando hover (modo manual ativo)');
    }
  };

  // Handle mouse leave - APENAS quando controle manual está DESATIVO  
  const handleMouseLeave = () => {
    console.log('🔧 ToolSidebar: handleMouseLeave called', { 
      manualSidebarControl,
      shouldIgnore: manualSidebarControl 
    });
    
    if (window.innerWidth >= 768 && !manualSidebarControl) {
      console.log('🔧 ToolSidebar: Setting hovered to false (auto mode)');
      setHovered(false);
    } else {
      console.log('🔧 ToolSidebar: Ignorando mouse leave (modo manual ativo)');
    }
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <motion.div 
      className={`fixed right-4 top-4 bottom-4 ${styles.sidebar} flex flex-col z-40 shadow-2xl rounded-2xl`}
      onMouseEnter={manualSidebarControl ? undefined : handleMouseEnter}
      onMouseLeave={manualSidebarControl ? undefined : handleMouseLeave}
      initial={false}
      animate={{ 
        width: isExpanded ? 320 : 80 
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      style={{
        width: isExpanded ? 320 : 80
      }}
    >
      <SidebarHeader expanded={isExpanded} />
      
      <div className="flex-1 flex flex-col gap-3 pt-6 px-4 overflow-y-auto scrollbar-none">
        <AnimatePresence mode="wait">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.2
              }}
            >
              <ToolSidebarItem
                item={item}
                isOpen={openItems[item.id]}
                onToggle={() => toggleItem(item.id)}
                onCopy={handleCopy}
                expanded={isExpanded}
                theme={theme}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  // Mobile Sidebar Content
  const MobileSidebarContent = () => (
    <Drawer open={showMobileSidebar} onOpenChange={setShowMobileSidebar}>
      <DrawerContent className={`${styles.sidebarMobile} rounded-t-3xl border-t ${theme === 'light' ? 'border-[#EAEAEA]/50' : 'border-violet-500/20'} shadow-2xl ${theme === 'light' ? 'shadow-black/5' : 'shadow-violet-500/10'} max-h-[85vh]`}>
        <div className="p-6">
          <SidebarHeader expanded={true} />
          
          <div className="flex flex-col gap-4 mt-6">
            {sidebarItems.map((item) => (
              <ToolSidebarItem
                key={item.id}
                item={item}
                isOpen={openItems[item.id]}
                onToggle={() => toggleItem(item.id)}
                onCopy={handleCopy}
                expanded={true}
                mobile
                theme={theme}
              />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <>
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
      <MobileSidebarContent />
    </>
  );
};
