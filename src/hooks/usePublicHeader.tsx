
import { useQuery } from '@tanstack/react-query';
import { HeaderService } from '@/shared/services/HeaderService';
import { useUniversalAuth } from '@/hooks/useUniversalAuth';
import { usePageVisibility } from '@/hooks/usePageVisibility';

const headerService = HeaderService.getInstance();

export const usePublicHeader = () => {
  const { isAuthenticated, user } = useUniversalAuth();
  const { isPageVisible } = usePageVisibility();

  // Fetch header settings
  const { data: headerSettings, isLoading: loadingSettings } = useQuery({
    queryKey: ['public-header-settings'],
    queryFn: () => headerService.getHeaderSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch action buttons
  const { data: actionButtons = [], isLoading: loadingButtons } = useQuery({
    queryKey: ['public-header-buttons'],
    queryFn: () => headerService.getActionButtons(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch navigation items
  const { data: navItems = [], isLoading: loadingNavItems } = useQuery({
    queryKey: ['public-header-nav'],
    queryFn: () => headerService.getNavItems(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter navigation items based on page visibility for non-admin users
  const filteredNavItems = navItems.filter(item => {
    // If item has page_slug, check visibility
    if (item.page_slug) {
      return isPageVisible(item.page_slug);
    }
    // If it's a dropdown or external link, show it
    return true;
  });

  // Filter visible action buttons
  const visibleActionButtons = actionButtons.filter(button => button.is_visible);

  return {
    // Header data
    logoUrl: headerSettings?.logo_url,
    actionButtons: visibleActionButtons,
    navItems: filteredNavItems,
    
    // Loading states
    isLoading: loadingSettings || loadingButtons || loadingNavItems,
    
    // Auth state for conditional rendering
    isAuthenticated,
    user,
  };
};
