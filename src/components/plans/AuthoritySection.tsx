
import { useState, useEffect } from "react";
import { CheckCircle, Users, Award, Zap } from "lucide-react";

const AuthoritySection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Confiança comprovada",
      description: "Milhares de profissionais executando com nossa plataforma diariamente."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Qualidade premium",
      description: "Ferramentas de alta performance testadas e validadas."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Resultados imediatos",
      description: "Acesso instantâneo após a compra, sem tempo de espera."
    }
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white">
      {/* Background effects identical to home */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8E24AA]/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A64EFF]/20 rounded-full filter blur-[60px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight tracking-tight text-white max-w-[800px] mx-auto">
              A plataforma que <span className="text-[#B388FF]">profissionais escolhem</span>.
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Quando a execução não pode falhar, escolha ferramentas que entregam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm hover:border-[#8E24AA]/40 transition-all duration-300"
              >
                <div className="mb-6 mx-auto w-16 h-16 bg-[#8E24AA]/20 rounded-full flex items-center justify-center">
                  <div className="text-[#B388FF]">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8E24AA]/20 to-transparent rounded-full border border-[#8E24AA]/30 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-[#B388FF]" />
              <span className="text-white font-medium">
                Infraestrutura sólida. Acesso garantido. Resultados consistentes.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthoritySection;
