import { DollarSign, Link, Users, Zap } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
const AffiliateBenefitsSection = () => {
  const benefits = [{
    icon: <DollarSign className="h-8 w-8 text-[#B388FF]" />,
    title: "Ganhos Recorrentes",
    description: "Receba comissão enquanto o cliente mantiver a assinatura. Renda que cresce automaticamente.",
    highlight: "30% vitalício"
  }, {
    icon: <Link className="h-8 w-8 text-[#8E24AA]" />,
    title: "Link Exclusivo",
    description: "Acompanhe todos os seus resultados em tempo real através do seu painel personalizado.",
    highlight: "Analytics avançado"
  }, {
    icon: <Users className="h-8 w-8 text-[#B388FF]" />,
    title: "Suporte Completo",
    description: "Materiais, criativos, treinamentos e acompanhamento dedicado para maximizar suas vendas.",
    highlight: "Suporte VIP"
  }, {
    icon: <Zap className="h-8 w-8 text-[#8E24AA]" />,
    title: "Zero Burocracia",
    description: "Comece hoje mesmo, sem custo de entrada. Aprovação rápida e processo 100% digital.",
    highlight: "Início imediato"
  }];
  return <SectionContainer spacing="lg" background="gradient-secondary">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Por que ser um <span className="text-[#B388FF]">Afiliado CYRUS?</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Oferecemos as melhores condições do mercado para você monetizar sua audiência com tranquilidade e resultados garantidos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => <div key={index} className="relative bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-6 hover:border-[#B388FF]/40 transition-all duration-300 group hover:scale-105">
            {/* Highlight Badge */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#B388FF] to-[#8E24AA] text-white text-xs px-3 py-1 rounded-full font-bold">
              {benefit.highlight}
            </div>

            {/* Hover Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#B388FF]/5 to-[#8E24AA]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="bg-black/60 rounded-xl p-4 mb-4 inline-block">
                {benefit.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          </div>)}
      </div>

      {/* Additional Value Props */}
      
    </SectionContainer>;
};
export default AffiliateBenefitsSection;