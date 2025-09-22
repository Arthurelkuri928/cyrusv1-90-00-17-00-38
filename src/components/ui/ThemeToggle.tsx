
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeToggleProps {
  variant?: 'default' | 'sidebar' | 'header';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'default', 
  showLabel = false,
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();

  const getButtonStyles = () => {
    switch (variant) {
      case 'sidebar':
        return 'w-full justify-start gap-3 bg-transparent hover:bg-foreground/10 text-muted-foreground hover:text-foreground border-none';
      case 'header':
        return 'bg-transparent hover:bg-foreground/10 text-muted-foreground hover:text-foreground border border-border';
      default:
        return 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border';
    }
  };

  const IconComponent = theme === 'dark' ? Sun : Moon;
  const tooltipText = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
  const labelText = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';

  const handleToggle = () => {
    console.log('ThemeToggle: Alternando tema de', theme, 'para', theme === 'dark' ? 'light' : 'dark');
    toggleTheme();
  };

  if (showLabel) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={`${getButtonStyles()} ${className}`}
      >
        <IconComponent className="h-4 w-4" />
        <span>{labelText}</span>
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className={`${getButtonStyles()} ${className}`}
        >
          <IconComponent className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};
