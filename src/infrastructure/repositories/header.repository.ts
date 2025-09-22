
import { BaseRepository } from './base.repository';
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

export class SupabaseHeaderRepository extends BaseRepository {

  // Helper para contornar limitações de tipos do Supabase (functions RPC não presentes em types gerados)
  private rpc<T = any>(fn: string, args?: Record<string, any>) {
    return (this.client as any).rpc(fn, args) as Promise<{ data: T; error: any }>;
  }
  
  // Header Settings Methods
  async getHeaderSettings(): Promise<HeaderSettings> {
    return this.executeQuery(async () => {
      const { data, error } = await this.rpc<any[]>('get_header_settings');

      // Se não houver dados ou array vazio, criar configurações padrão
      if (!data || (Array.isArray(data) && data.length === 0)) {
        const { data: newData, error: createError } = await this.rpc<any[]>('create_default_header_settings');
        const first = Array.isArray(newData) ? newData?.[0] : newData;
        return { data: (first as HeaderSettings) || null, error: createError };
      }
      
      const first = Array.isArray(data) ? data?.[0] : data;
      return { data: (first as HeaderSettings) || null, error };
    });
  }

  async updateHeaderSettings(updates: UpdateHeaderSettingsRequest): Promise<HeaderSettings> {
    return this.executeQuery(async () => {
      const { data, error } = await this.rpc<any[]>('update_header_settings', { 
        logo_url_param: updates.logo_url 
      });
      const first = Array.isArray(data) ? data?.[0] : data;
      return { data: (first as HeaderSettings) || null, error };
    });
  }

  // Action Buttons Methods
  async getActionButtons(): Promise<HeaderActionButton[]> {
    return this.executeQuery(async () => {
      const { data, error } = await this.rpc<any[]>('get_header_action_buttons');
      const arr = Array.isArray(data) ? data : [];
      return { data: (arr as HeaderActionButton[]) || [], error };
    });
  }

  async createActionButton(buttonData: CreateHeaderActionButtonRequest): Promise<HeaderActionButton> {
    return this.executeQuery(async () => {
      const { data, error } = await this.rpc<any[]>('create_header_action_button', {
        label_param: buttonData.label,
        url_param: buttonData.url,
        style_param: buttonData.style,
        is_visible_param: buttonData.is_visible ?? true,
        position_param: buttonData.position ?? 0
      });
      const first = Array.isArray(data) ? data?.[0] : data;
      return { data: (first as HeaderActionButton) || null, error };
    });
  }

  async updateActionButton(id: string, updates: UpdateHeaderActionButtonRequest): Promise<HeaderActionButton> {
    return this.executeQuery(async () => {
      const { data, error } = await this.rpc<any[]>('update_header_action_button', {
        button_id: id,
        label_param: updates.label,
        url_param: updates.url,
        style_param: updates.style,
        is_visible_param: updates.is_visible,
        position_param: updates.position
      });
      const first = Array.isArray(data) ? data?.[0] : data;
      return { data: (first as HeaderActionButton) || null, error };
    });
  }

  async deleteActionButton(id: string): Promise<void> {
    return this.executeQuery(async () => {
      const { error } = await this.rpc('delete_header_action_button', { button_id: id });
      return { data: null, error };
    });
  }

  async updateActionButtonPositions(updates: { id: string; position: number }[]): Promise<void> {
    return this.executeQuery(async () => {
      // Atualiza um a um (não há função batch declarada)
      let lastError: any = null;
      for (const update of updates) {
        const { error } = await this.rpc('update_header_action_button', {
          button_id: update.id,
          position_param: update.position
        });
        if (error) lastError = error;
      }
      return { data: null, error: lastError };
    });
  }

  // Navigation Items Methods
  async getNavItems(): Promise<HeaderNavItem[]> {
    return this.executeQuery(async () => {
      const { data, error } = await this.rpc<any>('get_header_nav_items');
      
      // A função pode retornar JSONB como string, objeto ou array
      let navItems: any[] = [];
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          navItems = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
        } catch {
          navItems = [];
        }
      } else if (Array.isArray(data)) {
        navItems = data;
      } else if (data && typeof data === 'object') {
        navItems = [data];
      }
      return { data: (navItems as HeaderNavItem[]) || [], error };
    });
  }

  async getNavItemsAdmin(): Promise<HeaderNavItem[]> {
    return this.executeQuery(async () => {
      const { data, error } = await this.rpc<any>('get_header_nav_items_admin');
      
      // A função pode retornar JSONB como string, objeto ou array
      let navItems: any[] = [];
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          navItems = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
        } catch {
          navItems = [];
        }
      } else if (Array.isArray(data)) {
        navItems = data;
      } else if (data && typeof data === 'object') {
        navItems = [data];
      }
      return { data: (navItems as HeaderNavItem[]) || [], error };
    });
  }

  async createNavItem(itemData: CreateHeaderNavItemRequest): Promise<HeaderNavItem> {
    return this.executeQuery(async () => {
      const { data, error } = await this.rpc<any[]>('create_header_nav_item', {
        label_param: itemData.label,
        type_param: itemData.type,
        url_param: itemData.url,
        page_slug_param: itemData.page_slug,
        parent_id_param: itemData.parent_id,
        is_visible_param: itemData.is_visible ?? true,
        position_param: itemData.position ?? 0
      });
      const first = Array.isArray(data) ? data?.[0] : data;
      return { data: (first as HeaderNavItem) || null, error };
    });
  }

  async updateNavItem(id: string, updates: UpdateHeaderNavItemRequest): Promise<HeaderNavItem> {
    return this.executeQuery(async () => {
      const { data, error } = await this.rpc<any[]>('update_header_nav_item', {
        item_id: id,
        label_param: updates.label,
        type_param: updates.type,
        url_param: updates.url,
        page_slug_param: updates.page_slug,
        parent_id_param: updates.parent_id,
        is_visible_param: updates.is_visible,
        position_param: updates.position
      });
      const first = Array.isArray(data) ? data?.[0] : data;
      return { data: (first as HeaderNavItem) || null, error };
    });
  }

  async deleteNavItem(id: string): Promise<void> {
    return this.executeQuery(async () => {
      const { error } = await this.rpc('delete_header_nav_item', { item_id: id });
      return { data: null, error };
    });
  }

  async updateNavItemPositions(updates: { id: string; position: number; parent_id?: string }[]): Promise<void> {
    return this.executeQuery(async () => {
      let lastError: any = null;
      for (const update of updates) {
        const { error } = await this.rpc('update_header_nav_item', {
          item_id: update.id,
          position_param: update.position,
          parent_id_param: update.parent_id
        });
        if (error) lastError = error;
      }
      return { data: null, error: lastError };
    });
  }
}
