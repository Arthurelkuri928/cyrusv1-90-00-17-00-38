import { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
const TestimonialsSection = ({
  addSectionRef
}: {
  addSectionRef: (index: number) => (el: HTMLElement | null) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const testimonials = [{
    id: 1,
    quote: "Finalmente um suporte que entende o que faço.",
    name: "Fernanda C.",
    position: "estrategista",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  }, {
    id: 2,
    quote: "CYRUS é estrutura. Todo o resto parece improviso.",
    name: "Roberto S.",
    position: "gestor de mídia",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  }, {
    id: 3,
    quote: "É a única que funciona sem me dar dor de cabeça.",
    name: "Helena T.",
    position: "ecom manager",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }];

  // Auto-rotate testimonials every 6 seconds
  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % testimonials.length);
      }, 6000);
    };
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length]);

  // Reset timer when manually navigating
  const handleDotClick = (index: number) => {
    setActiveIndex(index);

    // Reset interval when manually clicking
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);
  };
  return <section ref={addSectionRef(5)} className="relative py-24 px-6 md:px-12 lg:px-24 bg-black select-none">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
        {/* Left Column - Text and Navigation */}
        <div className="flex flex-col">
          {/* Badge */}
          <Badge className="w-fit bg-transparent border border-white/20 mb-6 py-2 px-4">
            <Star className="h-4 w-4 mr-2 text-white fill-white" />
            <span>Todos que usaram</span>
          </Badge>
          
          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Profissionais que usaram.<br /> 
            E pararam de procurar outra.
          </h2>
          
          {/* Subtitle */}
          <p className="text-muted-foreground text-base sm:text-lg max-w-[500px] mb-10">
            Veja o que profissionais experientes dizem sobre a CYRUS.
          </p>
          
          {/* Navigation Dots */}
          <div className="flex gap-2 mt-auto">
            {testimonials.map((_, index) => <button key={index} onClick={() => handleDotClick(index)} className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? "w-8 bg-[#8E24AA]" : "w-2 bg-white/20"}`} aria-label={`Ver depoimento ${index + 1}`} />)}
          </div>
        </div>
        
        {/* Right Column - Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {testimonials.map((testimonial, index) => activeIndex === index && <motion.div key={testimonial.id} initial={{
            opacity: 0,
            x: 100
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -100
          }} transition={{
            duration: 0.5
          }} className="border border-white/10 rounded-xl bg-[#0A0A0A] p-8">
                  {/* Stars */}
                  <div className="flex mb-6">
                    {Array.from({
                length: testimonial.rating
              }).map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />)}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-white/90 text-lg font-medium leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  
                  <Separator className="bg-muted/20 my-6" />
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-white/20">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-[#8E24AA]/20 text-white">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    </div>
                  </div>
                </motion.div>)}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Background accents */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-[#8E24AA]/10 to-transparent opacity-60 blur-3xl pointer-events-none"></div>
      <div className="absolute top-24 -right-32 w-80 h-80 rounded-full bg-gradient-to-l from-[#8E24AA]/10 to-transparent opacity-40 blur-3xl pointer-events-none"></div>
    </section>;
};
export default TestimonialsSection;