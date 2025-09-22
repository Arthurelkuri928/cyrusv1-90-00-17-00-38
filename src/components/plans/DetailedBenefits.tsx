
import { useState, useEffect } from "react";
import { Check, Star, Shield, Zap } from "lucide-react";

const DetailedBenefits = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const benefits = [
    {
      icon: Star,
      title: "Acesso Total",
      description: "Todas as ferramentas premium disponíveis sem restrições"
    },
    {
      icon: Shield,
      title: "Segurança Garantida",
      description: "Dados protegidos com criptografia de nível empresarial"
    },
    {
      icon: Zap,
      title: "Performance Máxima",
      description: "Ferramentas otimizadas para máxima velocidade e eficiência"
    }
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Por que escolher a CYRUS?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Mais que ferramentas, uma experiência completa pensada para profissionais exigentes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#8E24AA] to-[#A64EFF] rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8E24AA]/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A64EFF]/20 rounded-full filter blur-[60px]"></div>
      </div>
    </section>
  );
};

export default DetailedBenefits;
