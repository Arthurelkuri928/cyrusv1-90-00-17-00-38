
import { SupabaseSidebarLinksRepository } from '@/infrastructure/repositories/sidebarLinks.repository';
import { SidebarLink, SidebarLinkFilter, CreateSidebarLinkRequest, UpdateSidebarLinkRequest } from '@/shared/types/sidebarLink';
import { ErrorService } from './ErrorService';

export class SidebarLinksService {
  private static instance: SidebarLinksService;
  private repository = new SupabaseSidebarLinksRepository();
  private errorService = ErrorService.getInstance();

  static getInstance(): SidebarLinksService {
    if (!SidebarLinksService.instance) {
      SidebarLinksService.instance = new SidebarLinksService();
    }
    return SidebarLinksService.instance;
  }

  async getAllLinks(filter?: SidebarLinkFilter): Promise<SidebarLink[]> {
    try {
      console.log('SidebarLinksService: Fetching all links with filter:', filter);
      const links = await this.repository.getAll(filter);
      console.log('SidebarLinksService: Retrieved links:', links.length);
      return links;
    } catch (error) {
      this.errorService.handleError(error, { 
        operation: 'getAllLinks', 
        filter 
      });
      throw error;
    }
  }

  async getLinkById(id: string): Promise<SidebarLink> {
    try {
      console.log('SidebarLinksService: Fetching link by ID:', id);
      const link = await this.repository.getById(id);
      console.log('SidebarLinksService: Retrieved link:', link.title);
      return link;
    } catch (error) {
      this.errorService.handleError(error, { 
        operation: 'getLinkById', 
        linkId: id 
      });
      throw error;
    }
  }

  async createLink(linkData: CreateSidebarLinkRequest): Promise<SidebarLink> {
    try {
      console.log('SidebarLinksService: Creating new link:', linkData.title);
      
      // Se position não foi fornecida, calcular a próxima position
      if (linkData.position === undefined) {
        const existingLinks = await this.repository.getAll();
        const maxPosition = existingLinks.reduce((max, link) => 
          Math.max(max, link.position), -1
        );
        linkData.position = maxPosition + 1;
      }

      const newLink = await this.repository.create(linkData);
      console.log('SidebarLinksService: Link created successfully:', newLink.id);
      return newLink;
    } catch (error) {
      this.errorService.handleError(error, { 
        operation: 'createLink', 
        linkData 
      });
      throw error;
    }
  }

  async updateLink(id: string, updates: UpdateSidebarLinkRequest): Promise<SidebarLink> {
    try {
      console.log('SidebarLinksService: Updating link:', id);
      const updatedLink = await this.repository.update(id, updates);
      console.log('SidebarLinksService: Link updated successfully');
      return updatedLink;
    } catch (error) {
      this.errorService.handleError(error, { 
        operation: 'updateLink', 
        linkId: id, 
        updates 
      });
      throw error;
    }
  }

  async deleteLink(id: string): Promise<void> {
    try {
      console.log('SidebarLinksService: Deleting link:', id);
      await this.repository.delete(id);
      console.log('SidebarLinksService: Link deleted successfully');
    } catch (error) {
      this.errorService.handleError(error, { 
        operation: 'deleteLink', 
        linkId: id 
      });
      throw error;
    }
  }

  async updatePositions(linksArray: { id: string; position: number }[]): Promise<void> {
    try {
      console.log('SidebarLinksService: Updating positions for', linksArray.length, 'links');
      await this.repository.updatePositions(linksArray);
      console.log('SidebarLinksService: Positions updated successfully');
    } catch (error) {
      this.errorService.handleError(error, { 
        operation: 'updatePositions', 
        linksCount: linksArray.length 
      });
      throw error;
    }
  }

  async getVisibleLinks(category?: string): Promise<SidebarLink[]> {
    try {
      console.log('SidebarLinksService: Fetching visible links for category:', category);
      const filter: SidebarLinkFilter = { 
        is_visible: true 
      };
      
      if (category) {
        filter.category = category;
      }

      const links = await this.repository.getAll(filter);
      console.log('SidebarLinksService: Retrieved visible links:', links.length);
      return links;
    } catch (error) {
      this.errorService.handleError(error, { 
        operation: 'getVisibleLinks', 
        category 
      });
      throw error;
    }
  }

  async reorderLinks(fromPosition: number, toPosition: number, category?: string): Promise<void> {
    try {
      console.log('SidebarLinksService: Reordering links from', fromPosition, 'to', toPosition);
      
      const filter: SidebarLinkFilter = {};
      if (category) {
        filter.category = category;
      }

      const links = await this.repository.getAll(filter);
      
      // Reordenar os links
      const reorderedLinks = [...links];
      const [movedLink] = reorderedLinks.splice(fromPosition, 1);
      reorderedLinks.splice(toPosition, 0, movedLink);

      // Atualizar positions
      const updateData = reorderedLinks.map((link, index) => ({
        id: link.id,
        position: index
      }));

      await this.repository.updatePositions(updateData);
      console.log('SidebarLinksService: Links reordered successfully');
    } catch (error) {
      this.errorService.handleError(error, { 
        operation: 'reorderLinks', 
        fromPosition, 
        toPosition, 
        category 
      });
      throw error;
    }
  }
}
