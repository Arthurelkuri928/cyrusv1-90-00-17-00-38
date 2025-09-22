import { FileText, BarChart3, Users, Zap, Download, Crown, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/shared/SectionContainer";
const AffiliateResourcesSection = () => {
  const resources = [{
    icon: <FileText className="h-8 w-8 text-[#B388FF]" />,
    title: "Kit de Materiais Premium",
    description: "Banners, imagens, textos e criativos já testados e otimizados para conversão",
    items: ["50+ banners em vários formatos", "Textos para redes sociais", "E-books exclusivos", "Templates de e-mail"]
  }, {
    icon: <BarChart3 className="h-8 w-8 text-[#8E24AA]" />,
    title: "Dashboard Avançado",
    description: "Painel completo para acompanhar suas métricas e resultados em tempo real",
    items: ["Cliques e conversões", "Relatórios detalhados", "Análise de performance", "Projeções de ganhos"]
  }, {
    icon: <Users className="h-8 w-8 text-[#B388FF]" />,
    title: "Suporte Especializado",
    description: "Equipe dedicada para ajudar você a maximizar seus resultados",
    items: ["Atendimento prioritário", "Consultoria estratégica", "Grupo VIP no WhatsApp", "Mentoria personalizada"]
  }, {
    icon: <Zap className="h-8 w-8 text-[#8E24AA]" />,
    title: "Treinamentos Exclusivos",
    description: "Cursos e webinars para você dominar as estratégias de afiliação",
    items: ["Masterclass semanal", "Casos de sucesso", "Estratégias avançadas", "Certificação oficial"]
  }];
  return <SectionContainer spacing="lg" background="border-top">
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
          <Crown className="w-4 h-4 text-[#B388FF] mr-2" />
          <span className="text-sm font-medium text-white">Recursos Exclusivos</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Tudo que você precisa para <span className="text-[#B388FF]">ter sucesso</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Não deixamos você sozinho. Tenha acesso a um arsenal completo de recursos exclusivos para maximizar seus resultados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {resources.map((resource, index) => <div key={index} className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-8 hover:border-[#B388FF]/40 transition-all duration-300 group">
            <div className="flex items-start gap-6">
              <div className="bg-black/60 rounded-xl p-4 group-hover:bg-[#8E24AA]/20 transition-all duration-300">
                {resource.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">{resource.title}</h3>
                <p className="text-gray-400 mb-6">{resource.description}</p>
                
                <div className="space-y-2">
                  {resource.items.map((item, itemIndex) => <div key={itemIndex} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-[#B388FF] rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{item}</span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>)}
      </div>

      {/* Kit de Boas-Vindas */}
      <div className="bg-gradient-to-r from-[#B388FF]/10 to-[#8E24AA]/10 border border-[#B388FF]/30 rounded-2xl p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <Target className="h-16 w-16 text-[#B388FF] mx-auto mb-6" />
          
          <h3 className="text-3xl font-bold text-white mb-4">
            Kit de Boas-Vindas Gratuito
          </h3>
          
          <p className="text-xl text-gray-300 mb-8">
            Assim que for aprovado, receba instantaneamente nosso kit premium com tudo que precisa para começar com o pé direito.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[{
            title: "Guia do Afiliado",
            description: "Manual completo com estratégias testadas"
          }, {
            title: "Templates Prontos",
            description: "Posts, stories e textos de alta conversão"
          }, {
            title: "Scripts Validados",
            description: "Roteiros para vídeos e apresentações"
          }].map((item, index) => <div key={index} className="bg-black/40 rounded-xl p-6 border border-[#B388FF]/20">
                <Download className="h-6 w-6 text-[#B388FF] mx-auto mb-3" />
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>)}
          </div>
          
          <Button onClick={() => document.getElementById('formulario')?.scrollIntoView({
          behavior: 'smooth'
        })} className="bg-gradient-to-r from-[#B388FF] to-[#8E24AA] hover:from-[#8E24AA] hover:to-[#B388FF] text-white px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105">
            <Crown className="mr-2 h-5 w-5" />
            Quero Acesso aos Recursos
            <Download className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Diferencial Competitivo */}
      
    </SectionContainer>;
};
export default AffiliateResourcesSection;