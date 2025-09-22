
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES, getRouteLabel } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RouteSelectorProps {
  label: string;
  url: string;
  onUrlChange: (url: string) => void;
  onLabelChange?: (label: string) => void;
  showCustomUrl?: boolean;
  placeholder?: string;
}

const RouteSelector: React.FC<RouteSelectorProps> = ({
  label,
  url,
  onUrlChange,
  onLabelChange,
  showCustomUrl = true,
  placeholder = "Selecione uma rota ou digite uma personalizada"
}) => {
  const [useCustomUrl, setUseCustomUrl] = React.useState(false);

  // Check if current URL matches any of our predefined routes
  const isKnownRoute = Object.values(ROUTES).includes(url as any);
  const needsCorrection = url === '/login' && (
    label.toLowerCase().includes('entrar') || 
    label.toLowerCase().includes('login')
  );

  // Get suggested routes based on label
  const getSuggestedRoutes = () => {
    const labelLower = label.toLowerCase();
    const suggestions = [];
    
    if (labelLower.includes('entrar') || labelLower.includes('login') || labelLower.includes('sign in')) {
      suggestions.push({ value: ROUTES.LOGIN, label: 'Login/Entrar' });
    }
    if (labelLower.includes('cadastro') || labelLower.includes('registro') || labelLower.includes('sign up')) {
      suggestions.push({ value: ROUTES.REGISTER, label: 'Cadastro/Registro' });
    }
    if (labelLower.includes('plano')) {
      suggestions.push({ value: ROUTES.PLANS, label: 'Planos' });
    }
    if (labelLower.includes('home') || labelLower.includes('início') || labelLower.includes('inicio')) {
      suggestions.push({ value: ROUTES.HOME, label: 'Página Inicial' });
    }
    
    return suggestions;
  };

  const handleRouteSelect = (selectedRoute: string) => {
    if (selectedRoute === 'custom') {
      setUseCustomUrl(true);
    } else {
      setUseCustomUrl(false);
      onUrlChange(selectedRoute);
    }
  };

  const handleFixUrl = () => {
    if (needsCorrection) {
      onUrlChange(ROUTES.LOGIN);
    }
  };

  const suggestedRoutes = getSuggestedRoutes();

  return (
    <div className="space-y-3">
      {needsCorrection && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>URL incorreta detectada. O link "/login" deve ser "/entrar"</span>
            <Button size="sm" onClick={handleFixUrl} variant="outline">
              Corrigir
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {suggestedRoutes.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Rotas Sugeridas para "{label}"</Label>
          <Select onValueChange={handleRouteSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar rota sugerida" />
            </SelectTrigger>
            <SelectContent>
              {suggestedRoutes.map((route) => (
                <SelectItem key={route.value} value={route.value}>
                  <div className="flex items-center space-x-2">
                    <span>{route.label}</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">{route.value}</code>
                  </div>
                </SelectItem>
              ))}
              {showCustomUrl && (
                <SelectItem value="custom">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-3 w-3" />
                    <span>URL Personalizada</span>
                  </div>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {(useCustomUrl || suggestedRoutes.length === 0) && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {suggestedRoutes.length > 0 ? 'URL Personalizada' : 'URL'}
          </Label>
          <Input
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder={placeholder}
          />
          {!isKnownRoute && url && (
            <p className="text-xs text-gray-500">
              Esta é uma URL personalizada. Certifique-se de que ela existe na aplicação.
            </p>
          )}
        </div>
      )}
      
      {isKnownRoute && (
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <span>✓</span>
          <span>Rota válida: {getRouteLabel(url)}</span>
        </div>
      )}
    </div>
  );
};

export default RouteSelector;
