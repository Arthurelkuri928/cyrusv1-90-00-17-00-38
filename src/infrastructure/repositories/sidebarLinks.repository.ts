
import { BaseRepository } from './base.repository';
import { SidebarLink, SidebarLinkFilter } from '@/shared/types/sidebarLink';

export interface SidebarLinksRepository {
  getAll(filter?: SidebarLinkFilter): Promise<SidebarLink[]>;
  getById(id: string): Promise<SidebarLink>;
  create(linkData: Partial<SidebarLink>): Promise<SidebarLink>;
  update(id: string, updates: Partial<SidebarLink>): Promise<SidebarLink>;
  delete(id: string): Promise<void>;
  updatePositions(linksArray: { id: string; position: number }[]): Promise<void>;
}

export class SupabaseSidebarLinksRepository extends BaseRepository implements SidebarLinksRepository {
  
  private mapSupabaseLinkToDomain(supabaseLink: any): SidebarLink {
    return {
      id: supabaseLink.id,
      title: supabaseLink.title,
      description: supabaseLink.description,
      url: supabaseLink.url,
      category: supabaseLink.category,
      icon: supabaseLink.icon,
      is_visible: supabaseLink.is_visible,
      is_external: supabaseLink.is_external,
      position: supabaseLink.position,
      multilang_support: supabaseLink.multilang_support,
      created_at: supabaseLink.created_at,
      updated_at: supabaseLink.updated_at,
    };
  }

  async getAll(filter: SidebarLinkFilter = {}): Promise<SidebarLink[]> {
    const supabaseLinks = await this.executeQuery(async () => {
      let query = this.client
        .from('sidebar_links')
        .select('*')
        .order('position', { ascending: true });

      if (filter.category) {
        query = query.eq('category', filter.category);
      }

      if (filter.is_visible !== undefined) {
        query = query.eq('is_visible', filter.is_visible);
      }

      if (filter.is_external !== undefined) {
        query = query.eq('is_external', filter.is_external);
      }

      return query;
    });

    return supabaseLinks.map(link => this.mapSupabaseLinkToDomain(link));
  }

  async getById(id: string): Promise<SidebarLink> {
    const supabaseLink = await this.executeQuery(async () => {
      return this.client
        .from('sidebar_links')
        .select('*')
        .eq('id', id)
        .single();
    });

    return this.mapSupabaseLinkToDomain(supabaseLink);
  }

  async create(linkData: Partial<SidebarLink>): Promise<SidebarLink> {
    const insertData = {
      title: linkData.title!,
      description: linkData.description || null,
      url: linkData.url!,
      category: linkData.category!,
      icon: linkData.icon || 'ExternalLink',
      is_visible: linkData.is_visible ?? true,
      is_external: linkData.is_external ?? true,
      position: linkData.position ?? 0,
      multilang_support: linkData.multilang_support || {
        en: { title: '', description: '' },
        es: { title: '', description: '' },
        pt: { title: '', description: '' }
      },
    };

    const supabaseLink = await this.executeQuery(async () => {
      return this.client
        .from('sidebar_links')
        .insert(insertData)
        .select()
        .single();
    });

    return this.mapSupabaseLinkToDomain(supabaseLink);
  }

  async update(id: string, updates: Partial<SidebarLink>): Promise<SidebarLink> {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.url !== undefined) updateData.url = updates.url;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.is_visible !== undefined) updateData.is_visible = updates.is_visible;
    if (updates.is_external !== undefined) updateData.is_external = updates.is_external;
    if (updates.position !== undefined) updateData.position = updates.position;
    if (updates.multilang_support !== undefined) updateData.multilang_support = updates.multilang_support;

    const supabaseLink = await this.executeQuery(async () => {
      return this.client
        .from('sidebar_links')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    });

    return this.mapSupabaseLinkToDomain(supabaseLink);
  }

  async delete(id: string): Promise<void> {
    await this.executeQuery(async () => {
      return this.client
        .from('sidebar_links')
        .delete()
        .eq('id', id);
    });
  }

  async updatePositions(linksArray: { id: string; position: number }[]): Promise<void> {
    // Realizar updates em batch para melhor performance
    for (const link of linksArray) {
      await this.executeQuery(async () => {
        return this.client
          .from('sidebar_links')
          .update({ position: link.position })
          .eq('id', link.id);
      });
    }
  }
}
