
import { AlertCircle, Lock, Headphones, MonitorX, FlameKindling } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComparisonItem {
  problem: string;
  solution: string;
  icon: React.ReactNode;
}

const ComparisonSection = () => {
  const isMobile = useIsMobile();
  
  const comparisonItems: ComparisonItem[] = [
    {
      problem: "Ferramenta fora do ar no meio do trabalho",
      solution: "Plataforma estável e monitorada 24h",
      icon: <AlertCircle className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    }, 
    {
      problem: "Login que muda sem aviso",
      solution: "Login fixo, sem surpresas ou trocas",
      icon: <Lock className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    }, 
    {
      problem: "Suporte ausente ou despreparado",
      solution: "Suporte técnico com quem entende",
      icon: <Headphones className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    }, 
    {
      problem: "Interface amadora, pouco confiável",
      solution: "Interface profissional, sem ruído",
      icon: <MonitorX className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    }, 
    {
      problem: "Sistemas instáveis, feitos no improviso",
      solution: "Sistema sólido, sem improviso",
      icon: <FlameKindling className="h-8 w-8 text-[#FF4B4B]" strokeWidth={2.5} />
    }
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Comparação da Experiência
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-10">
            <h3 className="text-2xl font-bold text-red-400">Problemas Comuns</h3>
            
            <div className="space-y-6">
              {comparisonItems.map((item, index) => (
                <div key={`problem-${index}`} className="flex items-start">
                  <div className="mr-4 mt-1">{item.icon}</div>
                  <p className="text-lg text-gray-300">{item.problem}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-10">
            <h3 className="text-2xl font-bold text-emerald-400">Nossa Solução</h3>
            
            <div className="space-y-6">
              {comparisonItems.map((item, index) => (
                <div key={`solution-${index}`} className="flex items-start">
                  <div className="mr-4 mt-1 bg-emerald-400/20 rounded-full p-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  </div>
                  <p className="text-lg text-gray-300">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto p-8 bg-black/80 border border-white/10 rounded-xl">
          <blockquote className="text-center">
            <p className="text-xl italic text-gray-300 mb-4">
              "Segurança e estabilidade não são recursos adicionais.
              São o mínimo que você deveria esperar."
            </p>
            <footer className="text-gray-400">— CYRUS Tech Team</footer>
          </blockquote>
        </div>
      </div>
      
      {/* Updated background with brighter gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0A0F1C]/60 via-black/80 to-[#0A0F1C]/70 opacity-70"></div>
      
      {/* Added subtle animated elements for brightness */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[120px] animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full filter blur-[100px] animate-pulse" 
           style={{ animationDuration: '10s' }}></div>
    </section>
  );
};

export default ComparisonSection;
