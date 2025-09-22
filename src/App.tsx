
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProviders } from "@/app/providers/AppProviders";
import { useKeyboardShortcuts } from "@/shared/hooks/useKeyboardShortcuts";
import { ShortcutsPopover } from "@/components/ui/ShortcutsPopover";
import { setupMigrationForBrowser } from "@/scripts/migrateToolsData";
import EnhancedProtectedRoute from "./components/auth/EnhancedProtectedRoute";
import { SessionManager } from "./components/auth/SessionManager";
import PageVisibilityGuard from "./components/auth/PageVisibilityGuard";
import { ROUTES } from "@/constants/routes";

// Lazy loaded pages
import {
  Index,
  Login,
  Register,
  PlanosPage,
  MemberArea,
  ProfilePage,
  EditProfilePage,
  ContentDetail,
  Favorites,
  Suporte,
  SuporteMembro,
  ParceriaPage,
  PerfilPage,
  ConfiguracoesPage,
  AssinaturaPage,
  CheckoutPage,
  AdminSearchDemo,
  NotFound,
  withSuspense,
} from "./pages/LazyPages";

// Import das novas páginas de planos personalizadas
import PlanosIniciaisPage from "./pages/PlanosIniciaisPage";
import PlanosPadroesPage from "./pages/PlanosPadroesPage";
import PlanosPremiumPage from "./pages/PlanosPremiumPage";

// Import da nova página pública de afiliados e dashboard de afiliados
import AfiliadosPublicPage from "./pages/AfiliadosPublicPage";
import AfiliadosDashboard from "./pages/AfiliadosDashboard";

// Import da página AdminPanel (corrigido)
import AdminPanel from "./pages/AdminPanel";
import PagamentoSucesso from "./pages/pagamento-sucesso";
import PagamentoFalha from "./pages/pagamento-falha";

// Aplicar Suspense a todas as páginas
const LazyIndex = withSuspense(Index);
const LazyLogin = withSuspense(Login);
const LazyRegister = withSuspense(Register);
const LazyPlanosPage = withSuspense(PlanosPage);
const LazyMemberArea = withSuspense(MemberArea);
const LazyProfilePage = withSuspense(ProfilePage);
const LazyEditProfilePage = withSuspense(EditProfilePage);
const LazyContentDetail = withSuspense(ContentDetail);
const LazyFavorites = withSuspense(Favorites);
const LazySuporte = withSuspense(Suporte);
const LazySuporteMembro = withSuspense(SuporteMembro);
const LazyParceriaPage = withSuspense(ParceriaPage);
const LazyPerfilPage = withSuspense(PerfilPage);
const LazyConfiguracoesPage = withSuspense(ConfiguracoesPage);
const LazyAssinaturaPage = withSuspense(AssinaturaPage);
const LazyCheckoutPage = withSuspense(CheckoutPage);
const LazyAdminSearchDemo = withSuspense(AdminSearchDemo);
const LazyNotFound = withSuspense(NotFound);

// Aplicar Suspense às novas páginas de planos
const LazyPlanosIniciaisPage = withSuspense(PlanosIniciaisPage);
const LazyPlanosPadroesPage = withSuspense(PlanosPadroesPage);
const LazyPlanosPremiumPage = withSuspense(PlanosPremiumPage);

// Aplicar Suspense às páginas de afiliados
const LazyAfiliadosPublicPage = withSuspense(AfiliadosPublicPage);
const LazyAfiliadosDashboard = withSuspense(AfiliadosDashboard);

// Aplicar Suspense à página admin (corrigido)
const LazyAdminPanel = withSuspense(AdminPanel);

// Configurar migração de ferramentas no browser (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  setupMigrationForBrowser();
}

