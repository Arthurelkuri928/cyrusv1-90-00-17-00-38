
import React from 'react';
import { cn } from '@/lib/utils';

interface SettingsKeyboardBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const SettingsKeyboardBadge: React.FC<SettingsKeyboardBadgeProps> = ({ 
  children, 
  className 
}) => {
  return (
    <span 
      className={cn(
        // Fundo roxo personalizado para ambos os temas
        "bg-[#A855F7] text-white border-0 outline-none px-2 py-1 text-xs font-mono rounded",
        className
      )}
    >
      {children}
    </span>
  );
};
