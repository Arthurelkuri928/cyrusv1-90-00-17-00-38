
import { useState, useEffect } from "react";
import { Shield, Lock, CreditCard, Users, CheckCircle } from "lucide-react";

const SecurityGuarantee = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const guarantees = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "99.9% de Uptime",
      description: "Garantia de disponibilidade. Sua operação nunca para."
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Dados Seguros",
      description: "Criptografia de nível bancário. Privacidade total."
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Pagamento Protegido",
      description: "Transações seguras com certificação SSL."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Suporte Especializado",
      description: "Atendimento por pessoas que realmente entendem."
    }
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Segurança e Confiabilidade
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Sua operação protegida com os mais altos padrões de segurança
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#8E24AA] to-[#A64EFF] rounded-full flex items-center justify-center text-white">
                  {guarantee.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">{guarantee.title}</h3>
                <p className="text-gray-300 text-sm">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-10 w-80 h-80 bg-[#8E24AA]/15 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-[#A64EFF]/15 rounded-full filter blur-[80px]"></div>
      </div>
    </section>
  );
};

export default SecurityGuarantee;
