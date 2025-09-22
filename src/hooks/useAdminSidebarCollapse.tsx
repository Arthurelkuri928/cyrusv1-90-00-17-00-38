
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'adminSidebarCollapsed';

export const useAdminSidebarCollapse = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Carregar estado do localStorage na inicialização
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Salvar estado no localStorage sempre que mudar
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  return {
    isCollapsed,
    toggleCollapse
  };
};
