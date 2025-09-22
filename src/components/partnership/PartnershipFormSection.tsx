
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Handshake, 
  Shield, 
  Clock, 
  CheckCircle, 
  Instagram, 
  Youtube, 
  Twitter,
  Linkedin,
  Globe
} from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PartnershipFormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    mainPlatform: "",
    followers: "",
    monthlyViews: "",
    businessArea: "",
    experience: "",
    motivation: "",
    socialProof: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
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
    
    if (!formData.whatsapp.trim()) {
      errors.whatsapp = "WhatsApp é obrigatório";
    }
    
    if (!formData.mainPlatform) {
      errors.mainPlatform = "Selecione sua principal plataforma";
    }
    
    if (!formData.followers) {
      errors.followers = "Selecione o número de seguidores";
    }
    
    if (!formData.businessArea) {
      errors.businessArea = "Selecione sua área de atuação";
    }
    
    if (!formData.experience) {
      errors.experience = "Selecione sua experiência com afiliações";
    }
    
    if (!formData.motivation.trim()) {
      errors.motivation = "Conte sobre sua motivação";
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
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    console.log('🚀 [FRONTEND] Iniciando envio da candidatura de parceria...');
    console.log('📊 [FRONTEND] Dados do formulário:', {
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      mainPlatform: formData.mainPlatform,
      followers: formData.followers,
      businessArea: formData.businessArea,
      experience: formData.experience,
      motivation: formData.motivation ? 'preenchido' : 'vazio',
      socialProof: formData.socialProof || 'não fornecido'
    });
    
    try {
      console.log('📡 [FRONTEND] Chamando Edge Function submit-partnership-application...');
      
      // Mapeamento correto dos campos para corresponder exatamente ao que a Edge Function espera
      const requestBody = {
        nome_completo: formData.name,
        email_profissional: formData.email,  // Campo correto conforme a tabela
        whatsapp: formData.whatsapp,
        plataforma: formData.mainPlatform,
        numero_seguidores: formData.followers,
        area_atuacao_principal: formData.businessArea,
        experiencia_afiliacao: formData.experience,
        motivo_parceria: formData.motivation,
        link_perfil_principal: formData.socialProof || ''
      };

      console.log('📤 [FRONTEND] Dados sendo enviados:', requestBody);

      const { data, error } = await supabase.functions.invoke('submit-partnership-application', {
        body: requestBody
      });

      console.log('📨 [FRONTEND] Resposta da Edge Function:', { data, error });

      if (error) {
        console.error('❌ [FRONTEND] Erro da Edge Function:', error);
        throw error;
      }

      console.log('✅ [FRONTEND] Candidatura enviada com sucesso!');
      
      toast({
        title: "Candidatura enviada com sucesso!",
        description: "Nossa equipe analisará seu perfil e entrará em contato em até 24h.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        mainPlatform: "",
        followers: "",
        monthlyViews: "",
        businessArea: "",
        experience: "",
        motivation: "",
        socialProof: ""
      });
      setFormErrors({});
      
    } catch (error) {
      console.error('💥 [FRONTEND] Error submitting partnership application:', error);
      toast({
        title: "Erro ao enviar candidatura",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const platformIcons = {
    instagram: <Instagram className="h-4 w-4" />,
    youtube: <Youtube className="h-4 w-4" />,
    linkedin: <Linkedin className="h-4 w-4" />,
    twitter: <Twitter className="h-4 w-4" />,
    website: <Globe className="h-4 w-4" />
  };

  return (
    <SectionContainer id="formulario" spacing="lg" background="border-top">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
            <Handshake className="w-4 h-4 text-[#B388FF] mr-2" />
            <span className="text-sm font-medium text-white">Candidatura Exclusiva</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Pronto para <span className="text-[#B388FF]">transformar</span> sua influência?
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Preencha sua candidatura com atenção. Analisamos cada perfil cuidadosamente para garantir o fit perfeito.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-black/60 backdrop-blur-sm border border-[#8E24AA]/30 rounded-2xl p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <div className="w-8 h-8 bg-[#B388FF]/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#B388FF] font-bold">1</span>
                      </div>
                      Informações Pessoais
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome completo *
                        </label>
                        <Input 
                          value={formData.name} 
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Seu nome completo" 
                          className={`bg-zinc-900 border-[#8E24AA]/20 text-white focus-visible:ring-0 focus-visible:ring-offset-0 border ${formErrors.name ? 'border-red-500' : ''}`}
                          required 
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          E-mail profissional *
                        </label>
                        <Input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="seu.email@dominio.com" 
                          className={`bg-zinc-900 border-[#8E24AA]/20 text-white focus-visible:ring-0 focus-visible:ring-offset-0 border ${formErrors.email ? 'border-red-500' : ''}`}
                          required 
                        />
                        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          WhatsApp *
                        </label>
                        <Input 
                          value={formData.whatsapp} 
                          onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                          placeholder="(11) 99999-9999" 
                          className={`bg-zinc-900 border-[#8E24AA]/20 text-white focus-visible:ring-0 focus-visible:ring-offset-0 border ${formErrors.whatsapp ? 'border-red-500' : ''}`}
                          required 
                        />
                        {formErrors.whatsapp && <p className="text-red-500 text-sm mt-1">{formErrors.whatsapp}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Audience Info */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <div className="w-8 h-8 bg-[#B388FF]/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#B388FF] font-bold">2</span>
                      </div>
                      Sua Audiência
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Principal plataforma *
                        </label>
                        <Select value={formData.mainPlatform} onValueChange={(value) => handleInputChange('mainPlatform', value)}>
                          <SelectTrigger className={`bg-zinc-900 border-[#8E24AA]/20 text-white focus:ring-0 focus:ring-offset-0 border ${formErrors.mainPlatform ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Selecione sua principal plataforma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="twitter">Twitter/X</SelectItem>
                            <SelectItem value="website">Site/Blog</SelectItem>
                            <SelectItem value="others">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.mainPlatform && <p className="text-red-500 text-sm mt-1">{formErrors.mainPlatform}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Número de seguidores *
                        </label>
                        <Select value={formData.followers} onValueChange={(value) => handleInputChange('followers', value)}>
                          <SelectTrigger className={`bg-zinc-900 border-[#8E24AA]/20 text-white focus:ring-0 focus:ring-offset-0 border ${formErrors.followers ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Selecione a faixa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1k-5k">1k - 5k</SelectItem>
                            <SelectItem value="5k-10k">5k - 10k</SelectItem>
                            <SelectItem value="10k-50k">10k - 50k</SelectItem>
                            <SelectItem value="50k-100k">50k - 100k</SelectItem>
                            <SelectItem value="100k+">100k+</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.followers && <p className="text-red-500 text-sm mt-1">{formErrors.followers}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Área de atuação *
                        </label>
                        <Select value={formData.businessArea} onValueChange={(value) => handleInputChange('businessArea', value)}>
                          <SelectTrigger className={`bg-zinc-900 border-[#8E24AA]/20 text-white focus:ring-0 focus:ring-offset-0 border ${formErrors.businessArea ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Sua área principal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="marketing">Marketing Digital</SelectItem>
                            <SelectItem value="business">Negócios/Empreendedorismo</SelectItem>
                            <SelectItem value="productivity">Produtividade</SelectItem>
                            <SelectItem value="tech">Tecnologia</SelectItem>
                            <SelectItem value="finance">Finanças</SelectItem>
                            <SelectItem value="education">Educação</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                            <SelectItem value="others">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.businessArea && <p className="text-red-500 text-sm mt-1">{formErrors.businessArea}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Experiência com afiliações *
                        </label>
                        <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                          <SelectTrigger className={`bg-zinc-900 border-[#8E24AA]/20 text-white focus:ring-0 focus:ring-offset-0 border ${formErrors.experience ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Seu nível de experiência" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhuma experiência</SelectItem>
                            <SelectItem value="beginner">Iniciante (1-6 meses)</SelectItem>
                            <SelectItem value="intermediate">Intermediário (6m-2 anos)</SelectItem>
                            <SelectItem value="advanced">Avançado (2+ anos)</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.experience && <p className="text-red-500 text-sm mt-1">{formErrors.experience}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <div className="w-8 h-8 bg-[#B388FF]/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#B388FF] font-bold">3</span>
                      </div>
                      Sobre Você
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Por que quer ser parceiro CYRUS? *
                        </label>
                        <Textarea 
                          value={formData.motivation} 
                          onChange={(e) => handleInputChange('motivation', e.target.value)}
                          placeholder="Conte sobre suas motivações e objetivos como parceiro..." 
                          className={`bg-zinc-900 border-[#8E24AA]/20 text-white focus-visible:ring-0 focus-visible:ring-offset-0 border ${formErrors.motivation ? 'border-red-500' : ''}`}
                          rows={4}
                          required
                        />
                        {formErrors.motivation && <p className="text-red-500 text-sm mt-1">{formErrors.motivation}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Link do seu principal perfil/canal
                        </label>
                        <Input 
                          value={formData.socialProof} 
                          onChange={(e) => handleInputChange('socialProof', e.target.value)}
                          placeholder="https://instagram.com/seuperfil" 
                          className="bg-zinc-900 border-[#8E24AA]/20 text-white focus-visible:ring-0 focus-visible:ring-offset-0 border" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="cyrusPrimary" 
                    size="cyrus" 
                    className="w-full py-6 text-xl font-bold bg-gradient-to-r from-[#B388FF] to-[#8E24AA] hover:from-[#8E24AA] hover:to-[#B388FF] text-white border-0"
                    disabled={isSubmitting}
                  >
                    <Handshake className="mr-2 h-6 w-6" />
                    {isSubmitting ? "Enviando..." : "Enviar Candidatura"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Process Steps */}
            <div className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Próximos Passos</h3>
              
              <div className="space-y-4">
                {[
                  { step: "1", title: "Análise em 24h", desc: "Revisão cuidadosa do seu perfil" },
                  { step: "2", title: "Entrevista por vídeo", desc: "Conversa de 15min para alinhamento" },
                  { step: "3", title: "Onboarding premium", desc: "Treinamento e materiais exclusivos" },
                  { step: "4", title: "Primeiros ganhos", desc: "Suporte ativo nos primeiros 30 dias" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#B388FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#B388FF] font-bold text-sm">{item.step}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-gradient-to-br from-[#B388FF]/10 to-[#B388FF]/10 border border-[#B388FF]/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Shield className="h-5 w-5 text-[#B388FF] mr-2" />
                Nossas Garantias
              </h3>
              
              <div className="space-y-3">
                {[
                  "Processo 100% transparente",
                  "Resposta em até 24h úteis",
                  "Sem custos ou taxas ocultas",
                  "Suporte premium garantido"
                ].map((guarantee, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{guarantee}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Dúvidas?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-300">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Respondemos em até 2h</span>
                </div>
                <div className="text-[#B388FF]">partnerships@cyrus.com</div>
                <div className="text-[#B388FF]">WhatsApp: (11) 99999-0000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default PartnershipFormSection;
