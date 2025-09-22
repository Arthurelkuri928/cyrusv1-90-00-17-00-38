
export interface Tool {
  id: string | number;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'maintenance';
  url?: string;
  image?: string;
  isFavorite?: boolean;
  isNew?: boolean;
  credentials?: ToolCredential[];
  action_buttons?: ActionButton[];
  // Campos opcionais para futura integração Supabase (não utilizados atualmente)
  access_url?: string;
  email?: string;
  password?: string;
  cookies?: string;
  slug?: string;
  is_active?: boolean;
  is_maintenance?: boolean;
  created_at?: string;
  updated_at?: string;
  // Campos visuais para interface
  card_color?: string;
  logo_url?: string;
}

export interface ActionButton {
  [key: string]: any; // Index signature for Supabase Json compatibility
  id: string;
  label: string;
  url?: string;
  type: 'copy' | 'link' | 'action';
  value?: string;
  icon?: string;
}

export interface ToolCredential {
  type: string;
  label: string;
  value: string;
}

export interface ToolsFilter {
  category?: string;
  status?: string;
  search?: string;
  isNew?: boolean;
}

// Tipos preparados para futura integração Supabase (isolados e inativos)
export interface SupabaseTool {
  id: number;
  name: string;
  access_url: string | null;
  email: string | null;
  password: string | null;
  cookies: string | null;
  slug: string | null;
  is_active: boolean;
  is_maintenance: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  action_buttons?: ActionButton[] | null;
}
