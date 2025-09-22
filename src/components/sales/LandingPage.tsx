import { useState, useEffect, useRef } from "react";
import HeroSection from "./landing/HeroSection";
import CatalogSection from "./landing/CatalogSection";
import MarketProblemSection from "../MarketProblemSection";
import PhilosophySection from "./landing/PhilosophySection";
import ExperienceSection from "./landing/ExperienceSection";
import OfferSection from "./landing/OfferSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import ClosingSection from "./landing/ClosingSection";
import Footer from "@/components/Footer";

const LandingPage = () => {
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
    <div className="w-full overflow-hidden bg-black text-white">
      <HeroSection />
      <CatalogSection addSectionRef={addSectionRef} />
      <MarketProblemSection addSectionRef={addSectionRef} />
      <PhilosophySection addSectionRef={addSectionRef} />
      <ExperienceSection addSectionRef={addSectionRef} />
      <OfferSection addSectionRef={addSectionRef} />
      <TestimonialsSection addSectionRef={addSectionRef} />
      <ClosingSection addSectionRef={addSectionRef} />
      <Footer />
    </div>
  );
};

export default LandingPage;
