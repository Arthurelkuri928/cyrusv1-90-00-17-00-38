import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check } from "lucide-react";

const avatarOptions = [
  "https://cdn-icons-png.flaticon.com/128/7790/7790136.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790130.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790077.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790093.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790095.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790126.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790101.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790118.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790124.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790097.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790132.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790122.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790134.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790099.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790128.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790078.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790083.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790085.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790087.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790089.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790091.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790103.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790105.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790109.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790111.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790114.png",
  "https://cdn-icons-png.flaticon.com/128/7790/7790120.png",
];

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load user profile data
    const loadUserProfile = async () => {
      if (!user) {
        navigate("/entrar");
        return;
      }
      
      setIsLoading(true);
      
      // Get username from localStorage or user metadata
      const savedUsername = localStorage.getItem("username");
      const username = user.user_metadata?.username || savedUsername || "Usuário";
      setName(username);
      
      // Get avatar from localStorage - priorizar customAvatar primeiro
      const customAvatar = localStorage.getItem("customAvatar");
      const savedAvatar = localStorage.getItem("selectedAvatar");
      
      if (customAvatar) {
        // Se houver avatar customizado, não selecionar nenhum avatar pré-definido
        setSelectedAvatar("");
      } else if (savedAvatar) {
        setSelectedAvatar(savedAvatar);
      } else {
        // Se não houver avatar salvo, usar o primeiro da lista
        setSelectedAvatar(avatarOptions[0]);
        localStorage.setItem("selectedAvatar", avatarOptions[0]);
      }
      
      setIsLoading(false);
    };
    
    loadUserProfile();
  }, [user, navigate]);

  useEffect(() => {
    // Check if there are any changes to enable save button
    const savedUsername = localStorage.getItem("username");
    const savedAvatar = localStorage.getItem("selectedAvatar");
    const customAvatar = localStorage.getItem("customAvatar");
    
    const nameChanged = name !== savedUsername && name.trim() !== "";
    const avatarChanged = selectedAvatar !== savedAvatar && selectedAvatar !== "";
    
    // Se houver avatar customizado e o usuário selecionar um pré-definido, considerar como mudança
    const switchingFromCustom = customAvatar && selectedAvatar !== "";
    
    setHasChanges(nameChanged || avatarChanged || switchingFromCustom);
  }, [name, selectedAvatar]);

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    console.log("Avatar selecionado:", avatar);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    
    try {
      // Save to localStorage
      if (name.trim()) {
        localStorage.setItem("username", name);
        console.log("Username salvo:", name);
      }
      
      if (selectedAvatar) {
        localStorage.setItem("selectedAvatar", selectedAvatar);
        // Remover avatar customizado se um pré-definido foi selecionado
        localStorage.removeItem("customAvatar");
        console.log("Avatar selecionado salvo:", selectedAvatar);
        // Disparar evento customizado para notificar outras páginas
        window.dispatchEvent(new Event('avatarChanged'));
      }
      
      // Update user metadata in Supabase if available
      if (user) {
        await supabase.auth.updateUser({
          data: { 
            username: name,
            avatar_url: selectedAvatar 
          }
        });
      }
      
      toast.success("Perfil atualizado com sucesso!");
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Não foi possível salvar seu perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-background">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            className="p-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{t('editProfile')}</h1>
        </div>
        
        <Card className="glass-card shadow-cyrus-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">{t('profileSettings')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('profileSettingsDescription')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="name" className="text-foreground">{t('name')}</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background text-foreground border-border focus:border-primary"
              />
            </div>
            
            <div className="space-y-4">
              <Label className="block text-foreground">{t('chooseAvatar')}</Label>
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-7">
                {avatarOptions.map((avatar, index) => (
                  <div 
                    key={index}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`
                      relative cursor-pointer rounded-full p-1 transition-all hover:bg-muted
                      ${selectedAvatar === avatar ? 'ring-2 ring-primary' : ''}
                    `}
                  >
                    <img 
                      src={avatar} 
                      alt={`Avatar ${index + 1}`}
                      className="h-14 w-14 rounded-full"
                    />
                    {selectedAvatar === avatar && (
                      <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-border pt-6">
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
              className={`ml-auto ${
                hasChanges 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isSaving ? 'Salvando...' : t('saveProfile')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EditProfilePage;
