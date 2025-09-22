
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

interface FinalCTASectionProps {
  onScrollToPlans: () => void;
}

const FinalCTASection = ({ onScrollToPlans }: FinalCTASectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const benefits = [
    "Acesso imediato após a compra",
    "Todas as ferramentas liberadas",
    "Suporte premium incluído",
    "Atualizações automáticas"
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-black via-[#0A0F1C] to-black">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Pronto para começar?
          </h2>
          
          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
            Junte-se aos profissionais que já descobriram o poder da CYRUS.<br/>
            <span className="font-medium text-white">Sua jornada de transformação começa agora.</span>
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <CheckCircle className="w-5 h-5 text-[#B388FF] flex-shrink-0" />
                <span className="text-gray-300 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
          
          <Button 
            variant="cyrusPrimary" 
            size="cyrus"
            onClick={onScrollToPlans}
            className="w-full sm:max-w-md mx-auto flex items-center justify-center hover:scale-[1.02] transition-transform"
          >
            Escolher meu plano
            <ArrowRight className="ml-2" />
          </Button>
          
          <p className="text-center text-gray-400 mt-4 italic text-sm">
            Ativação instantânea • Sem compromisso de longo prazo
          </p>
        </div>
      </div>
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#8E24AA]/10 to-[#A64EFF]/5"></div>
      </div>
    </section>
  );
};

export default FinalCTASection;
