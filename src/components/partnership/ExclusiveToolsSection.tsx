
import { FileText, BarChart3, CreditCard, MessageCircle, Download, Zap, Target, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/shared/SectionContainer";

const ExclusiveToolsSection = () => {
  const tools = [
    {
      icon: <FileText className="h-8 w-8 text-[#FFD700]" />,
      title: "Arsenal de Marketing Premium",
      description: "Kit completo com mais de 50 materiais exclusivos",
      items: ["Banners em 12 formatos", "Scripts de conversão", "Posts para redes sociais", "E-books educativos"]
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-[#B388FF]" />,
      title: "Dashboard Inteligente",
      description: "Analytics avançado com insights em tempo real",
      items: ["Métricas detalhadas", "Relatórios automáticos", "Tendências de conversão", "Previsões de ganhos"]
    },
    {
      icon: <Target className="h-8 w-8 text-[#FFD700]" />,
      title: "Treinamentos Exclusivos",
      description: "Masterclasses com estratégias de alta conversão",
      items: ["Webinars semanais", "Casos práticos", "Templates de sucesso", "Mentoria em grupo"]
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-[#B388FF]" />,
      title: "Suporte VIP Dedicado",
      description: "Equipe premium para otimizar seus resultados",
      items: ["WhatsApp direto", "Consultoria estratégica", "Revisão de campanhas", "Resposta em 2h"]
    }
  ];

  return (
    <SectionContainer spacing="lg" background="gradient-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
            <Crown className="w-4 h-4 text-[#B388FF] mr-2" />
            <span className="text-sm font-medium text-white">Arsenal Exclusivo</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            <span className="text-[#FFD700]">Ferramentas premium</span> para seu sucesso
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Não deixamos você sozinho. Tenha acesso a um arsenal completo de recursos exclusivos desenvolvidos pelos nossos especialistas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-8 hover:border-[#FFD700]/40 transition-all duration-300 group"
            >
              <div className="flex items-start gap-6">
                <div className="bg-black/60 rounded-xl p-4 group-hover:bg-[#8E24AA]/20 transition-all duration-300">
                  {tool.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">{tool.title}</h3>
                  <p className="text-gray-400 mb-6">{tool.description}</p>
                  
                  <div className="space-y-2">
                    {tool.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-[#FFD700] rounded-full mr-3 flex-shrink-0"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Download Section */}
        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#B388FF]/10 border border-[#FFD700]/30 rounded-2xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Zap className="h-16 w-16 text-[#FFD700] mx-auto mb-6" />
            
            <h3 className="text-3xl font-bold text-white mb-4">
              Kit de Boas-Vindas Exclusivo
            </h3>
            
            <p className="text-xl text-gray-300 mb-8">
              Assim que for aprovado, receba instantaneamente nosso kit premium com tudo que precisa para começar com o pé direito.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                "Guia de Primeiros Passos",
                "Templates de Alta Conversão", 
                "Scripts Testados e Aprovados"
              ].map((item, index) => (
                <div key={index} className="bg-black/40 rounded-lg p-4 border border-[#FFD700]/20">
                  <Download className="h-6 w-6 text-[#FFD700] mx-auto mb-2" />
                  <p className="text-white font-semibold text-sm">{item}</p>
                </div>
              ))}
            </div>
            
            <Button 
              variant="cyrusPrimary" 
              size="cyrus"
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold border-0"
              onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Quero Acesso aos Materiais
              <Download className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default ExclusiveToolsSection;
