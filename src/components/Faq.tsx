import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { HelpCircle, Sparkles } from "lucide-react";
const Faq = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const faqs = [{
    question: "Como funciona o plano de teste de R$ 0,99?",
    answer: "O plano de teste oferece acesso completo por 1 dia a todas as ferramentas premium por apenas R$ 0,99. É uma oportunidade única para conhecer nossa plataforma antes de escolher um plano maior."
  }, {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer: "Sim, você pode cancelar sua assinatura a qualquer momento através da área do membro. Não há taxas de cancelamento ou multas."
  }, {
    question: "Quais ferramentas estão incluídas nos planos?",
    answer: "Todos os planos incluem acesso às mais de 40 ferramentas premium da plataforma, incluindo ferramentas de IA, SEO, marketing digital, análise de dados e muito mais."
  }, {
    question: "Como funciona o suporte prioritário?",
    answer: "O suporte prioritário oferece atendimento via WhatsApp com tempo de resposta reduzido e acesso direto à nossa equipe técnica especializada."
  }, {
    question: "Posso alterar meu plano depois?",
    answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações entram em vigor no próximo ciclo de cobrança."
  }, {
    question: "Como funciona o programa de afiliados?",
    answer: "Nosso programa de afiliados permite que você ganhe comissões indicando novos usuários. Você recebe um link único e ganha uma porcentagem de cada venda realizada."
  }];
  return <section className="relative px-6 md:px-12 bg-black text-white mx-0 py-0 lg:px-[89px]">
      {/* Background effects mais pronunciados */}
      <div className="absolute inset-0 overflow-hidden px-0 my-[3px] mx-[48px]">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#8E24AA]/25 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#B388FF]/20 rounded-full filter blur-[60px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A64EFF]/15 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Header melhorado */}
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
              Esclarecemos suas principais dúvidas sobre nossos planos e funcionalidades
            </p>
          </div>

          {/* Container destacado para o FAQ */}
          <div className="bg-gradient-to-br from-white/5 to-transparent p-8 md:p-12 rounded-2xl border border-[#8E24AA]/30 backdrop-blur-sm">
            <Accordion type="single" collapsible className="w-full space-y-6">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border border-[#8E24AA]/30 rounded-xl bg-white/5 backdrop-blur-sm px-6 py-3 hover:border-[#8E24AA]/50 hover:bg-white/10 transition-all duration-300">
                  <AccordionTrigger className="text-left hover:no-underline text-white font-semibold text-lg py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 text-base leading-relaxed pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
          
        </div>
      </div>
    </section>;
};
export default Faq;