import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Advertisement {
  id: string;
  title_pt: string;
  title_en: string;
  title_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  video_url: string;
  thumbnail_url?: string;
  cta_button_1_text_pt?: string;
  cta_button_1_text_en?: string;
  cta_button_1_text_es?: string;
  cta_button_1_url?: string;
  cta_button_2_text_pt?: string;
  cta_button_2_text_en?: string;
  cta_button_2_text_es?: string;
  cta_button_2_url?: string;
  display_order: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface LocalizedAdvertisement {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  cta_button_1?: {
    text: string;
    url: string;
  };
  cta_button_2?: {
    text: string;
    url: string;
  };
  display_order: number;
}

// Função para extrair ID do vídeo do YouTube
const extractYouTubeId = (url: string): string | null => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

// Função para extrair ID do vídeo do Vimeo
const extractVimeoId = (url: string): string | null => {
  const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/i;
  const match = url.match(vimeoRegex);
  return match ? match[1] : null;
};

// Função para gerar thumbnail baseado na plataforma
const generateThumbnail = (videoUrl: string, providedThumbnail?: string): string => {
  // Se já tem thumbnail fornecida, usar ela
  if (providedThumbnail) {
    return providedThumbnail;
  }

  // Detectar se é YouTube
  const youtubeId = extractYouTubeId(videoUrl);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }

  // Detectar se é Vimeo (fallback para o método existente)
  const vimeoId = extractVimeoId(videoUrl);
  if (vimeoId) {
    return `https://vumbnail.com/${vimeoId}.jpg`;
  }

  // Fallback genérico se não conseguir detectar a plataforma
  return `https://vumbnail.com/${videoUrl.split('/').pop()}.jpg`;
};

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [localizedAds, setLocalizedAds] = useState<LocalizedAdvertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date().toISOString();
      
      const { data, error: fetchError } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('display_order', { ascending: true });

      if (fetchError) {
        console.error('Error fetching advertisements:', fetchError);
        setError(fetchError.message);
        return;
      }

      setAdvertisements(data || []);
    } catch (err) {
      console.error('Error in fetchAdvertisements:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const localizeAdvertisements = (ads: Advertisement[]): LocalizedAdvertisement[] => {
    const langSuffix = language === 'pt-BR' ? 'pt' : language === 'en-US' ? 'en' : 'es';
    
    return ads.map(ad => ({
      id: ad.id,
      title: ad[`title_${langSuffix}` as keyof Advertisement] as string,
      description: ad[`description_${langSuffix}` as keyof Advertisement] as string,
      url: ad.video_url,
      thumbnail: generateThumbnail(ad.video_url, ad.thumbnail_url),
      cta_button_1: ad[`cta_button_1_text_${langSuffix}` as keyof Advertisement] && ad.cta_button_1_url ? {
        text: ad[`cta_button_1_text_${langSuffix}` as keyof Advertisement] as string,
        url: ad.cta_button_1_url
      } : undefined,
      cta_button_2: ad[`cta_button_2_text_${langSuffix}` as keyof Advertisement] && ad.cta_button_2_url ? {
        text: ad[`cta_button_2_text_${langSuffix}` as keyof Advertisement] as string,
        url: ad.cta_button_2_url
      } : undefined,
      display_order: ad.display_order
    }));
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  useEffect(() => {
    const localized = localizeAdvertisements(advertisements);
    setLocalizedAds(localized);
  }, [advertisements, language]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('advertisements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'advertisements'
        },
        () => {
          console.log('Advertisement change detected, refetching...');
          fetchAdvertisements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    advertisements,
    localizedAds,
    loading,
    error,
    refetch: fetchAdvertisements
  };
};
