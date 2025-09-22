import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: string;
  gradient?: string;
  onClick?: () => void;
  className?: string;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  highlight, 
  gradient = "from-[#8E24AA]/20 to-[#A64EFF]/10",
  onClick,
  className = ""
}: FeatureCardProps) => {
  return (
    <div 
      className={`group relative backdrop-blur-md bg-black/60 border border-[#8E24AA]/30 rounded-2xl p-8 hover:shadow-2xl hover:shadow-[#8E24AA]/30 hover:-translate-y-2 transition-all duration-500 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {gradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      )}
      
      <div className="relative z-10">
        {highlight && (
          <div className="absolute top-4 right-4 bg-[#8E24AA]/20 text-[#8E24AA] text-xs font-bold px-3 py-1 rounded-full">
            {highlight}
          </div>
        )}
        
        <div className="flex items-center mb-6">
          <div className="p-3 bg-[#8E24AA]/20 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-8 w-8 text-[#8E24AA]" />
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        
        <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;