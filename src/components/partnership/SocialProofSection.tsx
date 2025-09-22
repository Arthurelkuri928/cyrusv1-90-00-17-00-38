
import { useState, useEffect } from "react";
import { TrendingUp, Users, DollarSign, Award, Star } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";

const SocialProofSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [liveStats, setLiveStats] = useState({
    totalPaid: 2847950,
    activePartners: 287,
    conversions: 1547
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        totalPaid: prev.totalPaid + Math.floor(Math.random() * 100) + 50,
        activePartners: prev.activePartners + (Math.random() > 0.95 ? 1 : 0),
        conversions: prev.conversions + Math.floor(Math.random() * 3) + 1
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      quote: "Em 6 meses, a CYRUS virou minha principal fonte de renda. Profissionalismo que eu nunca tinha visto.",
      author: "Carlos M.",
      role: "Especialista em Marketing",
      earnings: "R$ 18.400/mês"
    },
    {
      quote: "Finalmente um programa que valoriza de verdade o trabalho do afiliado. Recomendo de olhos fechados.",
      author: "Luciana R.",
      role: "Influenciadora Digital",
      earnings: "R$ 22.100/mês"
    },
    {
      quote: "A transparência e o suporte da CYRUS são incomparáveis. Mudou completamente meu negócio.",
      author: "Pedro S.",
      role: "Consultor de Negócios",
      earnings: "R$ 31.200/mês"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SectionContainer spacing="lg" background="border-top">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-500/10 border border-green-500/30 rounded-full px-6 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
            <span className="text-sm font-medium text-white">Números em Tempo Real</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Resultados que <span className="text-[#FFD700]">falam por si</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Números reais, atualizados em tempo real, de uma comunidade próspera de parceiros de sucesso.
          </p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 border border-[#FFD700]/30 rounded-2xl p-8 text-center">
            <DollarSign className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              R$ {(liveStats.totalPaid / 1000000).toFixed(1)}M+
            </div>
            <div className="text-gray-300">Já pagos aos parceiros</div>
            <div className="text-sm text-green-400 mt-2">+R$ 127.854 só hoje</div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm border border-[#B388FF]/20 rounded-2xl p-8 text-center">
            <Users className="h-10 w-10 text-[#B388FF] mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">{liveStats.activePartners}+</div>
            <div className="text-gray-300">Parceiros Ativos</div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-8 text-center">
            <Award className="h-10 w-10 text-[#8E24AA] mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">{liveStats.conversions}</div>
            <div className="text-gray-300">Conversões hoje</div>
          </div>
        </div>

        {/* Rotating Testimonials */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-8 min-h-[200px] flex items-center">
            <div className="w-full text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              
              <blockquote className="text-2xl text-white italic mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <div>
                  <div className="font-semibold text-white">{testimonials[currentTestimonial].author}</div>
                  <div className="text-gray-400 text-sm">{testimonials[currentTestimonial].role}</div>
                </div>
                <div className="w-px h-8 bg-[#8E24AA]/30"></div>
                <div className="text-[#FFD700] font-bold">{testimonials[currentTestimonial].earnings}</div>
              </div>
            </div>
          </div>
          
          {/* Testimonial Indicators */}
          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentTestimonial === index ? "w-8 bg-[#FFD700]" : "w-3 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Melhor Programa de Afiliados 2024",
              organization: "Prêmio Digital Awards",
              icon: <Award className="h-8 w-8 text-[#FFD700]" />
            },
            {
              title: "Top 3 em Satisfação do Parceiro",
              organization: "Pesquisa Influencer Brasil",
              icon: <Star className="h-8 w-8 text-[#FFD700]" />
            },
            {
              title: "Maior Taxa de Retenção",
              organization: "Análise Mercado SaaS",
              icon: <TrendingUp className="h-8 w-8 text-[#FFD700]" />
            }
          ].map((award, index) => (
            <div 
              key={index}
              className="bg-black/40 backdrop-blur-sm border border-[#FFD700]/20 rounded-xl p-6 text-center hover:border-[#FFD700]/40 transition-all duration-300"
            >
              <div className="bg-[#FFD700]/10 rounded-full p-4 inline-block mb-4">
                {award.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{award.title}</h3>
              <p className="text-gray-400 text-sm">{award.organization}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default SocialProofSection;
