
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useUIStore } from '@/app/store/ui.store';

interface SidebarHeaderProps {
  expanded: boolean;
}

export const SidebarHeader = ({ expanded }: SidebarHeaderProps) => {
  const { theme } = useTheme();
  const { manualSidebarControl, toggleSidebar } = useUIStore();

  const handleLogoClick = () => {
    console.log('🔧 SidebarHeader: handleLogoClick', { manualSidebarControl });
    if (manualSidebarControl) {
      console.log('🔧 SidebarHeader: calling toggleSidebar');
      toggleSidebar();
    }
  };

  const getThemeStyles = () => {
    if (theme === 'light') {
      return {
        text: 'text-[#2B2B2B]',
        textSecondary: 'text-[#7D7D7D]',
        divider: 'border-[#E0E0E0]'
      };
    } else {
      return {
        text: 'text-white',
        textSecondary: 'text-zinc-400',
        divider: 'border-zinc-800/30'
      };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`flex items-center p-4 min-h-[80px] border-b bg-transparent ${styles.divider} ${!expanded ? 'justify-center' : 'gap-3'}`}>
      {manualSidebarControl ? (
        // Botão interativo quando controle manual está ativo
        <motion.button
          onClick={handleLogoClick}
          className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] shadow-lg flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200 hover:shadow-xl"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 25px rgba(168, 85, 247, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))'
          }}
        >
          <img src="https://i.postimg.cc/sf0yGXBJ/2.png" alt="Cyrus" className="h-6 w-6 filter brightness-0 invert" />
        </motion.button>
      ) : (
        // Botão estático quando controle manual está desativo
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] shadow-lg flex items-center justify-center flex-shrink-0">
          <img src="https://i.postimg.cc/sf0yGXBJ/2.png" alt="Cyrus" className="h-6 w-6 filter brightness-0 invert" />
        </div>
      )}

      {/* Texto do cabeçalho */}
      {expanded && (
        <div className="flex flex-col">
          <span className={`text-lg font-bold ${styles.text}`}>
            Cyrus
          </span>
          <span className={`text-xs ${styles.textSecondary}`}>
            Ferramenta
          </span>
        </div>
      )}
    </div>
  );
};
