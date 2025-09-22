
import { motion } from "framer-motion";
import ToolCard, { ToolCardProps } from "./ToolCard";

interface ToolsGridProps {
  tools: ToolCardProps[];
  viewMode: "grid" | "list";
}

const ToolsGrid = ({ tools, viewMode }: ToolsGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const getGridLayout = () => {
    if (viewMode === "grid") {
      return "grid gap-4 sm:gap-5 md:gap-6 xl:gap-8 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]";
    } else {
      return "grid grid-cols-1 lg:grid-cols-2 gap-6";
    }
  };

  const getCardStyles = () => {
    if (viewMode === "grid") {
      return "w-full max-w-[280px] mx-auto";
    } else {
      return "w-full";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`w-full ${getGridLayout()}`}
    >
      {tools.map((tool) => (
        <div 
          key={tool.id} 
          className={`${getCardStyles()} transform transition-all duration-300 hover:scale-105`}
        >
          <ToolCard {...tool} viewMode={viewMode} />
        </div>
      ))}
    </motion.div>
  );
};

export default ToolsGrid;
