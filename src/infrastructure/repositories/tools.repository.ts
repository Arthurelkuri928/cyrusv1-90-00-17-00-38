
import { BaseRepository } from './base.repository';
import { Tool, ToolsFilter, SupabaseTool, ActionButton } from '@/shared/types/tool';

export interface ToolsRepository {
  getAll(filter?: ToolsFilter): Promise<Tool[]>;
  getById(id: string | number): Promise<Tool>;
  getCredentials(toolId: string | number): Promise<any>;
  addToFavorites(toolId: string | number): Promise<void>;
  removeFromFavorites(toolId: string | number): Promise<void>;
  updateTool(id: number, updates: Partial<Pick<Tool, 'is_active' | 'is_maintenance' | 'card_color' | 'logo_url' | 'description' | 'category' | 'action_buttons'>>): Promise<void>;
  insertTool(tool: Partial<Tool>): Promise<Tool>;
  upsertTool(tool: Partial<Tool>): Promise<Tool>;
  deleteTool(id: number): Promise<void>;
  getDeletedTools(): Promise<Tool[]>;
  restoreTool(id: number): Promise<void>;
  permanentDeleteTool(id: number): Promise<void>;
}

export class SupabaseToolsRepository extends BaseRepository implements ToolsRepository {
  
  private mapSupabaseToolToDomain(supabaseTool: any): Tool {
    return {
      id: supabaseTool.id,
      name: supabaseTool.name,
      description: supabaseTool.description || '',
      category: supabaseTool.category || 'general',
      status: supabaseTool.is_maintenance ? 'maintenance' : 
              supabaseTool.is_active ? 'active' : 'inactive',
      url: supabaseTool.access_url || undefined,
      access_url: supabaseTool.access_url || undefined,
      email: supabaseTool.email || undefined,
      password: supabaseTool.password || undefined,
      cookies: supabaseTool.cookies || undefined,
      slug: supabaseTool.slug || undefined,
      is_active: supabaseTool.is_active,
      is_maintenance: supabaseTool.is_maintenance || false,
      created_at: supabaseTool.created_at || undefined,
      updated_at: supabaseTool.updated_at || undefined,
      // Visual fields
      card_color: supabaseTool.card_color || '#3B82F6',
      logo_url: supabaseTool.logo_url || undefined,
      // Action buttons mapping
      action_buttons: supabaseTool.action_buttons || [],
    };
  }

  async getAll(filter: ToolsFilter = {}): Promise<Tool[]> {
    console.log('🔄 [REPO] Fetching tools with filter:', filter);
    
    try {
      // Use the new RPC function that bypasses RLS issues
      const { data: supabaseTools, error } = await this.client.rpc('get_member_tools');
      
      if (error) {
        console.error('❌ [REPO] Error calling get_member_tools RPC:', error);
        throw error;
      }

      console.log('✅ [REPO] RPC get_member_tools returned:', {
        count: supabaseTools?.length || 0,
        tools: supabaseTools?.slice(0, 3).map(t => ({ id: t.id, name: t.name, is_active: t.is_active }))
      });

      if (!supabaseTools || supabaseTools.length === 0) {
        console.warn('⚠️ [REPO] No tools returned from RPC function');
        return [];
      }

      // As ferramentas já vêm filtradas pela função RPC (sem deleted_at)
      let filteredTools = supabaseTools;

      // Apply client-side filtering
      if (filter.status === 'active') {
        filteredTools = filteredTools.filter(tool => tool.is_active === true);
      } else if (filter.status === 'maintenance') {
        filteredTools = filteredTools.filter(tool => tool.is_maintenance === true);
      } else if (filter.status === 'inactive') {
        filteredTools = filteredTools.filter(tool => tool.is_active === false);
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredTools = filteredTools.filter(tool => 
          tool.name?.toLowerCase().includes(searchLower) ||
          tool.description?.toLowerCase().includes(searchLower)
        );
      }

      const mappedTools = filteredTools.map(tool => this.mapSupabaseToolToDomain(tool));
      
      console.log('✅ [REPO] Returning mapped tools:', {
        count: mappedTools.length,
        activeCount: mappedTools.filter(t => t.is_active === true).length,
        maintenanceCount: mappedTools.filter(t => t.is_maintenance === true).length
      });

      return mappedTools;
    } catch (error) {
      console.error('💥 [REPO] Critical error in getAll:', error);
      throw error;
    }
  }

