
import { useState } from 'react';
import { ChevronDown, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarItem {
  id: string;
  title: string;
  icon: JSX.Element;
  action?: () => void;
  content?: {
    type: string;
    value: string;
    label?: string;
  }[];
}

interface ToolSidebarItemProps {
  item: SidebarItem;
  isOpen: boolean;
  onToggle: () => void;
  onCopy: (text: string, label: string) => void;
  expanded: boolean;
  mobile?: boolean;
  theme?: 'light' | 'dark';
}

export const ToolSidebarItem = ({ 
  item, 
  isOpen, 
  onToggle, 
  onCopy, 
  expanded,
  mobile = false,
  theme = 'dark'
}: ToolSidebarItemProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  
  // Custom copy handler with correct messages
  const handleCopy = (text: string, label: string) => {
    onCopy(text, label);
    toast({
      title: language === "pt-BR" ? "Copiado com sucesso!" : language === "es-ES" ? "¡Copiado con éxito!" : "Successfully copied!",
      description: language === "pt-BR" ? `${label} foi copiado para sua área de transferência.` : language === "es-ES" ? `${label} se ha copiado a tu portapapeles.` : `${label} has been copied to your clipboard.`,
      duration: 3000
    });
  };
  
  // Get theme-based styles
  const getThemeStyles = () => {
    if (theme === 'light') {
      return {
        button: 'text-[#2B2B2B] hover:text-[#1A1A1A] hover:bg-[#F2F2F2]',
        buttonBorder: 'border-transparent hover:border-[#A259FF]/30',
        contentBg: 'bg-[#F9F9F9] border-[#E0E0E0]',
        contentText: 'text-[#1C1C1C]',
        copyButton: 'hover:bg-[#A259FF]/10 text-[#A259FF]',
        labelText: 'text-[#A259FF]'
      };
    } else {
      return {
        button: 'text-gray-300 hover:text-white hover:bg-violet-500/20',
        buttonBorder: 'border-transparent hover:border-violet-500/30',
        contentBg: 'bg-zinc-800/50 border-zinc-700/50',
        contentText: 'text-gray-300',
        copyButton: 'hover:bg-violet-500/20 text-white',
        labelText: 'text-violet-300'
      };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className="group">
      <Button
        variant="ghost"
        size={mobile ? "default" : "sm"}
        onClick={item.action || onToggle}
        className={`
          w-full justify-start gap-3 ${styles.button}
          transition-all duration-200 border ${styles.buttonBorder}
          ${mobile ? 'h-12 px-4' : 'h-10 px-3'}
          ${expanded || mobile ? '' : 'px-3'}
        `}
      >
        <div className="flex-shrink-0">
          {item.icon}
        </div>
        
        {(expanded || mobile) && (
          <>
            <span className="flex-1 text-left truncate">{item.title}</span>
            {item.content && (
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              />
            )}
          </>
        )}
      </Button>

      {item.content && isOpen && (expanded || mobile) && (
        <div className="mt-2 space-y-2 pl-4">
          {item.content.map((contentItem, index) => (
            <div 
              key={index}
              className={`${styles.contentBg} rounded-lg p-3 border`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-xs font-medium ${styles.labelText}`}>
                  {contentItem.label}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(contentItem.value, contentItem.label || '')}
                  className={`h-6 w-6 p-0 ${styles.copyButton}`}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-zinc-900/50'} rounded p-2 text-xs font-mono ${styles.contentText} break-all`}>
                {contentItem.type === 'password' 
                  ? '••••••••••••••••' 
                  : contentItem.value.substring(0, 80) + (contentItem.value.length > 80 ? '...' : '')
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
