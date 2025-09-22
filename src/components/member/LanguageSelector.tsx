
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languageNames = {
    "pt-BR": "Português",
    "en-US": "English",
    "es-ES": "Español",
  };

  const languageFlags = {
    "pt-BR": "🇧🇷",
    "en-US": "🇺🇸",
    "es-ES": "🇪🇸",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 z-50">
        <DropdownMenuItem 
          className={`cursor-pointer hover:bg-purple-900/20 ${language === 'pt-BR' ? 'bg-purple-900/30' : ''}`}
          onClick={() => setLanguage("pt-BR")}
        >
          <span className="mr-2">{languageFlags["pt-BR"]}</span> {languageNames["pt-BR"]}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer hover:bg-purple-900/20 ${language === 'en-US' ? 'bg-purple-900/30' : ''}`}
          onClick={() => setLanguage("en-US")}
        >
          <span className="mr-2">{languageFlags["en-US"]}</span> {languageNames["en-US"]}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer hover:bg-purple-900/20 ${language === 'es-ES' ? 'bg-purple-900/30' : ''}`}
          onClick={() => setLanguage("es-ES")}
        >
          <span className="mr-2">{languageFlags["es-ES"]}</span> {languageNames["es-ES"]}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
