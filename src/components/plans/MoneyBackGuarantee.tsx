
import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const MoneyBackGuarantee = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative py-20 px-6 md:px-12 lg:px-24 bg-black">
      {/* Background effects consistent with other sections */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#8E24AA]/15 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#A64EFF]/15 rounded-full filter blur-[80px]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-br from-white/5 to-transparent p-8 md:p-12 rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-[#8E24AA] to-[#A64EFF] rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-white" strokeWidth={2} />
            </div>
            
            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
              Sua satisfação é garantida ou seu dinheiro de volta
            </h2>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Você tem até <span className="font-semibold text-white">7 dias</span> para testar a plataforma sem risco. 
              Se não gostar, <span className="font-semibold text-[#B388FF]">devolvemos seu dinheiro sem perguntas</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoneyBackGuarantee;
