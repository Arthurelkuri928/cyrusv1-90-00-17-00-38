
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Copy, Check, Upload, Download, AlertTriangle, Cookie } from 'lucide-react';
import { toast } from 'sonner';

interface CookieData {
  domain?: string;
  path?: string;
  value: string;
  name?: string;
  expires?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

interface CookieManagerSectionProps {
  cookiesData: string;
  onCookiesChange: (cookies: string) => void;
  toolName: string;
}

const CookieManagerSection: React.FC<CookieManagerSectionProps> = ({
  cookiesData,
  onCookiesChange,
  toolName
}) => {
  const [showRawCookies, setShowRawCookies] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  // Parse cookies to extract individual cookie entries
  const parseCookies = (cookieString: string): CookieData[] => {
    if (!cookieString) return [];
    
    try {
      // Try to parse as JSON first
      const jsonCookies = JSON.parse(cookieString);
      if (Array.isArray(jsonCookies)) {
        return jsonCookies;
      }
    } catch {
      // If not JSON, treat as raw cookie string and try to parse
      return cookieString.split(';').map(cookie => {
        const [nameValue, ...attributes] = cookie.trim().split('=');
        const [name, value] = nameValue.split('=');
        
        const cookieData: CookieData = {
          name: name?.trim(),
          value: value?.trim() || nameValue.trim(),
        };

        // Parse attributes
        attributes.forEach(attr => {
          const [key, val] = attr.split('=');
          const attrKey = key?.trim().toLowerCase();
          
          switch (attrKey) {
            case 'domain':
              cookieData.domain = val?.trim();
              break;
            case 'path':
              cookieData.path = val?.trim();
              break;
            case 'expires':
              cookieData.expires = val?.trim();
              break;
            case 'secure':
              cookieData.secure = true;
              break;
            case 'httponly':
              cookieData.httpOnly = true;
              break;
            case 'samesite':
              cookieData.sameSite = val?.trim() as 'Strict' | 'Lax' | 'None';
              break;
          }
        });

        return cookieData;
      });
    }
    
    return [];
  };

  const validateCookies = async () => {
    setIsValidating(true);
    
    try {
      const cookies = parseCookies(cookiesData);
      
      if (cookies.length === 0 && cookiesData.trim()) {
        setValidationResult({
          isValid: false,
          message: 'Formato de cookies inválido. Verifique a sintaxe.'
        });
        return;
      }

      // Validate each cookie
      const invalidCookies = cookies.filter(cookie => 
        !cookie.value || cookie.value.length < 1
      );

      if (invalidCookies.length > 0) {
        setValidationResult({
          isValid: false,
          message: `${invalidCookies.length} cookie(s) com valores inválidos encontrados.`
        });
        return;
      }

      // Check for potential security issues
      const insecureCookies = cookies.filter(cookie => 
        !cookie.secure && cookie.value.includes('session')
      );

      if (insecureCookies.length > 0) {
        setValidationResult({
          isValid: true,
          message: `⚠️ ${insecureCookies.length} cookie(s) de sessão sem flag secure detectados.`
        });
        return;
      }

      setValidationResult({
        isValid: true,
        message: `✅ ${cookies.length} cookie(s) válidos. Formato correto.`
      });

    } catch (error) {
      setValidationResult({
        isValid: false,
        message: 'Erro na validação dos cookies. Verifique o formato.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleCopyRawCookies = () => {
    navigator.clipboard.writeText(cookiesData);
    setCopiedState(true);
    toast.success('Cookies copiados para área de transferência');
    
    setTimeout(() => setCopiedState(false), 2000);
  };

  const formatCookiesForDisplay = () => {
    if (!cookiesData) return 'Nenhum cookie configurado';
    
    const cookies = parseCookies(cookiesData);
    if (cookies.length === 0) return 'Formato inválido';
    
    return cookies.map((cookie, index) => (
      <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded border">
        <div className="font-mono text-xs">
          {cookie.name ? `${cookie.name}=` : ''}{cookie.value.substring(0, 50)}
          {cookie.value.length > 50 ? '...' : ''}
        </div>
        {(cookie.domain || cookie.path) && (
          <div className="text-xs text-muted-foreground mt-1">
            {cookie.domain && <span>Domain: {cookie.domain} </span>}
            {cookie.path && <span>Path: {cookie.path}</span>}
          </div>
        )}
        <div className="flex gap-1 mt-1">
          {cookie.secure && <Badge variant="secondary" className="text-xs">Secure</Badge>}
          {cookie.httpOnly && <Badge variant="secondary" className="text-xs">HttpOnly</Badge>}
          {cookie.sameSite && <Badge variant="outline" className="text-xs">{cookie.sameSite}</Badge>}
        </div>
      </div>
    ));
  };

  const cookieCount = parseCookies(cookiesData).length;
  const cookieSize = new Blob([cookiesData]).size;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cookie className="h-5 w-5 text-orange-500" />
          Gerenciamento de Cookies - {toolName}
          {cookieCount > 0 && (
            <Badge variant="outline" className="ml-2">
              {cookieCount} cookie{cookieCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Cookie Stats */}
        {cookiesData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{cookieCount}</div>
              <div className="text-xs text-muted-foreground">Cookies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(cookieSize / 1024)}KB</div>
              <div className="text-xs text-muted-foreground">Tamanho</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {parseCookies(cookiesData).filter(c => c.secure).length}
              </div>
              <div className="text-xs text-muted-foreground">Seguros</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {parseCookies(cookiesData).filter(c => c.httpOnly).length}
              </div>
              <div className="text-xs text-muted-foreground">HttpOnly</div>
            </div>
          </div>
        )}

        {/* Cookie Preview */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Preview dos Cookies</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
            {formatCookiesForDisplay()}
          </div>
        </div>

        {/* Cookie Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Editor de Cookies</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowRawCookies(!showRawCookies)}
              >
                {showRawCookies ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showRawCookies ? 'Ocultar Raw' : 'Ver Raw'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyRawCookies}
                disabled={!cookiesData}
              >
                {copiedState ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copiar
              </Button>
            </div>
          </div>
          
          <Textarea
            value={cookiesData}
            onChange={(e) => onCookiesChange(e.target.value)}
            placeholder="Cole aqui os cookies da ferramenta...&#10;&#10;Formatos suportados:&#10;• Raw cookie string: name=value; domain=.example.com; path=/; secure&#10;• JSON array: [{&quot;name&quot;:&quot;session&quot;,&quot;value&quot;:&quot;abc123&quot;,&quot;domain&quot;:&quot;.example.com&quot;}]"
            rows={showRawCookies ? 12 : 6}
            className="font-mono text-sm"
          />
        </div>

        {/* Validation */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={validateCookies}
            disabled={isValidating || !cookiesData}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            {isValidating ? 'Validando...' : 'Validar Cookies'}
          </Button>
          
          {validationResult && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
              validationResult.isValid 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {validationResult.message}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
          <strong>💡 Dica:</strong> Cole os cookies diretamente do navegador (F12 → Application → Cookies) 
          ou no formato JSON estruturado. O sistema suporta validação automática e detecção de problemas de segurança.
        </div>
      </CardContent>
    </Card>
  );
};

export default CookieManagerSection;
