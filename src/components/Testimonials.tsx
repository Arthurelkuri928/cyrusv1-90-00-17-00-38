import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dados dos depoimentos
const testimonials = [{
  id: 1,
  name: "Thiago Lima",
  position: "Despertar Digital",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
  testimonial: "A Astron faz toda a diferença dentro do meu negócio! Com certeza a melhor aquisição que já fiz para minha empresa."
}, {
  id: 2,
  name: "Murilo Henrique",
  position: "Afiliagram",
  image: "https://randomuser.me/api/portraits/men/45.jpg",
  testimonial: "Astron Members eu uso e recomendo! Pra mim, com certeza é a melhor área de membros do mercado!"
}, {
  id: 3,
  name: "Gabriel Juste",
  position: "Insta Criativo",
  image: "https://randomuser.me/api/portraits/men/67.jpg",
  testimonial: "Área de membros maravilhosa, gerando uma experiência incrível aumentando o LTV."
}, {
  id: 4,
  name: "Ana Silva",
  position: "Digital Expert",
  image: "https://randomuser.me/api/portraits/women/44.jpg",
  testimonial: "Simplesmente incrível! A plataforma mais completa que já utilizei para área de membros."
}, {
  id: 5,
  name: "Carlos Oliveira",
  position: "Marketing Digital",
  image: "https://randomuser.me/api/portraits/men/22.jpg",
  testimonial: "Consigo gerenciar meus cursos e membros com facilidade e eficiência. Recomendo totalmente!"
}];
const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 350; // Aproximadamente a largura de cada card + marginRight
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    const newIndex = direction === "left" ? Math.max(0, currentIndex - 1) : Math.min(testimonials.length - 3, currentIndex + 1);
    setCurrentIndex(newIndex);
    scrollRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth"
    });
  };
  return <div className="bg-[#111] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Veja os depoimentos de nossos clientes.</h2>
          <p className="text-gray-400">Confira o que os clientes falam da Astron Members.</p>
        </div>
        
        <div className="relative">
          <div ref={scrollRef} className="flex overflow-x-auto gap-6 pb-8 testimonial-slide" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
            {testimonials.map(testimonial => <div key={testimonial.id} className="flex-shrink-0 w-[320px] bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
                <div className="flex flex-col items-center text-center">
                  <img src={testimonial.image} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 object-cover" />
                  <h3 className="text-xl font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-gray-400 mb-4">{testimonial.position}</p>
                  <p className="text-gray-300 italic">"{testimonial.testimonial}"</p>
                  
                  <Button variant="outline" className="mt-6 border-primary text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-2 font-normal text-base">
                    Assistir Depoimento
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>)}
          </div>
          
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black/50 border border-gray-700 text-white hover:bg-black hover:text-primary rounded-full" onClick={() => handleScroll("left")} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black/50 border border-gray-700 text-white hover:bg-black hover:text-primary rounded-full" onClick={() => handleScroll("right")} disabled={currentIndex === testimonials.length - 3}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-center gap-1 mt-6">
          {testimonials.map((_, index) => <div key={index} className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-gray-700'}`} />)}
        </div>
      </div>
    </div>;
};
export default Testimonials;