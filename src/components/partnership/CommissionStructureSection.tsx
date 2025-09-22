import { useState } from "react";
import { Calculator, DollarSign, TrendingUp, Gift, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionContainer from "@/components/shared/SectionContainer";
const CommissionStructureSection = () => {
  const [referrals, setReferrals] = useState(10);
  const monthlyCommission = referrals * 29.7 * 0.3; // 30% de R$ 29,70
  const yearlyCommission = monthlyCommission * 12;
  const commissionTiers = [{
    tier: "Iniciante",
    range: "1-9 indicações",
    commission: "30%",
    bonus: "Kit inicial",
    color: "text-[#B388FF]"
  }, {
    tier: "Profissional",
    range: "10-24 indicações",
    commission: "30% + 5%",
    bonus: "Bônus performance",
    color: "text-[#B388FF]"
  }, {
    tier: "Elite",
    range: "25+ indicações",
    commission: "30% + 10%",
    bonus: "Participação nos lucros",
    color: "text-[#B388FF]"
  }];
  const competitorComparison = [{
    platform: "CYRUS",
    commission: "30%",
    payment: "7 dias",
    support: "Premium"
  }, {
    platform: "Concorrente A",
    commission: "20%",
    payment: "30 dias",
    support: "Básico"
  }, {
    platform: "Concorrente B",
    commission: "15%",
    payment: "45 dias",
    support: "Email"
  }, {
    platform: "Concorrente C",
    commission: "25%",
    payment: "60 dias",
    support: "FAQ"
  }];
  return <SectionContainer spacing="lg" background="gradient-primary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
            <DollarSign className="w-4 h-4 text-[#B388FF] mr-2" />
            <span className="text-sm font-medium text-white">Estrutura de Ganhos</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            <span className="text-[#B388FF]">30% de comissão</span> recorrente vitalícia
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A estrutura de comissões mais generosa do mercado. Transparente, justa e desenhada para o seu sucesso de longo prazo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Calculadora Interativa */}
          <div className="bg-black/40 backdrop-blur-sm border border-[#B388FF]/30 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <Calculator className="h-8 w-8 text-[#B388FF] mr-3" />
              <h3 className="text-2xl font-bold text-white">Simule seus Ganhos</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantos assinantes você pretende indicar por mês?
                </label>
                <Input type="number" value={referrals} onChange={e => setReferrals(Number(e.target.value))} className="bg-black/60 border-[#B388FF]/30 text-white" min="1" max="1000" />
              </div>
              
              <div className="bg-[#B388FF]/10 rounded-xl p-6 border border-[#B388FF]/20">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Ganho Mensal</div>
                    <div className="text-3xl font-bold text-[#B388FF]">
                      R$ {monthlyCommission.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Ganho Anual</div>
                    <div className="text-3xl font-bold text-[#B388FF]">
                      R$ {yearlyCommission.toFixed(0)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#B388FF]/20">
                  <div className="text-sm text-gray-300 text-center">
                    Base: R$ 29,70/mês por assinante • Comissão: 30% vitalícia
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tiers de Comissão */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Crown className="h-6 w-6 text-[#B388FF] mr-3" />
              Níveis de Parceria
            </h3>
            
            <div className="space-y-4">
              {commissionTiers.map((tier, index) => <div key={index} className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-xl p-6 hover:border-[#B388FF]/40 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className={`text-xl font-bold ${tier.color}`}>{tier.tier}</h4>
                      <p className="text-gray-400 text-sm">{tier.range}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{tier.commission}</div>
                      <div className="text-sm text-gray-400">comissão</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-300">
                    <Gift className="h-4 w-4 mr-2" />
                    <span>{tier.bonus}</span>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Comparação com Concorrentes */}
        

        {/* Garantias */}
        
      </div>
    </SectionContainer>;
};
export default CommissionStructureSection;