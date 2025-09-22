
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import HeroSection from "./HeroSection";
import MarketPainSection from "./MarketPainSection";
import PhilosophySection from "./PhilosophySection";
import ExperienceSection from "./ExperienceSection";
import OfferSection from "./OfferSection";
import TestimonialsSection from "./TestimonialsSection";
import FinalCTASection from "./FinalCTASection";

const SalesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Animation on page load
  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      sectionRefs.current.forEach((ref) => {
        if (!ref) return;
        
        const rect = ref.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
        
        if (isInView) {
          ref.classList.add("animate-fade-in");
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      
      <MarketPainSection addSectionRef={addSectionRef} />
      
      <div className="relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden z-10">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-[60px] text-[#0A0F1C] rotate-180"
          >
            <path 
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        <PhilosophySection addSectionRef={addSectionRef} />
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-[60px] text-[#0A0F1C]"
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V69.14C50.94,75.82,137.25,66.26,182.73,63.47Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <ExperienceSection addSectionRef={addSectionRef} />

      <Separator className="bg-gradient-to-r from-transparent via-[#304FFE]/30 to-transparent h-[1px]" />

      <OfferSection addSectionRef={addSectionRef} />

      <Separator className="bg-gradient-to-r from-transparent via-[#8E24AA]/30 to-transparent h-[1px]" />

      <TestimonialsSection addSectionRef={addSectionRef} />

      <Separator className="bg-gradient-to-r from-transparent via-gradient-radial to-transparent h-[1px]" />

      <FinalCTASection addSectionRef={addSectionRef} />
    </div>
  );
};

export default SalesPage;
