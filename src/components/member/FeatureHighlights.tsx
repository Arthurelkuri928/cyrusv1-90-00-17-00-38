
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Coins, LockOpen, Sparkles, Star, Zap } from "lucide-react";

const features = [
  {
    id: 1,
    icon: <ShieldCheck className="h-7 w-7 text-emerald-400" />,
    title: "Acesso Ilimitado",
    description: "Utilize todas as ferramentas sem restrições de tempo ou conteúdo com poder total",
    gradient: "from-emerald-600 via-teal-600 to-emerald-700",
    glowColor: "emerald-500/30",
    borderColor: "emerald-500/40",
    accentIcon: <Zap className="h-4 w-4 text-emerald-300" />
  },
  {
    id: 2,
    icon: <Coins className="h-7 w-7 text-amber-400" />,
    title: "Economia Máxima",
    description: "Economize mais de R$ 8.500 por ano em assinaturas individuais com acesso total",
    gradient: "from-amber-600 via-orange-600 to-yellow-600",
    glowColor: "amber-500/30",
    borderColor: "amber-500/40",
    accentIcon: <Star className="h-4 w-4 text-amber-300" />
  },
  {
    id: 3,
    icon: <LockOpen className="h-7 w-7 text-purple-400" />,
    title: "Premium Elite",
    description: "Todas as ferramentas premium estão disponíveis para seu uso imediato e completo",
    gradient: "from-purple-600 via-violet-600 to-indigo-600",
    glowColor: "purple-500/30",
    borderColor: "purple-500/40",
    accentIcon: <Sparkles className="h-4 w-4 text-purple-300" />
  }
];

const FeatureHighlights = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -100]);

  // Animações premium sofisticadas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
      rotateX: 15,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8
      }
    }
  };

  const hoverVariants = {
    hover: {
      scale: 1.05,
      rotateY: 5,
      rotateX: 5,
      z: 50,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.section 
      className="bg-gradient-to-br from-black via-zinc-900 to-black py-28 px-4 relative overflow-hidden"
      style={{ y }}
    >
      {/* Background premium ultra sofisticado */}
      <div className="absolute inset-0">
        {/* Gradientes animados premium */}
        <motion.div 
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 via-violet-500/15 to-blue-500/10 rounded-full filter blur-[150px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.9, 0.6],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-gradient-to-tl from-emerald-500/15 via-teal-500/20 to-blue-500/12 rounded-full filter blur-[120px]"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 0.8, 0.5],
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-r from-amber-500/12 via-orange-500/18 to-red-500/10 rounded-full filter blur-[110px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
        
        {/* Malha premium animada */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_1px,transparent_1px)] [background-size:80px_80px] opacity-40"
          animate={{
            backgroundPosition: ["0px 0px", "80px 80px", "0px 0px"]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Partículas flutuantes premium */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
          {/* Badge premium elite */}
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/40 backdrop-blur-2xl mb-8 shadow-2xl shadow-purple-500/30 relative overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
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
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="h-5 w-5 text-purple-400" />
            </motion.div>
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent relative z-10">
              Recursos Elite Premium
            </span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent relative"
            variants={cardVariants}
          >
            Recursos Premium
            
            {/* Glow effect atrás do título */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed"
            variants={cardVariants}
          >
            Desfrute de todos os benefícios da plataforma{" "}
            <motion.span 
              className="bg-gradient-to-r from-purple-400 via-blue-400 to-violet-400 bg-clip-text text-transparent font-semibold bg-[length:300%_300%]"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              CYRUS
            </motion.span>{" "}
            com acesso total e irrestrito
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              whileHover="hover"
              className="group cursor-pointer perspective-1000"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div 
                className={`relative overflow-hidden rounded-3xl bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/60 hover:border-${feature.borderColor} transition-all duration-700 shadow-2xl hover:shadow-3xl p-8 group-hover:bg-zinc-900/80`}
                variants={hoverVariants}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Gradient overlay premium */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-3xl`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Shimmer effect premium */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
                
                {/* Glow effect ao hover */}
                <motion.div 
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl -z-10`}
                  whileHover={{ 
                    scale: 1.1,
                    opacity: 0.2
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                <div className="relative z-10">
                  {/* Header do card */}
                  <div className="flex items-center gap-6 mb-8">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-2xl group-hover:shadow-3xl relative overflow-hidden`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        boxShadow: `0 20px 40px ${feature.glowColor}`
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.icon}
                      
                      {/* Shimmer interno do ícone */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                    
                    <div>
                      <motion.h3 
                        className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      {/* Accent icon */}
                      <motion.div 
                        className="flex items-center gap-1 mt-1"
                        animate={{ 
                          opacity: [0.7, 1, 0.7],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {feature.accentIcon}
                        <span className="text-xs text-zinc-400 font-medium">PREMIUM</span>
                      </motion.div>
                    </div>
                  </div>
                  
                  <motion.p 
                    className="text-zinc-400 leading-relaxed text-lg group-hover:text-zinc-300 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    {feature.description}
                  </motion.p>
                </div>

                {/* Partículas decorativas */}
                <motion.div 
                  className="absolute top-6 right-6 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to action premium */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Cada recurso foi desenvolvido pensando na{" "}
            <motion.span 
              className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              excelência e performance máxima
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeatureHighlights;
