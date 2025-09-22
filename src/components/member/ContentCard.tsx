
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BaseCard } from "@/design-system";

export interface ContentCardProps {
  id: number;
  title: string;
  year: string;
  rating: number;
  image: string;
  status?: "on" | "off";
}

const ContentCard = ({ id, title, year, rating, image, status = "on" }: ContentCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = () => {
    navigate(`/content/${id}`);
  };

  // Check if the card is in favorites
  useEffect(() => {
    const favorites = localStorage.getItem("favorites");
    if (favorites) {
      const parsedFavorites = JSON.parse(favorites);
      const isInFavorites = parsedFavorites.some((fav: ContentCardProps) => fav.id === id);
      setIsFavorite(isInFavorites);
    }
  }, [id]);

  // Toggle favorite status
  const handleToggleFavorite = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    let favorites = [];
    const storedFavorites = localStorage.getItem("favorites");
    
    if (storedFavorites) {
      favorites = JSON.parse(storedFavorites);
    }
    
    // Set animation state
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((fav: ContentCardProps) => fav.id !== id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      toast({
        description: "Removido dos favoritos",
        duration: 2000,
      });
    } else {
      // Add to favorites
      favorites.push({ id, title, year, rating, image, status });
      localStorage.setItem("favorites", JSON.stringify(favorites));
      toast({
        description: "Adicionado aos favoritos",
        duration: 2000,
      });
    }
    
    setIsFavorite(!isFavorite);
  };

  return (
    <BaseCard 
      variant="cyrus"
      size="none"
      hover="moderate"
      className="relative cursor-pointer group overflow-hidden"
      onClick={handleCardClick}
    >
      <img 
        src={image} 
        alt={title} 
        className="w-full aspect-[2/3] object-cover" 
      />
      
      {/* Status indicator */}
      <div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${status === "on" ? "bg-green-500" : "bg-red-500"}`} />
      
      {/* Hover overlay - with smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="font-medium text-sm text-white">{title}</h3>
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full ${rating >= 7 ? "bg-green-500" : rating >= 6 ? "bg-yellow-500" : "bg-red-500"}`} />
            <span className="ml-1 text-xs text-white">{rating}</span>
          </div>
          <span className="text-zinc-400 text-xs">{year}</span>
        </div>
        
        {/* Favorite button with enhanced animation */}
        <div 
          className={`absolute top-2 left-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center transition-all
          hover:bg-purple-600/80 ${isAnimating ? 'animate-pulse' : ''}`}
          onClick={handleToggleFavorite}
        >
          <Heart 
            className={`h-4 w-4 transition-all duration-300 
              ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'} 
              ${isAnimating ? 'scale-125' : ''}`}
          />
          
          {/* Glow effect when favorite */}
          {isFavorite && (
            <div className={`absolute inset-0 rounded-full bg-red-500/20 animate-pulse`}></div>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default ContentCard;
