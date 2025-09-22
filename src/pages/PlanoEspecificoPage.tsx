import { useParams, Link } from "react-router-dom";
import UniversalNavbar from "@/components/UniversalNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Crown, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const plansData = {
  mensal: {
    name: "Plano Mensal",
    price: 47.00,
    period: "por mês",
    validity: "Acesso por 30 dias",
    description: "Perfeito para quem quer economia e acesso básico às ferramentas premium",
    features: [
      "40+ Ferramentas Premium",
      "Acesso por 30 dias", 
      "Suporte via WhatsApp",
      "Atualizações incluídas",
      "Sem fidelidade"
    ],
    highlight: false,
    badge: "Econômico"
  },
  trimestral: {
    name: "Plano Trimestral",
    price: 147.00,
    period: "por 3 meses",
    validity: "Acesso por 90 dias",
    description: "O equilíbrio perfeito entre preço e recursos para uso regular",
    features: [
      "40+ Ferramentas Premium",
      "Acesso por 90 dias",
      "Suporte Prioritário",
      "Programa de Afiliados",
      "Melhor custo-benefício",
      "Atualizações incluídas"
    ],
    highlight: true,
    badge: "Mais Vendido"
  },
  anual: {
    name: "Plano Anual",
    price: 397.00,
    period: "por ano",
    validity: "Acesso por 12 meses",
    description: "Acesso completo e ilimitado para usuários avançados",
    features: [
      "40+ Ferramentas Premium",
      "Acesso por 12 meses",
      "Suporte VIP 24/7",
      "Programa de Afiliados Premium",
      "Acesso a novos recursos",
      "Consultoria personalizada",
      "Máximo desconto"
    ],
    highlight: false,
    badge: "Melhor Valor"
  }
};

const PlanoEspecificoPage = () => {
  const { tipo } = useParams<{ tipo: string }>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const plan = plansData[tipo as keyof typeof plansData];

  if (!plan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Plano não encontrado</h1>
          <Button asChild>
            <Link to="/planos">Voltar aos Planos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced background with subtle glow effects like homepage */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-[#8b5cf6]/12 via-[#8b5cf6]/4 to-transparent blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-[800px] h-[400px] bg-gradient-radial from-[#a259ff]/8 via-[#a259ff]/3 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[300px] bg-gradient-radial from-[#6d28d9]/6 via-[#6d28d9]/2 to-transparent blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.06)_1px,transparent_1px)] [background-size:50px_50px] opacity-30"></div>
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#a259ff] rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <UniversalNavbar />

        {/* Hero Section */}
        <section className="relative py-16 my-[98px] px-6 md:py-0">
          <div className="max-w-7xl mx-auto text-center">
            <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex justify-center mb-8">
                <div className="relative p-4 bg-gradient-to-r from-[#8b5cf6]/20 to-[#a259ff]/20 rounded-full border border-[#8b5cf6]/40 backdrop-blur-sm">
                  <Crown className="h-12 w-12 text-[#a259ff]" />
                  <div className="absolute inset-2 bg-[#a259ff]/15 rounded-full blur-lg"></div>
                  <div className="absolute inset-0 bg-[#a259ff]/10 rounded-full blur-xl"></div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Escolha seu <span className="bg-gradient-to-r from-[#a259ff] to-[#c084fc] bg-clip-text text-transparent relative">
                  Plano Premium
                  <div className="absolute inset-0 bg-gradient-to-r from-[#a259ff]/20 to-[#c084fc]/20 blur-lg -z-10"></div>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
                {plan.description}
              </p>
              
              <div className="relative">
                <Sparkles className="absolute -top-4 left-1/4 h-4 w-4 text-[#c084fc] animate-pulse opacity-70" />
                <Sparkles className="absolute top-2 right-1/3 h-3 w-3 text-[#8b5cf6] animate-pulse delay-700 opacity-70" />
                <Sparkles className="absolute -bottom-2 left-2/3 h-4 w-4 text-[#a259ff] animate-pulse delay-300 opacity-70" />
                <Sparkles className="absolute top-6 left-1/2 h-2 w-2 text-[#c084fc] animate-pulse delay-1000 opacity-50" />
                <Sparkles className="absolute -top-2 right-1/4 h-3 w-3 text-[#a259ff] animate-pulse delay-500 opacity-60" />
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 mt-8">
            <div className={`mb-8 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10" 
                asChild
              >
                <Link to="/planos">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar aos Planos
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/30 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#8b5cf6]/5 via-[#8b5cf6]/2 to-transparent blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-gradient-radial from-[#a259ff]/4 via-[#a259ff]/1 to-transparent blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.03)_1px,transparent_1px)] [background-size:60px_60px] opacity-30 my-[3px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className={`transition-all duration-1000 delay-200 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {plan.badge && (
                <div className="flex justify-center mb-8">
                  <div className="bg-gradient-to-r from-[#a259ff] to-[#8b5cf6] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="relative max-w-md mx-auto">
                <div className={`relative bg-gradient-to-br from-black/60 via-[#0a0a0a]/80 to-black/60 backdrop-blur-xl border rounded-3xl shadow-2xl overflow-hidden ${plan.highlight ? 'border-[#8b5cf6]/30 shadow-[#8b5cf6]/20' : 'border-[#8b5cf6]/20 shadow-[#8b5cf6]/10'}`}>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a259ff]/50 to-transparent"></div>
                  <div className={`absolute inset-0 pointer-events-none ${plan.highlight ? 'bg-gradient-to-br from-[#8b5cf6]/10 via-transparent to-[#a259ff]/10' : 'bg-gradient-to-br from-[#8b5cf6]/5 via-transparent to-[#a259ff]/5'}`}></div>
                  
                  <div className="p-8 text-center">
                    <h3 className="text-white font-bold text-2xl tracking-wide mb-6">{plan.name}</h3>
                    
                    <div className="space-y-2 mb-6">
                      <div className="text-white font-extrabold text-4xl flex justify-center items-baseline">
                        <span className="text-lg mr-2 text-gray-300 font-normal">R$</span>
                        <span className="text-3xl">{plan.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="text-[#a259ff] text-base font-semibold">{plan.period}</div>
                    </div>
                    
                    <div className="text-gray-300 text-sm leading-relaxed mb-8">
                      <span className="text-white font-semibold">{plan.validity}</span>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a259ff] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/40 flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-medium text-left">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-[#a259ff] to-[#8b5cf6] hover:from-[#b366ff] hover:to-[#9c6cfa] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-[#8b5cf6]/40 hover:shadow-xl hover:shadow-[#8b5cf6]/50 transform hover:scale-105 text-base" asChild>
                      <Link to="/entrar">
                        Quero Esse Plano
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default PlanoEspecificoPage;
