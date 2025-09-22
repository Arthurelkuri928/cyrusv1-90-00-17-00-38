
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tool } from '@/shared/types/tool';
import { toast } from 'sonner';
import { useToolsSync } from '@/hooks/useToolsSync';

export const useToolManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { broadcastAdminUpdate } = useToolsSync();

  const createTool = async (toolData: Partial<Tool>) => {
    try {
      setIsCreating(true);
      
      // Serialize action_buttons safely for Supabase
      const actionButtons = JSON.parse(JSON.stringify(toolData.action_buttons || []));
      console.log('🔄 Creating tool with action_buttons count:', actionButtons.length);
      
      const { data, error } = await supabase
        .from('tools')
        .insert({
          name: toolData.name!,
          description: toolData.description || '',
          category: toolData.category || 'general',
          card_color: toolData.card_color || '#3B82F6',
          logo_url: toolData.logo_url,
          access_url: toolData.access_url,
          email: toolData.email,
          password: toolData.password,
          cookies: toolData.cookies,
          slug: toolData.slug,
          is_active: toolData.is_active ?? true,
          is_maintenance: toolData.is_maintenance ?? false,
          action_buttons: actionButtons,
        })
        .select()
        .single();

      if (error) throw error;

      // Broadcast update to all tabs/windows
      broadcastAdminUpdate(data.id, { action: 'create', tool: data });
      
      toast.success('Ferramenta criada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar ferramenta:', error);
      toast.error('Erro ao criar ferramenta');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateTool = async (id: number, updates: Partial<Tool>) => {
    try {
      setIsUpdating(true);
      
      // Serialize action_buttons safely for Supabase - use empty array if undefined to ensure deletions are reflected
      const actionButtons = JSON.parse(JSON.stringify(updates.action_buttons ?? []));
      
      // Safely get action_buttons length with proper type checking
      let actionButtonsCount = 0;
      if (Array.isArray(actionButtons)) {
        actionButtonsCount = actionButtons.length;
      }
      
      console.log('🔄 Updating tool ID', id, 'with action_buttons:', {
        count: actionButtonsCount,
        buttons: Array.isArray(actionButtons) ? actionButtons.map(btn => ({ id: btn.id, label: btn.label, type: btn.type })) : []
      });
      
      const updateData = {
        name: updates.name,
        description: updates.description,
        category: updates.category,
        card_color: updates.card_color,
        logo_url: updates.logo_url,
        access_url: updates.access_url,
        email: updates.email,
        password: updates.password,
        cookies: updates.cookies,
        slug: updates.slug,
        is_active: updates.is_active,
        is_maintenance: updates.is_maintenance,
        action_buttons: actionButtons,
        updated_at: new Date().toISOString()
      };

      console.log('📤 Sending update payload:', updateData);

      const { data, error } = await supabase
        .from('tools')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase update error:', error);
        throw error;
      }

      // Safely get updated action_buttons count
      let updatedActionButtonsCount = 0;
      if (data.action_buttons && Array.isArray(data.action_buttons)) {
        updatedActionButtonsCount = data.action_buttons.length;
      }

      console.log('✅ Tool updated successfully:', {
        id: data.id,
        name: data.name,
        action_buttons_count: updatedActionButtonsCount,
        action_buttons: data.action_buttons
      });

      // Broadcast update to all tabs/windows
      broadcastAdminUpdate(id, { action: 'update', tool: data, updates });
      
      toast.success('Ferramenta atualizada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar ferramenta:', error);
      toast.error('Erro ao atualizar ferramenta');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteTool = async (id: number) => {
    try {
      setIsDeleting(true);
      
      // Primeiro, buscar dados da ferramenta antes de excluir (para possível restauração)
      const { data: toolData, error: fetchError } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Soft delete - marcar como excluída ao invés de deletar permanentemente
      const { error } = await supabase
        .from('tools')
        .update({ 
          deleted_at: new Date().toISOString(),
          is_active: false // Desativar também
        })
        .eq('id', id);

      if (error) throw error;

      // Broadcast update to all tabs/windows
      broadcastAdminUpdate(id, { action: 'delete' });
      
      // Toast com opção de reverter por 5 segundos
      toast.success('Ferramenta movida para lixeira', {
        action: {
          label: 'Reverter',
          onClick: () => restoreTool(id, toolData.name)
        },
        duration: 5000,
      });
    } catch (error) {
      console.error('Erro ao mover ferramenta para lixeira:', error);
      toast.error('Erro ao mover ferramenta para lixeira');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const restoreTool = async (id: number, toolName: string) => {
    try {
      const { error } = await supabase
        .from('tools')
        .update({ 
          deleted_at: null,
          is_active: true // Reativar ferramenta
        })
        .eq('id', id);

      if (error) throw error;

      // Broadcast update to all tabs/windows
      broadcastAdminUpdate(id, { action: 'restore' });
      
      toast.success(`Ferramenta "${toolName}" foi restaurada!`);
    } catch (error) {
      console.error('Erro ao restaurar ferramenta:', error);
      toast.error('Erro ao restaurar ferramenta');
    }
  };

  const permanentDeleteTool = async (id: number) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Broadcast update to all tabs/windows
      broadcastAdminUpdate(id, { action: 'permanent_delete' });
      
      toast.success('Ferramenta excluída permanentemente!');
    } catch (error) {
      console.error('Erro ao excluir ferramenta permanentemente:', error);
      toast.error('Erro ao excluir ferramenta permanentemente');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleToolStatus = async (id: number, field: 'is_active' | 'is_maintenance', value: boolean) => {
    try {
      const updates = { [field]: value };
      
      const { data, error } = await supabase
        .from('tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Broadcast update to all tabs/windows
      broadcastAdminUpdate(id, { action: 'toggle_status', field, value, tool: data });
      
      const statusText = field === 'is_active' 
        ? (value ? 'ativada' : 'desativada')
        : (value ? 'em manutenção' : 'fora de manutenção');
      
      toast.success(`Ferramenta ${statusText} com sucesso!`);
      return data;
    } catch (error) {
      console.error('Erro ao alterar status da ferramenta:', error);
      toast.error('Erro ao alterar status da ferramenta');
      throw error;
    }
  };

  return {
    createTool,
    updateTool,
    deleteTool,
    restoreTool,
    permanentDeleteTool,
    toggleToolStatus,
    isCreating,
    isUpdating,
    isDeleting
  };
};
