import { useState, useEffect } from "react";
import { Check, X, Star, Crown, Users } from "lucide-react";
const PlansComparison = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const comparisons = [{
    feature: "Acesso às 40+ ferramentas",
    other: false,
    freelancer: false,
    premium: true,
    description: "Todas as ferramentas premium liberadas"
  }, {
    feature: "Suporte 24/7",
    other: false,
    freelancer: false,
    premium: true,
    description: "Atendimento humano especializado"
  }, {
    feature: "Atualizações automáticas",
    other: false,
    freelancer: false,
    premium: true,
    description: "Sempre com as últimas versões"
  }, {
    feature: "Acesso vitalício disponível",
    other: false,
    freelancer: false,
    premium: true,
    description: "Opção de pagamento único"
  }, {
    feature: "Programa de afiliados",
    other: false,
    freelancer: false,
    premium: true,
    description: "Ganhe comissões indicando"
  }];
  return <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white">
      {/* Background effects identical to home */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8E24AA]/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A64EFF]/20 rounded-full filter blur-[60px]"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#B388FF]/10 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight tracking-tight text-white max-w-[800px] mx-auto">
              Por que escolher a <span className="text-[#B388FF]">CYRUS</span>?
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Compare e veja por que profissionais sérios não abrem mão da nossa plataforma.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Headers */}
              <div></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <X className="h-6 w-6 text-red-400" />
                  <span className="text-lg font-bold text-white">Outras Plataformas</span>
                </div>
                <p className="text-gray-400 text-sm">Instabilidade e limitações</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Users className="h-6 w-6 text-red-400" />
                  <span className="text-lg font-bold text-white">Prestadores</span>
                </div>
                <p className="text-gray-400 text-sm">Caro e demorado</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="h-6 w-6 text-[#B388FF]" />
                  <span className="text-lg font-bold text-[#B388FF]">CYRUS Premium</span>
                </div>
                <p className="text-gray-300 text-sm">Solução profissional completa</p>
              </div>
            </div>

            {/* Comparison rows */}
            <div className="space-y-4">
              {comparisons.map((item, index) => <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="md:col-span-1">
                    <h4 className="font-semibold text-white mb-1">{item.feature}</h4>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-400" />
                      <span className="text-gray-400">Limitado/Indisponível</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-400" />
                      <span className="text-gray-400">Limitado/Indisponível</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-[#B388FF]" />
                      <span className="text-white font-medium">Incluído</span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default PlansComparison;