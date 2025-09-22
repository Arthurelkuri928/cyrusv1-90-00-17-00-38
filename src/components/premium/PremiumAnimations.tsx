import React from "react";
import { motion } from "framer-motion";

// Premium animation variants
export const premiumVariants = {
  // Entrada cinematográfica
  cinematicEnter: {
    hidden: { 
      opacity: 0, 
      y: 100, 
      scale: 0.8,
      filter: "blur(20px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 1.2, 
        staggerChildren: 0.1
      } 
    }
  },

  // Hover 3D elegante
  elegantHover: {
    rest: { 
      scale: 1, 
      rotateX: 0, 
      rotateY: 0,
      transition: { duration: 0.4 }
    },
    hover: { 
      scale: 1.05, 
      rotateX: 5, 
      rotateY: 5,
      transition: { duration: 0.4 }
    }
  },

  // Transição suave de gradiente
  gradientSweep: {
    initial: { backgroundPosition: "0% 50%" },
    animate: { 
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: { 
        duration: 3, 
        repeat: Infinity 
      }
    }
  },

  // Reveal on scroll delicado
  delicateReveal: {
    hidden: { 
      opacity: 0, 
      y: 50,
      clipPath: "inset(100% 0 0 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      clipPath: "inset(0% 0 0 0)",
      transition: { 
        duration: 0.8
      } 
    }
  },

  // Pulsação premium
  premiumPulse: {
    animate: {
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    }
  },

  // Float suave
  gentleFloat: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity
      }
    }
  }
};

// Componente de container premium
interface PremiumContainerProps {
  children: React.ReactNode;
  variant?: keyof typeof premiumVariants;
  className?: string;
}

export const PremiumContainer: React.FC<PremiumContainerProps> = ({ 
  children, 
  variant = "cinematicEnter", 
  className = "" 
}) => {
  return (
    <motion.div
      variants={premiumVariants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Botão premium com animações sofisticadas
interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = ""
}) => {
  const baseClasses = "relative overflow-hidden font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25",
    secondary: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30",
    glass: "bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 text-white hover:from-white/10 hover:to-white/15"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      variants={premiumVariants.elegantHover}
      initial="rest"
      whileHover="hover"
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        animate={{
          translateX: ["100%", "-100%"],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Card premium com efeitos 3D
interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className = "",
  glowColor = "purple"
}) => {
  return (
    <motion.div
      className={`relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 transition-all duration-500 ${className}`}
      variants={premiumVariants.elegantHover}
      initial="rest"
      whileHover="hover"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-${glowColor}-500/5 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Loading premium
export const PremiumLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div className="relative">
        {/* Anel externo */}
        <motion.div
          className="w-16 h-16 border-4 border-purple-500/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Anel interno */}
        <motion.div
          className="absolute top-2 left-2 w-12 h-12 border-4 border-t-purple-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Centro pulsante */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

export default { PremiumContainer, PremiumButton, PremiumCard, PremiumLoader, premiumVariants };
