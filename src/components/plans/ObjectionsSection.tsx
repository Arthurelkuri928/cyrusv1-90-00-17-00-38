import { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
interface ObjectionsSectionProps {
  onOpenAssistant: () => void;
}
const ObjectionsSection = ({
  onOpenAssistant
}: ObjectionsSectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const objections = [{
    question: "\"E se eu não conseguir usar as ferramentas?\"",
    answer: "Nosso suporte especializado te ajuda com qualquer dúvida. Além disso, as ferramentas são intuitivas e pensadas para facilitar seu trabalho.",
    icon: <HelpCircle className="h-6 w-6" />
  }, {
    question: "\"O investimento vale a pena?\"",
    answer: "Com apenas uma ferramenta funcionando bem, você já recupera o investimento. São mais de 40 ferramentas premium por um preço único.",
    icon: <CheckCircle className="h-6 w-6" />
  }, {
    question: "\"E se eu não gostar da plataforma?\"",
    answer: "Teste por R$0,99 durante 7 dias. Acesso total, sem limitações. Se não convencer, você só perdeu menos de 1 real.",
    icon: <MessageCircle className="h-6 w-6" />
  }, {
    question: "\"Como sei que é confiável?\"",
    answer: "Mais de 5000 profissionais já confiam na CYRUS. 99.9% de uptime, pagamentos seguros e suporte 24/7 comprovam nossa seriedade.",
    icon: <CheckCircle className="h-6 w-6" />
  }];
  return <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white">
      {/* Background effects identical to home */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8E24AA]/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A64EFF]/20 rounded-full filter blur-[60px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight tracking-tight text-white max-w-[800px] mx-auto">
              Suas <span className="text-[#B388FF]">dúvidas</span> respondidas.
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Entendemos suas preocupações. Veja as respostas para as perguntas mais comuns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {objections.map((objection, index) => <div key={index} className="p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm hover:border-[#8E24AA]/40 transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-[#8E24AA]/20 rounded-full flex-shrink-0">
                    <div className="text-[#B388FF]">
                      {objection.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 leading-tight">{objection.question}</h3>
                    <p className="text-gray-300 leading-relaxed">{objection.answer}</p>
                  </div>
                </div>
              </div>)}
          </div>

          {/* CTA for more questions */}
          
        </div>
      </div>
    </section>;
};
export default ObjectionsSection;