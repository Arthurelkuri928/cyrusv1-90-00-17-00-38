
import React, { memo, useCallback, useMemo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUniversalAuth } from "@/hooks/useUniversalAuth";
import { useTranslation } from "@/hooks/useUniversalTranslation";
import { usePublicHeader } from "@/hooks/usePublicHeader";
import { APP_CONFIG } from "@/config/appConfig";
import { ROUTES, getRouteLabel } from "@/constants/routes";
import { ChevronDown } from "lucide-react";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: (linkName: string) => void;
  linkName: string;
}

const NavLink = memo(({ to, children, isActive, onClick, linkName }: NavLinkProps) => {
  const handleClick = useCallback(() => {
    onClick(linkName);
  }, [onClick, linkName]);

  return (
    <Link 
      to={to} 
      className={`nav-link px-6 py-2 text-[#CCCCCC] text-[0.95rem] transition-colors duration-300 hover:text-[#A259FF] ${
        isActive ? "text-white" : ""
      }`} 
      onClick={handleClick}
    >
      {children}
    </Link>
  );
});

NavLink.displayName = 'NavLink';

// Enhanced dropdown component for navigation items with better styling
const DropdownNav = memo(({ item, activeLink, handleLinkClick }: { 
  item: any; 
  activeLink: string; 
  handleLinkClick: (linkName: string) => void; 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  // Check if this item or any of its children are active
  const isItemActive = useMemo(() => {
    if (activeLink === item.label.toLowerCase()) return true;
    
    // Check if any child is active
    if (item.children && item.children.length > 0) {
      return item.children.some((child: any) => 
        activeLink === child.label.toLowerCase() ||
        (child.children && child.children.some((grandchild: any) => 
          activeLink === grandchild.label.toLowerCase()
        ))
      );
    }
    
    return false;
  }, [activeLink, item]);

  if (!item.children || item.children.length === 0) {
    // Render as regular link if no children
    const linkUrl = item.url || (item.page_slug === 'home' ? ROUTES.HOME : `/${item.page_slug}`);
    return (
      <NavLink
        to={linkUrl}
        isActive={isItemActive}
        onClick={handleLinkClick}
        linkName={item.label.toLowerCase()}
      >
        {item.label}
      </NavLink>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={`nav-link px-6 py-2 text-[0.95rem] transition-colors duration-300 hover:text-[#A259FF] flex items-center space-x-1 ${
        isItemActive ? "text-white" : "text-[#CCCCCC]"
      }`}>
        <span>{item.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {item.children.map((child: any) => (
              <div key={child.id}>
                {child.children && child.children.length > 0 ? (
                  // Render nested dropdown for 3rd level
                  <NestedDropdownItem 
                    item={child} 
                    handleLinkClick={handleLinkClick}
                    activeLink={activeLink}
                  />
                ) : (
                  // Regular child item
                  <Link
                    to={child.url || (child.page_slug === 'home' ? ROUTES.HOME : `/${child.page_slug}`)}
                    className={`block px-4 py-2 transition-colors duration-200 ${
                      activeLink === child.label.toLowerCase() 
                        ? 'bg-[#A259FF] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleLinkClick(child.label.toLowerCase())}
                  >
                    {child.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

DropdownNav.displayName = 'DropdownNav';

// Component for handling 3rd level nested items
const NestedDropdownItem = memo(({ item, handleLinkClick, activeLink }: {
  item: any;
  handleLinkClick: (linkName: string) => void;
  activeLink: string;
}) => {
  const [isNestedOpen, setIsNestedOpen] = useState(false);

  const isItemActive = useMemo(() => {
    if (activeLink === item.label.toLowerCase()) return true;
    if (item.children && item.children.length > 0) {
      return item.children.some((child: any) => activeLink === child.label.toLowerCase());
    }
    return false;
  }, [activeLink, item]);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsNestedOpen(true)}
      onMouseLeave={() => setIsNestedOpen(false)}
    >
      <div className={`flex items-center justify-between px-4 py-2 transition-colors duration-200 cursor-pointer ${
        isItemActive 
          ? 'bg-[#A259FF] text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}>
        <span>{item.label}</span>
        <ChevronDown className="h-3 w-3 -rotate-90" />
      </div>

      {isNestedOpen && item.children && item.children.length > 0 && (
        <div className="absolute left-full top-0 ml-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {item.children.map((grandchild: any) => (
              <Link
                key={grandchild.id}
                to={grandchild.url || (grandchild.page_slug === 'home' ? ROUTES.HOME : `/${grandchild.page_slug}`)}
                className={`block px-4 py-2 transition-colors duration-200 ${
                  activeLink === grandchild.label.toLowerCase() 
                    ? 'bg-[#A259FF] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleLinkClick(grandchild.label.toLowerCase())}
              >
                {grandchild.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

NestedDropdownItem.displayName = 'NestedDropdownItem';

// Helper function to correct common login URL mistakes
const correctLoginUrl = (url: string, label: string): string => {
  const isLoginButton = label.toLowerCase().includes('entrar') || 
                       label.toLowerCase().includes('login') || 
                       label.toLowerCase().includes('sign in');
  
  if (isLoginButton && (url === '/login' || url === 'login')) {
    console.log('🔧 Correcting login URL from', url, 'to', ROUTES.LOGIN);
    return ROUTES.LOGIN;
  }
  
  return url;
};

interface UniversalNavbarProps {
  variant?: 'default' | 'compact' | 'minimal';
  position?: 'fixed' | 'sticky' | 'static';
  width?: number;
}

const UniversalNavbar = memo(({ 
  variant = 'default', 
  position = 'fixed',
  width 
}: UniversalNavbarProps) => {
  const [activeLink, setActiveLink] = useState("inicio");
  const { user, isAuthenticated } = useUniversalAuth();
  const { t } = useTranslation();
  const location = useLocation();
  
  // Use the new dynamic header hook
  const { 
    logoUrl, 
    actionButtons, 
    navItems, 
    isLoading,
    isAuthenticated: headerIsAuthenticated 
  } = usePublicHeader();

  const handleLinkClick = useCallback((linkName: string) => {
    setActiveLink(linkName);
  }, []);

  const currentActiveLink = useMemo(() => {
    const path = location.pathname;
    if (path === ROUTES.HOME) return "inicio";
    if (path.includes("/planos")) return "planos";
    if (path.includes("/parceria")) return "parceria";
    if (path.includes("/afiliados")) return "afiliados";
    return activeLink;
  }, [location.pathname, activeLink]);

  useEffect(() => {
    setActiveLink(currentActiveLink);
  }, [currentActiveLink]);

  const positionClasses = useMemo(() => {
    switch (position) {
      case 'sticky':
        return 'sticky top-[12px]';
      case 'static':
        return 'relative';
      default:
        return 'fixed top-[12px] left-0 right-0';
    }
  }, [position]);

  // Show loading state
  if (isLoading) {
    return (
      <header 
        className={`
          universal-navbar
          ${positionClasses} 
          w-full h-[72px]
          flex justify-center
          border-b border-zinc-800/50
        `}
        style={{ zIndex: APP_CONFIG.Z_INDEX.NAVBAR }}
      >
        <div className="bg-[#252525] w-full max-w-[1144px] h-full flex items-center justify-center mx-auto rounded-lg shadow-lg shadow-black/20">
          <div className="text-white">Carregando...</div>
        </div>
      </header>
    );
  }

  console.log('🚀 [UniversalNavbar] Rendering with dynamic nested data:', {
    logoUrl,
    actionButtonsCount: actionButtons.length,
    navItemsCount: navItems.length,
    navItemsStructure: navItems.map(item => ({
      id: item.id,
      label: item.label,
      type: item.type,
      childrenCount: item.children?.length || 0
    })),
    isAuthenticated
  });

  return (
    <header 
      className={`
        universal-navbar
        ${positionClasses} 
        w-full h-[72px]
        flex justify-center
        border-b border-zinc-800/50
      `}
      style={{ zIndex: APP_CONFIG.Z_INDEX.NAVBAR }}
    >
      {/* Container flutuante com largura máxima e bordas arredondadas */}
      <div className="
        bg-[#252525] w-full max-w-[1144px] h-full
        flex items-center justify-between px-8
        mx-auto rounded-lg
        shadow-lg shadow-black/20
      ">
        {/* Logo Section - Dynamic */}
        <Link to={ROUTES.HOME} className="text-white flex items-center flex-shrink-0">
          <img 
            src={logoUrl || "https://i.postimg.cc/sf0yGXBJ/2.png"} 
            alt="CYRUS Logo" 
            className="h-[51px] object-contain" 
          />
        </Link>
        
        {/* Navigation Links - Dynamic from database with proper nesting support */}
        <nav className="flex items-center justify-center flex-1">
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <DropdownNav
                key={item.id}
                item={item}
                activeLink={activeLink}
                handleLinkClick={handleLinkClick}
              />
            ))}
          </div>
        </nav>

        {/* Action Buttons - Dynamic from database with URL correction */}
        <div className="actions flex items-center gap-6 flex-shrink-0">
          {isAuthenticated && user ? (
            <Link 
              to={ROUTES.MEMBER_AREA} 
              className="bg-[#6F4AC5] hover:bg-[#A259FF] text-white px-6 py-2.5 rounded-lg text-[0.95rem] font-medium transition-all duration-300"
            >
              {t('nav.memberArea') || t('memberArea') || 'Área do Membro'}
            </Link>
          ) : (
            <>
              {actionButtons.map((button) => {
                // Apply URL correction for login buttons
                const correctedUrl = correctLoginUrl(button.url, button.label);
                
                return (
                  <Link 
                    key={button.id}
                    to={correctedUrl} 
                    className={`
                      ${button.style === 'primary' 
                        ? 'bg-[#6F4AC5] hover:bg-[#A259FF] text-white px-6 py-2.5 rounded-lg font-medium' 
                        : 'text-[#CCCCCC] font-medium hover:text-[#A259FF]'
                      } 
                      text-[0.95rem] transition-all duration-300
                    `}
                  >
                    {button.label}
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    </header>
  );
});

UniversalNavbar.displayName = 'UniversalNavbar';

export default UniversalNavbar;
