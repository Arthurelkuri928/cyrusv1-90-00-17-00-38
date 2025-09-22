
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FinalCTASection = ({ addSectionRef }: { addSectionRef: (index: number) => (el: HTMLElement | null) => void }) => {
  return (
    <section 
      ref={addSectionRef(6)}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0A0F1C] via-[#111827] to-[#151F38] text-white text-center"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Para Quem Faz de Verdade
        </h2>
        
        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          CYRUS é feita para profissionais que operam em alto nível.<br/>
          <span className="font-medium text-white">Nada de distrações. Nada de promessas vazias. Só o que importa:</span>
        </p>
        
        <div className="w-full mb-8">
          <Link to="/cadastro">
            <Button 
              variant="cyrusPrimary" 
              size="cyrus"
              className="w-full sm:max-w-2xl mx-auto flex items-center justify-center py-8 text-xl font-bold hover:scale-[1.02]"
            >
              Acesso completo – R$0,99 por uma semana
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
          
          <p className="text-center text-gray-400 mt-3 italic text-sm">
            Disponível enquanto o lote promocional estiver aberto.
          </p>
        </div>
        
        <div className="mt-16 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl max-w-2xl mx-auto">
          <p className="text-gray-300 italic">
            "Profissionais de alta performance não operam em estruturas frágeis. A CYRUS foi feita para eles."
          </p>
        </div>
      </div>
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#304FFE]/10 to-[#8E24AA]/5 animated-gradient"></div>
      </div>
    </section>
  );
};

export default FinalCTASection;
