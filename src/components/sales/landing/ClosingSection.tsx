
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const ClosingSection = ({
  addSectionRef
}: {
  addSectionRef: (index: number) => (el: HTMLElement | null) => void;
}) => {
  return <section ref={addSectionRef(6)} className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white border-t border-white/5 overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          CYRUS é para quem quer executar. Não pedir desculpas.
        </h2>
        
        <p className="text-xl mb-12 text-gray-300">Acesso completo por R$0,99 enquanto o lote promocional estiver ativo.</p>
        
        <Link to="/cadastro">
          <Button variant="cyrusPrimary" size="cyrus" className="text-base py-[13px] px-[28px] transform hover:scale-105 transition-all duration-300">
            Entrar agora — uma semana por R$0,99
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>
        
        <p className="text-center text-sm text-gray-400 mt-4">
          Disponível enquanto o lote promocional estiver aberto.
        </p>
        
        {/* Quote section with enhanced styling */}
        
      </div>
      
      {/* Enhanced background effects with subtle purple animations */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#8E24AA]/10 filter blur-[100px] pointer-events-none animate-pulse" style={{
      animationDuration: '10s'
    }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(142,36,170,0.2),transparent_70%)]"></div>
      
      {/* Additional subtle purple animations */}
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#9b87f5]/5 rounded-full filter blur-[90px] animate-pulse" style={{
      animationDuration: '15s'
    }}></div>
      <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-[#7E69AB]/5 rounded-full filter blur-[70px] animate-pulse" style={{
      animationDuration: '12s'
    }}></div>
    </section>;
};
export default ClosingSection;
