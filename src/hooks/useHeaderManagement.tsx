
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HeaderService } from '@/shared/services/HeaderService';
import { 
  HeaderSettings, 
  HeaderActionButton, 
  HeaderNavItem,
  CreateHeaderActionButtonRequest,
  UpdateHeaderActionButtonRequest,
  CreateHeaderNavItemRequest,
  UpdateHeaderNavItemRequest,
  UpdateHeaderSettingsRequest
} from '@/shared/types/header';
import { useToast } from '@/hooks/use-toast';

const headerService = HeaderService.getInstance();

export const useHeaderManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Header Settings
  const { 
    data: headerSettings, 
    isLoading: loadingSettings,
    error: settingsError 
  } = useQuery({
    queryKey: ['header-settings'],
    queryFn: () => headerService.getHeaderSettings(),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (updates: UpdateHeaderSettingsRequest) => 
      headerService.updateHeaderSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-settings'] });
      toast({
        title: 'Sucesso',
        description: 'Configurações do cabeçalho atualizadas com sucesso',
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar configurações do cabeçalho',
        variant: 'destructive',
      });
    },
  });

  // Action Buttons
  const { 
    data: actionButtons = [], 
    isLoading: loadingButtons,
    error: buttonsError 
  } = useQuery({
    queryKey: ['header-action-buttons'],
    queryFn: () => headerService.getActionButtons(),
  });

  const createButtonMutation = useMutation({
    mutationFn: (buttonData: CreateHeaderActionButtonRequest) => 
      headerService.createActionButton(buttonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-action-buttons'] });
      toast({
        title: 'Sucesso',
        description: 'Botão criado com sucesso',
      });
    },
    onError: (error) => {
      console.error('Erro ao criar botão:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao criar botão',
        variant: 'destructive',
      });
    },
  });

  const updateButtonMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateHeaderActionButtonRequest }) => 
      headerService.updateActionButton(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-action-buttons'] });
      toast({
        title: 'Sucesso',
        description: 'Botão atualizado com sucesso',
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar botão:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar botão',
        variant: 'destructive',
      });
    },
  });

  const deleteButtonMutation = useMutation({
    mutationFn: (id: string) => headerService.deleteActionButton(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-action-buttons'] });
      toast({
        title: 'Sucesso',
        description: 'Botão removido com sucesso',
      });
    },
    onError: (error) => {
      console.error('Erro ao remover botão:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao remover botão',
        variant: 'destructive',
      });
    },
  });

  const reorderButtonsMutation = useMutation({
    mutationFn: (updates: { id: string; position: number }[]) => 
      headerService.reorderActionButtons(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-action-buttons'] });
    },
    onError: (error) => {
      console.error('Erro ao reordenar botões:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao reordenar botões',
        variant: 'destructive',
      });
    },
  });

  // Navigation Items
  const { 
    data: navItems = [], 
    isLoading: loadingNavItems,
    error: navItemsError 
  } = useQuery({
    queryKey: ['header-nav-items-admin'],
    queryFn: () => headerService.getNavItemsAdmin(),
  });

  const createNavItemMutation = useMutation({
    mutationFn: (itemData: CreateHeaderNavItemRequest) => 
      headerService.createNavItem(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-nav-items-admin'] });
      toast({
        title: 'Sucesso',
        description: 'Item de navegação criado com sucesso',
      });
    },
    onError: (error) => {
      console.error('Erro ao criar item de navegação:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao criar item de navegação',
        variant: 'destructive',
      });
    },
  });

  const updateNavItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateHeaderNavItemRequest }) => 
      headerService.updateNavItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-nav-items-admin'] });
      toast({
        title: 'Sucesso',
        description: 'Item de navegação atualizado com sucesso',
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar item de navegação:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar item de navegação',
        variant: 'destructive',
      });
    },
  });

  const deleteNavItemMutation = useMutation({
    mutationFn: (id: string) => headerService.deleteNavItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-nav-items-admin'] });
      toast({
        title: 'Sucesso',
        description: 'Item de navegação removido com sucesso',
      });
    },
    onError: (error) => {
      console.error('Erro ao remover item de navegação:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao remover item de navegação',
        variant: 'destructive',
      });
    },
  });

  const reorderNavItemsMutation = useMutation({
    mutationFn: (updates: { id: string; position: number; parent_id?: string }[]) => 
      headerService.reorderNavItems(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-nav-items-admin'] });
    },
    onError: (error) => {
      console.error('Erro ao reordenar itens de navegação:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao reordenar itens de navegação',
        variant: 'destructive',
      });
    },
  });

  return {
    // Header Settings
    headerSettings,
    loadingSettings,
    settingsError,
    updateSettings: updateSettingsMutation.mutate,
    updatingSettings: updateSettingsMutation.isPending,

    // Action Buttons
    actionButtons,
    loadingButtons,
    buttonsError,
    createButton: createButtonMutation.mutate,
    creatingButton: createButtonMutation.isPending,
    updateButton: updateButtonMutation.mutate,
    updatingButton: updateButtonMutation.isPending,
    deleteButton: deleteButtonMutation.mutate,
    deletingButton: deleteButtonMutation.isPending,
    reorderButtons: reorderButtonsMutation.mutate,
    reorderingButtons: reorderButtonsMutation.isPending,

    // Navigation Items
    navItems,
    loadingNavItems,
    navItemsError,
    createNavItem: createNavItemMutation.mutate,
    creatingNavItem: createNavItemMutation.isPending,
    updateNavItem: updateNavItemMutation.mutate,
    updatingNavItem: updateNavItemMutation.isPending,
    deleteNavItem: deleteNavItemMutation.mutate,
    deletingNavItem: deleteNavItemMutation.isPending,
    reorderNavItems: reorderNavItemsMutation.mutate,
    reorderingNavItems: reorderNavItemsMutation.isPending,
  };
};
