
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Server } from "lucide-react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section 
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 min-h-screen flex items-center bg-gradient-to-b from-[#0A0F1C] via-[#111827] to-[#151F38]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(48,79,254,0.08)_0%,rgba(0,0,0,0)_100%)]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#304FFE]/5 rounded-full filter blur-[80px]"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-[#8E24AA]/5 rounded-full filter blur-[60px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 max-w-[600px]">
              Ferramentas sérias não podem falhar.
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              A <span className="font-bold">CYRUS</span> é uma plataforma construída com um princípio simples:
            </p>
            
            <div className="flex items-center mb-10 bg-[#304FFE]/10 p-4 rounded-lg border border-[#304FFE]/20">
              <Target className="w-6 h-6 text-[#304FFE] mr-3 flex-shrink-0" />
              <p className="text-lg italic text-gray-200">
                Confiabilidade absoluta para quem precisa executar.
              </p>
            </div>
            
            <div className="space-y-5 mb-10">
              {[
                "Infraestrutura técnica sólida",
                "Acesso instantâneo e contínuo",
                "Organização lógica por áreas estratégicas"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center group">
                  <div className="bg-[#304FFE]/20 rounded-full p-2 mr-4 shadow-lg shadow-[#304FFE]/10">
                    <div className="w-2 h-2 rounded-full bg-[#304FFE] group-hover:animate-pulse"></div>
                  </div>
                  <p className="text-gray-300 group-hover:text-white transition-all duration-300">{item}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
              <Link to="/cadastro">
                <Button 
                  variant="cyrusPrimary" 
                  size="cyrus"
                  className="w-full md:w-[260px] group relative overflow-hidden"
                >
                  <span className="relative z-10">Teste com acesso total por R$1</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div 
            className={`relative transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div className="relative z-10 glow-border rounded-2xl overflow-hidden backdrop-blur-sm bg-black/20 border border-[#304FFE]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#304FFE]/10 to-[#8E24AA]/10 animate-gradient-flow"></div>
              <div className="h-96 w-full flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-[#304FFE]/20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-[#0A0F1C] rounded-full flex items-center justify-center">
                      <Server className="w-12 h-12 text-[#304FFE]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Plataforma Técnica Superior</h3>
                  <p className="text-gray-400 px-8">Arquitetura otimizada para performance e estabilidade contínua.</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8E24AA]/30 rounded-full filter blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#304FFE]/20 rounded-full filter blur-xl"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-[100px] text-[#0A0F1C]"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V69.14C50.94,75.82,137.25,66.26,182.73,63.47Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
