
import { Server, Layout, Shield, Clock, Code, Users } from "lucide-react";

const PhilosophySection = ({ addSectionRef }: { addSectionRef: (index: number) => (el: HTMLElement | null) => void }) => {
  const features = [
    {
      icon: <Server className="h-6 w-6 text-[#B388FF]" />,
      title: "Arquitetura sólida",
      description: "Nada falha. Nada reinicia. Nada depende da sorte."
    },
    {
      icon: <Clock className="h-6 w-6 text-[#B388FF]" />,
      title: "Monitoramento 24h",
      description: "Nossa equipe acompanha o funcionamento em tempo real."
    },
    {
      icon: <Shield className="h-6 w-6 text-[#B388FF]" />,
      title: "Redundância de acesso",
      description: "Mesmo se um servidor cair, você continua rodando."
    },
    {
      icon: <Layout className="h-6 w-6 text-[#B388FF]" />,
      title: "Áreas por função",
      description: "Copy, IA, tráfego, criativos, análise — tudo separado, claro e rápido."
    },
    {
      icon: <Users className="h-6 w-6 text-[#B388FF]" />,
      title: "Suporte que resolve",
      description: "Você não abre ticket. Você soluciona."
    },
    {
      icon: <Code className="h-6 w-6 text-[#B388FF]" />,
      title: "Interface profissional",
      description: "Design que não distrai. Foco total na execução."
    }
  ];

  return (
    <section 
      ref={addSectionRef(2)}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Filosofia CYRUS
          </h2>
          <div className="h-[1px] w-48 mx-auto bg-gradient-to-r from-transparent via-[#8E24AA] to-transparent"></div>
          <p className="text-xl mt-6 text-gray-300 max-w-2xl mx-auto">
            A base técnica que você esperava. Finalmente executada com rigor.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:border-[#8E24AA]/50 hover:bg-[#8E24AA]/5 group"
            >
              <div className="bg-white/5 p-3 rounded-lg mb-4 inline-block group-hover:bg-[#8E24AA]/20 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-black/95"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-[#8E24AA]/5 rounded-full filter blur-[100px]"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#B388FF]/5 rounded-full filter blur-[80px]"></div>
    </section>
  );
};

export default PhilosophySection;
