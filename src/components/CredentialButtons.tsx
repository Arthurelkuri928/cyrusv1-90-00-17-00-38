
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check, Cookie, Key, Mail, Lock, Code, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToolCredential } from "@/hooks/use-tool-credentials";

interface CredentialButtonsProps {
  credentials: ToolCredential[];
}

const CredentialButtons = ({ credentials }: CredentialButtonsProps) => {
  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (value: string, label: string, index: number) => {
    // Validate cookie integrity before copying
    if (label.toLowerCase().includes('cookie')) {
      if (!validateCookieIntegrity(value)) {
        toast({
          title: "⚠️ Aviso de Integridade",
          description: "O cookie pode estar corrompido ou incompleto. Verifique antes de usar.",
          variant: "destructive",
          duration: 4000
        });
      }
    }

    navigator.clipboard.writeText(value);
    
    // Update copied state for this button
    setCopiedStates(prev => ({
      ...prev,
      [`${label}-${index}`]: true
    }));
    
    // Show specific toast for cookies
    const toastTitle = label.toLowerCase().includes('cookie') 
      ? "🍪 Cookies copiados!" 
      : "📋 Copiado com sucesso!";
    
    toast({
      title: toastTitle,
      description: `${label} foi copiado para a área de transferência.`,
      duration: 3000
    });
    
    // Reset state after 2 seconds
    setTimeout(() => {
      setCopiedStates(prev => ({
        ...prev,
        [`${label}-${index}`]: false
      }));
    }, 2000);
  };

  const validateCookieIntegrity = (cookieValue: string): boolean => {
    if (!cookieValue || cookieValue.length < 5) return false;
    
    // Basic validation for cookie format
    const hasCookieStructure = cookieValue.includes('=') || 
                              cookieValue.includes('domain') || 
                              cookieValue.includes('path') ||
                              cookieValue.startsWith('[') || 
                              cookieValue.startsWith('{');
    
    return hasCookieStructure;
  };

  const getCredentialIcon = (type: string, label: string) => {
    const normalizedType = type.toLowerCase();
    const normalizedLabel = label.toLowerCase();
    
    if (normalizedType.includes('cookie') || normalizedLabel.includes('cookie')) {
      return <Cookie className="mr-2 h-5 w-5 text-orange-500" />;
    }
    
    if (normalizedType.includes('email') || normalizedLabel.includes('email')) {
      return <Mail className="mr-2 h-5 w-5 text-blue-500" />;
    }
    
    if (normalizedType.includes('password') || normalizedType.includes('senha')) {
      return <Lock className="mr-2 h-5 w-5 text-red-500" />;
    }
    
    if (normalizedType.includes('token') || normalizedType.includes('api')) {
      return <Code className="mr-2 h-5 w-5 text-green-500" />;
    }
    
    if (normalizedType.includes('login') || normalizedType.includes('user')) {
      return <Key className="mr-2 h-5 w-5 text-purple-500" />;
    }
    
    return <Globe className="mr-2 h-5 w-5 text-gray-500" />;
  };

  const getButtonVariant = (type: string, label: string) => {
    const normalizedType = type.toLowerCase();
    const normalizedLabel = label.toLowerCase();
    
    if (normalizedType.includes('cookie') || normalizedLabel.includes('cookie')) {
      return "secondary" as const;
    }
    
    return "purpleDark" as const;
  };

  const formatCredentialPreview = (value: string, type: string): string => {
    if (type.toLowerCase().includes('cookie')) {
      // Show cookie count and size for preview
      try {
        const cookieLength = value.length;
        const cookieCount = value.split(';').length;
        return `${cookieCount} cookie(s) • ${Math.round(cookieLength / 1024)}KB`;
      } catch {
        return `Cookie • ${Math.round(value.length / 1024)}KB`;
      }
    }
    
    // For other credentials, show truncated value
    if (value.length > 20) {
      return `${value.substring(0, 15)}...`;
    }
    
    return value;
  };

  if (!credentials || credentials.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        Credenciais da Ferramenta
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {credentials.map((credential, index) => {
          const buttonKey = `${credential.label}-${index}`;
          const isCopied = copiedStates[buttonKey];
          const buttonVariant = getButtonVariant(credential.type, credential.label);
          const credentialIcon = getCredentialIcon(credential.type, credential.label);
          
          return (
            <div key={buttonKey} className="relative group">
              <Button
                variant={buttonVariant}
                size="lg"
                className="w-full h-auto py-3 px-4 flex flex-col items-start gap-2"
                onClick={() => handleCopy(credential.value, credential.label, index)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {credentialIcon}
                    <span className="font-medium">{credential.label}</span>
                  </div>
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 opacity-70" />
                  )}
                </div>
                
                {/* Preview for cookies */}
                {credential.type.toLowerCase().includes('cookie') && (
                  <div className="text-xs opacity-80 font-mono text-left w-full">
                    {formatCredentialPreview(credential.value, credential.type)}
                  </div>
                )}
              </Button>
              
              {/* Tooltip for cookies */}
              {credential.type.toLowerCase().includes('cookie') && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  🍪 Cookies de sessão • Clique para copiar
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Cookie-specific help text */}
      {credentials.some(cred => cred.type.toLowerCase().includes('cookie')) && (
        <div className="text-xs text-muted-foreground p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-2">
            <Cookie className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong>🍪 Cookies detectados:</strong> Use estes cookies para manter a sessão ativa. 
              Cole-os nas configurações do navegador ou extensão para acesso automático à ferramenta.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialButtons;
