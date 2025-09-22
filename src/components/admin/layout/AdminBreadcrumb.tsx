
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { adminMenuConfig } from '../config/menuConfig';

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

export const AdminBreadcrumb = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/painel-admin/dashboard' }
    ];

    // Find current section and subsection
    for (const category of adminMenuConfig) {
      for (const subItem of category.subItems) {
        if (currentPath === subItem.to) {
          // Add category if it's not dashboard
          if (category.id !== 'dashboard') {
            items.push({
              label: category.label,
              path: undefined // Categories don't have direct paths
            });
          }
          
          // Add current page
          items.push({
            label: subItem.label,
            path: subItem.to,
            isActive: true
          });
          break;
        }
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Home className="h-4 w-4 text-gray-500" />
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          
          {item.path && !item.isActive ? (
            <Link
              to={item.path}
              className="text-gray-600 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={
                item.isActive
                  ? 'text-white font-medium'
                  : 'text-gray-500'
              }
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
