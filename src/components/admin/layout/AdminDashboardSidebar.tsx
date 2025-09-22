import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserCircle, ChevronLeft, HelpCircle, ChevronDown, LogOut, X, MoreVertical } from 'lucide-react';
import cyrusLogo from '@/assets/cyrus-logo.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../../../contexts/AdminDashboardContext';
import { adminNavigationData } from '../../../data/adminNavigationData';
import { Button } from '../../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { useAvatar } from '../../../hooks/useAvatar';
import * as Popover from '@radix-ui/react-popover';
import * as Dialog from '@radix-ui/react-dialog';
import { SIDEBAR_CONFIG } from '../../../config/sidebarConfig';
import { AdminNotificationBell } from './AdminNotificationBell';

// Support Modal Component
const SupportModal: React.FC<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}> = ({
  isOpen,
  onOpenChange
}) => <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-700/50 bg-[#1C1C1E] p-6 shadow-2xl">
        <Dialog.Title className="text-lg font-bold text-white">Solicitar Ajuda ao Administrador</Dialog.Title>
        <Dialog.Description className="mt-1 text-sm text-zinc-400">Descreva seu problema para o administrador.</Dialog.Description>
        <form className="mt-6 space-y-4">
          <textarea placeholder="Digite sua mensagem aqui..." className="h-32 w-full resize-none rounded-md border border-zinc-700/50 bg-zinc-800/30 p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <div className="flex justify-end">
            <button type="submit" className="h-10 rounded-md bg-gradient-to-r from-purple-600 to-violet-600 px-6 text-sm font-semibold text-white hover:shadow-lg transition-all">
              Enviar Solicitação
            </button>
          </div>
        </form>
        <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-800/50">
          <X className="h-5 w-5" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;

// User Dropup Component
const UserDropup: React.FC = () => {
  const avatarUrl = useAvatar();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Redireciona para a área de membros
    navigate('/area-membro');
  };
  return <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex w-full items-center gap-3 rounded-md p-1 text-left hover:bg-zinc-800/50 transition-colors">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={avatarUrl} alt="User Avatar" />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white font-bold">
              A
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin</p>
          </div>
          <MoreVertical className="h-4 w-4 text-zinc-400 flex-shrink-0" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="top" align="start" sideOffset={8} className="w-48 rounded-lg border border-zinc-700/50 bg-[#1C1C1E] p-2 shadow-lg z-50">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-md p-2 text-sm text-white hover:bg-zinc-800/60 transition-colors">
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>;
};
export const AdminDashboardSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    setSearchModalOpen
  } = useAdminDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const avatarUrl = useAvatar();

  // Todas as categorias abertas por padrão
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "GERAL": true,
    "WORKSPACE": true,
    "CONFIGURAÇÕES": true
  });
  const sidebarVariants = {
    expanded: {
      width: `${SIDEBAR_CONFIG.EXPANDED_WIDTH}px`
    },
    collapsed: {
      width: `${SIDEBAR_CONFIG.COLLAPSED_WIDTH}px`
    }
  };
  const toggleSection = (title: string) => {
    if (!isSidebarCollapsed) {
      setExpandedSections(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    }
  };
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const getNavCls = (isActiveState: boolean) => isActiveState ? 'bg-gradient-to-r from-[#A855F7]/20 to-[#A855F7]/10 text-white border-[#A855F7]/30 font-medium' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white';

  // Filtrar itens de navegação removendo "Visão Geral" e "Minha Conta"
  const filteredNavigationData = adminNavigationData.map(section => ({
    ...section,
    items: section.items.filter(item => item.id !== 'visao-geral' && item.id !== 'conta' && item.label !== 'Visão Geral' && item.label !== 'Minha Conta')
  }));
  return <>
      <motion.div variants={sidebarVariants} animate={isSidebarCollapsed ? 'collapsed' : 'expanded'} transition={{
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }} className={`fixed left-4 top-4 bottom-4 bg-[#18181B] border-zinc-800/50 text-white rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden`}>
      {/* Header com toggle */}
      <div className="p-3 mb-4 border-b border-zinc-800/30">
        {!isSidebarCollapsed ?
        // Layout expandido - logotipo + texto + botão de colapsar
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-2 rounded-lg shadow-lg">
                <img src={cyrusLogo} alt="Cyrus Logo" className="h-5 w-5 object-contain filter drop-shadow-sm" />
              </div>
              <h1 className="text-xl font-bold text-white whitespace-nowrap select-none">
                Cyrus Admin
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4 transition-transform duration-300" />
            </Button>
          </div> :
        // Layout colapsado - apenas logotipo centralizado com hover para mostrar seta
        <div className="flex flex-col items-center">
            <div className="group relative bg-gradient-to-r from-purple-600 to-violet-600 p-2 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300" onClick={toggleSidebar}>
              <img src={cyrusLogo} alt="Cyrus Logo" className="h-6 w-6 object-contain filter drop-shadow-sm" />
              
              {/* Seta que aparece no hover */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                <div className="bg-zinc-800 border border-zinc-700 rounded-full p-1 shadow-lg">
                  <ChevronLeft className="h-3 w-3 text-white rotate-180" />
                </div>
              </div>
            </div>
          </div>}
      </div>

      {/* Search - só aparece quando expandido */}
      {!isSidebarCollapsed && <div className="relative mb-4 px-3">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <button onClick={() => setSearchModalOpen(true)} className="w-full bg-zinc-800/30 text-white border border-zinc-700/50 rounded-lg pl-10 pr-10 py-2 text-sm text-left hover:bg-zinc-800/50 transition-colors backdrop-blur-sm">
            Pesquisar
          </button>
          <kbd className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-zinc-400 bg-zinc-800/30 px-1.5 py-0.5 rounded border border-zinc-700/50">
            ⌘K
          </kbd>
        </div>}

        {/* Navigation */}
        <nav className="flex-1 flex flex-col px-3 overflow-y-auto">
          {filteredNavigationData.map((section, index) => <div key={section.id} className={`${index > 0 ? 'border-t border-zinc-800/30 pt-4' : ''} mb-4`}>
            <h2 className={`text-xs font-semibold text-zinc-500 uppercase mb-2 cursor-pointer flex justify-between items-center select-none transition-colors hover:text-zinc-300 px-3 ${isSidebarCollapsed ? 'justify-center' : ''}`} onClick={() => toggleSection(section.label || '')}>
              {!isSidebarCollapsed && <>
                  {section.label}
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${expandedSections[section.label || ''] ? 'rotate-180' : ''}`} />
                </>}
              {isSidebarCollapsed}
            </h2>

            {(expandedSections[section.label || ''] || isSidebarCollapsed) && <ul className="space-y-1">
                {section.items.map(item => <li key={item.id}>
                    <NavLink to={item.href} className={({
                isActive
              }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 ${getNavCls(isActive || item.active)} ${isSidebarCollapsed ? 'justify-center' : ''} relative`} title={isSidebarCollapsed ? item.label : ''}>
                      <item.icon className={`flex-shrink-0 ${isSidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`} />
                      {!isSidebarCollapsed && <>
                          <span className="select-none">{item.label}</span>
                          {item.hasNotification && <div className="w-2 h-2 bg-primary rounded-full ml-auto animate-pulse"></div>}
                          {item.count && <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                              {item.count}
                            </span>}
                        </>}
                      {isSidebarCollapsed && item.hasNotification && <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </NavLink>
                  </li>)}
              </ul>}
          </div>)}
      </nav>

        {/* Footer com suporte e perfil */}
        <div className={`mt-auto space-y-4 transition-all duration-300 ${isSidebarCollapsed ? 'm-2' : 'm-4'}`}>
          {!isSidebarCollapsed && <div className="group relative rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 p-5 text-center backdrop-blur-sm hover:from-zinc-800/60 hover:to-zinc-900/60 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <HelpCircle className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">Precisa de ajuda?</p>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">Entre em contato com nossos agentes</p>
                <button onClick={() => setIsModalOpen(true)} className="w-full h-9 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 px-4 text-sm font-medium text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900">
                  Entrar em contato
                </button>
              </div>
            </div>}
          
          <div className={`flex items-center justify-between border-t border-zinc-800/30 pt-4 ${isSidebarCollapsed ? 'flex-col gap-3' : ''}`}>
            <div className={`${isSidebarCollapsed ? 'w-full' : 'flex-1'}`}>
              {!isSidebarCollapsed ? <UserDropup /> : <div className="flex justify-center">
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button className="flex items-center justify-center p-1 rounded-md hover:bg-zinc-800/50 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={avatarUrl} alt="User Avatar" />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white font-bold">
                            A
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content side="top" align="center" sideOffset={8} className="w-48 rounded-lg border border-zinc-700/50 bg-[#1C1C1E] p-2 shadow-lg z-50">
                        <button onClick={() => navigate('/area-membro')} className="flex w-full items-center gap-3 rounded-md p-2 text-sm text-white hover:bg-zinc-800/60 transition-colors">
                          <LogOut className="h-4 w-4" />
                          <span>Sair</span>
                        </button>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>}
            </div>
            
            {/* Notifications Bell - sempre visível */}
            <div className={`${isSidebarCollapsed ? 'w-full flex justify-center' : 'flex items-center gap-2'}`}>
              <AdminNotificationBell />
            </div>
          </div>
        </div>
      </motion.div>
      
      <SupportModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>;
};