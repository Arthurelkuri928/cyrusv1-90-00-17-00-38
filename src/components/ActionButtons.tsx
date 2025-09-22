
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ActionButton } from "@/shared/types/tool";

interface ActionButtonsProps {
  buttons: ActionButton[];
}

const ActionButtons = ({ buttons }: ActionButtonsProps) => {
  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (value: string, label: string, buttonId: string) => {
    navigator.clipboard.writeText(value);
    
    setCopiedStates(prev => ({
      ...prev,
      [buttonId]: true
    }));
    
    toast({
      title: "Copiado com sucesso!",
      description: `${label} foi copiado para a área de transferência.`,
      duration: 3000
    });
    
    setTimeout(() => {
      setCopiedStates(prev => ({
        ...prev,
        [buttonId]: false
      }));
    }, 2000);
  };

  const handleLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getButtonIcon = (type: string, buttonId: string) => {
    if (type === 'copy') {
      return copiedStates[buttonId] ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />;
    }
    if (type === 'link') {
      return <ExternalLink className="mr-2 h-4 w-4" />;
    }
    return <Play className="mr-2 h-4 w-4" />;
  };

  if (!buttons || buttons.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-medium mb-3 text-foreground">Botões de Ação</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {buttons.map((button) => (
          <Button
            key={button.id}
            variant="outline"
            size="lg"
            className="w-full transition-all duration-300 hover:scale-[1.02]"
            onClick={() => {
              if (button.type === 'copy' && button.value) {
                handleCopy(button.value, button.label, button.id);
              } else if (button.type === 'link' && button.url) {
                handleLink(button.url);
              }
            }}
          >
            {getButtonIcon(button.type, button.id)}
            {copiedStates[button.id] && button.type === 'copy' ? 'Copiado!' : button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ActionButtons;
