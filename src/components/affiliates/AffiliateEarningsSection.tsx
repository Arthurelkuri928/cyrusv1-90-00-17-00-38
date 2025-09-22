
import { useState } from "react";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/shared/SectionContainer";

const AffiliateEarningsSection = () => {
  const [referrals, setReferrals] = useState(10);
  
  // Comissões baseadas em 30% dos planos
  const planCommissions = {
    basic: { price: 47, commission: 14.10 },
    pro: { price: 97, commission: 29.10 },
    elite: { price: 197, commission: 59.10 }
  };

  const monthlyEarnings = referrals * planCommissions.pro.commission; // Base no plano profissional
  const yearlyEarnings = monthlyEarnings * 12;

  const projectionExamples = [
    { sales: 5, monthly: 5 * planCommissions.pro.commission, yearly: 5 * planCommissions.pro.commission * 12 },
    { sales: 20, monthly: 20 * planCommissions.pro.commission, yearly: 20 * planCommissions.pro.commission * 12 },
    { sales: 50, monthly: 50 * planCommissions.pro.commission, yearly: 50 * planCommissions.pro.commission * 12 }
  ];

  return (
    <SectionContainer spacing="lg" background="gradient-primary">
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
          <Calculator className="w-4 h-4 text-[#B388FF] mr-2" />
          <span className="text-sm font-medium text-white">Potencial de Ganhos</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Quanto você pode <span className="text-[#B388FF]">ganhar?</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Calcule seu potencial de renda com nossa calculadora interativa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Calculadora Interativa */}
        <div className="bg-black/40 backdrop-blur-sm border border-[#B388FF]/30 rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <Calculator className="h-8 w-8 text-[#B388FF] mr-3" />
            <h3 className="text-2xl font-bold text-white">Simulador de Ganhos</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Quantas vendas você pretende fazer por mês?
              </label>
              <Input 
                type="number" 
                value={referrals} 
                onChange={(e) => setReferrals(Math.max(1, Number(e.target.value)))}
                className="bg-black/60 border-[#B388FF]/30 text-white text-lg py-3"
                min="1" 
                max="1000"
              />
            </div>
            
            <div className="bg-gradient-to-r from-[#B388FF]/10 to-[#8E24AA]/10 rounded-xl p-6 border border-[#B388FF]/20">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Ganho Mensal</div>
                  <div className="text-3xl font-bold text-[#B388FF]">
                    R$ {monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Ganho Anual</div>
                  <div className="text-3xl font-bold text-[#B388FF]">
                    R$ {yearlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#B388FF]/20">
                <div className="text-sm text-gray-300 text-center">
                  Base: Plano Profissional R$ 97/mês • Comissão: 30% vitalícia
                </div>
              </div>
            </div>

            <Button 
              onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-gradient-to-r from-[#B388FF] to-[#8E24AA] hover:from-[#8E24AA] hover:to-[#B388FF] text-white py-3 text-lg font-bold"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Quero Começar a Ganhar
            </Button>
          </div>
        </div>

        {/* Projeções de Exemplo */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 text-[#B388FF] mr-3" />
            Exemplos Reais de Ganhos
          </h3>
          
          <div className="space-y-4 mb-8">
            {projectionExamples.map((example, index) => (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-xl p-6 hover:border-[#B388FF]/40 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white">{example.sales} vendas/mês</h4>
                    <p className="text-gray-400 text-sm">Cenário {index === 0 ? 'Conservador' : index === 1 ? 'Moderado' : 'Otimista'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#B388FF]">
                      R$ {example.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm text-gray-400">por mês</div>
                  </div>
                </div>
                
                <div className="bg-[#B388FF]/10 rounded-lg p-3">
                  <div className="text-center">
                    <span className="text-gray-300 text-sm">Ganho anual: </span>
                    <span className="text-[#B388FF] font-bold">
                      R$ {example.yearly.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estrutura de Comissões */}
          <div className="bg-gradient-to-r from-[#B388FF]/10 to-[#8E24AA]/10 border border-[#B388FF]/30 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-4">Estrutura de Comissões</h4>
            
            <div className="space-y-3">
              {Object.entries(planCommissions).map(([key, plan]) => (
                <div key={key} className="flex justify-between items-center bg-black/40 rounded-lg p-3">
                  <div>
                    <div className="text-white font-semibold capitalize">
                      Plano {key === 'basic' ? 'Básico' : key === 'pro' ? 'Profissional' : 'Elite'}
                    </div>
                    <div className="text-gray-400 text-sm">R$ {plan.price}/mês</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#B388FF] font-bold">R$ {plan.commission.toFixed(2)}</div>
                    <div className="text-gray-400 text-xs">30% comissão</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Legal */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm max-w-3xl mx-auto">
          * Valores estimados com base em comissão de 30% por assinatura ativa. 
          Resultados podem variar conforme estratégia de divulgação e engajamento da audiência.
        </p>
      </div>
    </SectionContainer>
  );
};

export default AffiliateEarningsSection;
