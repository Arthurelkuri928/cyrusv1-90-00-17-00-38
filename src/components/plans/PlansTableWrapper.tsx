
import PlansTable from "./PlansTable";
import { useState, useEffect } from "react";

interface PlansTableWrapperProps {
  onSubscribeClick?: (priceId: string) => void;
  plans?: any[];
  loading?: boolean;
}

const PlansTableWrapper = ({ onSubscribeClick, plans, loading }: PlansTableWrapperProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="plans-table" className="relative pt-8 pb-16 px-6 md:px-12 lg:px-24 bg-black">
      {/* Background effects identical to home */}
      <div className="absolute inset-0 overflow-hidden mx-0 px-0 my-0 py-0">
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8E24AA]/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A64EFF]/20 rounded-full filter blur-[60px]"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#B388FF]/10 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Container com sombra suave para harmonizar com a Home */}
          <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm">
            <PlansTable onSubscribeClick={onSubscribeClick} plans={plans} />
          </div>
          
          {/* Microcopy abaixo da tabela */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed">
              <span className="font-semibold text-white">Todos os planos liberam acesso total a todas as ferramentas, sem limitações.</span><br />
              Sua conta é ativada imediatamente após a compra — em menos de 2 minutos você estará operando com toda a potência da CYRUS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansTableWrapper;
