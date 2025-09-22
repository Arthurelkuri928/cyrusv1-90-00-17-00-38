import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";
const PlansBottomCTA = () => {
  return <div className="text-center">
      <div className="relative">
        {/* Premium container with sophisticated effects */}
        <div className="relative bg-gradient-to-br from-black/70 via-[#0a0a0a]/80 to-black/70 backdrop-blur-xl border border-[#8b5cf6]/20 rounded-3xl p-12 max-w-4xl mx-auto shadow-2xl shadow-[#8b5cf6]/15 overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a259ff]/60 to-transparent"></div>
          
          {/* Inner gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/5 via-transparent to-[#a259ff]/5 pointer-events-none rounded-3xl"></div>
          
          {/* Enhanced Icon with multiple effects */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              {/* Main icon container */}
              <div className="relative p-5 bg-gradient-to-br from-[#8b5cf6]/25 via-[#a259ff]/20 to-[#c084fc]/25 rounded-full border border-[#8b5cf6]/40 backdrop-blur-sm">
                <MessageCircle className="h-8 w-8 text-[#a259ff]" />
                
                {/* Floating sparkles */}
                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-[#c084fc] animate-pulse" />
                <Sparkles className="absolute -bottom-2 -left-2 h-4 w-4 text-[#8b5cf6] animate-pulse delay-700" />
                <Sparkles className="absolute top-1 right-8 h-3 w-3 text-[#a259ff] animate-pulse delay-300" />
              </div>
              
              {/* Icon glow */}
              <div className="absolute inset-3 bg-[#a259ff]/20 rounded-full blur-xl"></div>
              
              {/* Outer ring glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6]/15 to-[#a259ff]/15 rounded-full blur-2xl scale-150"></div>
            </div>
          </div>
          
          {/* Enhanced Content */}
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Ainda tem dúvidas sobre qual{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#a259ff] via-[#c084fc] to-[#8b5cf6] bg-clip-text text-transparent">
                  plano escolher
                </span>
                {/* Text glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#a259ff] via-[#c084fc] to-[#8b5cf6] bg-clip-text text-transparent blur-sm opacity-40 -z-10"></div>
              </span>
              ?
            </h3>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nossa equipe está pronta para te ajudar a encontrar o plano perfeito para suas necessidades e objetivos
            </p>
            
            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <Button className="group relative bg-gradient-to-r from-[#8b5cf6] via-[#a259ff] to-[#c084fc] hover:from-[#7c3aed] hover:via-[#9333ea] hover:to-[#b366ff] text-white font-bold text-lg px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-[#8b5cf6]/40 hover:shadow-2xl hover:shadow-[#8b5cf6]/60 border border-[#a259ff]/20" asChild>
                <Link to="/suporte">
                  <span className="relative z-10">Falar com Especialista</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </Button>
              
              <Button className="group relative bg-black/40 backdrop-blur-sm border-2 border-[#8b5cf6]/50 text-[#a259ff] hover:bg-[#8b5cf6]/10 hover:border-[#a259ff] hover:text-white text-lg px-10 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#8b5cf6]/30 rounded-xl" asChild>
                <Link to="/cadastro">
                  <span className="relative z-10">Começar teste agora</span>
                  {/* Subtle inner highlight */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </Button>
            </div>
            
            {/* Enhanced trust indicator */}
            <div className="relative">
              <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#a259ff]" />
                <span>Resposta em até 2 horas • Suporte especializado • Sem compromisso</span>
                <Sparkles className="w-4 h-4 text-[#a259ff]" />
              </p>
            </div>
          </div>
        </div>
        
        {/* Container outer glow */}
        
      </div>
    </div>;
};
export default PlansBottomCTA;