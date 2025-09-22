
import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  addSectionRef: (index: number) => (el: HTMLElement | null) => void;
  sectionIndex: number;
}

const AnimatedTestimonials = ({
  testimonials,
  title = "Profissionais que usaram. E pararam de procurar outra.",
  subtitle,
  addSectionRef,
  sectionIndex,
}: AnimatedTestimonialsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Refs for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      },
    },
  };

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Auto rotate testimonials every 6000ms
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section 
      ref={(el) => {
        if (sectionRef.current === null && el !== null) {
          sectionRef.current = el;
        }
        addSectionRef(sectionIndex)(el);
      }}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-gray-300">{subtitle}</p>}
          </motion.div>

          <div className="relative w-full">
            <div className="flex gap-3 justify-center mb-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "w-8 bg-[#8E24AA]" : "w-2.5 bg-white/30"
                  }`}
                  aria-label={`Ver depoimento ${index + 1}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  isActive={activeIndex === index}
                  index={index}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(142,36,170,0.1),transparent_70%)]"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#8E24AA]/10 rounded-full filter blur-[80px]"></div>
    </section>
  );
};

export default AnimatedTestimonials;
