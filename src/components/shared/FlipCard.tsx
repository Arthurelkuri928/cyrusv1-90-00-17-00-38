import { useState, useEffect } from 'react';
import { LucideIcon, CheckCircle } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';
interface FlipCardProps {
  frontIcon: LucideIcon;
  frontTitle: string;
  backTitle?: string;
  backSolutions: string[];
  className?: string;
}
const FlipCard = ({
  frontIcon: Icon,
  frontTitle,
  backTitle = "Como a CYRUS resolve",
  backSolutions,
  className = ""
}: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Reset flip state on scroll for mobile
  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      if (isFlipped) {
        setIsFlipped(false);
      }
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFlipped, isMobile]);
  const handleInteraction = () => {
    if (isMobile) {
      setIsFlipped(!isFlipped);
    }
  };
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsFlipped(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsFlipped(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };
  const handleFocus = () => {
    if (!isMobile) {
      setIsFlipped(true);
    }
  };
  const handleBlur = () => {
    if (!isMobile) {
      setIsFlipped(false);
    }
  };

  // Convert solutions array to a single descriptive sentence
  const solutionText = backSolutions.join(', ').toLowerCase();
  return <div className={`group relative w-full h-[200px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B388FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg ${className}`} style={{
    perspective: '1000px'
  }} onClick={handleInteraction} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onFocus={handleFocus} onBlur={handleBlur} role="button" tabIndex={0} aria-label={`${frontTitle}. Pressione para ver a solução CYRUS.`}>
      {/* Flip Container */}
      <div className="relative w-full h-full transition-transform duration-500 ease-out" style={{
      transformStyle: 'preserve-3d',
      transformOrigin: 'center',
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
    }}>
        {/* Front Face - Problem */}
        <div className="absolute inset-0 w-full h-full backdrop-blur-md bg-black border border-[#222] rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-[#FF4B4B]/30 hover:shadow-[#FF4B4B]/10" style={{
        backfaceVisibility: 'hidden',
        transform: 'rotateY(0deg)'
      }}>
          {/* Hover background effect */}
          <div className="absolute inset-0 bg-[#FF4B4B]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            {/* Icon */}
            <div className="bg-black/90 rounded-full p-4 mb-4 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-[#FF4B4B] opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative">
                  <Icon className="h-7 w-7 text-[#FF4B4B]" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            
            {/* Title */}
            <h3 className="font-semibold text-base leading-tight text-white">
              {frontTitle}
            </h3>
          </div>
        </div>

        {/* Back Face - Solution */}
        <div className="absolute inset-0 w-full h-full bg-black/90 border border-[#A259FF]/30 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-[#A259FF]/50 hover:bg-black/95" style={{
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)'
      }}>
          {/* Hover background effect */}
          <div className="absolute inset-0 bg-[#A259FF]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            {/* Icon */}
            <div className="rounded-full p-4 mb-4 flex items-center justify-center bg-transparent">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-[#A259FF] opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative">
                  <CheckCircle className="h-7 w-7 text-[#A259FF]" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            
            {/* Título "Como a CYRUS resolve" */}
            <p className="text-sm text-white/70 mb-2">Como a CYRUS resolve</p>
            
            {/* Solution text */}
            <h3 className="font-semibold text-base leading-tight text-white">
              {solutionText}
            </h3>
          </div>
        </div>
      </div>
    </div>;
};
export default FlipCard;