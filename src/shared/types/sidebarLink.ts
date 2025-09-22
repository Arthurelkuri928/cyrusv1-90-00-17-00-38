
export interface SidebarLink {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: string;
  icon: string;
  is_visible: boolean;
  is_external: boolean;
  position: number;
  multilang_support?: {
    en: { title: string; description: string };
    es: { title: string; description: string };
    pt: { title: string; description: string };
  };
  created_at?: string;
  updated_at?: string;
}

export interface SidebarLinkFilter {
  category?: string;
  is_visible?: boolean;
  is_external?: boolean;
}

export interface CreateSidebarLinkRequest {
  title: string;
  description?: string;
  url: string;
  category: string;
  icon?: string;
  is_visible?: boolean;
  is_external?: boolean;
  position?: number;
  multilang_support?: {
    en: { title: string; description: string };
    es: { title: string; description: string };
    pt: { title: string; description: string };
  };
}

export interface UpdateSidebarLinkRequest {
  title?: string;
  description?: string;
  url?: string;
  category?: string;
  icon?: string;
  is_visible?: boolean;
  is_external?: boolean;
  position?: number;
  multilang_support?: {
    en: { title: string; description: string };
    es: { title: string; description: string };
    pt: { title: string; description: string };
  };
}
