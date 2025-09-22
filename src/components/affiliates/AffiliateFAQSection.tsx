import { HelpCircle, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionContainer from "@/components/shared/SectionContainer";
const AffiliateFAQSection = () => {
  const faqs = [{
    question: "Preciso pagar para ser afiliado?",
    answer: "Não! Nosso programa de afiliados é 100% gratuito. Você não paga nada para participar e não há custos ocultos. Você só ganha, nunca paga."
  }, {
    question: "Quanto vou ganhar por venda?",
    answer: "Você recebe 30% de comissão vitalícia sobre cada assinatura ativa. Isso significa: Plano Básico (R$ 47) = R$ 14,10/mês, Plano Profissional (R$ 97) = R$ 29,10/mês, Plano Elite (R$ 197) = R$ 59,10/mês."
  }, {
    question: "Quando recebo meu pagamento?",
    answer: "Os pagamentos são realizados toda sexta-feira via Pix, referente às comissões da semana anterior. Não há valor mínimo para saque - assim que tiver R$ 0,01, já pode receber."
  }, {
    question: "Posso indicar para qualquer pessoa?",
    answer: "Sim! Nosso produto atende empreendedores, freelancers, pequenas empresas e qualquer pessoa que precise de ferramentas digitais. Quanto mais diversificada sua audiência, maior seu potencial de ganhos."
  }, {
    question: "Como vou acompanhar meus resultados?",
    answer: "Você terá acesso a um painel completo e exclusivo onde pode ver em tempo real: cliques no seu link, conversões, comissões geradas, pagamentos realizados e muito mais."
  }, {
    question: "Que tipo de suporte vocês oferecem?",
    answer: "Oferecemos suporte premium com atendimento prioritário via WhatsApp, consultoria estratégica, materiais exclusivos, treinamentos semanais e grupo VIP com outros afiliados de sucesso."
  }, {
    question: "Posso promover em redes sociais?",
    answer: "Claro! Pode promover no Instagram, YouTube, TikTok, Facebook, LinkedIn, WhatsApp, Telegram, blog, podcast ou qualquer canal que desejar. Fornecemos materiais específicos para cada plataforma."
  }];
  return <SectionContainer spacing="lg" background="gradient-secondary">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
            <HelpCircle className="w-4 h-4 text-[#B388FF] mr-2" />
            <span className="text-sm font-medium text-white">Dúvidas Frequentes</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Perguntas <span className="text-[#B388FF]">Frequentes</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Esclarecemos as principais dúvidas sobre nosso programa de afiliados
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-8">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border border-[#8E24AA]/30 rounded-xl bg-black/20 backdrop-blur-sm px-6 py-3 hover:border-[#B388FF]/50 hover:bg-black/40 transition-all duration-300">
                <AccordionTrigger className="text-left hover:no-underline text-white font-semibold text-lg py-4 [&[data-state=open]>svg]:text-[#B388FF]">
                  <span className="pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 text-base leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>

        {/* CTA adicional após FAQ */}
        <div className="mt-12 text-center">
          
        </div>
      </div>
    </SectionContainer>;
};
export default AffiliateFAQSection;