
import { Handshake, Target, Zap, Shield, Heart, Crown } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";

const PartnershipPhilosophySection = () => {
  const philosophyPillars = [
    {
      icon: <Crown className="h-8 w-8 text-[#B388FF]" />,
      title: "Você é nosso embaixador, não um vendedor",
      description: "Tratamos você como parceiro estratégico da marca CYRUS"
    },
    {
      icon: <Shield className="h-8 w-8 text-[#A64EFF]" />,
      title: "Sua reputação é sagrada",
      description: "Produtos premium que você indicará com orgulho"
    },
    {
      icon: <Zap className="h-8 w-8 text-[#B388FF]" />,
      title: "Transparência radical",
      description: "Acesso total a métricas, dados e resultados em tempo real"
    },
    {
      icon: <Heart className="h-8 w-8 text-[#A64EFF]" />,
      title: "Sucesso compartilhado",
      description: "Quando você cresce, nós crescemos junto"
    }
  ];

  return (
    <SectionContainer spacing="lg" background="gradient-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
              <Handshake className="w-4 h-4 text-[#B388FF] mr-2" />
              <span className="text-sm font-medium text-white">Nossa Filosofia</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Parceria CYRUS: <span className="text-[#B388FF]">Sucesso Mútuo</span> Garantido
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Não acreditamos em relacionamentos descartáveis. Construímos parcerias de longo prazo baseadas em respeito mútuo, transparência total e resultados extraordinários.
            </p>

            <div className="space-y-6">
              {philosophyPillars.map((pillar, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="bg-black/40 rounded-xl p-3 group-hover:bg-[#8E24AA]/10 transition-all duration-300">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                    <p className="text-gray-400">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Manifesto Card */}
            <div className="bg-gradient-to-br from-black/80 to-[#8E24AA]/20 border border-[#B388FF]/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-center mb-6">
                <Target className="h-12 w-12 text-[#B388FF] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white">Manifesto do Parceiro CYRUS</h3>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <blockquote className="italic text-lg leading-relaxed">
                  "Acreditamos que influenciadores de verdade merecem parceiros de verdade. 
                  
                  Não queremos apenas suas indicações - queremos construir um império junto com você.
                  
                  Sua audiência confia em você. Nós valorizamos essa confiança tanto quanto você."
                </blockquote>
                
                <div className="pt-4 border-t border-[#B388FF]/20">
                  <div className="text-right">
                    <div className="font-semibold text-[#B388FF]">Equipe CYRUS</div>
                    <div className="text-sm text-gray-400">Fundadores & Partners</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-6 -right-6 bg-black/80 border border-[#A64EFF]/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#A64EFF]">98%</div>
                <div className="text-xs text-gray-400">Satisfação</div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-black/80 border border-[#B388FF]/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#B388FF]">4.9★</div>
                <div className="text-xs text-gray-400">Avaliação</div>
              </div>
            </div>

            {/* Background Effects */}
            <div className="absolute -inset-4 bg-[#B388FF]/5 rounded-3xl filter blur-xl -z-10"></div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default PartnershipPhilosophySection;
