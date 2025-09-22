
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserCog, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/member/Header";
import Loader from "@/components/ui/loader";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("Usuário");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [changesMade, setChangesMade] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check authentication
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      navigate("/entrar");
    } else {
      setIsAuthenticated(true);
      
      // Load user preferences
      const savedUsername = localStorage.getItem("username");
      if (savedUsername) {
        setUsername(savedUsername);
      }

      // Check for custom avatar first, then fallback to selected avatar
      const savedCustomAvatar = localStorage.getItem("customAvatar");
      if (savedCustomAvatar) {
        setCustomAvatar(savedCustomAvatar);
        setSelectedAvatar(""); // Clear selected avatar when custom is used
      } else {
        const savedAvatar = localStorage.getItem("selectedAvatar");
        if (savedAvatar) {
          setSelectedAvatar(savedAvatar);
        } else if (predefinedAvatars.length > 0) {
          setSelectedAvatar(predefinedAvatars[0]);
        }
      }
    }
  }, [navigate]);

  const predefinedAvatars = [
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

  const handleAvatarChange = (avatar: string) => {
    setSelectedAvatar(avatar);
    setCustomAvatar(null);
    setChangesMade(true);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setChangesMade(true);
  };
  
  const handleCustomAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomAvatar(result);
      setSelectedAvatar("");
      setChangesMade(true);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    // Simular tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    localStorage.setItem("username", username);
    
    if (customAvatar) {
      localStorage.setItem("customAvatar", customAvatar);
      localStorage.removeItem("selectedAvatar");
      // Disparar evento customizado para notificar outras páginas
      window.dispatchEvent(new Event('avatarChanged'));
    } else if (selectedAvatar) {
      localStorage.setItem("selectedAvatar", selectedAvatar);
      localStorage.removeItem("customAvatar");
      // Disparar evento customizado para notificar outras páginas
      window.dispatchEvent(new Event('avatarChanged'));
    }
    
    setIsSaving(false);
    setChangesMade(false);
    
    toast({
      title: "Alterações salvas",
      description: "Seu perfil foi atualizado com sucesso.",
      duration: 3000,
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    toast({
      title: "Desconectado com sucesso",
      description: "Você foi desconectado da sua conta.",
      duration: 3000,
    });
    navigate("/entrar");
  };

  const navigateToEditProfile = () => {
    navigate("/editar-perfil");
  };

  // Remover o loader padrão - só mostrar conteúdo quando autenticado
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Loading Overlay - apenas o loader personalizado */}
      {isSaving && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader size="lg" />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">Salvando perfil...</h3>
              <p className="text-muted-foreground">Aguarde um momento enquanto suas alterações são processadas</p>
            </div>
          </div>
        </div>
      )}
      
      {/* ... keep existing code (main content) */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card className="bg-zinc-900/50 dark:bg-zinc-900/50 bg-white/80 backdrop-blur-xl border border-zinc-800/50 dark:border-zinc-800/50 border-zinc-200/50 rounded-2xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">Perfil do Usuário</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Gerencie suas configurações pessoais
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-background border-border text-foreground hover:bg-muted"
                  onClick={navigateToEditProfile}
                >
                  <UserCog size={16} />
                  Nova página de edição
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Sair da conta
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Avatar section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 border-4 border-primary">
                  {customAvatar ? (
                    <AvatarImage src={customAvatar} alt={username} className="object-cover" />
                  ) : (
                    <AvatarImage src={selectedAvatar} alt={username} />
                  )}
                  <AvatarFallback className="text-3xl bg-primary/20">{username.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-background border-border text-foreground hover:bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Carregar foto
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomAvatarUpload}
                />
              </div>
              
              {/* User details section */}
              <div className="flex-1 space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Nome de Usuário</label>
                  <Input 
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    className="w-full bg-background border border-border rounded-md py-2 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <label className="text-lg font-medium text-foreground mb-3 block">Escolher Avatar Pré-definido</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {predefinedAvatars.map((avatar, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer rounded-full p-1 transition-all ${
                      selectedAvatar === avatar && !customAvatar ? 'ring-2 ring-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => handleAvatarChange(avatar)}
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-border pt-6">
            <Button 
              onClick={handleSaveChanges}
              className={`ml-auto text-primary-foreground font-medium flex items-center gap-2 ${changesMade 
                ? 'bg-primary hover:bg-primary/90' 
                : 'bg-muted hover:bg-muted/80'}`}
              disabled={!changesMade || isSaving}
            >
              {isSaving ? (
                <Loader size="sm" className="w-4 h-4" />
              ) : null}
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
