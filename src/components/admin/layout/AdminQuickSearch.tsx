
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminQuickSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  value?: string;
  className?: string;
}

export const AdminQuickSearch: React.FC<AdminQuickSearchProps> = ({
  placeholder = 'Buscar...',
  onSearch,
  onClear,
  value = '',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          flex items-center bg-gray-800/50 border rounded-lg transition-all duration-200
          ${isFocused 
            ? 'border-purple-500/50 bg-gray-800/80' 
            : 'border-gray-700/50 hover:border-gray-600/50'
          }
        `}
      >
        <Search className="h-4 w-4 text-gray-400 ml-3 flex-shrink-0" />
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            flex-1 bg-transparent border-none outline-none text-sm text-white
            placeholder-gray-500 px-3 py-2.5 min-w-0
          "
        />
        
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 w-8 p-0 mr-1 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};
