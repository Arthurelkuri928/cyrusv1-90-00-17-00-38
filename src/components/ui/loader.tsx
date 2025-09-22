
import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dots' | 'spinner';
}

const Loader: React.FC<LoaderProps> = ({ className, size = 'md', variant = 'dots' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  };

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center space-x-1", className)}>
        <div 
          className={cn(
            "bg-purple-600 rounded-full animate-pulse",
            dotSizeClasses[size]
          )}
          style={{
            animationDelay: '0ms',
            animationDuration: '1000ms'
          }}
        />
        <div 
          className={cn(
            "bg-purple-600 rounded-full animate-pulse",
            dotSizeClasses[size]
          )}
          style={{
            animationDelay: '200ms',
            animationDuration: '1000ms'
          }}
        />
        <div 
          className={cn(
            "bg-purple-600 rounded-full animate-pulse",
            dotSizeClasses[size]
          )}
          style={{
            animationDelay: '400ms',
            animationDuration: '1000ms'
          }}
        />
      </div>
    );
  }

  // spinner variant  
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div 
        className={cn(
          "border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin",
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export default Loader;
