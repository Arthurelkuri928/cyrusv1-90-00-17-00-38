
import React from "react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Play, Star } from "lucide-react";

const premiumVideos = [{
  id: 1,
  title: "Master Class Premium",
  description: "Técnicas avançadas de produtividade",
  thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop",
  duration: "12:34",
  category: "Premium",
  level: "Expert"
}, {
  id: 2,
  title: "Estratégias Elite",
  description: "Segredos dos profissionais",
  thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop",
  duration: "8:45",
  category: "Estratégia",
  level: "Advanced"
}, {
  id: 3,
  title: "Innovation Lab",
  description: "Tecnologias emergentes",
  thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop",
  duration: "15:20",
  category: "Tech",
  level: "Pro"
}, {
  id: 4,
  title: "Leadership Excellence",
  description: "Desenvolvimento executivo",
  thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
  duration: "10:15",
  category: "Leadership",
  level: "Executive"
}];

const VideoCarousel = () => {
  if (!premiumVideos || premiumVideos.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-background to-muted/30 py-16 overflow-hidden min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5" />
      
      {/* Content with full width */}
      <div className="relative z-10 w-full px-6 h-full">
        {/* Header */}
        <div className="text-center mb-12 ml-0 md:ml-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Conteúdo Premium Exclusivo
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Acesse masterclasses e conteúdos avançados criados especialmente para membros premium
          </motion.p>
        </div>

        {/* Carousel with adjusted margins */}
        <div className="max-w-7xl mx-auto ml-0 md:ml-16">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {premiumVideos.map((video, index) => (
                <CarouselItem key={video.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/20">
                            <Play className="h-8 w-8 text-white fill-white" />
                          </div>
                        </div>
                        
                        {/* Duration */}
                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-sm px-2 py-1 rounded">
                          {video.duration}
                        </div>
                        
                        {/* Level badge */}
                        <div className="absolute top-3 left-3">
                          <div className="bg-purple-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            {video.level}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-xs text-purple-400 font-medium uppercase tracking-wide">
                            {video.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-purple-400 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation - adjusted positioning */}
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="relative translate-y-0 left-0 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-purple-600/20 hover:border-purple-500/50" />
              <CarouselNext className="relative translate-y-0 right-0 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-purple-600/20 hover:border-purple-500/50" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel;
