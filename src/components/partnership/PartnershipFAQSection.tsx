import { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PartnershipFAQSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const faqs = [
    {
      question: "Qual é o valor mínimo de ganhos para receber?",
      answer: "Não há valor mínimo! Assim que você tiver R$ 0,01 em comissões, já pode solicitar o pagamento. Pagamos via Pix em até 7 dias úteis."
    },
    {
      question: "Como vocês garantem que minha audiência será bem atendida?",
      answer: "Temos uma equipe de suporte premium dedicada exclusivamente aos indicados de parceiros. Além disso, você terá acesso direto ao nosso time para acompanhar qualquer situação em tempo real."
    },
    {
      question: "Existe algum custo para se tornar parceiro?",
      answer: "Zero custos. O programa é 100% gratuito. Você só ganha, nunca paga nada para participar. Até os materiais de marketing são fornecidos gratuitamente."
    },
    {
      question: "Como vocês se comparam com outros programas do mercado?",
      answer: "Oferecemos 30% de comissão recorrente (vs 15-20% da concorrência), pagamentos em 7 dias (vs 30-60 dias), suporte dedicado e materiais premium exclusivos. Somos referência em transparência e resultados."
    },
    {
      question: "Quanto tempo leva para ser aprovado?",
      answer: "Nossa análise é feita em até 24 horas úteis. Priorizamos qualidade sobre quantidade, então avaliamos cuidadosamente cada candidatura para garantir fit cultural e de valores."
    },
    {
      question: "Posso promover outros produtos junto com a CYRUS?",
      answer: "Sim, desde que não sejam concorrentes diretos. Na verdade, incentivamos que você tenha múltiplas fontes de renda. A CYRUS deve ser vista como um complemento sólido ao seu portfólio."
    },
    {
      question: "E se eu não conseguir gerar vendas?",
      answer: "Oferecemos treinamento completo, materiais de alta conversão, suporte dedicado e mentoria. Nosso índice de sucesso é de 89% entre parceiros que seguem nossa metodologia. Você não fica sozinho."
    },
    {
      question: "Qual o perfil ideal de parceiro CYRUS?",
      answer: "Profissionais sérios com audiência engajada interessada em produtividade, marketing digital, empreendedorismo ou tecnologia. Priorizamos qualidade do público sobre quantidade de seguidores."
    }
  ];

  return (
    <section className="relative px-6 md:px-12 bg-black text-white mx-0 py-0 lg:px-[89px]">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden px-0 my-[3px] mx-[48px]">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#8E24AA]/25 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#B388FF]/20 rounded-full filter blur-[60px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A64EFF]/15 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-[#8E24AA]/20 to-[#A64EFF]/20 rounded-full border border-[#8E24AA]/40 backdrop-blur-sm">
                <HelpCircle className="h-8 w-8 text-[#B388FF]" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Perguntas <span className="text-[#B388FF]">Frequentes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tire todas suas dúvidas sobre o programa de parceria da CYRUS
            </p>
          </div>

          {/* Container destacado para o FAQ */}
          <div className="bg-gradient-to-br from-white/5 to-transparent p-8 md:p-12 rounded-2xl border border-[#8E24AA]/30 backdrop-blur-sm">
            <Accordion type="single" collapsible className="w-full space-y-6">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="border border-[#8E24AA]/30 rounded-xl bg-white/5 backdrop-blur-sm px-6 py-3 hover:border-[#8E24AA]/50 hover:bg-white/10 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left hover:no-underline text-white font-semibold text-lg py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 text-base leading-relaxed pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default PartnershipFAQSection;