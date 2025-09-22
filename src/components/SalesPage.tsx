import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Shield, 
  Target, 
  Users, 
  Star, 
  Layout,
  Code,
  Server
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const SalesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Animation on page load
  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      sectionRefs.current.forEach((ref) => {
        if (!ref) return;
        
        const rect = ref.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
        
        if (isInView) {
          ref.classList.add("animate-fade-in");
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={addSectionRef(0)}
        className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center bg-gradient-to-b from-[#0A0F1C] via-[#111827] to-[#151F38]"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(48,79,254,0.08)_0%,rgba(0,0,0,0)_100%)]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#304FFE]/5 rounded-full filter blur-[80px]"></div>
          <div className="absolute top-40 left-20 w-72 h-72 bg-[#8E24AA]/5 rounded-full filter blur-[60px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Ferramentas sérias não podem falhar.
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                A <span className="font-bold">CYRUS</span> é uma plataforma construída com um princípio simples:
              </p>
              
              <div className="flex items-center mb-10 bg-[#304FFE]/10 p-4 rounded-lg border border-[#304FFE]/20">
                <Target className="w-6 h-6 text-[#304FFE] mr-3 flex-shrink-0" />
                <p className="text-lg italic text-gray-200">
                  Confiabilidade absoluta para quem precisa executar.
                </p>
              </div>
              
              <div className="space-y-5 mb-10">
                {[
                  "Infraestrutura técnica sólida",
                  "Acesso instantâneo e contínuo",
                  "Organização lógica por áreas estratégicas"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center group">
                    <div className="bg-[#304FFE]/20 rounded-full p-2 mr-4 shadow-lg shadow-[#304FFE]/10">
                      <div className="w-2 h-2 rounded-full bg-[#304FFE] group-hover:animate-pulse"></div>
                    </div>
                    <p className="text-gray-300 group-hover:text-white transition-all duration-300">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link to="/cadastro">
                  <Button 
                    variant="neon" 
                    size="xl"
                    className="w-full sm:max-w-md group relative overflow-hidden"
                  >
                    <span className="relative z-10">Teste com acesso total por R$0,99</span>
                    <span className="absolute inset-0 bg-[#304FFE]/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>
                </Link>
              </div>
            </div>
            
            <div 
              className={`relative transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="relative z-10 glow-border rounded-2xl overflow-hidden backdrop-blur-sm bg-black/20 border border-[#304FFE]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#304FFE]/10 to-[#8E24AA]/10 animate-gradient-flow"></div>
                <div className="h-96 w-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className="absolute inset-0 bg-[#304FFE]/20 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 bg-[#0A0F1C] rounded-full flex items-center justify-center">
                        <Server className="w-12 h-12 text-[#304FFE]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Plataforma Técnica Superior</h3>
                    <p className="text-gray-400 px-8">Arquitetura otimizada para performance e estabilidade contínua.</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8E24AA]/30 rounded-full filter blur-xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#304FFE]/20 rounded-full filter blur-xl"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-[100px] text-[#0A0F1C]"
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V69.14C50.94,75.82,137.25,66.26,182.73,63.47Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Section 2 - The Market Problem */}
      <section 
        ref={addSectionRef(1)}
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0F1C] text-white"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            O Problema do Mercado: Insegurança Invisível
          </h2>
          
          <p className="text-xl mb-10 text-gray-300">Você já viveu isso:</p>
          
          <ul className="space-y-6 mb-12 text-lg">
            {[
              "Ferramenta fora do ar no meio do dia",
              "Login expirado sem explicação",
              "Suporte que não responde",
              "Estrutura improvisada, sem controle",
              "Interfaces frágeis, instáveis"
            ].map((item, index) => (
              <li key={index} className="flex items-center group">
                <span className="text-red-400 mr-3 transition-all duration-300 group-hover:text-red-500">–</span>
                <span className="text-gray-300 transition-all duration-300 group-hover:text-white">{item}</span>
              </li>
            ))}
          </ul>
          
          <div className="glass-container p-6 mb-8 bg-gradient-to-br from-[#111827]/50 to-[#151F38]/50">
            <div className="border-l-4 border-[#304FFE] pl-4">
              <p className="mb-2 italic text-gray-300">Quando a base falha, o resto trava.</p>
              <p className="italic text-gray-300">A CYRUS nasce para garantir que isso não aconteça.</p>
            </div>
          </div>
        </div>
        
        {/* Background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#8E24AA]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#304FFE]/10 rounded-full filter blur-3xl"></div>
      </section>

      <div className="relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden z-10">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-[60px] text-[#0A0F1C] rotate-180"
          >
            <path 
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        {/* Section 3 - CYRUS Philosophy */}
        <section 
          ref={addSectionRef(2)}
          className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A0F1C] via-[#111827] to-[#151F38] text-white"
        >
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              A Filosofia CYRUS: Silêncio Operacional
            </h2>
            
            <p className="text-xl mb-8 text-gray-300">
              Uma ferramenta bem feita não chama atenção. Ela entrega.
            </p>
            
            <ul className="space-y-7 mb-12">
              {[
                "Estabilidade 24h por arquitetura proprietária",
                "Fluxos claros, sem fricção",
                "Acesso por área: copy, tráfego, AI, criativos...",
                "Redundância técnica real",
                "Suporte feito por quem entende"
              ].map((item, index) => (
                <li key={index} className="flex items-start group">
                  <div className="bg-[#8E24AA]/20 rounded-full p-2 mr-4 mt-1 shadow-md shadow-[#8E24AA]/10 transition-all duration-300 group-hover:shadow-[#8E24AA]/30">
                    <div className="w-3 h-3 rounded-full bg-[#8E24AA] group-hover:animate-pulse"></div>
                  </div>
                  <p className="text-lg text-gray-300 group-hover:text-white transition-all duration-300">{item}</p>
                </li>
              ))}
            </ul>
            
            <div className="glass-container p-6">
              <div className="border-l-4 border-[#8E24AA] pl-4">
                <p className="mb-2 italic text-gray-300">Você não perderá tempo consertando o que nunca deveria quebrar.</p>
              </div>
            </div>
          </div>
          
          {/* Animated gradient background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#304FFE]/10 to-[#8E24AA]/10 animated-gradient"></div>
          </div>
        </section>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-[60px] text-[#0A0F1C]"
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V69.14C50.94,75.82,137.25,66.26,182.73,63.47Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      {/* Section 4 - CYRUS Experience */}
      <section 
        ref={addSectionRef(3)}
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0F1C] text-white"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            A Experiência Real de Uso
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: <Layout className="h-8 w-8 text-[#304FFE]" />,
                title: "Interface escura, fluida e moderna",
                description: "Design intuitivo com foco em usabilidade e performance."
              },
              {
                icon: <Code className="h-8 w-8 text-[#8E24AA]" />,
                title: "Cards otimizados por área funcional",
                description: "Acesso lógico organizado por necessidades de trabalho."
              },
              {
                icon: <Shield className="h-8 w-8 text-[#304FFE]" />,
                title: "Mais de 30 ferramentas críticas",
                description: "Todo o necessário para operações contínuas."
              },
              {
                icon: <Clock className="h-8 w-8 text-[#8E24AA]" />,
                title: "Histórico técnico, atualizações visíveis",
                description: "Transparência total sobre mudanças e melhorias."
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="glass-card p-6 h-full flex flex-col hover:scale-[1.02] transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-[#151F38] to-[#111827] p-4 rounded-xl mb-4 inline-flex">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <Target className="text-[#304FFE] mr-3 h-5 w-5 flex-shrink-0" />
            <p className="text-lg italic text-gray-300">
              Pensada para quem vende, opera e escala com consistência.
            </p>
          </div>
        </div>
        
        {/* Tech-style grid background */}
        <div className="absolute inset-0 tech-grid opacity-10"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#304FFE]/5 rounded-full filter blur-3xl"></div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-[#304FFE]/30 to-transparent h-[1px]" />

      {/* Section 5 - Test with Total Autonomy */}
      <section 
        ref={addSectionRef(4)}
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A0F1C] via-[#111827] to-[#151F38] text-white"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Oferta Teste: R$0,99, Sem Riscos
          </h2>
          
          <p className="text-xl mb-10 text-gray-300">
            Você não precisa acreditar — basta experimentar.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { text: "Acesso integral", icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
              { text: "Nenhuma limitação", icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
              { text: "Sem renovação automática oculta", icon: <CheckCircle className="h-5 w-5 text-green-500" /> }
            ].map((item, index) => (
              <div 
                key={index} 
                className="glass-card p-4 flex items-center space-x-3 hover:shadow-[#304FFE]/20 transition-all"
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <p className="text-gray-200">{item.text}</p>
              </div>
            ))}
          </div>
          
          <div className="sticky bottom-8 w-full mb-12 z-50">
            <Link to="/cadastro">
              <Button 
                variant="glass"
                size="xl"
                className="w-full font-bold text-lg border-[#304FFE]/50 hover:bg-[#304FFE]/20 hover:border-[#304FFE] group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#304FFE]/0 via-[#304FFE]/30 to-[#304FFE]/0 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
                <span className="relative z-10">Começar agora por R$0,99</span>
                <ArrowRight className="ml-2 relative z-10" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Gradient circle background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#8E24AA]/5 filter blur-3xl pointer-events-none"></div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-[#8E24AA]/30 to-transparent h-[1px]" />

      {/* Section 6 - Testimonials */}
      <section 
        ref={addSectionRef(5)}
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0F1C] text-white"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <div className="bg-[#8E24AA]/20 p-3 rounded-full mb-4">
              <Users className="h-6 w-6 text-[#8E24AA]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Profissionais Reais, Resultados Reais
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote: "Pela primeira vez, o suporte sabia o que eu precisava.",
                author: "Fernanda C.",
                position: "estrategista",
                rating: 5
              },
              {
                quote: "CYRUS é técnica. E isso faz diferença.",
                author: "Roberto S.",
                position: "gestor de mídia",
                rating: 5
              },
              {
                quote: "Funciona. Simples assim.",
                author: "Helena T.",
                position: "ecom manager",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="glass-card p-6 backdrop-blur-sm bg-[#151F38]/30 border border-[#304FFE]/20 shadow-lg hover:shadow-[#304FFE]/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex mb-4">
                  {Array.from({length: testimonial.rating}).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <p className="font-semibold text-white">– {testimonial.author},</p>
                <p className="text-gray-400 text-sm">{testimonial.position}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background accent */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#304FFE]/5 rounded-full filter blur-3xl"></div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-gradient-radial to-transparent h-[1px]" />

      {/* Section 7 - Closing with Implicit Authority */}
      <section 
        ref={addSectionRef(6)}
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A0F1C] via-[#111827] to-[#151F38] text-white"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Para Quem Faz de Verdade
          </h2>
          
          <p className="text-xl mb-10 text-gray-300">
            CYRUS é feita para profissionais que operam em alto nível.<br/>
            <span className="font-medium text-white">Nada de distrações. Nada de promessas vazias. Só o que importa:</span>
          </p>
          
          <div className="sticky bottom-8 w-full mb-12 z-50">
            <Link to="/cadastro">
              <Button 
                variant="neon" 
                size="xl"
                className="w-full sm:max-w-2xl mx-auto flex items-center justify-center py-6 text-lg md:py-8 md:text-xl font-bold hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-[#8E24AA]/10 border-[#8E24AA]"
              >
                Acesso completo – R$0,99 por uma semana
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            
            <p className="text-center text-gray-400 mt-3 italic">
              Disponível enquanto o lote promocional estiver aberto.
            </p>
          </div>
        </div>
        
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#304FFE]/10 to-[#8E24AA]/5 animated-gradient"></div>
        </div>
      </section>
    </div>
  );
};

export default SalesPage;
