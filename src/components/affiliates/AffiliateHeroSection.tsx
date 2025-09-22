
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, ArrowRight, Users, Target } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import { useState, useEffect } from "react";

const AffiliateHeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <SectionContainer spacing="xl" background="transparent" className="relative overflow-hidden pt-32">
      {/* Background Effects - Degradê mais suave */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Degradê principal mais suave */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
        
        {/* Orbs com transições mais suaves */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-radial from-[#A259FF]/15 via-[#A259FF]/8 via-[#A259FF]/4 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-gradient-radial from-[#8E24AA]/12 via-[#8E24AA]/6 via-[#8E24AA]/3 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#A259FF]/8 via-[#A259FF]/4 via-[#A259FF]/2 to-transparent rounded-full filter blur-[120px]"></div>
        
        {/* Overlay para suavizar ainda mais */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        
        {/* Malha sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(162,89,255,0.015)_1px,transparent_1px)] [background-size:60px_60px] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Badge */}
          <div className="inline-flex items-center bg-[#A259FF]/20 border border-[#A259FF]/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <Target className="w-5 h-5 text-[#A259FF] mr-2" />
            <span className="text-sm font-medium text-white">Programa de Afiliados CYRUS</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight text-white max-w-5xl mx-auto">
            Conheça o programa de <span className="text-[#A259FF]">afiliados CYRUS</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ganhe comissões automáticas indicando a plataforma mais completa do mercado. 
            <span className="text-[#A259FF] font-semibold"> Sem investimento inicial, sem burocracia.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#A259FF] hover:bg-[#8A4FD0] text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-[#A259FF]/30 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Quero ser Afiliado
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-[#A259FF]/30 text-white hover:bg-[#A259FF]/10 px-6 py-4 text-lg rounded-xl w-full sm:w-auto backdrop-blur-sm"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Como Funciona
            </Button>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { 
                icon: <Users className="h-6 w-6 text-[#A259FF]" />,
                number: "500+", 
                label: "Afiliados Ativos" 
              },
              { 
                icon: <DollarSign className="h-6 w-6 text-[#A259FF]" />,
                number: "R$ 2M+", 
                label: "Comissões Pagas" 
              },
              { 
                icon: <TrendingUp className="h-6 w-6 text-[#A259FF]" />,
                number: "30%", 
                label: "Comissão Vitalícia" 
              }
            ].map((metric, index) => (
              <div key={index} className="text-center bg-black/20 backdrop-blur-sm border border-[#A259FF]/20 rounded-xl p-6 hover:border-[#A259FF]/40 transition-all duration-300">
                <div className="flex justify-center mb-3">
                  {metric.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#A259FF] mb-2">{metric.number}</div>
                <div className="text-gray-400 text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AffiliateHeroSection;
