import { SupabaseHeaderRepository } from '@/infrastructure/repositories/header.repository';
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
import { ErrorService } from './ErrorService';

export class HeaderService {
  private static instance: HeaderService;
  private repository = new SupabaseHeaderRepository();
  private errorService = ErrorService.getInstance();

  static getInstance(): HeaderService {
    if (!HeaderService.instance) {
      HeaderService.instance = new HeaderService();
    }
    return HeaderService.instance;
  }

  // Header Settings
  async getHeaderSettings(): Promise<HeaderSettings> {
    try {
      console.log('HeaderService: Fetching header settings');
      const settings = await this.repository.getHeaderSettings();
      console.log('HeaderService: Retrieved header settings');
      return settings;
    } catch (error) {
      this.errorService.handleError(error, { operation: 'getHeaderSettings' });
      throw error;
    }
  }

  async updateHeaderSettings(updates: UpdateHeaderSettingsRequest): Promise<HeaderSettings> {
    try {
      console.log('HeaderService: Updating header settings:', updates);
      const settings = await this.repository.updateHeaderSettings(updates);
      console.log('HeaderService: Header settings updated successfully');
      return settings;
    } catch (error) {
      this.errorService.handleError(error, { operation: 'updateHeaderSettings', updates });
      throw error;
    }
  }

  // Action Buttons
  async getActionButtons(): Promise<HeaderActionButton[]> {
    try {
      console.log('HeaderService: Fetching action buttons');
      const buttons = await this.repository.getActionButtons();
      console.log('HeaderService: Retrieved action buttons:', buttons.length);
      return buttons;
    } catch (error) {
      this.errorService.handleError(error, { operation: 'getActionButtons' });
      throw error;
    }
  }

  async createActionButton(buttonData: CreateHeaderActionButtonRequest): Promise<HeaderActionButton> {
    try {
      console.log('HeaderService: Creating action button:', buttonData.label);
      const button = await this.repository.createActionButton(buttonData);
      console.log('HeaderService: Action button created successfully');
      return button;
    } catch (error) {
      this.errorService.handleError(error, { operation: 'createActionButton', buttonData });
      throw error;
    }
  }

  async updateActionButton(id: string, updates: UpdateHeaderActionButtonRequest): Promise<HeaderActionButton> {
    try {
      console.log('HeaderService: Updating action button:', id);
      const button = await this.repository.updateActionButton(id, updates);
      console.log('HeaderService: Action button updated successfully');
      return button;
    } catch (error) {
      this.errorService.handleError(error, { operation: 'updateActionButton', buttonId: id, updates });
      throw error;
    }
  }

  async deleteActionButton(id: string): Promise<void> {
    try {
      console.log('HeaderService: Deleting action button:', id);
      await this.repository.deleteActionButton(id);
      console.log('HeaderService: Action button deleted successfully');
    } catch (error) {
      this.errorService.handleError(error, { operation: 'deleteActionButton', buttonId: id });
      throw error;
    }
  }

  async reorderActionButtons(updates: { id: string; position: number }[]): Promise<void> {
    try {
      console.log('HeaderService: Reordering action buttons:', updates.length);
      await this.repository.updateActionButtonPositions(updates);
      console.log('HeaderService: Action buttons reordered successfully');
    } catch (error) {
      this.errorService.handleError(error, { operation: 'reorderActionButtons', updates });
      throw error;
    }
  }

  // Navigation Items - Now properly supports nested structure
  async getNavItems(): Promise<HeaderNavItem[]> {
    try {
      console.log('HeaderService: Fetching navigation items (nested structure)');
      const items = await this.repository.getNavItems();
      console.log('HeaderService: Retrieved navigation items with nested structure:', {
        totalItems: items.length,
        itemsWithChildren: items.filter(item => item.children && item.children.length > 0).length
      });
      return items;
    } catch (error) {
      this.errorService.handleError(error, { operation: 'getNavItems' });
      throw error;
    }
  }

  async getNavItemsAdmin(): Promise<HeaderNavItem[]> {
    try {
      console.log('HeaderService: Fetching navigation items (admin)');
      const items = await this.repository.getNavItemsAdmin();
      console.log('HeaderService: Retrieved navigation items (admin):', items.length);
      return items;
    } catch (error) {
      this.errorService.handleError(error, { operation: 'getNavItemsAdmin' });
      throw error;
    }
  }

  async createNavItem(itemData: CreateHeaderNavItemRequest): Promise<HeaderNavItem> {
    try {
      console.log('HeaderService: Creating navigation item:', itemData.label);
      const item = await this.repository.createNavItem(itemData);
      console.log('HeaderService: Navigation item created successfully');
      return item;
    } catch (error) {
      this.errorService.handleError(error, { operation: 'createNavItem', itemData });
      throw error;
    }
  }

  async updateNavItem(id: string, updates: UpdateHeaderNavItemRequest): Promise<HeaderNavItem> {
    try {
      console.log('HeaderService: Updating navigation item:', id);
      const item = await this.repository.updateNavItem(id, updates);
      console.log('HeaderService: Navigation item updated successfully');
      return item;
    } catch (error) {
      this.errorService.handleError(error, { operation: 'updateNavItem', itemId: id, updates });
      throw error;
    }
  }

  async deleteNavItem(id: string): Promise<void> {
    try {
      console.log('HeaderService: Deleting navigation item:', id);
      await this.repository.deleteNavItem(id);
      console.log('HeaderService: Navigation item deleted successfully');
    } catch (error) {
      this.errorService.handleError(error, { operation: 'deleteNavItem', itemId: id });
      throw error;
    }
  }

  async reorderNavItems(updates: { id: string; position: number; parent_id?: string }[]): Promise<void> {
    try {
      console.log('HeaderService: Reordering navigation items:', updates.length);
      await this.repository.updateNavItemPositions(updates);
      console.log('HeaderService: Navigation items reordered successfully');
    } catch (error) {
      this.errorService.handleError(error, { operation: 'reorderNavItems', updates });
      throw error;
    }
  }
}
