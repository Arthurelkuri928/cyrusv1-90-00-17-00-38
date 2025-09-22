
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, ListFilter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";

export interface VideoBannerProps {
  title: string;
  description: string;
  category?: string;
  rating?: number;
  year?: string;
  image: string;
  videoSrc?: string;
}

const VideoBanner = ({
  title,
  description,
  category,
  image,
  videoSrc
}: VideoBannerProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays automatically when loaded
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);
  
  return (
    <section className="relative h-[80vh] min-h-[500px] mb-6 z-10">
      <div className="absolute inset-0 bg-black">
        {videoSrc ? (
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            autoPlay
            muted
            loop
            playsInline
            poster={image}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={image} alt={title} className="w-full h-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      <div className="container mx-auto relative h-full flex flex-col justify-center items-center text-center pb-20 px-4 md:px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">{title}</h1>
          <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">{description}</p>
          
          <div className="flex items-center justify-center space-x-4">
            <Button 
              className="bg-[#e50914] hover:bg-[#f40612] text-white rounded-md px-8 py-6 font-medium flex items-center transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-500/30"
              onClick={() => setIsVideoOpen(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Assistir Trailer
            </Button>
            <Button 
              variant="outline" 
              className="bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-[#A259FF] rounded-md px-8 py-6 transition-all duration-300 transform hover:translate-y-[-2px]"
              onClick={() => navigate("/ferramentas")}
            >
              <ListFilter className="mr-2 h-5 w-5" />
              Ver Categorias
            </Button>
          </div>
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <div className="aspect-video w-full">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="CYRUS Trailer" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoBanner;
