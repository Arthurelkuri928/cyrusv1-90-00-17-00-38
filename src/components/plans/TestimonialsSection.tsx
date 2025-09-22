
import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const testimonials = [
    {
      name: "Carlos M.",
      role: "Marketing Digital",
      content: "Finalmente encontrei uma plataforma que não me deixa na mão. As ferramentas funcionam sempre que preciso.",
      rating: 5
    },
    {
      name: "Ana S.",
      role: "Consultora",
      content: "A CYRUS mudou como eu trabalho. Acesso rápido, ferramentas confiáveis e resultados consistentes.",
      rating: 5
    },
    {
      name: "Roberto L.",
      role: "Empreendedor",
      content: "Não perco mais tempo com plataformas instáveis. Aqui tudo funciona como deveria desde o primeiro dia.",
      rating: 5
    }
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white">
      {/* Background effects identical to home */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8E24AA]/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A64EFF]/20 rounded-full filter blur-[60px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight tracking-tight text-white max-w-[800px] mx-auto">
              O que nossos <span className="text-[#B388FF]">clientes dizem</span>.
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Profissionais que dependem de resultados escolhem a CYRUS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-[#8E24AA]/20 backdrop-blur-sm hover:border-[#8E24AA]/40 transition-all duration-300"
              >
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-[#B388FF] mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#B388FF] text-[#B388FF]" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
