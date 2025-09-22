
import { CheckCircle } from "lucide-react";

const ExperienceSection = ({
  addSectionRef
}: {
  addSectionRef: (index: number) => (el: HTMLElement | null) => void;
}) => {
  const steps = [{
    number: "01",
    title: "Acesso imediato",
    description: "Clique, entre, use. Sem camadas inúteis."
  }, {
    number: "02",
    title: "Organização por áreas",
    description: "Você sabe onde tudo está. E por quê."
  }, {
    number: "03",
    title: "Atualizações frequentes",
    description: "Ferramentas novas adicionadas por demanda real."
  }];
  
  const features = ["Interface escura, fluida e moderna", "Cards otimizados por área funcional", "Mais de 40 ferramentas críticas prontas para uso", "Histórico técnico, atualizações visíveis"];
  
  return (
    <section ref={addSectionRef(3)} className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          A Experiência Real de Uso
        </h2>
        
        <p className="text-xl text-center text-gray-300 mb-16 max-w-2xl mx-auto">
          Não é sobre 'ter acesso'. É sobre nunca precisar pensar nisso.
        </p>
        
        {/* Steps - Horizontal Layout */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines - Only visible on desktop */}
            <div className="hidden md:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8E24AA]/30 to-transparent z-0"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="w-14 h-14 rounded-full bg-[#8E24AA]/20 flex items-center justify-center text-xl font-bold text-[#B388FF] border border-[#8E24AA]/30 mb-6 relative bg-black">
                  <div className="absolute inset-0 rounded-full bg-[#8E24AA]/10 animate-pulse"></div>
                  <span className="relative z-10">{step.number}</span>
                </div>
                
                {/* Step Content */}
                <div className="max-w-xs">
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-16 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-6 text-left">Características da Plataforma</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="text-[#8E24AA] h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-gray-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background pattern with subtle purple animations */}
      <div className="absolute top-0 left-0 w-full h-full tech-grid opacity-10"></div>
      
      {/* Animated purple background elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8E24AA]/5 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#9b87f5]/5 rounded-full filter blur-[80px] animate-pulse" style={{
        animationDuration: '8s'
      }}></div>
      <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-[#7E69AB]/5 rounded-full filter blur-[90px] animate-pulse" style={{
        animationDuration: '12s'
      }}></div>
      
      {/* Additional subtle animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-transparent opacity-20 animate-gradient-flow"></div>
    </section>
  );
};

export default ExperienceSection;
