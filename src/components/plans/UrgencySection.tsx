
import { useState, useEffect } from "react";
import { Clock, TrendingUp, AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UrgencySectionProps {
  onScrollToPlans: () => void;
}

const UrgencySection = ({ onScrollToPlans }: UrgencySectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const urgencyItems = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Preços em alta",
      description: "Os valores atuais são promocionais. Novos usuários pagam mais."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Vagas limitadas",
      description: "Mantemos um número controlado de usuários para garantir qualidade."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Ativação imediata",
      description: "Sua conta é liberada em menos de 2 minutos após o pagamento."
    }
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Momento ideal para decidir
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Condições especiais disponíveis por tempo limitado
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {urgencyItems.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#8E24AA] to-[#A64EFF] rounded-full flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="cyrusPrimary" 
              size="cyrus"
              onClick={onScrollToPlans}
              className="hover:scale-[1.02] transition-transform"
            >
              Escolher meu plano agora
            </Button>
          </div>
        </div>
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#8E24AA]/15 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#A64EFF]/15 rounded-full filter blur-[80px]"></div>
      </div>
    </section>
  );
};

export default UrgencySection;
