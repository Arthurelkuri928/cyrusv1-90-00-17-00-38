
import { useState, useEffect } from "react";

const statItems = [
  { 
    value: 30, 
    label: "Gateways integrados", 
    prefix: "+", 
    suffix: "" 
  },
  { 
    value: 99.9, 
    label: "Uptime garantido", 
    prefix: "", 
    suffix: "%" 
  },
  { 
    value: 1000, 
    label: "Clientes satisfeitos", 
    prefix: "+", 
    suffix: "" 
  },
  { 
    value: 24, 
    label: "Suporte todos os dias", 
    prefix: "", 
    suffix: "/7" 
  }
];

const Stats = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <div className="bg-[#0D0D0D] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Números que impressionam
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <div 
              key={index} 
              className="bg-[#1A1A1A] rounded-xl border border-[#A259FF]/20 p-8 text-center transform transition-all duration-700 hover-glow"
              style={{ 
                opacity: animated ? 1 : 0, 
                transform: animated ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${index * 100}ms` 
              }}
            >
              <div className="text-5xl font-bold text-[#A259FF] mb-2 flex items-center justify-center">
                <span>{stat.prefix}</span>
                <span>{stat.value}</span>
                <span>{stat.suffix}</span>
              </div>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
