import { useState } from "react";
import UniversalNavbar from "@/components/UniversalNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CyrusBackground from "@/components/shared/CyrusBackground";
import HeroLayout from "@/components/shared/HeroLayout";
import SectionContainer from "@/components/shared/SectionContainer";
import FeatureCard from "@/components/shared/FeatureCard";
import { MessageCircle, Mail, HelpCircle, CheckCircle, Clock, Shield, Headphones, FileText, Users, Settings, CreditCard, Sparkles, Activity, Zap } from "lucide-react";

const Suporte = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle subject select change
  const handleSelectChange = (value: string) => {
    setContactForm(prev => ({
      ...prev,
      subject: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", contactForm);
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    alert("Sua mensagem foi enviada! Entraremos em contato em breve.");
  };

  return (
    <CyrusBackground>
      <UniversalNavbar />
      
      {/* Hero Section */}
      <HeroLayout
        icon={Headphones}
        title={
          <>
            Precisa de <span className="bg-gradient-to-r from-text-cyrus-light to-text-cyrus-accent bg-clip-text text-transparent">Ajuda?</span> Estamos Aqui Para Você
          </>
        }
        description={
          <>
            Conte com nosso suporte para tirar dúvidas, resolver problemas ou receber orientações sobre 
            <span className="text-white font-bold"> qualquer funcionalidade da plataforma.</span>
          </>
        }
        subtitle="Fale com nosso time de suporte de forma rápida e prática."
        actions={
          <>
            <Button 
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')} 
              variant="cyrusPrimary" 
              size="xl" 
              className="group"
            >
              <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Falar no WhatsApp
            </Button>
            <Button 
              variant="cyrusGhost" 
              size="xl" 
              onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Mail className="mr-2 h-5 w-5" />
              Enviar E-mail
            </Button>
          </>
        }
      />
      
      {/* Canais de Atendimento */}
      <SectionContainer 
        background="gradient-primary" 
        className="border-t border-cyrus"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Canais de <span className="bg-gradient-to-r from-text-cyrus-light to-text-cyrus-accent bg-clip-text text-transparent">Atendimento</span>
          </h2>
          <p className="text-xl text-foreground-muted">Escolha a forma mais conveniente para entrar em contato</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: MessageCircle,
              title: "WhatsApp",
              description: "Atendimento rápido e prioritário para resolver suas dúvidas imediatamente",
              highlight: "Resposta imediata",
              onClick: () => window.open('https://wa.me/5511999999999', '_blank')
            },
            {
              icon: Mail,
              title: "E-mail",
              description: "Para dúvidas mais detalhadas que precisam de documentação ou prints",
              highlight: "24h para resposta",
              onClick: () => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
            },
            {
              icon: HelpCircle,
              title: "Central de Ajuda",
              description: "Artigos, tutoriais em vídeo e perguntas frequentes organizados",
              highlight: "Autoatendimento",
              onClick: () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
            },
            {
              icon: Activity,
              title: "Status da Plataforma",
              description: "Acompanhe manutenções programadas e status dos serviços",
              highlight: "Tempo real",
              onClick: () => window.open('https://status.cyrus.com', '_blank')
            }
          ].map((channel, index) => (
            <FeatureCard
              key={index}
              icon={channel.icon}
              title={channel.title}
              description={channel.description}
              highlight={channel.highlight}
              onClick={channel.onClick}
              className="cursor-pointer"
            />
          ))}
        </div>
      </SectionContainer>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-b from-[#0a0a0a] to-black border-t border-[#a259ff]/20">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Perguntas <span className="bg-gradient-to-r from-[#a259ff] to-[#c084fc] bg-clip-text text-transparent">Frequentes</span>
            </h2>
            <p className="text-xl text-gray-400">Respostas rápidas para as dúvidas mais comuns</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[{
              question: "Como altero meu plano?",
              answer: "Acesse 'Minha Conta' > 'Planos' e selecione o novo pacote desejado. A alteração é imediata e você pode fazer upgrade ou downgrade a qualquer momento."
            }, {
              question: "Como funciona o programa de afiliados?",
              answer: "Nosso programa oferece até 50% de comissão por venda. Você recebe um link exclusivo, materiais prontos e suporte direto. Pagamentos via Pix semanalmente."
            }, {
              question: "Minhas ferramentas não estão funcionando, o que fazer?",
              answer: "Primeiro, verifique sua conexão com a internet. Se persistir, entre em contato via WhatsApp com prints da tela. Nossa equipe resolve em até 30 minutos."
            }, {
              question: "Como entro em contato com o suporte?",
              answer: "WhatsApp é o canal mais rápido (resposta imediata). Para questões complexas, use o formulário de e-mail. Também temos chat ao vivo de segunda a sexta, 8h às 20h."
            }, {
              question: "Posso cancelar minha assinatura a qualquer momento?",
              answer: "Sim, sem fidelidade. O cancelamento pode ser feito na área 'Minha Conta' ou entrando em contato conosco. Você mantém acesso até o final do período pago."
            }, {
              question: "Como recuperar minha senha?",
              answer: "Clique em 'Esqueci minha senha' na tela de login. Você receberá um e-mail com instruções. Se não receber, verifique sua caixa de spam ou entre em contato."
            }, {
              question: "Onde encontro tutoriais de uso?",
              answer: "Na área de membros temos uma seção dedicada aos tutoriais em vídeo. Também enviamos por e-mail guias práticos e dicas de uso das ferramentas."
            }].map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="bg-black/60 border border-[#a259ff]/30 rounded-xl overflow-hidden backdrop-blur-sm hover:bg-[#a259ff]/10 transition-all duration-300">
                  <AccordionTrigger className="px-6 py-4 text-left hover:text-[#c084fc] transition-colors duration-300 text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 text-gray-300 text-base leading-relaxed border-t border-[#a259ff]/20">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* Formulário de Contato */}
      <section id="contato" className="py-20 bg-gradient-to-r from-[#a259ff]/10 via-black to-[#c084fc]/10 border-t border-[#a259ff]/20">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Entre em <span className="bg-gradient-to-r from-[#a259ff] to-[#c084fc] bg-clip-text text-transparent">Contato</span>
            </h2>
            <p className="text-xl text-gray-400">Nossa equipe responde em até 24h</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="backdrop-blur-md bg-black/60 border border-[#a259ff]/30 rounded-2xl p-8 shadow-2xl shadow-[#a259ff]/20">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Nome completo *
                      </label>
                      <Input id="name" name="name" value={contactForm.name} onChange={handleInputChange} placeholder="Seu nome completo" className="bg-zinc-900 border-[#a259ff]/30 text-white focus:border-[#a259ff] focus:ring-[#a259ff]/30" required />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        E-mail *
                      </label>
                      <Input id="email" name="email" type="email" value={contactForm.email} onChange={handleInputChange} placeholder="seu.email@dominio.com" className="bg-zinc-900 border-[#a259ff]/30 text-white focus:border-[#a259ff] focus:ring-[#a259ff]/30" required />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Assunto *
                    </label>
                    <Select onValueChange={handleSelectChange}>
                      <SelectTrigger className="bg-zinc-900 border-[#a259ff]/30 text-white focus:border-[#a259ff] focus:ring-[#a259ff]/30">
                        <SelectValue placeholder="Selecione o assunto" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-[#a259ff]/30 text-white">
                        <SelectItem value="suporte-tecnico">Suporte Técnico</SelectItem>
                        <SelectItem value="problemas-ferramentas">Problemas com Ferramentas</SelectItem>
                        <SelectItem value="cobranca">Cobrança e Pagamentos</SelectItem>
                        <SelectItem value="afiliados">Programa de Afiliados</SelectItem>
                        <SelectItem value="sugestoes">Sugestões e Melhorias</SelectItem>
                        <SelectItem value="outro">Outro Assunto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Mensagem *
                    </label>
                    <Textarea id="message" name="message" value={contactForm.message} onChange={handleInputChange} placeholder="Descreva detalhadamente sua dúvida ou problema..." className="bg-zinc-900 border-[#a259ff]/30 text-white focus:border-[#a259ff] focus:ring-[#a259ff]/30" rows={6} required />
                  </div>
                  
                  <Button type="submit" variant="cyrusPrimary" className="w-full py-6 text-lg font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-[#a259ff]/50">
                    <Mail className="mr-2 h-5 w-5" />
                    Enviar Mensagem
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Final - CTA */}
      <section className="py-20 bg-gradient-to-r from-[#a259ff]/20 via-black to-[#c084fc]/20 border-t border-[#a259ff]/20">
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight md:text-6xl">
            Ainda precisa de ajuda? <span className="bg-gradient-to-r from-[#a259ff] to-[#c084fc] bg-clip-text text-transparent">Fale diretamente com nosso time</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed px-[62px]">
            Nossa equipe está pronta para resolver qualquer dúvida ou problema. 
            <span className="text-[#a259ff] font-bold"> Atendimento humanizado e especializado!</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button onClick={() => window.open('https://wa.me/5511999999999', '_blank')} variant="cyrusPrimary" size="xl" className="px-12 py-6 text-lg font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-[#a259ff]/50 group">
              <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Abrir Suporte no WhatsApp
            </Button>
            <Button variant="cyrusGhost" size="xl" className="px-8 py-6 text-lg hover:scale-105 transition-all duration-300 border-2" onClick={() => document.getElementById('contato')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              <Mail className="mr-2 h-5 w-5" />
              Enviar E-mail
            </Button>
          </div>
          
          {/* Sparkles effect */}
          <div className="relative mt-12">
            <Sparkles className="absolute top-0 left-1/4 h-4 w-4 text-[#c084fc] animate-pulse opacity-70" />
            <Sparkles className="absolute top-4 right-1/3 h-3 w-3 text-[#8b5cf6] animate-pulse delay-700 opacity-70" />
            <Sparkles className="absolute -bottom-2 left-2/3 h-4 w-4 text-[#a259ff] animate-pulse delay-300 opacity-70" />
          </div>
        </div>
      </section>

      <Footer />
    </CyrusBackground>
  );
};

export default Suporte;
