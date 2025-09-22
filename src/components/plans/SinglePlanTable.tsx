
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

interface SinglePlanProps {
  plan: {
    name: string;
    price: string;
    period: string;
    features: string[];
    buttonText: string;
    buttonColor?: string;
    buttonHover?: string;
  };
}

const SinglePlanTable = ({ plan }: SinglePlanProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      {/* Main table container */}
      <div className="bg-gradient-to-br from-black/60 via-[#0e0e0e]/80 to-black/60 backdrop-blur-xl border border-[#8b5cf6]/30 rounded-3xl shadow-2xl shadow-[#8b5cf6]/20 overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a259ff]/50 to-transparent"></div>
        
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/5 via-transparent to-[#a259ff]/5 pointer-events-none"></div>
        
        <div className="relative max-w-md mx-auto">
          {/* Plan Header */}
          <div className="p-8 text-center">
            {/* Plan name */}
            <h3 className="text-white font-bold text-2xl tracking-wide mb-6">{plan.name}</h3>
            
            {/* Price section */}
            <div className="space-y-2 mb-6">
              <div className="text-white font-extrabold text-4xl flex justify-center items-baseline">
                <span className="text-lg mr-2 text-gray-300 font-normal">R$</span>
                <span className="text-3xl">{plan.price.replace('R$ ', '').replace(',00', ',00')}</span>
              </div>
              <div className="text-[#a259ff] text-base font-semibold">{plan.period}</div>
            </div>

            {/* Features */}
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
            
            {/* CTA Button */}
            <Button className="w-full bg-gradient-to-r from-[#a259ff] to-[#8b5cf6] hover:from-[#b366ff] hover:to-[#9c6cfa] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-[#8b5cf6]/40 hover:shadow-xl hover:shadow-[#8b5cf6]/50 transform hover:scale-105 text-base" asChild>
              <Link to="/entrar">
                {plan.buttonText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePlanTable;
