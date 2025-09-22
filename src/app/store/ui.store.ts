
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  sidebarExpanded: boolean;
  showMobileSidebar: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  manualSidebarControl: boolean;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setShowMobileSidebar: (show: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'pt-BR' | 'en-US' | 'es-ES') => void;
  setManualSidebarControl: (manual: boolean) => void;
  initializeFromLocalStorage: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        sidebarOpen: false,
        sidebarExpanded: false,
        showMobileSidebar: false,
        theme: 'system',
        language: 'pt-BR',
        manualSidebarControl: false,

        // Actions
        toggleSidebar: () => {
          const { manualSidebarControl, sidebarExpanded, showMobileSidebar } = get();
          
          console.log('🔧 UI Store: toggleSidebar called', {
            manualSidebarControl,
            sidebarExpanded,
            showMobileSidebar,
            windowWidth: window.innerWidth
          });

          if (manualSidebarControl) {
            if (window.innerWidth >= 768) {
              const newExpanded = !sidebarExpanded;
              console.log('🔧 UI Store: setting sidebarExpanded to', newExpanded);
              set({ sidebarExpanded: newExpanded });
            } else {
              const newShowMobile = !showMobileSidebar;
              console.log('🔧 UI Store: setting showMobileSidebar to', newShowMobile);
              set({ showMobileSidebar: newShowMobile });
            }
          } else {
            console.log('🔧 UI Store: manual control disabled, ignoring toggle');
          }
        },

        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        setSidebarExpanded: (sidebarExpanded) => {
          console.log('🔧 UI Store: setSidebarExpanded', sidebarExpanded);
          set({ sidebarExpanded });
        },
        setShowMobileSidebar: (showMobileSidebar) => {
          console.log('🔧 UI Store: setShowMobileSidebar', showMobileSidebar);
          set({ showMobileSidebar });
        },
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        setManualSidebarControl: (manualSidebarControl) => {
          console.log('🔧 UI Store: setManualSidebarControl called with:', manualSidebarControl);
          
          // 🔧 CORREÇÃO: Resetar sidebarExpanded quando ativar controle manual
          if (manualSidebarControl) {
            console.log('🔧 UI Store: Controle manual ativado - resetando sidebarExpanded para false');
            set({ manualSidebarControl, sidebarExpanded: false });
          } else {
            console.log('🔧 UI Store: Controle manual desativado');
            set({ manualSidebarControl });
          }
          
          // 🔧 CORREÇÃO: Forçar atualização imediata no DOM
          setTimeout(() => {
            console.log('🔧 UI Store: Verificando estado após setManualSidebarControl:', get());
            window.dispatchEvent(new CustomEvent('manualSidebarControlChanged', { 
              detail: { manualSidebarControl } 
            }));
          }, 100);
        },

        // Initialize from localStorage
        initializeFromLocalStorage: () => {
          console.log('🔧 UI Store: Initializing from localStorage');
          
          const userSettings = localStorage.getItem('userSettings');
          if (userSettings) {
            try {
              const parsed = JSON.parse(userSettings);
              if (parsed.layout && typeof parsed.layout.manualSidebarControl === 'boolean') {
                console.log('🔧 UI Store: Found manualSidebarControl in localStorage:', parsed.layout.manualSidebarControl);
                
                // 🔧 CORREÇÃO: Aplicar configuração com reset adequado
                if (parsed.layout.manualSidebarControl) {
                  set({ 
                    manualSidebarControl: true,
                    sidebarExpanded: false // Resetar para false quando controle manual está ativo
                  });
                } else {
                  set({ manualSidebarControl: false });
                }
              }
            } catch (error) {
              console.error('🔧 UI Store: Error parsing userSettings:', error);
            }
          }
        }
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          manualSidebarControl: state.manualSidebarControl,
          sidebarExpanded: state.sidebarExpanded
        })
      }
    ),
    { name: 'ui-store' }
  )
);

// 🔧 CORREÇÃO: Melhorar inicialização
if (typeof window !== 'undefined') {
  // Aguardar o DOM ser carregado antes de inicializar
  const initializeStore = () => {
    console.log('🔧 UI Store: Executando inicialização da store');
    useUIStore.getState().initializeFromLocalStorage();
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStore);
  } else {
    setTimeout(initializeStore, 100);
  }
}
