
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// List of integrations with updated colors to match the main tool cards
const integrations = [
  {
    name: "Hotmart",
    color: "#F3610E",
    icon: "🔥",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "Mercado Pago",
    color: "#0285FF",
    icon: "🤝",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "Converte",
    color: "#F5870A",
    icon: "🔄",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "LastLink",
    color: "#FFFFFF",
    icon: "🔗",
    textColor: "black",
    type: "Gateway de Pagamento"
  },
  {
    name: "Eduzz",
    color: "#0836BC",
    icon: "🌙",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "Asaas",
    color: "#0094FF",
    icon: "🦅",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "NexusPay",
    color: "#12E0A0",
    icon: "✖️",
    textColor: "black",
    type: "Gateway de Pagamento"
  },
  {
    name: "Abmex",
    color: "#000000",
    icon: "❌",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "Kiwify",
    color: "#10BC84",
    icon: "🥝",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "Monetizze",
    color: "#2FA5E8",
    icon: "💰",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "Guru Manager",
    color: "#01BA9A",
    icon: "🧘",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "Yampi",
    color: "#B31E8C",
    icon: "❤️",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "Braip",
    color: "#5F43B2",
    icon: "🧠",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "CartPanda",
    color: "#0770ED",
    icon: "🐼",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "AppMax",
    color: "#2D5BEC",
    icon: "📱",
    textColor: "white",
    type: "Gateway de Pagamento"
  },
  {
    name: "PerfectPay",
    color: "#FFFFFF",
    icon: "💲",
    textColor: "black",
    type: "Gateway de Pagamento"
  }
];

const Integrations = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 16; // Show 16 items per page (4x4 grid)
  const totalPages = Math.ceil(integrations.length / itemsPerPage);
  
  const handleScroll = (direction: "left" | "right") => {
    if (direction === "left" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "right" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div id="integrações" className="bg-[#0D0D0D] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Gateways Integrados</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Conectamos com mais de 30 gateways de pagamento para maximizar suas conversões e reduzir perdas de venda.</p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {integrations.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((integration, index) => (
              <div 
                key={index} 
                className="cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#A259FF]/20"
              >
                <div 
                  className="cyrus-card h-24 flex" 
                  style={{ backgroundColor: integration.color }}
                >
                  {/* Left section with logo/icon */}
                  <div className="flex items-center justify-center w-2/5 border-r border-white/10">
                    <div className="text-4xl">{integration.icon}</div>
                  </div>
                  
                  {/* Right section with text */}
                  <div className="w-3/5 p-3 flex flex-col justify-center">
                    <h3 
                      className={`font-bold text-lg ${integration.textColor === 'white' ? 'text-white' : 'text-black'}`}
                    >
                      {integration.name}
                    </h3>
                    <p 
                      className={`text-xs ${integration.textColor === 'white' ? 'text-white/70' : 'text-black/70'}`}
                    >
                      {integration.type}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 status-pulse" title="Online"></div>
                </div>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black/50 border border-[#A259FF]/30 text-white hover:bg-black hover:text-[#A259FF] rounded-full" 
            onClick={() => handleScroll("left")} 
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black/50 border border-[#A259FF]/30 text-white hover:bg-black hover:text-[#A259FF] rounded-full" 
            onClick={() => handleScroll("right")} 
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-1 mt-6">
          {Array.from({length: totalPages}).map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentPage ? 'bg-[#A259FF] w-4' : 'bg-gray-700'}`} 
              onClick={() => setCurrentPage(index)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
