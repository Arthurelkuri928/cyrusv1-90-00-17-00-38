
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Play, Info } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const VideoHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    // Ensure video plays automatically when loaded
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 bg-black">
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          poster="/lovable-uploads/fc073547-2f8d-4bab-96fd-5ddc50b1c4d8.png"
        >
          <source src="https://cdn.coverr.co/videos/coverr-purple-gradient-waves-4533/1080p.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/90 via-[#0D0D0D]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-5xl animate-fade-in">
          Bem-vindo à <span className="text-[#A259FF]">CYRUS</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl">
          Acesse ferramentas premium de IA, espionagem, SEO e muito mais em um único lugar
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button 
            size="lg" 
            className="bg-[#e50914] hover:bg-[#f40612] text-white font-bold text-lg px-8 py-6 rounded-md shadow-lg transition-all"
            onClick={() => setIsVideoOpen(true)}
          >
            <Play className="mr-2 h-5 w-5" />
            Assistir Trailer
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-[#6d6d6eb3] hover:bg-[#6d6d6e99] text-white border-0 font-bold text-lg px-8 py-6 rounded-md shadow-lg transition-all"
            asChild
          >
            <div className="flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Mais Informações
            </div>
          </Button>
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
    </div>
  );
};

export default VideoHero;
