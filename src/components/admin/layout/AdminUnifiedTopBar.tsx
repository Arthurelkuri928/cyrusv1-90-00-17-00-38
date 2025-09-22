
import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { AdminContextualTabs } from './AdminContextualTabs';
import { AdminGlobalActions } from './AdminGlobalActions';
import { AdminCommandPalette } from './AdminCommandPalette';
import { getCurrentCategoryLabel } from '../config/topBarConfig';
import { useLocation } from 'react-router-dom';

export const AdminUnifiedTopBar: React.FC = () => {
  const location = useLocation();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const currentPath = location.pathname;
  const categoryLabel = getCurrentCategoryLabel(currentPath);

  // Global keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left section - Logo + Category + Tabs */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            {/* Logo and Category */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-foreground">{categoryLabel}</h1>
                <p className="text-xs text-muted-foreground">Painel Administrativo</p>
              </div>
            </div>

            {/* Contextual Tabs */}
            <AdminContextualTabs />
          </div>

          {/* Right section - Global Actions */}
          <AdminGlobalActions onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        </div>
      </header>

      {/* Command Palette */}
      <AdminCommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </>
  );
};
