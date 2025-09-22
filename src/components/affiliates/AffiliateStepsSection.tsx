import { UserPlus, Link, Share2, DollarSign } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
const AffiliateStepsSection = () => {
  const steps = [{
    number: "01",
    icon: <UserPlus className="h-8 w-8 text-white" />,
    title: "Cadastre-se Gratuitamente",
    description: "Preencha o formulário e seja aprovado em até 24h. Processo 100% digital e sem custos.",
    time: "2 minutos"
  }, {
    number: "02",
    icon: <Link className="h-8 w-8 text-white" />,
    title: "Receba seu Link Exclusivo",
    description: "Acesse seu painel personalizado com link de rastreamento e materiais promocionais prontos.",
    time: "Instantâneo"
  }, {
    number: "03",
    icon: <Share2 className="h-8 w-8 text-white" />,
    title: "Divulgue para sua Audiência",
    description: "Use nossos materiais otimizados ou crie os seus. Compartilhe nas suas redes e canais.",
    time: "Quando quiser"
  }, {
    number: "04",
    icon: <DollarSign className="h-8 w-8 text-white" />,
    title: "Ganhe Comissão por Cada Venda",
    description: "Receba 30% de comissão vitalícia. Pagamentos automáticos toda sexta-feira via Pix.",
    time: "Para sempre"
  }];
  return <SectionContainer id="como-funciona" spacing="lg" background="border-top">
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
          <Share2 className="w-4 h-4 text-[#B388FF] mr-2" />
          <span className="text-sm font-medium text-white">Processo Simples</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Como <span className="text-[#B388FF]">Funciona</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          4 passos simples para começar a ganhar comissões recorrentes hoje mesmo
        </p>
      </div>

      {/* Steps Grid - Desktop */}
      <div className="hidden md:grid grid-cols-4 gap-8 relative">
        {/* Connection Line */}
        <div className="absolute top-16 left-20 right-20 h-0.5 bg-gradient-to-r from-[#B388FF] to-[#8E24AA] z-0"></div>
        
        {steps.map((step, index) => <div key={index} className="relative z-10">
            {/* Step Circle */}
            <div className="w-16 h-16 bg-gradient-to-r from-[#B388FF] to-[#8E24AA] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg">
              {step.number}
            </div>
            
            {/* Step Content */}
            <div className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-xl p-6 text-center hover:border-[#B388FF]/40 transition-all duration-300">
              <div className="bg-[#8E24AA]/20 rounded-lg p-3 mb-4 inline-block">
                {step.icon}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{step.description}</p>
              
              <div className="inline-flex items-center bg-[#B388FF]/10 rounded-full px-3 py-1">
                <span className="text-[#B388FF] text-xs font-semibold">{step.time}</span>
              </div>
            </div>
          </div>)}
      </div>

      {/* Steps List - Mobile */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => <div key={index} className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#B388FF] to-[#8E24AA] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {step.number}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                
                <div className="inline-flex items-center bg-[#B388FF]/10 rounded-full px-3 py-1">
                  <span className="text-[#B388FF] text-xs font-semibold">{step.time}</span>
                </div>
              </div>
            </div>
          </div>)}
      </div>

      {/* Success Rate */}
      
    </SectionContainer>;
};
export default AffiliateStepsSection;