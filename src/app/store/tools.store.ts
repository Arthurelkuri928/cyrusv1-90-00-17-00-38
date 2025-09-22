
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Tool, ToolsFilter } from '@/shared/types/tool';
import { SupabaseToolsRepository } from '@/infrastructure/repositories/tools.repository';
import { supabase } from '@/integrations/supabase/client';

interface ToolsState {
  tools: Tool[];
  favorites: Tool[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number;
  isSyncing: boolean;
  adminUpdateInProgress: boolean;
  credentialsUpdateInProgress: boolean;
  isSupabaseConnected: boolean;
}

interface ToolsActions {
  setTools: (tools: Tool[]) => void;
  setFavorites: (favorites: Tool[]) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSyncing: (syncing: boolean) => void;
  setAdminUpdateInProgress: (inProgress: boolean) => void;
  setCredentialsUpdateInProgress: (inProgress: boolean) => void;
  setSupabaseConnected: (connected: boolean) => void;
  fetchTools: (filter?: ToolsFilter, forceRefresh?: boolean) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  addToFavorites: (toolId: string | number) => Promise<void>;
  removeFromFavorites: (toolId: string | number) => Promise<void>;
  clearError: () => void;
  refreshTools: () => Promise<void>;
  forceGlobalRefresh: (source?: string) => Promise<void>;
  setupCredentialsRealtime: () => void;
  testSupabaseConnection: () => Promise<boolean>;
}

const toolsRepository = new SupabaseToolsRepository();

export const useToolsStore = create<ToolsState & ToolsActions>()(
  devtools(
    (set, get) => ({
      // State
      tools: [],
      favorites: [],
      selectedCategory: 'all',
      searchQuery: '',
      isLoading: false,
      error: null,
      lastFetchTime: 0,
      isSyncing: false,
      adminUpdateInProgress: false,
      credentialsUpdateInProgress: false,
      isSupabaseConnected: false,

      // Actions
      setTools: (tools) => set({ tools, lastFetchTime: Date.now() }),
      setFavorites: (favorites) => set({ favorites }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSyncing: (isSyncing) => set({ isSyncing }),
      setAdminUpdateInProgress: (adminUpdateInProgress) => set({ adminUpdateInProgress }),
      setCredentialsUpdateInProgress: (credentialsUpdateInProgress) => set({ credentialsUpdateInProgress }),
      setSupabaseConnected: (isSupabaseConnected) => set({ isSupabaseConnected }),
      clearError: () => set({ error: null }),

      testSupabaseConnection: async () => {
        console.log('🔍 [STORE] Testing Supabase connection...');
        try {
          // Test the new RPC function instead of direct table access
          const { data, error } = await supabase.rpc('get_member_tools');
          
          if (error) {
            console.error('❌ [STORE] Supabase connection failed:', error);
            set({ isSupabaseConnected: false });
            return false;
          }
          
          console.log('✅ [STORE] Supabase connection successful, tools found:', data?.length || 0);
          set({ isSupabaseConnected: true });
          return true;
        } catch (error) {
          console.error('💥 [STORE] Supabase connection error:', error);
          set({ isSupabaseConnected: false });
          return false;
        }
      },

      fetchTools: async (filter, forceRefresh = false) => {
        const currentTime = Date.now();
        const lastFetch = get().lastFetchTime;
        
        console.log('🔄 [STORE] fetchTools called:', { forceRefresh, lastFetch, currentTime, filter });
        
        // Test connection first
        const isConnected = await get().testSupabaseConnection();
        if (!isConnected) {
          console.warn('⚠️ [STORE] Supabase not connected, skipping fetch');
          set({ error: 'Conexão com banco de dados falhou' });
          return;
        }
        
        // Cache control: skip if recent fetch (unless forced)
        if (!forceRefresh && (currentTime - lastFetch) < 2000) {
          console.log('🔄 [STORE] Using cached data (recent fetch - 2s)');
          return;
        }

        set({ isLoading: true, error: null, isSyncing: true });
        
        try {
          console.log('🔄 [STORE] Starting tools fetch from Supabase using new RPC...');
          const tools = await toolsRepository.getAll(filter);
          console.log('✅ [STORE] Tools loaded via new RPC:', {
            count: tools.length,
            activeCount: tools.filter(t => t.is_active === true).length,
            maintenanceCount: tools.filter(t => t.is_maintenance === true).length
          });
          
          // Log some key tools for verification
          const keyToolIds = [1, 12, 17, 21, 32, 33];
          keyToolIds.forEach(id => {
            const tool = tools.find(t => Number(t.id) === id);
            if (tool) {
              console.log(`🔍 [STORE] Status RPC ID ${id} (${tool.name}): is_active=${tool.is_active}, is_maintenance=${tool.is_maintenance}, status=${tool.status}`);
            }
          });
          
          set({ 
            tools, 
            isLoading: false, 
            lastFetchTime: currentTime, 
            isSyncing: false,
            error: null 
          });
        } catch (error) {
          console.error('❌ [STORE] Error fetching tools:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch tools',
            isLoading: false,
            isSyncing: false
          });
        }
      },

      refreshTools: async () => {
        console.log('🔄 FORCED REFRESH of tools...');
        await get().fetchTools(undefined, true);
      },

      forceGlobalRefresh: async (source = 'unknown') => {
        const startTime = Date.now();
        console.log(`🚀 FORCE GLOBAL REFRESH STARTED - Source: ${source}`);
        console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
        
        set({ lastFetchTime: 0, isSyncing: true });
        
        try {
          await get().fetchTools(undefined, true);
          const duration = Date.now() - startTime;
          console.log(`✅ Global refresh COMPLETED in ${duration}ms - Source: ${source}`);
        } catch (error) {
          console.error(`❌ Global refresh FAILED - Source: ${source}:`, error);
        }
      },

      fetchFavorites: async () => {
        try {
          const favoriteIds = JSON.parse(localStorage.getItem('user_favorites') || '[]');
          const favoriteTools: Tool[] = [];
          
          for (const id of favoriteIds) {
            try {
              const tool = await toolsRepository.getById(id);
              favoriteTools.push({ ...tool, isFavorite: true });
            } catch (error) {
              console.warn(`Failed to fetch favorite tool ${id}:`, error);
            }
          }
          
          set({ favorites: favoriteTools });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch favorites'
          });
        }
      },

      addToFavorites: async (toolId) => {
        try {
          await toolsRepository.addToFavorites(toolId);
          
          const tools = get().tools.map(tool => 
            tool.id === toolId ? { ...tool, isFavorite: true } : tool
          );
          set({ tools });
          
          get().fetchFavorites();
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add to favorites'
          });
        }
      },

