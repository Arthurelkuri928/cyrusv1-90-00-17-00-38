
import { AlertTriangle, XCircle, Clock, TrendingDown } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";

const MarketPainPartnersSection = () => {
  const marketPains = [
    {
      icon: <TrendingDown className="h-6 w-6 text-red-400" />,
      title: "Comissões miseráveis",
      description: "5-10% em produtos baratos que ninguém renova"
    },
    {
      icon: <Clock className="h-6 w-6 text-red-400" />,
      title: "Pagamentos atrasados",
      description: "45-90 dias para receber, quando recebe"
    },
    {
      icon: <XCircle className="h-6 w-6 text-red-400" />,
      title: "Suporte inexistente",
      description: "Você vira refém do atendimento da empresa"
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-red-400" />,
      title: "Produtos frágeis",
      description: "Alta taxa de cancelamento = sua credibilidade em risco"
    }
  ];

  return (
    <SectionContainer spacing="lg" background="gradient-primary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-500/10 border border-red-500/30 rounded-full px-6 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-sm font-medium text-white">A Realidade Brutal do Mercado</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Cansado de <span className="text-red-400">programas de afiliados</span> que não respeitam sua audiência?
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Se você já passou por essas frustrações, você não está sozinho. A maioria dos programas de parceria trata influenciadores como números descartáveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {marketPains.map((pain, index) => (
            <div 
              key={index}
              className="bg-black/60 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="bg-red-500/10 rounded-lg p-3 flex-shrink-0">
                  {pain.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{pain.title}</h3>
                  <p className="text-gray-400">{pain.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Solution Transition */}
        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#B388FF]/10 border border-[#FFD700]/30 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Existe uma alternativa para quem pensa grande
          </h3>
          
          <p className="text-xl text-gray-300 mb-6">
            O programa CYRUS foi desenhado por influenciadores, para influenciadores que valorizam sua reputação tanto quanto seus ganhos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              "30% de comissão recorrente",
              "Pagamento em até 7 dias",
              "Suporte dedicado premium"
            ].map((solution, index) => (
              <div key={index} className="bg-black/40 rounded-lg p-4 border border-[#FFD700]/20">
                <div className="w-8 h-8 bg-[#FFD700]/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="text-[#FFD700] font-bold">{index + 1}</span>
                </div>
                <p className="text-white font-semibold">{solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default MarketPainPartnersSection;
