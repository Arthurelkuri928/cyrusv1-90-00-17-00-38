
import React, { Suspense } from 'react';
import { Loader } from '@/design-system';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

// Lazy loading das páginas principais
export const Index = React.lazy(() => import('./Index'));
export const Login = React.lazy(() => import('./Login'));
export const Register = React.lazy(() => import('./Register'));
export const MemberArea = React.lazy(() => import('./MemberArea'));
export const PlanosPage = React.lazy(() => import('./PlanosPage'));
export const ProfilePage = React.lazy(() => import('./ProfilePage'));
export const EditProfilePage = React.lazy(() => import('./EditProfilePage'));
export const ContentDetail = React.lazy(() => import('./ContentDetail'));
export const Favorites = React.lazy(() => import('./Favorites'));
export const Suporte = React.lazy(() => import('./Suporte'));
export const SuporteMembro = React.lazy(() => import('./SuporteMembro'));
export const AfiliadosPublicPage = React.lazy(() => import('./AfiliadosPublicPage'));
export const AfiliadosDashboard = React.lazy(() => import('./AfiliadosDashboard'));
export const ParceriaPage = React.lazy(() => import('./ParceriaPage'));
export const PerfilPage = React.lazy(() => import('./PerfilPage'));
export const ConfiguracoesPage = React.lazy(() => import('./ConfiguracoesPage'));
export const AssinaturaPage = React.lazy(() => import('./AssinaturaPage'));
export const CheckoutPage = React.lazy(() => import('./CheckoutPage'));
export const AdminSearchDemo = React.lazy(() => import('./AdminSearchDemo'));
export const NotFound = React.lazy(() => import('./NotFound'));

// Componente de fallback para lazy loading com verificação de área de membros
export const PageLoader = () => {
  const { t } = useLanguage();
  const location = useLocation();
  
  // Verificar se está na área de membros
  const isMemberArea = location.pathname.includes('/area-membro') || 
                      location.pathname.includes('/favoritos') || 
                      location.pathname.includes('/perfil') || 
                      location.pathname.includes('/configuracoes') || 
                      location.pathname.includes('/assinatura') || 
                      location.pathname.includes('/dashboard-afiliados') || 
                      location.pathname.includes('/suporte-membro') ||
                      location.pathname.includes('/tool/');

  // Se não estiver na área de membros, usar um loader mais simples
  if (!isMemberArea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader variant="cyrus" size="lg" />
      </div>
    );
  }

  // Para área de membros, usar o loader com texto multiidioma
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Loader variant="cyrus" size="xl" text={t('loading') || 'Carregando...'} />
    </div>
  );
};

// HOC para envolver páginas com Suspense
export const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
};
