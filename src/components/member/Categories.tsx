
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Search, LineChart, Play, PenTool, Eye, Sparkles, ArrowRight } from "lucide-react";

// Mapping de categorias para os filtros do catálogo
const categoryMappings = {
  "IA": "ia",
  "SEO/Análise": "seo",
  "Espionagem": "espionagem",
  "Streaming": "streaming",
  "Design/Criação": "design",
  "Diversos": "diversos"
};

const categories = [{
  id: 1,
  icon: <BrainCircuit className="h-8 w-8" />,
  name: "IA",
  description: "Ferramentas de inteligência artificial avançadas",
  color: "#A855F7",
  gradient: "from-purple-600 to-violet-600",
  glowColor: "purple-500/20"
}, {
  id: 2,
  icon: <LineChart className="h-8 w-8" />,
  name: "SEO/Análise",
  description: "Ferramentas para otimização e análise de sites",
  color: "#3B82F6",
  gradient: "from-blue-600 to-indigo-600",
  glowColor: "blue-500/20"
}, {
  id: 3,
  icon: <Eye className="h-8 w-8" />,
  name: "Espionagem",
  description: "Monitore seus concorrentes e o mercado",
  color: "#DC2626",
  gradient: "from-red-600 to-rose-600",
  glowColor: "red-500/20"
}, {
  id: 4,
  icon: <Play className="h-8 w-8" />,
  name: "Streaming",
  description: "Serviços de streaming e mídia premium",
  color: "#EC4899",
  gradient: "from-pink-600 to-rose-600",
  glowColor: "pink-500/20"
}, {
  id: 5,
  icon: <PenTool className="h-8 w-8" />,
  name: "Design/Criação",
  description: "Recursos de design e criação de conteúdo",
  color: "#10B981",
  gradient: "from-emerald-600 to-teal-600",
  glowColor: "emerald-500/20"
}, {
  id: 6,
  icon: <Search className="h-8 w-8" />,
  name: "Diversos",
  description: "Outras ferramentas e recursos especiais",
  color: "#F59E0B",
  gradient: "from-amber-600 to-orange-600",
  glowColor: "amber-500/20"
}];

const Categories = () => {
  // Referência para a seção de catálogo
  const catalogRef = useRef<HTMLDivElement>(null);

  // Função para navegar até a seção de catálogo com o filtro aplicado
  const navigateToCategory = (categoryName: string) => {
    // Encontrar o ID de filtro correspondente à categoria
    const filterId = categoryMappings[categoryName as keyof typeof categoryMappings] || "new";

    // Buscar elemento do catálogo
    const catalogSection = document.querySelector(".bg-zinc-900");
    if (catalogSection) {
      // Rolar até a seção do catálogo
      catalogSection.scrollIntoView({
        behavior: "smooth"
      });

      // Simular o clique no filtro correspondente
      setTimeout(() => {
        const filterButton = document.querySelector(`button[data-category="${filterId}"]`);
        if (filterButton) {
          (filterButton as HTMLButtonElement).click();
        }
      }, 500);
    }
  };

  return (
    <section className="bg-black py-20 px-4 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-purple-500/10 via-blue-500/8 to-transparent rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-emerald-500/8 via-teal-500/10 to-transparent rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_1px,transparent_1px)] [background-size:40px_40px] opacity-40"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 backdrop-blur-xl mb-6 shadow-lg shadow-purple-500/20">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-200">Catálogo Premium</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Explore por Categoria
          </h2>
          <p className="text-zinc-400 text-lg">
            Encontre as ferramentas perfeitas para suas necessidades
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => navigateToCategory(category.name)}
              className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-zinc-800/50 hover:border-purple-500/30 transition-all duration-500 cursor-pointer group relative overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div 
                    className={`p-3 rounded-xl mr-4 group-hover:scale-110 transition-all duration-300 bg-gradient-to-r ${category.gradient} shadow-lg shadow-${category.glowColor} group-hover:shadow-xl`}
                  >
                    <div style={{ color: 'white' }}>
                      {category.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
                <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                  {category.description}
                </p>
              </div>

              {/* Floating particles */}
              <div className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.5s' }}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
