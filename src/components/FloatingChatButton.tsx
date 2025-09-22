
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { APP_CONFIG } from '@/config/appConfig';

interface FloatingChatButtonProps {
  onClick: () => void;
  variant?: 'default' | 'compact';
  position?: 'bottom-right' | 'bottom-left';
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ 
  onClick, 
  variant = 'default',
  position = 'bottom-right' 
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5',
  };

  const sizeClasses = {
    default: 'w-14 h-14',
    compact: 'w-12 h-12',
  };

  const iconSizes = {
    default: 'w-6 h-6',
    compact: 'w-5 h-5',
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]} ${sizeClasses[variant]}
        bg-[#9333EA] hover:bg-[#7e22ce] text-white rounded-full shadow-lg 
        flex items-center justify-center transition-all duration-200 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        hover:scale-110 active:scale-95
      `}
      style={{ zIndex: APP_CONFIG.Z_INDEX.FLOATING }}
      aria-label="Abrir assistente de ajuda para planos"
    >
      <MessageCircle className={iconSizes[variant]} />
    </button>
  );
};

export default FloatingChatButton;
