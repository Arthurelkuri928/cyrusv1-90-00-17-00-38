
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, Search, Sparkles, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animações premium sofisticadas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8
      }
    }
  };

  const floatingParticles = Array.from({ length: 12 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2,
      }}
    />
  ));

  return (
    <section className="relative py-32 md:py-40 px-6 md:px-12 lg:px-24 bg-black overflow-hidden">
      {/* Enhanced Background com efeitos premium */}
      <div className="absolute inset-0">
        {/* Gradiente principal premium */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.2)_0%,rgba(168,85,247,0.1)_45%,transparent_100%)]"
          animate={{
            background: [
              "radial-gradient(ellipse at top, rgba(139,92,246,0.2) 0%, rgba(168,85,247,0.1) 45%, transparent 100%)",
              "radial-gradient(ellipse at top, rgba(168,85,247,0.2) 0%, rgba(139,92,246,0.1) 45%, transparent 100%)",
              "radial-gradient(ellipse at top, rgba(139,92,246,0.2) 0%, rgba(168,85,247,0.1) 45%, transparent 100%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Orbs flutuantes premium com glow */}
        <motion.div 
          className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/25 via-violet-500/20 to-blue-500/15 rounded-full filter blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-indigo-500/20 via-purple-500/25 to-pink-500/15 rounded-full filter blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.7, 0.5],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Malha premium com shimmer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_1px,transparent_1px)] [background-size:60px_60px] opacity-30" />
        
        {/* Partículas flutuantes */}
        {floatingParticles}
        
        {/* Overlay de shimmer animado */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transform: "skewX(-12deg)" }}
        />
      </div>
      
      <motion.div 
        className="max-w-4xl mx-auto w-full relative z-10 text-center"
        style={{ y, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Badge premium elite */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/40 backdrop-blur-2xl mb-10 shadow-2xl shadow-purple-500/30 relative overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)",
            transition: { duration: 0.3 }
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-5 w-5 text-purple-400" />
          </motion.div>
          <span className="text-sm font-semibold bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 bg-clip-text text-transparent relative z-10">
            Plataforma Elite Premium
          </span>
          <motion.div
            animate={{ 
              rotate: [0, -360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Star className="h-4 w-4 text-yellow-400" />
          </motion.div>
        </motion.div>
        
        {/* Título principal com efeito cinematográfico */}
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-10 leading-tight tracking-tight relative"
          variants={itemVariants}
        >
          <motion.span 
            className="bg-gradient-to-r from-white via-purple-200 via-blue-200 to-white bg-clip-text text-transparent bg-[length:400%_400%]"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            Acesso Total a
          </motion.span>
          <br />
          <motion.span 
            className="bg-gradient-to-r from-purple-400 via-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent bg-[length:400%_400%]"
            animate={{
              backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            Ferramentas Premium
          </motion.span>
          
          {/* Glow effect atrás do texto */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.h1>
        
        {/* Descrição premium */}
        <motion.p 
          className="text-xl md:text-2xl lg:text-3xl mb-14 text-zinc-300 max-w-4xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          O acesso a ferramentas de alta performance disponível em um só lugar.{" "}
          <motion.span 
            className="bg-gradient-to-r from-purple-400 via-blue-400 to-violet-400 bg-clip-text text-transparent font-semibold bg-[length:300%_300%]"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            Navegue pela plataforma e utilize todo o poder que ela tem a oferecer.
          </motion.span>
        </motion.p>
        
        {/* Botões CTA premium com efeitos avançados */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="redDark" 
              size="lg"
              className="w-full sm:w-auto px-10 py-4 group relative overflow-hidden shadow-2xl shadow-red-900/40 hover:shadow-red-900/60 transition-all duration-500 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border border-red-500/40 text-lg font-semibold"
            >
              {/* Shimmer effect interno */}
              <motion.div 
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-400/0 via-red-300/40 to-red-400/0 -translate-x-full"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div
                className="flex items-center gap-3 relative z-10"
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <PlayCircle className="h-6 w-6 group-hover:animate-pulse" />
                <span>🎬 Assistir Tutorial</span>
              </motion.div>
              
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-lg bg-red-500/20 blur-xl -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="purpleDark"
              size="lg"
              className="w-full sm:w-auto px-10 py-4 group relative overflow-hidden shadow-2xl shadow-purple-900/40 hover:shadow-purple-900/60 transition-all duration-500 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-500/40 text-lg font-semibold"
            >
              {/* Shimmer effect interno */}
              <motion.div 
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400/0 via-purple-300/40 to-purple-400/0 -translate-x-full"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div
                className="flex items-center gap-3 relative z-10"
                animate={{ x: [0, -2, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Search className="h-6 w-6 group-hover:animate-pulse" />
                <span>🔍 Explorar Recursos</span>
              </motion.div>
              
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-lg bg-purple-500/20 blur-xl -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* Elementos decorativos flutuantes premium */}
        <motion.div 
          className="absolute top-10 left-10 w-3 h-3 bg-purple-400 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-20 right-20 w-2 h-2 bg-blue-400 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-32 left-1/4 w-2.5 h-2.5 bg-violet-400 rounded-full"
          animate={{
            y: [0, -25, 0],
            opacity: [0.5, 0.9, 0.5],
            scale: [1, 1.4, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
