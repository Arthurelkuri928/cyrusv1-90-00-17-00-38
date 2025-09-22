
// Utilitário para validação e manipulação de URLs de vídeo

export interface VideoValidationResult {
  isValid: boolean;
  platform: 'youtube' | 'vimeo' | 'unknown';
  videoId?: string;
  error?: string;
}

// Regex para YouTube (suporta vários formatos)
const YOUTUBE_REGEX = /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

// Regex para Vimeo
const VIMEO_REGEX = /^https?:\/\/(?:www\.)?vimeo\.com\/([0-9]+)/i;

/**
 * Valida se a URL é de uma plataforma de vídeo suportada
 * @param url - URL do vídeo a ser validada
 * @returns Objeto com resultado da validação
 */
export const validateVideoUrl = (url: string): VideoValidationResult => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      platform: 'unknown',
      error: 'URL não fornecida ou inválida'
    };
  }

  // Sanitizar URL removendo espaços
  const cleanUrl = url.trim();

  // Verificar YouTube
  const youtubeMatch = cleanUrl.match(YOUTUBE_REGEX);
  if (youtubeMatch) {
    return {
      isValid: true,
      platform: 'youtube',
      videoId: youtubeMatch[1]
    };
  }

  // Verificar Vimeo
  const vimeoMatch = cleanUrl.match(VIMEO_REGEX);
  if (vimeoMatch) {
    return {
      isValid: true,
      platform: 'vimeo',
      videoId: vimeoMatch[1]
    };
  }

  return {
    isValid: false,
    platform: 'unknown',
    error: 'URL deve ser do YouTube (youtube.com, youtu.be) ou Vimeo (vimeo.com)'
  };
};

/**
 * Extrai o ID do vídeo do YouTube de uma URL
 * @param url - URL do YouTube
 * @returns ID do vídeo ou null se não encontrado
 */
export const extractYouTubeId = (url: string): string | null => {
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
};

/**
 * Extrai o ID do vídeo do Vimeo de uma URL
 * @param url - URL do Vimeo
 * @returns ID do vídeo ou null se não encontrado
 */
export const extractVimeoId = (url: string): string | null => {
  const match = url.match(VIMEO_REGEX);
  return match ? match[1] : null;
};

/**
 * Gera URL de thumbnail baseado na plataforma
 * @param url - URL do vídeo
 * @param providedThumbnail - Thumbnail fornecida manualmente (opcional)
 * @returns URL da thumbnail
 */
export const generateVideoThumbnail = (url: string, providedThumbnail?: string): string => {
  if (providedThumbnail) {
    return providedThumbnail;
  }

  const validation = validateVideoUrl(url);
  
  if (!validation.isValid || !validation.videoId) {
    return '/placeholder.svg'; // Fallback para thumbnail padrão
  }

  switch (validation.platform) {
    case 'youtube':
      return `https://img.youtube.com/vi/${validation.videoId}/maxresdefault.jpg`;
    case 'vimeo':
      return `https://vumbnail.com/${validation.videoId}.jpg`;
    default:
      return '/placeholder.svg';
  }
};

/**
 * Lista de URLs de exemplo para cada plataforma (para documentação/testes)
 */
export const EXAMPLE_URLS = {
  youtube: [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://youtube.com/embed/dQw4w9WgXcQ'
  ],
  vimeo: [
    'https://vimeo.com/123456789',
    'https://www.vimeo.com/123456789'
  ]
} as const;
