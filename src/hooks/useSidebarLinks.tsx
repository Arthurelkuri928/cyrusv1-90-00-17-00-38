
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SidebarLinksService } from '@/shared/services/SidebarLinksService';
import { SidebarLink } from '@/shared/types/sidebarLink';

export const useSidebarLinks = (category?: string, includeHidden: boolean = false) => {
  const sidebarLinksService = SidebarLinksService.getInstance();

  const {
    data: sidebarLinks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['sidebar-links', category, includeHidden],
    queryFn: () => {
      if (includeHidden) {
        // For admin - get all links regardless of visibility
        return sidebarLinksService.getAllLinks(category ? { category } : {});
      } else {
        // For regular users - only visible links
        return category 
          ? sidebarLinksService.getVisibleLinks(category)
          : sidebarLinksService.getVisibleLinks();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    sidebarLinks,
    isLoading,
    error,
    refetch
  };
};
