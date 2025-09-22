
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SimpleHero = () => {
  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Dark background with gradient */}
      <div className="absolute inset-0 bg-black">
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

        <div>
          <Button 
            size="lg" 
            className="bg-[#A259FF] hover:bg-[#8A4FD0] text-white font-bold text-lg px-8 py-6 rounded-md shadow-lg transition-all"
            asChild
          >
            <Link to="/planos">
              Ver planos <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleHero;