// Component to initialize keyboard shortcuts and enhanced providers
const AppEnhancedProviders = ({ children }: { children: React.ReactNode }) => {
  useKeyboardShortcuts();
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <SessionManager>
    <AppEnhancedProviders>
      <ShortcutsPopover />
      <Routes>
        {/* Legacy route redirect */}
        <Route path={ROUTES.LEGACY_LOGIN} element={<Navigate to={ROUTES.LOGIN} replace />} />
        
        {/* Rotas públicas */}
        <Route path={ROUTES.HOME} element={<LazyIndex />} />
        <Route path={ROUTES.LOGIN} element={<LazyLogin />} />
        <Route path={ROUTES.REGISTER} element={<LazyRegister />} />
        <Route path={ROUTES.PLANS} element={
          <PageVisibilityGuard pageKey="plans" redirectTo={ROUTES.HOME}>
            <LazyPlanosPage />
          </PageVisibilityGuard>
        } />
        <Route path={ROUTES.PARTNERSHIP} element={
          <PageVisibilityGuard pageKey="partnership" redirectTo={ROUTES.HOME}>
            <LazyParceriaPage />
          </PageVisibilityGuard>
        } />
        <Route path={ROUTES.AFFILIATES} element={
          <PageVisibilityGuard pageKey="affiliates-public" redirectTo={ROUTES.HOME}>
            <LazyAfiliadosPublicPage />
          </PageVisibilityGuard>
        } />
        <Route path={ROUTES.SUPPORT} element={
          <PageVisibilityGuard pageKey="support" redirectTo={ROUTES.HOME}>
            <LazySuporte />
          </PageVisibilityGuard>
        } />
        
        {/* Páginas de pagamento */}
        <Route path={ROUTES.PAYMENT_SUCCESS} element={<PagamentoSucesso />} />
        <Route path={ROUTES.PAYMENT_FAILURE} element={<PagamentoFalha />} />
        
        {/* Página de demonstração do painel admin */}
        <Route path="/admin-search-demo" element={<LazyAdminSearchDemo />} />
        
        {/* Novas rotas dos planos personalizados */}
        <Route path={ROUTES.INITIAL_PLANS} element={
          <PageVisibilityGuard pageKey="initial-plans" redirectTo={ROUTES.HOME}>
            <LazyPlanosIniciaisPage />
          </PageVisibilityGuard>
        } />
        <Route path={ROUTES.STANDARD_PLANS} element={
          <PageVisibilityGuard pageKey="standard-plans" redirectTo={ROUTES.HOME}>
            <LazyPlanosPadroesPage />
          </PageVisibilityGuard>
        } />
        <Route path={ROUTES.PREMIUM_PLANS} element={
          <PageVisibilityGuard pageKey="premium-plans" redirectTo={ROUTES.HOME}>
            <LazyPlanosPremiumPage />
          </PageVisibilityGuard>
        } />
        
        {/* Rotas protegidas - requer autenticação */}
        <Route element={<EnhancedProtectedRoute />}>
          <Route path={ROUTES.MEMBER_AREA} element={
            <PageVisibilityGuard pageKey="dashboard" redirectTo={ROUTES.LOGIN}>
              <LazyMemberArea />
            </PageVisibilityGuard>
          } />
          <Route path={ROUTES.PROFILE} element={
            <PageVisibilityGuard pageKey="profile" redirectTo={ROUTES.MEMBER_AREA}>
              <LazyPerfilPage />
            </PageVisibilityGuard>
          } />
          <Route path={ROUTES.EDIT_PROFILE} element={<LazyEditProfilePage />} />
          <Route path={ROUTES.SETTINGS} element={
            <PageVisibilityGuard pageKey="settings" redirectTo={ROUTES.MEMBER_AREA}>
              <LazyConfiguracoesPage />
            </PageVisibilityGuard>
          } />
          <Route path={ROUTES.TOOLS} element={
            <PageVisibilityGuard pageKey="dashboard" redirectTo={ROUTES.LOGIN}>
              <LazyMemberArea />
            </PageVisibilityGuard>
          } />
          <Route path="/content/:id" element={<LazyContentDetail />} />
          <Route path={ROUTES.FAVORITES} element={
            <PageVisibilityGuard pageKey="favorites" redirectTo={ROUTES.MEMBER_AREA}>
              <LazyFavorites />
            </PageVisibilityGuard>
          } />
          <Route path="/ferramenta/:id" element={<LazyContentDetail />} />
          <Route path={ROUTES.SUPPORT_MEMBER} element={
            <PageVisibilityGuard pageKey="support" redirectTo={ROUTES.MEMBER_AREA}>
              <LazySuporteMembro />
            </PageVisibilityGuard>
          } />
          <Route path={ROUTES.AFFILIATES_DASHBOARD} element={
            <PageVisibilityGuard pageKey="affiliates" redirectTo={ROUTES.MEMBER_AREA}>
              <LazyAfiliadosDashboard />
            </PageVisibilityGuard>
          } />
          <Route path={ROUTES.SUBSCRIPTION} element={
            <PageVisibilityGuard pageKey="subscription" redirectTo={ROUTES.MEMBER_AREA}>
              <LazyAssinaturaPage />
            </PageVisibilityGuard>
          } />
          <Route path={ROUTES.CHECKOUT} element={<LazyCheckoutPage />} />
          <Route path={`${ROUTES.ADMIN_PANEL}/*`} element={<LazyAdminPanel />} />
        </Route>
        
        {/* Rota não encontrada */}
        <Route path="*" element={<LazyNotFound />} />
      </Routes>
    </AppEnhancedProviders>
  </SessionManager>
);

const App = () => (
  <React.StrictMode>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </React.StrictMode>
);

export default App;
