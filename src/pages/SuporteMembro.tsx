
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import ModernSidebar from "@/components/member/ModernSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  HelpCircle, 
  MessageCircle, 
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const SuporteMembro = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: "",
    priority: "",
    message: ""
  });

  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const selectedAvatar = user?.user_metadata?.avatar_url || '';

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", contactForm);
    // Reset form after submission
    setContactForm({ subject: "", priority: "", message: "" });
    alert(t('ticketCreated') || "Seu ticket foi criado! Nossa equipe entrará em contato em breve.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ModernSidebar
        username={username}
        selectedAvatar={selectedAvatar}
        onProfileClick={handleProfileClick}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="md:ml-20 transition-all duration-300">
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('supportCenter') || 'Central de Suporte'}
            </h1>
            <p className="text-muted-foreground">
              {t('supportCenterDesc') || 'Como podemos ajudá-lo hoje? Nossa equipe está pronta para resolver suas dúvidas.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-[#A855F7]/30 transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#A855F7]/20 rounded-lg flex items-center justify-center mr-4">
                      <MessageCircle className="h-6 w-6 text-[#A855F7]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t('liveChat') || 'Chat ao Vivo'}</h3>
                      <p className="text-sm text-muted-foreground">{t('immediateResponse') || 'Resposta imediata'}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-[#A855F7] hover:bg-[#A855F7]/90">
                    {t('startChat') || 'Iniciar Chat'}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-[#A855F7]/30 transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                      <BookOpen className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t('knowledgeBase') || 'Base de Conhecimento'}</h3>
                      <p className="text-sm text-muted-foreground">{t('articlesAndTutorials') || 'Artigos e tutoriais'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-border hover:border-border">
                    {t('explore') || 'Explorar'}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-[#A855F7]/30 transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t('myTickets') || 'Meus Tickets'}</h3>
                      <p className="text-sm text-muted-foreground">{t('trackRequests') || 'Acompanhar solicitações'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-border hover:border-border">
                    {t('viewTickets') || 'Ver Tickets'}
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center text-foreground">
                  <FileText className="h-5 w-5 mr-2 text-[#A855F7]" />
                  {t('openNewTicket') || 'Abrir Novo Ticket'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                      {t('subject') || 'Assunto'}
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      placeholder={t('describeBriefly') || "Descreva brevemente o problema"}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-1">
                      {t('priority') || 'Prioridade'}
                    </label>
                    <Select onValueChange={(value) => handleSelectChange('priority', value)}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder={t('selectPriority') || "Selecione a prioridade"} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="baixa">{t('low') || 'Baixa'}</SelectItem>
                        <SelectItem value="media">{t('medium') || 'Média'}</SelectItem>
                        <SelectItem value="alta">{t('high') || 'Alta'}</SelectItem>
                        <SelectItem value="urgente">{t('urgent') || 'Urgente'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                      {t('detailedDescription') || 'Descrição detalhada'}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      placeholder={t('describeInDetail') || "Descreva o problema em detalhes. Inclua passos para reproduzir, mensagens de erro, etc."}
                      className="bg-background border-border text-foreground"
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-[#A855F7] hover:bg-[#A855F7]/90">
                    {t('sendTicket') || 'Enviar Ticket'}
                  </Button>
                </form>
              </motion.div>
            </div>

            {/* FAQ Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center text-foreground">
                  <HelpCircle className="h-5 w-5 mr-2 text-[#A855F7]" />
                  {t('faq') || 'Perguntas Frequentes'}
                </h2>
                
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="item-1" className="border border-border rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted text-left">
                      {t('howToResetPassword') || 'Como resetar minha senha?'}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-muted text-muted-foreground">
                      {t('resetPasswordAnswer') || 'Vá em Configurações > Segurança e clique em "Alterar Senha".'}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border border-border rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted text-left">
                      {t('howToChangePlan') || 'Como alterar meu plano?'}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-muted text-muted-foreground">
                      {t('changePlanAnswer') || 'Acesse a página de Assinatura no menu lateral para gerenciar seu plano.'}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border border-border rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted text-left">
                      {t('whereToFindTools') || 'Onde encontro as ferramentas?'}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-muted text-muted-foreground">
                      {t('findToolsAnswer') || 'No Dashboard principal você encontra todas as ferramentas disponíveis organizadas por categoria.'}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Status do Suporte */}
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-500 font-medium">{t('systemOnline') || 'Sistema Online'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('averageResponseTime') || 'Tempo médio de resposta: 2 horas'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuporteMembro;
