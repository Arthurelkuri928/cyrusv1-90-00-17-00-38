
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Copy, Eye, EyeOff } from 'lucide-react';

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

interface SidebarSectionProps {
  item: SidebarItem;
  isOpen: boolean;
  onToggle: () => void;
  onCopy: (text: string, label: string) => void;
  expanded: boolean;
  mobile?: boolean;
}

export const SidebarSection = ({ 
  item, 
  isOpen, 
  onToggle, 
  onCopy, 
  expanded, 
  mobile = false 
}: SidebarSectionProps) => {
  const [visiblePasswords, setVisiblePasswords] = useState<{[key: string]: boolean}>({});

  const togglePasswordVisibility = (index: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleItemClick = () => {
    if (item.action) {
      item.action();
    } else if (item.content && item.content.length > 0) {
      onToggle();
    }
  };

  const isActive = isOpen;

  return (
    <div className="mb-2">
      <motion.button
        onClick={handleItemClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${
          isActive 
            ? 'bg-gradient-to-r from-[#A855F7]/20 to-[#A855F7]/10 text-white border border-[#A855F7]/30' 
            : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-white'
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`flex items-center justify-center flex-shrink-0 ${expanded ? 'w-5 h-5' : 'w-full'}`}>
          <div className={`h-5 w-5 transition-colors duration-300 ${
            isActive ? 'text-[#A855F7]' : 'text-zinc-400 group-hover:text-white'
          }`}>
            {item.icon}
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="font-medium text-sm flex-1 text-left select-none"
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>

        {expanded && item.content && item.content.length > 0 && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        )}

        {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#A855F7] rounded-full" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && item.content && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-8 mt-2 space-y-2">
              {item.content.map((contentItem, index) => (
                <div
                  key={index}
                  className="group bg-zinc-800/30 backdrop-blur-sm rounded-lg p-3 border border-zinc-700/30 hover:border-[#A855F7]/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      {contentItem.label}
                    </span>
                    <div className="flex gap-1">
                      {contentItem.type === 'password' && (
                        <button
                          onClick={() => togglePasswordVisibility(index)}
                          className="p-1 rounded-md hover:bg-zinc-700/50 transition-colors duration-200"
                        >
                          {visiblePasswords[index] ? (
                            <EyeOff className="h-3 w-3 text-zinc-400" />
                          ) : (
                            <Eye className="h-3 w-3 text-zinc-400" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => onCopy(contentItem.value, contentItem.label || item.title)}
                        className="p-1 rounded-md hover:bg-zinc-700/50 transition-colors duration-200 group/copy"
                      >
                        <Copy className="h-3 w-3 text-zinc-400 group-hover/copy:text-[#A855F7]" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-white font-mono bg-zinc-900/50 rounded-md p-2 border border-zinc-700/50">
                    {contentItem.type === 'password' && !visiblePasswords[index]
                      ? '••••••••••••'
                      : contentItem.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
