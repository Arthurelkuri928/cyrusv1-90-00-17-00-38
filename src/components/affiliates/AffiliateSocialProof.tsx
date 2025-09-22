
import { Star, DollarSign, Users } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";

const AffiliateSocialProof = () => {
  const testimonials = [
    {
      name: "Marina Silva",
      role: "Influenciadora Digital",
      avatar: "/lovable-uploads/avatar-1.jpg",
      result: "R$ 3.847/mês",
      quote: "Em 60 dias já estava faturando mais de R$ 3k por mês. O suporte da CYRUS é excepcional e os materiais realmente convertem.",
      followers: "125k seguidores",
      time: "2 meses"
    },
    {
      name: "Carlos Mendes",
      role: "YouTuber Tech",
      avatar: "/lovable-uploads/avatar-2.jpg", 
      result: "R$ 7.230/mês",
      quote: "Nunca vi uma empresa tratar seus afiliados com tanto carinho. Além da comissão alta, eles realmente se importam com nosso sucesso.",
      followers: "89k inscritos",
      time: "4 meses"
    },
    {
      name: "Ana Paula",
      role: "Consultora de Marketing",
      avatar: "/lovable-uploads/avatar-3.jpg",
      result: "R$ 12.450/mês",
      quote: "Testei várias empresas e a CYRUS disparou é a melhor. Produto sólido, comissão justa e pagamento sempre em dia.",
      followers: "45k LinkedIn",
      time: "6 meses"
    }
  ];

  const results = [
    {
      icon: <DollarSign className="h-8 w-8 text-[#B388FF]" />,
      number: "R$ 2.3M+",
      label: "Em comissões pagas",
      description: "Valor total distribuído para nossos afiliados"
    },
    {
      icon: <Users className="h-8 w-8 text-[#8E24AA]" />,
      number: "587",
      label: "Afiliados ativos",
      description: "Parceiros promovendo nossa plataforma"
    },
    {
      icon: <Star className="h-8 w-8 text-[#B388FF]" />,
      number: "4.9/5",
      label: "Avaliação média",
      description: "Satisfação dos nossos afiliados"
    }
  ];

  return (
    <SectionContainer spacing="lg" background="gradient-secondary">
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-[#B388FF]/10 border border-[#B388FF]/30 rounded-full px-6 py-2 mb-6">
          <Star className="w-4 h-4 text-[#B388FF] mr-2" />
          <span className="text-sm font-medium text-white">Resultados Comprovados</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Sucesso dos nossos <span className="text-[#B388FF]">Afiliados</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Veja os resultados reais de quem já faz parte do nosso programa de parceria
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {results.map((result, index) => (
          <div 
            key={index}
            className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-8 text-center hover:border-[#B388FF]/40 transition-all duration-300"
          >
            <div className="bg-[#8E24AA]/20 rounded-xl p-4 mb-4 inline-block">
              {result.icon}
            </div>
            
            <div className="text-4xl font-bold text-[#B388FF] mb-2">{result.number}</div>
            <h3 className="text-xl font-bold text-white mb-2">{result.label}</h3>
            <p className="text-gray-400 text-sm">{result.description}</p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index}
            className="bg-black/40 backdrop-blur-sm border border-[#8E24AA]/20 rounded-2xl p-6 hover:border-[#B388FF]/40 transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#B388FF] to-[#8E24AA] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-bold">{testimonial.name}</h4>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
                <p className="text-[#B388FF] text-sm font-semibold">{testimonial.followers}</p>
              </div>
              
              <div className="text-right">
                <div className="text-[#B388FF] font-bold text-lg">{testimonial.result}</div>
                <div className="text-gray-400 text-xs">{testimonial.time}</div>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-gray-300 italic leading-relaxed mb-4">
              "{testimonial.quote}"
            </blockquote>

            {/* Rating */}
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-[#B388FF]/10 to-[#8E24AA]/10 border border-[#B388FF]/30 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Pronto para ser o próximo caso de sucesso?
        </h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Junte-se a centenas de afiliados que já transformaram sua audiência em uma fonte de renda recorrente e estável.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-[#B388FF] to-[#8E24AA] hover:from-[#8E24AA] hover:to-[#B388FF] text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
          >
            <DollarSign className="inline mr-2 h-5 w-5" />
            Quero Resultados Como Esses
          </button>
          
          <button 
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            className="border border-[#B388FF]/30 text-white hover:bg-[#B388FF]/10 px-6 py-3 rounded-xl transition-all duration-300"
          >
            Falar com um Especialista
          </button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AffiliateSocialProof;
