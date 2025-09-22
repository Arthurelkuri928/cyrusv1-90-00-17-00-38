
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Target, Shield, Wrench, Headphones, CreditCard } from "lucide-react";

interface DecisionSupportSectionProps {
  onOpenAssistant: () => void;
}

const DecisionSupportSection = ({
  onOpenAssistant
}: DecisionSupportSectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const benefits = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Arquitetura sólida",
      description: "Infraestrutura robusta que garante 99.9% de uptime e performance consistente."
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Catálogo premium (40+)",
      description: "Mais de 40 ferramentas profissionais testadas e validadas por nossa equipe."
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Suporte humano 24/7",
      description: "Atendimento especializado disponível todos os dias, por pessoas que entendem."
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Pagamento seguro",
      description: "Transações protegidas com tecnologia de criptografia de nível bancário."
    }
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white">
      {/* Background effects identical to home */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8E24AA]/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A64EFF]/20 rounded-full filter blur-[60px]"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#B388FF]/10 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="p-6 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:border-[#8E24AA]/50 hover:bg-[#8E24AA]/5 group"
              >
                <div className="bg-white/5 p-3 rounded-lg mb-4 inline-block group-hover:bg-[#8E24AA]/20 transition-all text-[#B388FF]">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-white/5 to-transparent p-12 rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="mx-auto w-20 h-20 bg-[#8E24AA]/20 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="h-10 w-10 text-[#B388FF]" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Ainda em <span className="text-[#B388FF]">dúvida</span>?
                </h3>
                
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Nosso assistente inteligente te ajuda a encontrar o plano perfeito para suas necessidades
                </p>
              </div>
              
              <Button variant="cyrusPrimary" size="cyrus" className="text-lg px-8 py-4" onClick={onOpenAssistant}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar com assistente de planos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DecisionSupportSection;
