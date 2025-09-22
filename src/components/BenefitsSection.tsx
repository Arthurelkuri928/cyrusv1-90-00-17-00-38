
import { Sparkles, Shield, CreditCard, BarChart } from "lucide-react";

const benefits = [
  {
    title: "Todas as formas de pagamento",
    description: "Aceite cartões, boletos, Pix e outras formas de pagamento em um único lugar",
    icon: <CreditCard className="w-10 h-10 text-primary" />
  },
  {
    title: "Segurança avançada",
    description: "Proteção antifraude e criptografia de dados para suas transações",
    icon: <Shield className="w-10 h-10 text-primary" />
  },
  {
    title: "Dados unificados",
    description: "Visualize todas as suas vendas em um único dashboard simplificado",
    icon: <BarChart className="w-10 h-10 text-primary" />
  },
  {
    title: "Automação inteligente",
    description: "Configure regras de negócio para direcionar pagamentos automaticamente",
    icon: <Sparkles className="w-10 h-10 text-primary" />
  }
];

const BenefitsSection = () => {
  return (
    <div className="bg-[#111] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Benefícios da plataforma CYRUS</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Conheça os principais recursos que fazem nossa plataforma se destacar no mercado
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-[#1A1A1A] rounded-xl border border-purple-900/20 p-6 hover:border-purple-500/40 transition-all duration-300 hover:translate-y-[-5px]"
            >
              <div className="mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
