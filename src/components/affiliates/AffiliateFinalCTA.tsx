
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Zap, Clock, ArrowRight, CheckCircle } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AffiliateFinalCTA = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Nome completo é obrigatório";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email inválido";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "WhatsApp é obrigatório";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Dados sobre você e sua audiência são obrigatórios";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, corrija os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("🚀 [FRONTEND] Enviando candidatura de afiliado:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message_length: formData.message.length
      });
      
      const { data, error } = await supabase.functions.invoke('submit-affiliate-application', {
        body: {
          nome_completo: formData.name,
          email: formData.email,
          whatsapp: formData.phone,
          dados_audiencia: formData.message
        }
      });

      if (error) {
        console.error("❌ [FRONTEND] Erro ao enviar:", error);
        toast({
          title: "Erro ao Enviar",
          description: "Ocorreu um erro ao enviar sua candidatura. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      console.log("✅ [FRONTEND] Candidatura enviada com sucesso:", data);
      
      toast({
        title: "Candidatura Enviada!",
        description: "Analisaremos seu perfil e entraremos em contato em até 24h."
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      setFormErrors({});
      
    } catch (error) {
      console.error("💥 [FRONTEND] Erro inesperado:", error);
      toast({
        title: "Erro ao Enviar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionContainer id="formulario" spacing="xl" background="gradient-primary" className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[#B388FF]/10 filter blur-[150px] animate-pulse" style={{
          animationDuration: '10s'
        }}>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Urgency Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Comece hoje a transformar seu <br />
            <span className="bg-gradient-to-r from-[#B388FF] to-[#8E24AA] bg-clip-text text-transparent">tempo livre</span> em renda extra
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Não perca a oportunidade de fazer parte do programa de afiliados mais lucrativo do mercado digital brasileiro.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Formulário */}
          <div className="bg-black/60 backdrop-blur-sm border border-[#B388FF]/30 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Candidate-se Agora</h3>
              <p className="text-gray-400">Preencha os dados e seja aprovado em até 24h</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome completo *
                  </label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Seu nome completo" 
                    className={`bg-black/60 border-[#B388FF]/30 text-white focus:border-[#B388FF] focus:ring-[#B388FF]/30 ${formErrors.name ? 'border-red-500' : ''}`}
                    required 
                    disabled={isSubmitting}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-mail *
                  </label>
                  <Input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="seu.email@dominio.com" 
                    className={`bg-black/60 border-[#B388FF]/30 text-white focus:border-[#B388FF] focus:ring-[#B388FF]/30 ${formErrors.email ? 'border-red-500' : ''}`}
                    required 
                    disabled={isSubmitting}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  WhatsApp *
                </label>
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="(11) 99999-9999" 
                  className={`bg-black/60 border-[#B388FF]/30 text-white focus:border-[#B388FF] focus:ring-[#B388FF]/30 ${formErrors.phone ? 'border-red-500' : ''}`}
                  required 
                  disabled={isSubmitting}
                />
                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Conte sobre você e sua audiência *
                </label>
                <Textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Fale sobre seus canais, número de seguidores, nicho de atuação, experiência com afiliação..." 
                  className={`bg-black/60 border-[#B388FF]/30 text-white focus:border-[#B388FF] focus:ring-[#B388FF]/30 ${formErrors.message ? 'border-red-500' : ''}`}
                  rows={4} 
                  required 
                  disabled={isSubmitting}
                />
                {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#B388FF] to-[#8E24AA] hover:from-[#8E24AA] hover:to-[#B388FF] text-white py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-[#B388FF]/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                {isSubmitting ? "Enviando..." : "Quero Ser Afiliado CYRUS"}
                {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </div>

          {/* Benefícios Finais - Simplificado */}
          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-sm border border-[#B388FF]/20 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                <Zap className="h-6 w-6 text-[#B388FF] mr-2" />
                O que acontece depois?
              </h4>
              
              <div className="space-y-3">
                {[
                  { time: "24h", action: "Análise do seu perfil pela nossa equipe" },
                  { time: "48h", action: "Aprovação e acesso ao painel exclusivo" },
                  { time: "72h", action: "Kit de materiais e link personalizado" },
                  { time: "7 dias", action: "Primeira sessão de mentoria gratuita" }
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-[#B388FF]/20 rounded-lg flex items-center justify-center">
                      <span className="text-[#B388FF] font-bold text-sm">{step.time}</span>
                    </div>
                    <span className="text-gray-300 text-sm">{step.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#B388FF]/10 to-[#8E24AA]/10 border border-[#B388FF]/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">Garantias Exclusivas</h4>
              
              <div className="space-y-3">
                {[
                  "Suporte dedicado por 90 dias",
                  "Materiais atualizados mensalmente", 
                  "Acesso vitalício ao grupo VIP",
                  "Treinamentos exclusivos gratuitos"
                ].map((guarantee, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{guarantee}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm max-w-3xl mx-auto">
            * Cadastro gratuito e aprovação baseada em critérios de qualidade. 
            Priorizamos parceiros alinhados com nossos valores e comprometidos com resultados de longo prazo.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AffiliateFinalCTA;
