
import { Shield, Award, TrendingUp, Clock, CheckCircle, Star } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";

const PartnershipAuthoritySection = () => {
  const achievements = [
    {
      icon: <Award className="h-8 w-8 text-[#B388FF]" />,
      title: "Plataforma #1 em Retenção",
      description: "87% dos assinantes renovam automaticamente",
      metric: "87%"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-[#A64EFF]" />,
      title: "Crescimento Explosivo",
      description: "400% de crescimento nos últimos 12 meses",
      metric: "400%"
    },
    {
      icon: <Shield className="h-8 w-8 text-[#B388FF]" />,
      title: "Infraestrutura Premium",
      description: "99.9% de uptime garantido",
      metric: "99.9%"
    },
    {
      icon: <Clock className="h-8 w-8 text-[#A64EFF]" />,
      title: "3 Anos de Mercado",
      description: "Experiência comprovada e sólida",
      metric: "2021"
    }
  ];

  return (
    <SectionContainer spacing="lg" background="border-top">
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
          <Star className="w-4 h-4 text-[#B388FF] mr-2" />
          <span className="text-sm font-medium text-white">Reconhecida pela Indústria</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Por que os <span className="text-[#B388FF]">melhores influenciadores</span> escolhem CYRUS?
        </h2>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Não somos mais uma plataforma qualquer. Somos a escolha de profissionais que levam seus negócios a sério.
        </p>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className="relative bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-6 text-center hover:border-[#B388FF]/40 transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#B388FF]/5 to-[#A64EFF]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="bg-black/60 rounded-xl p-4 mb-4 inline-block">
                {achievement.icon}
              </div>
              
              <div className="text-4xl font-bold text-[#B388FF] mb-2">
                {achievement.metric}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">
                {achievement.title}
              </h3>
              
              <p className="text-gray-400 text-sm">
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default PartnershipAuthoritySection;
