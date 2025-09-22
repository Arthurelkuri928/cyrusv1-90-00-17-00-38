
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface PageVisibility {
  id: string;
  name: string;
  slug: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface PageVisibilityState {
  pages: PageVisibility[];
  loading: boolean;
  lastFetch: number | null;
  error: string | null;
  
  // Actions
  fetchPages: () => Promise<void>;
  updatePageVisibility: (pageId: string, isVisible: boolean) => Promise<{ success: boolean; error?: string }>;
  isPageVisible: (pageKey: string) => boolean;
  setPages: (pages: PageVisibility[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Cache management
  shouldRefetch: () => boolean;
  invalidateCache: () => void;
}

const CACHE_DURATION = 30 * 1000; // 30 segundos - cache mais agressivo para melhor UX

// Páginas que devem ser sempre visíveis por padrão (fallback de segurança)
const DEFAULT_VISIBLE_PAGES = ['dashboard', 'profile', 'settings', 'home', 'affiliates-public'];

// Mapeamento padronizado de pageKeys para slugs
const PAGE_KEY_TO_SLUG_MAP: Record<string, string> = {
  'home': 'home',
  'plans': 'plans', 
  'partnership': 'partnership',
  'affiliates-public': 'affiliates-public',
  'affiliates': 'affiliates',
  'dashboard': 'dashboard',
  'profile': 'profile',
  'settings': 'settings',
  'favorites': 'favorites',
  'support': 'support',
  'admin': 'admin'
};

export const usePageVisibilityStore = create<PageVisibilityState>((set, get) => ({
  pages: [],
  loading: false,
  lastFetch: null,
  error: null,

  fetchPages: async () => {
    const state = get();
    
    // Skip if we have fresh data and not loading
    if (!state.shouldRefetch() && state.pages.length > 0 && !state.loading) {
      console.log('📋 [PAGE STORE] Using cached data, skipping fetch');
      return;
    }

    console.log('📊 [PAGE STORE] Fetching pages from Supabase...');
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ [PAGE STORE] Error fetching pages:', error);
        set({ error: error.message, loading: false });
        return;
      }

      console.log('✅ [PAGE STORE] Pages loaded successfully:', data?.length || 0, data);
      set({ 
        pages: data || [], 
        loading: false, 
        lastFetch: Date.now(),
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('💥 [PAGE STORE] Unexpected error:', error);
      set({ error: errorMessage, loading: false });
    }
  },

  updatePageVisibility: async (pageId: string, isVisible: boolean) => {
    const state = get();
    const page = state.pages.find(p => p.id === pageId);
    
    console.log(`🔄 [PAGE STORE] Updating page ${page?.name}:`, {
      pageId,
      from: page?.is_visible,
      to: isVisible
    });

    try {
      // Fazer a atualização no banco PRIMEIRO
      const { data, error } = await supabase
        .from('pages')
        .update({ is_visible: isVisible })
        .eq('id', pageId)
        .select();

      if (error) {
        console.error('❌ [PAGE STORE] Update failed:', error);
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        console.error('⚠️ [PAGE STORE] No data returned from update');
        return { success: false, error: 'Update executed but no data returned' };
      }

      console.log('✅ [PAGE STORE] Update successful:', data[0]);
      
      // Atualizar estado local APÓS confirmação do banco
      const updatedPages = state.pages.map(p => 
        p.id === pageId ? data[0] : p
      );
      
      set({ 
        pages: updatedPages, 
        lastFetch: Date.now(),
        error: null 
      });
      
      // Disparar evento customizado para forçar re-render
      window.dispatchEvent(new CustomEvent('pageVisibilityUpdated', {
        detail: {
          pageId,
          page: data[0],
          oldVisibility: page?.is_visible,
          newVisibility: isVisible
        }
      }));
      
      return { success: true };
    } catch (error) {
      console.error('💥 [PAGE STORE] Unexpected update error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  isPageVisible: (pageKey: string) => {
    const state = get();
    
    // Se ainda está carregando e não há páginas, usar fallback seguro
    if (state.loading && state.pages.length === 0) {
      const isDefaultVisible = DEFAULT_VISIBLE_PAGES.includes(pageKey);
      console.log(`🔍 [PAGE STORE] Loading state, using fallback for "${pageKey}":`, isDefaultVisible);
      return isDefaultVisible;
    }
    
    // Se há erro e não há páginas em cache, usar fallback seguro
    if (state.error && state.pages.length === 0) {
      const isDefaultVisible = DEFAULT_VISIBLE_PAGES.includes(pageKey);
      console.log(`❌ [PAGE STORE] Error state, using fallback for "${pageKey}":`, isDefaultVisible);
      return isDefaultVisible;
    }
    
    // Tentar encontrar por slug direto primeiro
    let page = state.pages.find(p => p.slug === pageKey);
    
    // Se não encontrou, tentar o mapeamento
    if (!page && PAGE_KEY_TO_SLUG_MAP[pageKey]) {
      const mappedSlug = PAGE_KEY_TO_SLUG_MAP[pageKey];
      page = state.pages.find(p => p.slug === mappedSlug);
    }
    
    // Se ainda não encontrou, tentar por name transformado
    if (!page) {
      page = state.pages.find(p => 
        p.name.toLowerCase().replace(/\s+/g, '-') === pageKey
      );
    }
    
    // Se a página não foi encontrada, usar fallback seguro
    if (!page) {
      const isDefaultVisible = DEFAULT_VISIBLE_PAGES.includes(pageKey);
      console.log(`🔍 [PAGE STORE] Page "${pageKey}" not found in:`, 
        state.pages.map(p => ({ name: p.name, slug: p.slug })), 
        'using fallback:', isDefaultVisible
      );
      return isDefaultVisible;
    }
    
    console.log(`🔍 [PAGE STORE] Page "${pageKey}" found as "${page.name}" (${page.slug}), visibility:`, page.is_visible);
    return page.is_visible;
  },

  setPages: (pages) => set({ pages, lastFetch: Date.now() }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  shouldRefetch: () => {
    const state = get();
    if (!state.lastFetch) return true;
    return Date.now() - state.lastFetch > CACHE_DURATION;
  },

  invalidateCache: () => set({ lastFetch: null }),
}));
