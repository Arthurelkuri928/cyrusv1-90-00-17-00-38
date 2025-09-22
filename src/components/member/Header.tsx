
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();
  
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bem-vindo, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Acesse suas ferramentas premium
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Área de Membros
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
