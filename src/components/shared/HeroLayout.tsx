import { ReactNode } from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';
import SectionContainer from './SectionContainer';

interface HeroLayoutProps {
  icon?: LucideIcon;
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  showSparkles?: boolean;
}

const HeroLayout = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  description, 
  actions,
  spacing = 'xl',
  showSparkles = true
}: HeroLayoutProps) => {
  return (
    <SectionContainer spacing={spacing} className="pt-32 pb-20">
      <div className="text-center">
        {/* Icon */}
        {Icon && (
          <div className="flex justify-center mb-8">
            <div className="relative p-4 bg-gradient-to-r from-[#8E24AA]/20 to-[#A64EFF]/20 rounded-full border border-[#8E24AA]/40 backdrop-blur-sm">
              <Icon className="h-12 w-12 text-[#A64EFF]" />
              <div className="absolute inset-2 bg-[#A64EFF]/15 rounded-full blur-lg"></div>
              <div className="absolute inset-0 bg-[#A64EFF]/10 rounded-full blur-xl"></div>
            </div>
          </div>
        )}
        
        {/* Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight max-w-6xl mx-auto">
          {title}
        </h1>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg text-[#8E24AA] font-semibold mb-6 max-w-4xl mx-auto">
            {subtitle}
          </p>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
            {description}
          </p>
        )}
        
        {/* Actions */}
        {actions && (
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            {actions}
          </div>
        )}
        
        {/* Floating sparkles */}
        {showSparkles && (
          <div className="relative mt-8">
            <Sparkles className="absolute -top-4 left-1/4 h-4 w-4 text-[#c084fc] animate-pulse opacity-70" />
            <Sparkles className="absolute top-2 right-1/3 h-3 w-3 text-[#8E24AA] animate-pulse delay-700 opacity-70" />
            <Sparkles className="absolute -bottom-2 left-2/3 h-4 w-4 text-[#A64EFF] animate-pulse delay-300 opacity-70" />
            <Sparkles className="absolute top-6 left-1/2 h-2 w-2 text-[#c084fc] animate-pulse delay-1000 opacity-50" />
            <Sparkles className="absolute -top-2 right-1/4 h-3 w-3 text-[#8E24AA] animate-pulse delay-500 opacity-60" />
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default HeroLayout;