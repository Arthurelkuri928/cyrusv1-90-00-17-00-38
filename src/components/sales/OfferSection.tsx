
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const OfferSection = ({ addSectionRef }: { addSectionRef: (index: number) => (el: HTMLElement | null) => void }) => {
  return (
    <section 
      ref={addSectionRef(4)}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0A0F1C] via-[#111827] to-[#151F38] text-white"
    >
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Oferta Teste: R$0,99, Sem Riscos
        </h2>
        
        <p className="text-xl mb-12 text-gray-300">
          Você não precisa acreditar — basta experimentar.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto">
          {[
            { text: "Acesso integral", icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
            { text: "Nenhuma limitação", icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
            { text: "Sem renovação automática oculta", icon: <CheckCircle className="h-5 w-5 text-green-500" /> }
          ].map((item, index) => (
            <div 
              key={index} 
              className="glass-card p-4 flex items-center space-x-3 hover:shadow-[#304FFE]/20 transition-all"
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <p className="text-gray-200">{item.text}</p>
            </div>
          ))}
        </div>
        
        <Link to="/cadastro">
          <Button 
            variant="cyrusPrimary"
            size="cyrus"
            className="w-full max-w-md text-lg"
          >
            <span>Começar agora por R$0,99</span>
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
        
        {/* Sticky mobile CTA - Corrigido o tamanho e posicionamento para mobile */}
        <div className="md:hidden fixed bottom-4 inset-x-4 z-50">
          <Link to="/cadastro" className="block">
            <Button 
              variant="cyrusPrimary"
              size="cyrus"
              className="w-full text-base py-2 px-4 shadow-lg"
            >
              <span>Acesso por R$0,99</span>
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Gradient circle background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#8E24AA]/5 filter blur-3xl pointer-events-none"></div>
    </section>
  );
};

export default OfferSection;
