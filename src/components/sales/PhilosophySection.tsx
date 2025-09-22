
import { Clock, Shield, Layout, Code, Server } from "lucide-react";

const PhilosophySection = ({ addSectionRef }: { addSectionRef: (index: number) => (el: HTMLElement | null) => void }) => {
  const features = [
    {
      icon: <Server className="h-8 w-8 text-[#304FFE]" />,
      title: "Arquitetura proprietária",
      description: "Estabilidade 24h sem quedas ou interrupções."
    },
    {
      icon: <Layout className="h-8 w-8 text-[#8E24AA]" />,
      title: "Fluxos claros",
      description: "Interface intuitiva, sem fricção operacional."
    },
    {
      icon: <Code className="h-8 w-8 text-[#304FFE]" />,
      title: "Acesso por área",
      description: "Copy, tráfego, AI, criativos em áreas separadas."
    },
    {
      icon: <Shield className="h-8 w-8 text-[#8E24AA]" />,
      title: "Redundância técnica",
      description: "Sistemas duplicados para garantia de acesso."
    },
    {
      icon: <Clock className="h-8 w-8 text-[#304FFE]" />,
      title: "Suporte especializado",
      description: "Atendimento feito por quem entende."
    }
  ];

  return (
    <section 
      ref={addSectionRef(2)}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0A0F1C] via-[#111827] to-[#151F38] text-white overflow-hidden"
    >
      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 inline-block">
            A Filosofia CYRUS: Silêncio Operacional
          </h2>
          <div className="h-[1px] w-48 mx-auto bg-gradient-to-r from-transparent via-[#8E24AA] to-transparent mt-4"></div>
          <p className="text-xl mt-6 text-gray-300 max-w-2xl mx-auto">
            Uma ferramenta bem feita não chama atenção. Ela entrega.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 h-full flex flex-col group transition-all duration-300 hover:border-[#304FFE]/30 hover:shadow-lg hover:shadow-[#304FFE]/10"
            >
              <div className="bg-gradient-to-br from-[#151F38] to-[#111827] p-4 rounded-xl mb-4 inline-flex">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="glass-container p-6 mt-16 max-w-3xl mx-auto">
          <div className="border-l-4 border-[#8E24AA] pl-4">
            <p className="mb-2 italic text-gray-300">Você não perderá tempo consertando o que nunca deveria quebrar.</p>
          </div>
        </div>
      </div>
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#304FFE]/10 to-[#8E24AA]/10 animated-gradient"></div>
      </div>
    </section>
  );
};

export default PhilosophySection;
