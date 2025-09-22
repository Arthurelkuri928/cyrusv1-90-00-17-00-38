
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Settings, Brain } from "lucide-react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 min-h-screen flex items-center bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8E24AA]/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A64EFF]/20 rounded-full filter blur-[60px]"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#B388FF]/10 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight tracking-tight text-white max-w-[800px] mx-auto">
            A única plataforma de ferramentas que você pode <span className="text-[#B388FF]">confiar todos os dias</span>.
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Para quem constrói campanhas de verdade, e não aceita ser travado por sistemas frágeis.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#8E24AA]/20 rounded-full">
                <Shield className="h-5 w-5 text-[#B388FF]" />
              </div>
              <span className="text-white font-medium">Estabilidade.</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#8E24AA]/20 rounded-full">
                <Settings className="h-5 w-5 text-[#B388FF]" />
              </div>
              <span className="text-white font-medium">Precisão.</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#8E24AA]/20 rounded-full">
                <Brain className="h-5 w-5 text-[#B388FF]" />
              </div>
              <span className="text-white font-medium">Inteligência.</span>
            </div>
          </div>
          
          <p className="text-lg mb-10 text-gray-300 max-w-2xl mx-auto">
            A <span className="font-semibold">CYRUS</span> é o ambiente técnico ideal para quem opera com responsabilidade real.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 max-w-[600px] mx-auto">
            <Link to="/ferramentas" className="w-full sm:w-auto">
              <Button variant="cyrusWhite" size="cyrus" className="w-full sm:w-auto">
                Ver ferramentas
              </Button>
            </Link>
            
            <Link to="/cadastro" className="w-full sm:w-auto">
              <Button variant="cyrusPrimary" size="cyrus" className="w-full sm:w-auto">
                Testar agora por R$0,99
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Sem limitações. Sem riscos. Sem surpresas.
          </p>
        </div>
        
        {/* Sticky mobile CTA */}
        <div className="md:hidden fixed bottom-4 inset-x-4 z-50">
          <Link to="/cadastro" className="block">
            <Button variant="cyrusPrimary" size="cyrus" className="w-full shadow-lg">
              <span>Testar por R$0,99</span>
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};

export default HeroSection;