  async getById(id: string | number): Promise<Tool> {
    const supabaseTool = await this.executeQuery(async () => {
      return this.client
        .from('tools')
        .select('*')
        .eq('id', Number(id))
        .single();
    });

    return this.mapSupabaseToolToDomain(supabaseTool);
  }

  async getCredentials(toolId: string | number): Promise<any> {
    return this.executeQuery(async () => {
      return this.client
        .from('tool_credentials')
        .select('credentials')
        .eq('tool_id', String(toolId))
        .single();
    });
  }

  async updateTool(id: number, updates: Partial<Pick<Tool, 'is_active' | 'is_maintenance' | 'card_color' | 'logo_url' | 'description' | 'category' | 'action_buttons'>>): Promise<void> {
    // Convert action_buttons to plain object for Supabase
    const supabaseUpdates: any = { ...updates };
    if (updates.action_buttons) {
      supabaseUpdates.action_buttons = JSON.parse(JSON.stringify(updates.action_buttons));
    }

    await this.executeQuery(async () => {
      return this.client
        .from('tools')
        .update(supabaseUpdates)
        .eq('id', id);
    });
  }

  async insertTool(tool: Partial<Tool>): Promise<Tool> {
    const insertData = {
      name: tool.name!,
      description: tool.description || '',
      category: tool.category || 'general',
      card_color: tool.card_color || '#3B82F6',
      logo_url: tool.logo_url,
      access_url: tool.access_url,
      email: tool.email,
      password: tool.password,
      cookies: tool.cookies,
      slug: tool.slug,
      is_active: tool.is_active ?? true,
      is_maintenance: tool.is_maintenance ?? false,
      action_buttons: JSON.parse(JSON.stringify(tool.action_buttons || [])),
    };

    const supabaseTool = await this.executeQuery(async () => {
      return this.client
        .from('tools')
        .insert(insertData)
        .select()
        .single();
    });

    return this.mapSupabaseToolToDomain(supabaseTool);
  }

  async upsertTool(tool: Partial<Tool>): Promise<Tool> {
    const upsertData = {
      id: Number(tool.id),
      name: tool.name!,
      description: tool.description || '',
      category: tool.category || 'general',
      card_color: tool.card_color || '#3B82F6',
      logo_url: tool.logo_url,
      access_url: tool.access_url,
      email: tool.email,
      password: tool.password,
      cookies: tool.cookies,
      slug: tool.slug,
      is_active: tool.is_active ?? true,
      is_maintenance: tool.is_maintenance ?? false,
      action_buttons: JSON.parse(JSON.stringify(tool.action_buttons || [])),
    };

    const supabaseTool = await this.executeQuery(async () => {
      return this.client
        .from('tools')
        .upsert(upsertData)
        .select()
        .single();
    });

    return this.mapSupabaseToolToDomain(supabaseTool);
  }

  async deleteTool(id: number): Promise<void> {
    await this.executeQuery(async () => {
      return this.client
        .from('tools')
        .update({ 
          deleted_at: new Date().toISOString(),
          is_active: false 
        })
        .eq('id', id);
    });
  }

  async getDeletedTools(): Promise<Tool[]> {
    const deletedTools = await this.executeQuery(async () => {
      return this.client
        .from('tools')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });
    });

    return deletedTools.map(tool => this.mapSupabaseToolToDomain(tool));
  }

  async restoreTool(id: number): Promise<void> {
    await this.executeQuery(async () => {
      return this.client
        .from('tools')
        .update({ 
          deleted_at: null,
          is_active: true 
        })
        .eq('id', id);
    });
  }

  async permanentDeleteTool(id: number): Promise<void> {
    await this.executeQuery(async () => {
      return this.client
        .from('tools')
        .delete()
        .eq('id', id);
    });
  }

  // Using localStorage for favorites since user_favorites table doesn't exist
  async addToFavorites(toolId: string | number): Promise<void> {
    try {
      const favorites = this.getFavoritesFromStorage();
      const toolIdStr = String(toolId);
      
      if (!favorites.includes(toolIdStr)) {
        favorites.push(toolIdStr);
        localStorage.setItem('user_favorites', JSON.stringify(favorites));
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeFromFavorites(toolId: string | number): Promise<void> {
    try {
      const favorites = this.getFavoritesFromStorage();
      const toolIdStr = String(toolId);
      const updatedFavorites = favorites.filter(id => id !== toolIdStr);
      
      localStorage.setItem('user_favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      this.handleError(error);
    }
  }

  private getFavoritesFromStorage(): string[] {
    try {
      const favorites = localStorage.getItem('user_favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch {
      return [];
    }
  }
}
