import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
const FinalCTASection = () => {
  return <SectionContainer spacing="xl" background="transparent" className="relative overflow-hidden">
      {/* Background Effects - Smoother gradient */}
      
      

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Better organized title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#B388FF] to-white">
          Sua audiência já confia em você.
        </h2>
        
        <p className="text-2xl md:text-3xl font-bold mb-8 text-[#B388FF]">
          Agora monetize essa confiança.
        </p>
        
        <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Você construiu sua autoridade com muito trabalho. Chegou a hora de colher os frutos com um parceiro que está à altura do seu profissionalismo.
        </p>

        {/* Main CTA */}
        <div className="mb-8">
          <Button variant="cyrusPrimary" size="cyrus" onClick={() => document.getElementById('formulario')?.scrollIntoView({
          behavior: 'smooth'
        })} className="px-8 py-4 text-lg font-semibold hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-[#B388FF]/30">
            Candidatar-se ao Programa Exclusivo
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>

        <p className="text-gray-400 italic text-sm max-w-xl mx-auto">
          Disponível enquanto o programa exclusivo estiver aberto.
        </p>
      </div>
      
      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
    </SectionContainer>;
};
export default FinalCTASection;