
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) => set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
        }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        clearError: () => set({ error: null }),

        login: async (email, password) => {
          set({ isLoading: true, error: null });
          
          try {
            // Simulate API call - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user: User = {
              id: '1',
              email,
              name: 'User Name'
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Login failed',
              isLoading: false 
            });
          }
        },

        logout: () => {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('user-session');
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
        }
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    { name: 'auth-store' }
  )
);
