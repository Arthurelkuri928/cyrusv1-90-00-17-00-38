
import { useState, useEffect } from "react";
import { Clock, Users, AlertTriangle, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/shared/SectionContainer";

const UrgencyScarcitySection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  const [spotsLeft, setSpotsLeft] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        let newDays = prev.days;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes--;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours--;
        }
        if (newHours < 0) {
          newHours = 23;
          newDays--;
        }

        return { days: newDays, hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const spotsInterval = setInterval(() => {
      if (Math.random() > 0.7 && spotsLeft > 3) {
        setSpotsLeft(prev => prev - 1);
      }
    }, 45000);

    return () => clearInterval(spotsInterval);
  }, [spotsLeft]);

  return (
    <SectionContainer spacing="lg" background="gradient-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-red-500/10 border border-red-500/30 rounded-full px-6 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-sm font-medium text-white">Vagas Limitadas</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Última turma de <span className="text-[#B388FF]">parceiros 2024</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Para manter a qualidade do programa e garantir atenção individual, limitamos a 25 novos parceiros por mês.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Countdown */}
          <div className="bg-black/60 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
            <div className="text-center mb-8">
              <Clock className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Inscrições encerram em:
              </h3>
              <p className="text-gray-400">Para a turma de dezembro</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { value: timeLeft.days, label: "Dias" },
                { value: timeLeft.hours, label: "Horas" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Seg" }
              ].map((time, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-4 text-center"
                >
                  <div className="text-3xl font-bold text-white mb-1">
                    {time.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-400">{time.label}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <p className="text-red-400 font-semibold">
                ⚠️ Após esse prazo, próximas vagas apenas em janeiro/2025
              </p>
            </div>
          </div>

          {/* Spots Left */}
          <div>
            <div className="bg-black/60 backdrop-blur-sm border border-[#B388FF]/30 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Vagas Restantes</h3>
                  <p className="text-gray-400">De 25 vagas disponíveis</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-[#B388FF]">{spotsLeft}</div>
                  <div className="text-sm text-gray-400">restantes</div>
                </div>
              </div>
              
              <div className="bg-black/40 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-red-500 to-[#B388FF] h-4 rounded-full transition-all duration-300"
                  style={{ width: `${((25 - spotsLeft) / 25) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                {25 - spotsLeft} de 25 vagas preenchidas
              </div>
            </div>

            {/* Benefits Recap */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                <Star className="h-5 w-5 text-[#B388FF] mr-2" />
                O que você garante hoje:
              </h4>
              
              {[
                "30% de comissão vitalícia",
                "Kit premium de materiais",
                "Treinamento exclusivo",
                "Suporte dedicado VIP",
                "Acesso à comunidade privada"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-[#B388FF] rounded-full mr-3 flex-shrink-0"></div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-lg p-4">
              <div className="flex items-center text-[#B388FF] mb-2">
                <Zap className="h-4 w-4 mr-2" />
                <span className="font-semibold">Garantia Especial</span>
              </div>
              <p className="text-sm text-gray-300">
                Primeiros 10 aprovados recebem mentoria individual de 1h com nosso CEO
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button 
            variant="cyrusPrimary" 
            size="cyrus"
            className="text-xl py-6 px-12 animate-pulse"
            onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Garantir Minha Vaga Agora
            <AlertTriangle className="ml-2 h-6 w-6" />
          </Button>
          
          <p className="text-center text-gray-400 mt-4 text-sm">
            Última chance • Sem renovação automática • 100% gratuito
          </p>
        </div>
      </div>
    </SectionContainer>
  );
};

export default UrgencyScarcitySection;
