
import { CheckCircle, Clock, Shield, Layout, Code } from "lucide-react";

const ExperienceSection = ({ addSectionRef }: { addSectionRef: (index: number) => (el: HTMLElement | null) => void }) => {
  const experienceItems = [
    {
      icon: <Layout className="h-8 w-8 text-[#304FFE]" />,
      title: "Interface escura, fluida e moderna",
      description: "Design intuitivo com foco em usabilidade e performance."
    },
    {
      icon: <Code className="h-8 w-8 text-[#8E24AA]" />,
      title: "Cards otimizados por área funcional",
      description: "Acesso lógico organizado por necessidades de trabalho."
    },
    {
      icon: <Shield className="h-8 w-8 text-[#304FFE]" />,
      title: "Mais de 30 ferramentas críticas",
      description: "Todo o necessário para operações contínuas."
    },
    {
      icon: <Clock className="h-8 w-8 text-[#8E24AA]" />,
      title: "Histórico técnico, atualizações visíveis",
      description: "Transparência total sobre mudanças e melhorias."
    }
  ];

  return (
    <section 
      ref={addSectionRef(3)}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-[#0A0F1C] text-white"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 text-center">
          A Experiência Real de Uso
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {experienceItems.map((item, index) => (
            <div 
              key={index} 
              className="glass-card p-6 h-full flex items-start space-x-4 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-[#151F38] to-[#111827] p-4 rounded-xl inline-flex flex-shrink-0 group-hover:shadow-md group-hover:shadow-[#304FFE]/20">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center mb-8 p-6 border border-[#304FFE]/20 rounded-xl bg-[#0A0F1C]/80 backdrop-blur-sm max-w-3xl mx-auto">
          <p className="text-xl italic text-center text-gray-300">
            "Te devolvemos o que nunca deveria ser problema: confiança no seu acesso."
            <span className="block mt-4 text-base">Pensada para quem vende, opera e escala com consistência.</span>
          </p>
        </div>
      </div>
      
      {/* Tech-style grid background */}
      <div className="absolute inset-0 tech-grid opacity-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#304FFE]/5 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default ExperienceSection;