      removeFromFavorites: async (toolId) => {
        try {
          await toolsRepository.removeFromFavorites(toolId);
          
          const tools = get().tools.map(tool => 
            tool.id === toolId ? { ...tool, isFavorite: false } : tool
          );
          const favorites = get().favorites.filter(fav => fav.id !== toolId);
          set({ tools, favorites });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove from favorites'
          });
        }
      },

      setupCredentialsRealtime: () => {
        console.log('🔄 Setting up credentials realtime listener...');
        
        // Listen for changes to tool_credentials table
        const credentialsChannel = supabase
          .channel('tool-credentials-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'tool_credentials'
            },
            (payload) => {
              console.log('🔄 Tool credentials changed:', payload);
              set({ credentialsUpdateInProgress: true });
              
              // Trigger refresh after credentials change
              setTimeout(() => {
                get().refreshTools();
                set({ credentialsUpdateInProgress: false });
              }, 500);
            }
          )
          .subscribe();

        // Listen for changes to tools table (for action_buttons updates)
        const toolsChannel = supabase
          .channel('tools-changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'tools'
            },
            (payload) => {
              console.log('🔄 Tool updated:', payload);
              
              // Check if action_buttons field was updated
              if (payload.new && 'action_buttons' in payload.new) {
                console.log('🔄 Action buttons updated for tool:', payload.new.id);
                get().refreshTools();
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(credentialsChannel);
          supabase.removeChannel(toolsChannel);
        };
      },
    }),
    { name: 'tools-store' }
  )
);
