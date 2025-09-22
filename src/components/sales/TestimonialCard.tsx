
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  quote: string;
  rating: number;
  avatar?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
  index: number;
}

export const TestimonialCard = ({ testimonial, isActive, index }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 20,
        scale: isActive ? 1 : 0.95,
        zIndex: isActive ? 20 : 0,
        display: isActive ? "block" : "none"
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-[#8E24AA]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#8E24AA]/5"
    >
      <div className="relative">
        <div className="absolute -top-4 -left-2 text-[#8E24AA]/30 text-4xl font-serif">
          "
        </div>
        
        <div className="flex mb-4">
          {Array.from({length: testimonial.rating}).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
        
        <p className="text-lg text-gray-200 italic mb-6 relative z-10">
          "{testimonial.quote}"
        </p>
        
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-3">
            {testimonial.avatar && (
              <Avatar className="h-10 w-10 border border-white/20">
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback className="bg-[#8E24AA]/20 text-white">
                  {testimonial.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="text-sm text-gray-400">{testimonial.position}</p>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-2 -right-2 text-[#8E24AA]/30 text-4xl font-serif">
          "
        </div>
      </div>
    </motion.div>
  );
};
