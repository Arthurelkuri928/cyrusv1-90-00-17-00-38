
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, DollarSign, Target } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";

const PartnershipHeroSection = () => {
  const [currentEarning, setCurrentEarning] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEarning(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SectionContainer spacing="xl" background="transparent" className="relative min-h-[90vh] flex items-center pt-32">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-16 w-80 h-80 bg-[#8E24AA]/25 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-32 left-16 w-96 h-96 bg-[#B388FF]/15 rounded-full filter blur-[80px]"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#A64EFF]/15 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="w-full relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge de Autoridade */}
          <div className="inline-flex items-center bg-gradient-to-r from-[#B388FF]/20 to-[#8E24AA]/20 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
            <Target className="w-4 h-4 text-[#B388FF] mr-2" />
            <span className="text-sm font-medium text-white">Programa Exclusivo para Profissionais de Elite</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-white max-w-4xl mx-auto">
            Transforme sua <span className="text-[#B388FF]">autoridade</span> em um <span className="text-[#A64EFF]">império financeiro</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            O programa de parcerias CYRUS não é para qualquer um. É para <span className="font-bold text-white">influenciadores sérios</span> que querem construir renda recorrente de 6 dígitos.
          </p>

          {/* Stats em Tempo Real */}
          <div className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/30 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Ganhos totais dos parceiros hoje:</span>
              <div className="flex items-center text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-xs">+12%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#B388FF] mb-1">
              R$ {currentEarning.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">e subindo...</div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <Button variant="cyrusPrimary" size="cyrus" className="w-full sm:w-auto" onClick={() => document.getElementById('formulario')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Candidatar-se Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="cyrusGhost" size="cyrus" className="w-full sm:w-auto border-[#B388FF] text-[#B388FF] hover:bg-[#B388FF]/10" onClick={() => document.getElementById('como-funciona')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Ver Comissões
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400 mb-12">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-[#B388FF]" />
              <span>200+ Parceiros Ativos</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-[#A64EFF]" />
              <span>R$ 2M+ Pagos</span>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default PartnershipHeroSection;
