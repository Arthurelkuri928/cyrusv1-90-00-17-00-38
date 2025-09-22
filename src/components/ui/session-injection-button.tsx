
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SessionInjectionButtonProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const SessionInjectionButton = ({ 
  size = "default", 
  className = "" 
}: SessionInjectionButtonProps) => {
  const [isInjecting, setIsInjecting] = useState(false);
  const { t } = useLanguage();

  const handleSessionInjection = async () => {
    setIsInjecting(true);
    
    try {
      // Simulate session injection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Open the tool with injected session
      window.open("https://example.com", "_blank");
    } catch (error) {
      console.error("Session injection failed:", error);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <Button 
      size={size}
      onClick={handleSessionInjection}
      disabled={isInjecting}
      className={`bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-purple-500/20 ${className}`}
    >
      <Zap className="mr-2 h-4 w-4" />
      {isInjecting ? "..." : t('accessWithSession')}
    </Button>
  );
};
