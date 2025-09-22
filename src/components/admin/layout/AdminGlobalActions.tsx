
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminNotificationBell } from './AdminNotificationBell';

interface AdminGlobalActionsProps {
  onOpenCommandPalette: () => void;
}

export const AdminGlobalActions: React.FC<AdminGlobalActionsProps> = ({
  onOpenCommandPalette
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userData = {
    name: user?.user_metadata?.username || localStorage.getItem("username") || "Administrador",
    avatar: localStorage.getItem("selectedAvatar") || "https://cdn-icons-png.flaticon.com/128/7790/7790136.png"
  };

  const handleLogout = () => {
    navigate('/area-membro');
  };

  const handleProfile = () => {
    navigate('/perfil');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Live indicator */}
      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
        <span className="text-xs font-medium">Tempo Real</span>
      </Badge>

      {/* Command Palette Trigger */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenCommandPalette}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
        title="Busca rápida (⌘K)"
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Notifications Bell */}
      <AdminNotificationBell />

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-muted">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                Administrador
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfile} className="gap-2">
            <User className="h-4 w-4" />
            Ver Perfil
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-600 focus:text-red-600">
            <LogOut className="h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
