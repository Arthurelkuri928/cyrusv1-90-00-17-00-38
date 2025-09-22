
import { 
  AlertCircle, 
  Lock, 
  Headphones, 
  MonitorX, 
  FlameKindling 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MarketProblemSection = ({ addSectionRef }: { addSectionRef: (index: number) => (el: HTMLElement | null) => void }) => {
  const isMobile = useIsMobile();
  
  const problems = [
    {
      title: "Ferramenta fora do ar no meio do trabalho",
      icon: <AlertCircle className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    },
    {
      title: "Login que muda sem aviso",
      icon: <Lock className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    },
    {
      title: "Suporte ausente ou despreparado",
      icon: <Headphones className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    },
    {
      title: "Interface amadora, pouco confiável",
      icon: <MonitorX className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    },
    {
      title: "Sistemas instáveis, feitos no improviso",
      icon: <FlameKindling className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    }
  ];

  return (
    <section 
      ref={addSectionRef(1)}
      className="relative py-20 px-6 md:px-10 lg:px-16 bg-black text-white border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-5 text-center">
          O Problema do Mercado
        </h2>
        
        <p className="text-xl text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Você já se adaptou ao improviso. Mas não deveria.
        </p>
        
        {isMobile ? (
          // Mobile layout - List with X markers
          <div className="flex flex-col space-y-5 mb-10">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="flex items-start"
              >
                <div className="text-[#FF4B4B] mr-3 flex-shrink-0 mt-0.5">×</div>
                <p className="text-white text-lg">{problem.title}</p>
              </div>
            ))}
          </div>
        ) : (
          // Desktop layout - Grid with cards and icons
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {problems.slice(0, 3).map((problem, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-md bg-black border border-[#222] rounded-lg p-8 hover:shadow-lg hover:scale-[1.02] hover:border-[#FF4B4B]/30 hover:shadow-[#FF4B4B]/10 transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center h-full"
                >
                  <div className="absolute inset-0 bg-[#FF4B4B]/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    <div className="bg-black/90 rounded-full p-5 mb-5 flex items-center justify-center group">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-[#FF4B4B] opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="relative">
                          {problem.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-white">
                      {problem.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {problems.slice(3, 5).map((problem, index) => (
                <div 
                  key={index + 3}
                  className="backdrop-blur-md bg-black border border-[#222] rounded-lg p-8 hover:shadow-lg hover:scale-[1.02] hover:border-[#FF4B4B]/30 hover:shadow-[#FF4B4B]/10 transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center h-full"
                >
                  <div className="absolute inset-0 bg-[#FF4B4B]/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    <div className="bg-black/90 rounded-full p-5 mb-5 flex items-center justify-center group">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-[#FF4B4B] opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="relative">
                          {problem.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-white">
                      {problem.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Highlighted quote */}
        <div className="mt-12 max-w-2xl mx-auto bg-black/60 border border-[#333] rounded-lg p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <blockquote className="relative z-10">
              <div className="text-5xl text-[#FF4B4B] leading-none mb-2">"</div>
              <p className="text-lg md:text-xl italic mb-2 text-gray-200">
                A maioria tenta liberar acesso.<br/>
                A CYRUS garante que você nunca pare.
              </p>
              <div className="text-5xl text-[#FF4B4B] leading-none text-right mt-2">"</div>
              <footer className="mt-2 text-sm text-gray-400">
                — Equipe CYRUS
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#FF4B4B]/5 rounded-full filter blur-[80px]"></div>
    </section>
  );
};

export default MarketProblemSection;
