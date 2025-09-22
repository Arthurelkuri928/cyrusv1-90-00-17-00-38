import { useState, useEffect } from "react";
interface PlansHeroSectionProps {
  onScrollToPlans: () => void;
  onOpenAssistant: () => void;
}
const PlansHeroSection = ({
  onScrollToPlans,
  onOpenAssistant
}: PlansHeroSectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return <section className="relative pt-24 md:pt-32 pb-4 px-6 md:px-12 min-h-[70vh] flex items-center bg-black py-[41px] lg:px-[94px]">
      {/* Background effects - mesmo padrão da Home com leve variação */}
      <div className="absolute inset-0 overflow-hidden my-0 py-0 px-0 mx-[38px]">
        <div className="absolute top-32 right-16 w-80 h-80 bg-[#8E24AA]/25 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-32 left-16 w-96 h-96 bg-[#A64EFF]/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#B388FF]/15 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Título principal - mesmo estilo da Home */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight tracking-tight text-white max-w-[800px] mx-auto md:text-7xl">
            Acesso completo a todas as <span className="text-[#B388FF]">ferramentas premium</span>
          </h1>
          
          {/* Subtítulo - mesmo estilo da Home */}
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Todos os planos incluem acesso total à plataforma. Escolha o que melhor se adapta ao seu uso.
          </p>
          
        </div>
      </div>
    </section>;
};
export default PlansHeroSection;