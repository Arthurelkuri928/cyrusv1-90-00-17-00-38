import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UniversalNavbar from "@/components/UniversalNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Star, Zap, Shield, DollarSign, Unlock } from "lucide-react";
import SinglePlanTable from "@/components/plans/SinglePlanTable";

const PlanosPadroesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const planData = {
    name: "Plano Trimestral",
    price: "R$ 147,00",
    period: "por 3 meses",
    features: [
      "Acesso ilimitado às ferramentas",
      "Suporte prioritário no WhatsApp", 
      "Participação no programa de afiliados",
      "Acesso estável, sem limitações de uso",
      "Melhor custo-benefício",
      "Atualizações incluídas"
    ],
    buttonText: "Assinar Agora"
  };

  const benefitsData = [
    {
      icon: Zap,
      title: "Acesso a +40 ferramentas premium",
      description: "Todas as ferramentas sem limitações"
    },
    {
      icon: Shield,
      title: "Suporte prioritário no WhatsApp",
      description: "Atendimento VIP e rápido"
    },
    {
      icon: DollarSign,
      title: "Programa de afiliados ativo",
      description: "Melhores condições de ganho"
    },
    {
      icon: Unlock,
      title: "Acesso ilimitado, sem travas",
      description: "Liberdade total de uso"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-[#9333ea]/12 via-[#9333ea]/4 to-transparent blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-[800px] h-[400px] bg-gradient-radial from-[#7e22ce]/8 via-[#7e22ce]/3 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[300px] bg-gradient-radial from-[#6d28d9]/6 via-[#6d28d9]/2 to-transparent blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(147,51,234,0.06)_1px,transparent_1px)] [background-size:50px_50px] opacity-30"></div>
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#9333ea] rounded-full opacity-30"
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
        
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-[#9333ea] to-[#7e22ce] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <Star className="h-4 w-4 fill-current" />
                  Plano Recomendado
                </div>
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="relative p-4 bg-gradient-to-r from-[#9333ea]/20 to-[#7e22ce]/20 rounded-full border border-[#9333ea]/40 backdrop-blur-sm">
                  <Crown className="h-12 w-12 text-[#9333ea]" />
                  <div className="absolute inset-2 bg-[#9333ea]/15 rounded-full blur-lg"></div>
                  <div className="absolute inset-0 bg-[#9333ea]/10 rounded-full blur-xl"></div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Esse é o plano <span className="bg-gradient-to-r from-[#9333ea] to-[#c084fc] bg-clip-text text-transparent relative">
                  perfeito para você
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea]/20 to-[#c084fc]/20 blur-lg -z-10"></div>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-6">
                Plano ideal para quem quer <strong>estabilidade, economia e acesso completo</strong>. 
                Recomendado com base nas suas respostas do quiz.
              </p>
              
              <p className="text-lg text-[#9333ea] font-semibold mb-12">
                Esse plano foi selecionado especialmente para o seu perfil de uso.
              </p>
              
              <div className="relative">
                <Sparkles className="absolute -top-4 left-1/4 h-4 w-4 text-[#c084fc] animate-pulse opacity-70" />
                <Sparkles className="absolute top-2 right-1/3 h-3 w-3 text-[#9333ea] animate-pulse delay-700 opacity-70" />
                <Sparkles className="absolute -bottom-2 left-2/3 h-4 w-4 text-[#7e22ce] animate-pulse delay-300 opacity-70" />
                <Sparkles className="absolute top-6 left-1/2 h-2 w-2 text-[#c084fc] animate-pulse delay-1000 opacity-50" />
                <Sparkles className="absolute -top-2 right-1/4 h-3 w-3 text-[#9333ea] animate-pulse delay-500 opacity-60" />
              </div>
            </div>
          </div>
        </section>
        
        <section className="relative py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Por que esse plano é ideal para você?
              </h2>
              <div className="bg-gradient-to-br from-[#9333ea]/10 via-transparent to-[#7e22ce]/10 backdrop-blur-xl border border-[#9333ea]/30 rounded-2xl p-8 shadow-2xl shadow-[#9333ea]/20">
                <p className="text-lg text-gray-300 leading-relaxed">
                  Com base nas suas respostas, identificamos que você busca <strong>equilíbrio entre preço e acesso</strong>. 
                  Este plano oferece liberdade para usar as ferramentas sem limitações, 
                  mantendo um investimento justo e acessível. É o plano mais equilibrado da nossa plataforma.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className={`transition-all duration-1000 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefitsData.map((benefit, index) => (
                  <div key={index} className="bg-gradient-to-br from-[#9333ea]/10 via-transparent to-[#7e22ce]/10 backdrop-blur-xl border border-[#9333ea]/30 rounded-xl p-6 text-center hover:border-[#9333ea]/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#9333ea] to-[#7e22ce] rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section className="relative py-16 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className={`transition-all duration-1000 delay-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <SinglePlanTable plan={planData} />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default PlanosPadroesPage;
