
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
const OfferSection = ({
  addSectionRef
}: {
  addSectionRef: (index: number) => (el: HTMLElement | null) => void;
}) => {
  const benefits = ["Sem limitação técnica", "Sem cobrança automática", "Sem renovação forçada"];
  return <section ref={addSectionRef(4)} className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white border-t border-white/5">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Teste agora com acesso total por apenas <span className="text-[#B388FF]">R$0,99</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {benefits.map((benefit, index) => <div key={index} className="flex items-center px-4 py-2 bg-white/5 rounded-full">
                <CheckCircle className="h-4 w-4 text-[#8E24AA] mr-2" />
                <span className="text-gray-300 text-sm">{benefit}</span>
              </div>)}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#8E24AA]/20 to-transparent p-8 rounded-2xl border border-[#8E24AA]/30 backdrop-blur-sm">
          <div className="text-center mb-8">
            <p className="text-xl text-gray-200 mb-4">
              Você não precisa confiar em marketing.
            </p>
            <p className="text-xl text-gray-200">
              Precisa testar — e ver com seus próprios olhos.
            </p>
          </div>
          
          <Link to="/cadastro">
            <Button variant="default" size="lg" className="w-full py-7 text-lg font-medium bg-gradient-to-r from-[#8E24AA] to-[#A64EFF] hover:shadow-lg hover:shadow-[#8E24AA]/30 transition-all duration-300">
              Testar Agora por R$0,99
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
          
          <p className="text-center text-sm text-gray-400 mt-4">
            Cancele quando quiser. Ou fique por saber que achou a plataforma certa.
          </p>
        </div>
        
        {/* Sticky mobile CTA - Ajustado tamanho para a versão mobile */}
        <div className="md:hidden fixed bottom-4 inset-x-4 z-50">
          <Link to="/cadastro">
            <Button variant="default" size="lg" className="w-full py-2 px-4 text-base bg-gradient-to-r from-[#8E24AA] to-[#A64EFF] shadow-lg">
              <span>Testar por R$0,99</span>
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(142,36,170,0.15),transparent_70%)]"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#8E24AA]/5 filter blur-3xl pointer-events-none"></div>
    </section>;
};
export default OfferSection;
