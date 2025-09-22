
import { Users, Link as LinkIcon, Smartphone, DollarSign, BarChart3, Crown } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Candidatura Seletiva",
      description: "Preenchimento do formulário + análise do perfil pela nossa equipe",
      icon: Users,
      details: "Avaliamos: audiência, engajamento, alinhamento com nossa marca"
    },
    {
      step: "02", 
      title: "Onboarding Premium",
      description: "Treinamento exclusivo + acesso ao painel personalizado",
      icon: Crown,
      details: "Materiais únicos, estratégias de conversão e suporte dedicado"
    },
    {
      step: "03",
      title: "Link Inteligente",
      description: "Recebe link exclusivo com tracking avançado e materiais de apoio",
      icon: LinkIcon,
      details: "Analytics em tempo real, materiais prontos e criativos exclusivos"
    },
    {
      step: "04",
      title: "Estratégia de Divulgação",
      description: "Implementa nossa metodologia comprovada com suporte contínuo",
      icon: Smartphone,
      details: "Templates, scripts, calendário de posts e mentoria ativa"
    },
    {
      step: "05",
      title: "Monitoramento Ativo",
      description: "Acompanha performance e otimiza resultados em tempo real",
      icon: BarChart3,
      details: "Dashboard avançado, relatórios detalhados e insights exclusivos"
    },
    {
      step: "06",
      title: "Pagamentos Garantidos",
      description: "Recebe comissões recorrentes todo dia 15 via Pix",
      icon: DollarSign,
      details: "30% de comissão vitalícia + bônus por performance"
    }
  ];

  return (
    <SectionContainer id="como-funciona" spacing="lg" background="border-top">
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
          <BarChart3 className="w-4 h-4 text-[#B388FF] mr-2" />
          <span className="text-sm font-medium text-white">Processo Estratégico</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Como transformar sua influência em <span className="text-[#B388FF]">renda recorrente?</span>
        </h2>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          6 etapas estratégicas para construir um negócio sólido e lucrativo como parceiro CYRUS
        </p>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-6 hover:border-[#B388FF]/40 transition-all duration-300 group hover:scale-105"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-[#B388FF] to-[#8E24AA] rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg">
                {step.step}
              </div>
              
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#B388FF]/5 to-[#8E24AA]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="bg-black/60 rounded-xl p-4 mb-4 inline-block group-hover:bg-[#8E24AA]/20 transition-all duration-300">
                  <step.icon className="h-8 w-8 text-[#B388FF] group-hover:text-[#B388FF] transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400 mb-4">{step.description}</p>
                
                {/* Additional Details */}
                <div className="bg-[#8E24AA]/10 rounded-lg p-3 border border-[#8E24AA]/20">
                  <p className="text-sm text-gray-300 italic">{step.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Timeline */}
        <div className="mt-16 bg-gradient-to-r from-[#B388FF]/10 to-[#8E24AA]/10 border border-[#B388FF]/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Timeline de Sucesso Típica</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { period: "Semana 1", result: "Setup completo + primeiros cliques" },
              { period: "Mês 1", result: "Primeiras conversões + R$ 500-1.500" },
              { period: "Mês 3", result: "Fluxo otimizado + R$ 2.000-5.000" },
              { period: "Mês 6+", result: "Renda consolidada + R$ 5.000+" }
            ].map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#B388FF]/20 rounded-full flex items-center justify-center text-[#B388FF] font-bold text-lg mx-auto mb-3">
                  {index + 1}
                </div>
                <div className="font-semibold text-white mb-2">{milestone.period}</div>
                <div className="text-sm text-gray-400">{milestone.result}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default HowItWorksSection;
