
import { Users, Star } from "lucide-react";

const TestimonialsSection = ({ addSectionRef }: { addSectionRef: (index: number) => (el: HTMLElement | null) => void }) => {
  const testimonials = [
    {
      quote: "Pela primeira vez, o suporte sabia o que eu precisava.",
      author: "Fernanda C.",
      position: "estrategista",
      rating: 5
    },
    {
      quote: "CYRUS é técnica. E isso faz diferença.",
      author: "Roberto S.",
      position: "gestor de mídia",
      rating: 5
    },
    {
      quote: "Funciona. Simples assim.",
      author: "Helena T.",
      position: "ecom manager",
      rating: 5
    }
  ];

  return (
    <section 
      ref={addSectionRef(5)}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-[#0A0F1C] text-white"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="bg-[#8E24AA]/20 p-3 rounded-full mb-4">
            <Users className="h-6 w-6 text-[#8E24AA]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Profissionais Reais, Resultados Reais
          </h2>
        </div>
        
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-zinc-900 border border-white/5 rounded-xl p-6 hover:shadow-[#304FFE]/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex mb-4">
                {Array.from({length: testimonial.rating}).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
              <p className="font-semibold text-white">– {testimonial.author},</p>
              <p className="text-sm text-zinc-400">{testimonial.position}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#304FFE]/5 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default TestimonialsSection;
