
export interface HeaderSettings {
  id: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeaderActionButton {
  id: string;
  label: string;
  url: string;
  style: 'primary' | 'secondary';
  is_visible: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  type: 'link' | 'dropdown';
  url: string | null;
  page_slug: string | null;
  parent_id: string | null;
  is_visible: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  children?: HeaderNavItem[];
}

export interface CreateHeaderActionButtonRequest {
  label: string;
  url: string;
  style: 'primary' | 'secondary';
  is_visible?: boolean;
  position?: number;
}

export interface UpdateHeaderActionButtonRequest {
  label?: string;
  url?: string;
  style?: 'primary' | 'secondary';
  is_visible?: boolean;
  position?: number;
}

export interface CreateHeaderNavItemRequest {
  label: string;
  type: 'link' | 'dropdown';
  url?: string;
  page_slug?: string;
  parent_id?: string;
  is_visible?: boolean;
  position?: number;
}

export interface UpdateHeaderNavItemRequest {
  label?: string;
  type?: 'link' | 'dropdown';
  url?: string;
  page_slug?: string;
  parent_id?: string;
  is_visible?: boolean;
  position?: number;
}

export interface UpdateHeaderSettingsRequest {
  logo_url?: string;
}
