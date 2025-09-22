
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Search, Settings, User, LogOut, Shield } from 'lucide-react';
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

export const AdminTopBar = () => {
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
    <header className="h-16 bg-gray-900 border-b border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo e Título */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Painel Administrativo</h1>
              <p className="text-xs text-gray-400">Gerenciamento do Sistema</p>
            </div>
          </div>
        </div>

        {/* Ações da direita */}
        <div className="flex items-center gap-4">
          {/* Indicador de tempo real */}
          <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            Tempo Real
          </Badge>

          {/* Busca rápida */}
          <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white hover:bg-gray-700">
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Buscar</span>
          </Button>

          {/* Notificações */}
          <Button variant="ghost" size="sm" className="relative text-gray-300 hover:text-white hover:bg-gray-700">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-700">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-gray-600">
                    <User className="h-5 w-5 text-white" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-600" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{userData.name}</p>
                  <p className="text-xs leading-none text-gray-400">
                    Administrador
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem onClick={handleProfile} className="gap-2 text-gray-300 hover:text-white hover:bg-gray-700">
                <User className="h-4 w-4" />
                Ver Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-gray-300 hover:text-white hover:bg-gray-700">
                <Settings className="h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-400 hover:text-red-300 hover:bg-gray-700">
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
