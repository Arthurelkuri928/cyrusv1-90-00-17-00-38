import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdvertisements, LocalizedAdvertisement } from "@/hooks/useAdvertisements";

const VimeoCarousel = () => {
  const { t } = useLanguage();
  const { localizedAds, loading, error } = useAdvertisements();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Usar apenas dados do Supabase - sem fallback
  const videos: LocalizedAdvertisement[] = localizedAds;

  const next = useCallback(() => {
    if (videos.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }
  }, [videos.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  // Auto-advance videos every 15 seconds
  useEffect(() => {
    if (playing && videos.length > 0) {
      intervalRef.current = setInterval(() => {
        next();
      }, 15000); // 15 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playing, next, videos.length]);

  // Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset currentIndex if it's out of bounds
  useEffect(() => {
    if (currentIndex >= videos.length && videos.length > 0) {
      setCurrentIndex(0);
    }
  }, [videos.length, currentIndex]);

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden bg-background dark:bg-background flex items-center justify-center md:-ml-20 md:w-[calc(100%_+_5rem)] md:z-0">
        <div className="text-white text-lg">Carregando anúncios...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error('Error loading advertisements:', error);
    return (
      <div className="relative w-full min-h-screen overflow-hidden bg-background dark:bg-background flex items-center justify-center md:-ml-20 md:w-[calc(100%_+_5rem)] md:z-0">
        <div className="text-white text-lg">Erro ao carregar anúncios</div>
      </div>
    );
  }

  // No videos state
  if (videos.length === 0) {
    return (
      <div className="relative w-full min-h-screen overflow-hidden bg-background dark:bg-background flex items-center justify-center md:-ml-20 md:w-[calc(100%_+_5rem)] md:z-0">
        <div className="text-white text-lg">Nenhum anúncio ativo disponível</div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background dark:bg-background md:-ml-20 md:w-[calc(100%_+_5rem)] md:z-0">
      {/* Main Video Container - Full coverage with proper background */}
      <div className="absolute inset-0 w-full min-h-screen bg-background dark:bg-background">
        <ReactPlayer
          ref={playerRef}
          url={currentVideo.url}
          playing={playing}
          muted={muted}
          controls={false}
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            minHeight: '100vh',
            backgroundColor: 'inherit'
          }}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                mute: muted ? 1 : 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0
              }
            },
            vimeo: {
              playerOptions: {
                background: true,
                responsive: true,
                autoplay: true,
                muted: muted
              }
            }
          }}
          className="w-full h-full min-h-screen object-cover bg-background dark:bg-background"
        />
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-10" />

      {/* Centered Content */}
      <div className="absolute inset-0 flex items-center justify-center z-20 px-6 min-h-screen">
        <div className="text-center max-w-4xl">
          <motion.h2 
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight"
          >
            {currentVideo.title}
          </motion.h2>
          
          <motion.p 
            key={`desc-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 drop-shadow-lg max-w-2xl mx-auto leading-relaxed"
          >
            {currentVideo.description}
          </motion.p>
          
          <motion.div 
            key={`buttons-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* CTA Button 1 */}
            <button 
              onClick={() => {
                if (currentVideo.cta_button_1?.url) {
                  window.open(currentVideo.cta_button_1.url, '_blank');
                }
              }}
              className="bg-white text-black px-6 py-3 rounded-full text-base font-semibold hover:bg-white/90 transition-all duration-300 shadow-xl backdrop-blur-sm"
            >
              {currentVideo.cta_button_1?.text || t('videoHeroButton1')}
            </button>
            
            {/* CTA Button 2 */}
            <button 
              onClick={() => {
                if (currentVideo.cta_button_2?.url) {
                  window.open(currentVideo.cta_button_2.url, '_blank');
                }
              }}
              className="border-2 border-white text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
            >
              {currentVideo.cta_button_2?.text || t('videoHeroButton2')}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 z-30 flex gap-3">
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white rounded-full border border-white/20 hover:border-white/50 transition-all duration-300 flex items-center justify-center"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        
        <button
          onClick={toggleMute}
          className="w-12 h-12 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white rounded-full border border-white/20 hover:border-white/50 transition-all duration-300 flex items-center justify-center"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      {/* Bottom Thumbnails */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`relative w-16 h-10 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
              index === currentIndex 
                ? 'border-white shadow-lg scale-110' 
                : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
            }`}
            onClick={() => goToSlide(index)}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VimeoCarousel;
