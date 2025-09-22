
import { 
  AlertCircle, 
  Lock, 
  Headphones, 
  MonitorX, 
  FlameKindling 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import FlipCard from "@/components/shared/FlipCard";

interface MarketProblemProps {
  addSectionRef?: (index: number) => (el: HTMLElement | null) => void;
}

const MarketProblemSection = ({
  addSectionRef
}: MarketProblemProps) => {
  const isMobile = useIsMobile();
  
  const marketProblems = [
    {
      title: "Ferramenta fora do ar no meio do trabalho",
      icon: AlertCircle,
      solutions: [
        "Infraestrutura 99.9% de uptime",
        "Servidores redundantes globais",
        "Monitoramento 24/7 em tempo real"
      ]
    },
    {
      title: "Login que muda sem aviso",
      icon: Lock,
      solutions: [
        "Credenciais sempre atualizadas",
        "Sistema de backup automático",
        "Notificações antecipadas"
      ]
    },
    {
      title: "Suporte ausente ou despreparado",
      icon: Headphones,
      solutions: [
        "Suporte especializado premium",
        "Resposta em até 2 horas úteis",
        "Canal direto com desenvolvedores"
      ]
    },
    {
      title: "Interface amadora, pouco confiável",
      icon: MonitorX,
      solutions: [
        "Design profissional e intuitivo",
        "UX otimizada para produtividade",
        "Testes constantes de usabilidade"
      ]
    },
    {
      title: "Sistemas instáveis, feitos no improviso",
      icon: FlameKindling,
      solutions: [
        "Arquitetura enterprise robusta",
        "Códigos auditados e testados",
        "Atualizações controladas"
      ]
    }
  ];

  return (
    <section 
      ref={addSectionRef ? addSectionRef(1) : undefined}
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
          // Mobile layout - Simple list with flip cards
          <div className="flex flex-col space-y-5 mb-10">
            {marketProblems.map((problem, index) => (
              <FlipCard
                key={index}
                frontIcon={problem.icon}
                frontTitle={problem.title}
                backSolutions={problem.solutions}
              />
            ))}
          </div>
        ) : (
          // Desktop layout - Grid with flip cards
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {marketProblems.slice(0, 3).map((problem, index) => (
                <FlipCard
                  key={index}
                  frontIcon={problem.icon}
                  frontTitle={problem.title}
                  backSolutions={problem.solutions}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {marketProblems.slice(3, 5).map((problem, index) => (
                <FlipCard
                  key={index + 3}
                  frontIcon={problem.icon}
                  frontTitle={problem.title}
                  backSolutions={problem.solutions}
                />
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
