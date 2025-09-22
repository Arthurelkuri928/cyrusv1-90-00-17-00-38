
import { useState } from "react";
import { Star, Play, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/shared/SectionContainer";

const SuccessStoriesSection = () => {
  const [activeStory, setActiveStory] = useState(0);

  const successStories = [
    {
      name: "Marina Silva",
      role: "Consultora em Marketing Digital",
      followers: "85k seguidores",
      timeline: "Parceira há 8 meses",
      monthlyEarning: "R$ 12.400",
      totalEarned: "R$ 76.800",
      growth: "+340%",
      quote: "O programa CYRUS mudou completamente minha estratégia de monetização. Não é só sobre o dinheiro - é sobre recomendar algo que realmente funciona.",
      beforeAfter: {
        before: "R$ 2.100/mês com infoprodutos",
        after: "R$ 12.400/mês só com CYRUS"
      },
      avatar: "M",
      videoThumbnail: "/api/placeholder/320/180"
    },
    {
      name: "Roberto Costa", 
      role: "YouTuber de Negócios",
      followers: "120k seguidores",
      timeline: "Parceiro há 1 ano",
      monthlyEarning: "R$ 18.900",
      totalEarned: "R$ 187.200",
      growth: "+520%",
      quote: "A qualidade da plataforma e o suporte excepcional fazem toda a diferença. Meus seguidores me agradecem pela indicação.",
      beforeAfter: {
        before: "R$ 4.200/mês com múltiplos programas",
        after: "R$ 18.900/mês focado na CYRUS"
      },
      avatar: "R",
      videoThumbnail: "/api/placeholder/320/180"
    },
    {
      name: "Ana Ferreira",
      role: "Influenciadora de Produtividade", 
      followers: "200k seguidores",
      timeline: "Parceira há 6 meses",
      monthlyEarning: "R$ 24.700",
      totalEarned: "R$ 128.400",
      growth: "+680%",
      quote: "Nunca vi um programa de parceria tão bem estruturado. A transparência e os pagamentos pontuais são excepcionais.",
      beforeAfter: {
        before: "R$ 3.800/mês com vários programas",
        after: "R$ 24.700/mês com foco na CYRUS"
      },
      avatar: "A",
      videoThumbnail: "/api/placeholder/320/180"
    }
  ];

  const currentStory = successStories[activeStory];

  return (
    <SectionContainer spacing="lg" background="border-top">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full px-6 py-2 mb-6">
            <Star className="w-4 h-4 text-[#FFD700] mr-2" />
            <span className="text-sm font-medium text-white">Casos Reais de Sucesso</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Parceiros que <span className="text-[#FFD700]">transformaram</span> suas vidas
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Histórias reais de influenciadores que construíram império financeiro como parceiros CYRUS
          </p>
        </div>

        {/* Story Navigator */}
        <div className="flex justify-center mb-12">
          <div className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-2 flex gap-2">
            {successStories.map((story, index) => (
              <button
                key={index}
                onClick={() => setActiveStory(index)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeStory === index 
                    ? 'bg-[#FFD700]/20 border border-[#FFD700]/30' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  activeStory === index ? 'bg-[#FFD700] text-black' : 'bg-[#8E24AA]/20 text-white'
                }`}>
                  {story.avatar}
                </div>
                <span className={`font-medium ${
                  activeStory === index ? 'text-white' : 'text-gray-400'
                }`}>
                  {story.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            {/* Story Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {currentStory.avatar}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{currentStory.name}</h3>
                <p className="text-gray-400">{currentStory.role}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-[#B388FF]">{currentStory.followers}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-400">{currentStory.timeline}</span>
                </div>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-xl text-gray-300 italic mb-8 leading-relaxed">
              "{currentStory.quote}"
            </blockquote>

            {/* Before/After */}
            <div className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-bold text-white mb-4">Transformação Financeira</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">ANTES</div>
                  <div className="text-red-400 font-semibold">{currentStory.beforeAfter.before}</div>
                </div>
                <div className="text-center p-4 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">AGORA</div>
                  <div className="text-[#FFD700] font-semibold">{currentStory.beforeAfter.after}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-[#FFD700] mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{currentStory.monthlyEarning}</div>
                <div className="text-xs text-gray-400">por mês</div>
              </div>
              <div className="text-center p-4 bg-[#B388FF]/10 border border-[#B388FF]/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-[#B388FF] mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{currentStory.growth}</div>
                <div className="text-xs text-gray-400">crescimento</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{currentStory.totalEarned}</div>
                <div className="text-xs text-gray-400">total ganho</div>
              </div>
            </div>
          </div>

          {/* Video Testimonial */}
          <div className="relative">
            <div className="bg-black/60 rounded-2xl p-8 border border-[#8E24AA]/20">
              <div className="aspect-video bg-black/80 rounded-xl mb-6 relative overflow-hidden border border-[#FFD700]/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="w-20 h-20 rounded-full bg-[#FFD700]/20 hover:bg-[#FFD700]/30 border border-[#FFD700]/40"
                  >
                    <Play className="h-8 w-8 text-[#FFD700]" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded-lg">
                  <span className="text-white text-sm">Depoimento em vídeo</span>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-lg font-bold text-white mb-2">
                  "Como a CYRUS mudou minha vida"
                </h4>
                <p className="text-gray-400 text-sm">
                  Assista ao depoimento completo de {currentStory.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#B388FF]/10 border border-[#FFD700]/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Resultados Consolidados dos Nossos Top Parceiros
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { metric: "R$ 15.000", label: "Ganho médio mensal", icon: DollarSign },
              { metric: "450%", label: "Crescimento médio", icon: TrendingUp },
              { metric: "89%", label: "Renovação dos indicados", icon: Star },
              { metric: "6 meses", label: "Para atingir R$ 10k/mês", icon: Calendar }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-8 w-8 text-[#FFD700]" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.metric}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default SuccessStoriesSection;
