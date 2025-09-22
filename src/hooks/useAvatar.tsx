
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAvatar = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState("");

  // Avatar padrão único para toda a aplicação
  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/128/7790/7790136.png";

  const getConsistentAvatarUrl = () => {
    // Priorizar avatar customizado primeiro
    const customAvatar = localStorage.getItem("customAvatar");
    if (customAvatar && customAvatar.trim() !== "") {
      console.log("Usando avatar customizado:", customAvatar);
      return customAvatar;
    }
    
    // Depois avatar selecionado
    const savedAvatar = localStorage.getItem("selectedAvatar");
    if (savedAvatar && savedAvatar.trim() !== "") {
      console.log("Usando avatar selecionado:", savedAvatar);
      return savedAvatar;
    }
    
    // Por último, avatar do user metadata
    if (user?.user_metadata?.avatar_url && user.user_metadata.avatar_url.trim() !== "") {
      console.log("Usando avatar do metadata:", user.user_metadata.avatar_url);
      return user.user_metadata.avatar_url;
    }
    
    // Avatar padrão se nenhum estiver definido
    console.log("Usando avatar padrão:", DEFAULT_AVATAR);
    return DEFAULT_AVATAR;
  };

  // Inicializar avatar na montagem do componente
  useEffect(() => {
    const currentAvatar = getConsistentAvatarUrl();
    setAvatarUrl(currentAvatar);
    console.log("Avatar inicializado:", currentAvatar);
  }, [user]);

  useEffect(() => {
    // Listener para mudanças no localStorage entre abas diferentes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedAvatar' || e.key === 'customAvatar') {
        const newAvatar = getConsistentAvatarUrl();
        setAvatarUrl(newAvatar);
        console.log("Avatar atualizado via storage:", newAvatar);
      }
    };

    // Listener personalizado para mudanças de avatar na mesma aba
    const handleAvatarChange = () => {
      const newAvatar = getConsistentAvatarUrl();
      setAvatarUrl(newAvatar);
      console.log("Avatar atualizado via evento:", newAvatar);
    };

    // Listener para verificar mudanças diretas no localStorage (mesma aba)
    const handleLocalStorageCheck = () => {
      const newAvatar = getConsistentAvatarUrl();
      if (newAvatar !== avatarUrl) {
        setAvatarUrl(newAvatar);
        console.log("Avatar sincronizado:", newAvatar);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('avatarChanged', handleAvatarChange);
    
    // Verificar mudanças a cada 2 segundos para garantir sincronização
    const interval = setInterval(handleLocalStorageCheck, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarChanged', handleAvatarChange);
      clearInterval(interval);
    };
  }, [avatarUrl, user]);

  return avatarUrl || DEFAULT_AVATAR; // Garantir que sempre retorne um avatar válido
};
