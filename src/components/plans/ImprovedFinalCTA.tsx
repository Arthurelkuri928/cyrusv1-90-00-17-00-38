
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ImprovedFinalCTAProps {
  onScrollToPlans: () => void;
}

const ImprovedFinalCTA = ({
  onScrollToPlans
}: ImprovedFinalCTAProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-black via-[#0A0F1C] to-black text-white">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#8E24AA]/20 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#A64EFF]/15 rounded-full filter blur-[80px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#B388FF]/10 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Headline principal */}
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white max-w-3xl mx-auto">
            CYRUS é para quem quer <span className="text-[#B388FF]">executar</span>. Não pedir desculpas.
          </h2>
          
          {/* Subheadline */}
          <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Acesso completo por <span className="font-semibold text-white">R$0,99</span> enquanto o lote promocional estiver ativo.
          </p>
          
          {/* Botão principal */}
          <div className="mb-8">
            <Link to="/cadastro">
              <Button 
                variant="cyrusPrimary" 
                size="cyrus"
                className="px-8 py-4 text-lg font-semibold hover:scale-[1.02] transition-all duration-300"
              >
                Garantir meu acesso agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          {/* Texto de urgência */}
          <p className="text-gray-400 italic text-sm max-w-xl mx-auto">
            Disponível enquanto o lote promocional estiver aberto.
          </p>
          
          {/* Container adicional de destaque */}
          <div className="mt-16 p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm max-w-2xl mx-auto">
            <p className="text-gray-300 italic leading-relaxed">
              "Profissionais de alta performance não operam em estruturas frágeis. A CYRUS foi feita para eles."
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ImprovedFinalCTA;
