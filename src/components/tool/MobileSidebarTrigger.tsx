
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useToolSidebar } from '@/hooks/useToolSidebar';

export const MobileSidebarTrigger = () => {
  const { theme } = useTheme();
  const { setShowMobileSidebar } = useToolSidebar();

  const getThemeStyles = () => {
    if (theme === 'light') {
      return {
        button: 'bg-white/90 hover:bg-white/95 text-[#2B2B2B] border-[#EAEAEA]/50'
      };
    } else {
      return {
        button: 'bg-zinc-900/90 hover:bg-zinc-800/90 text-white border-zinc-700/50'
      };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className="md:hidden fixed top-20 right-6 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowMobileSidebar(true)}
        className={`backdrop-blur-xl rounded-xl transition-all duration-300 shadow-lg border ${styles.button}`}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
};
