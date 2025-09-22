import { ReactNode } from 'react';
import PageContainer from './PageContainer';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'gradient-primary' | 'gradient-secondary' | 'border-top';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

const SectionContainer = ({ 
  children, 
  className = '', 
  id,
  spacing = 'lg',
  background = 'transparent',
  maxWidth = '7xl'
}: SectionContainerProps) => {
  const spacingClasses = {
    'sm': 'py-12',
    'md': 'py-16',
    'lg': 'py-20',
    'xl': 'py-24'
  };

  const backgroundClasses = {
    'transparent': '',
    'gradient-primary': 'bg-gradient-to-b from-black to-[#0a0a0a]',
    'gradient-secondary': 'bg-gradient-to-b from-[#0a0a0a] to-black',
    'border-top': 'border-t border-[#8E24AA]/20'
  };

  return (
    <section 
      id={id}
      className={`relative ${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
    >
      <PageContainer maxWidth={maxWidth}>
        <div className="relative z-10">
          {children}
        </div>
      </PageContainer>
    </section>
  );
};

export default SectionContainer;