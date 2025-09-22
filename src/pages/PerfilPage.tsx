
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Hash, Crown, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModernSidebar from "@/components/member/ModernSidebar";
import { useAvatar } from "@/hooks/useAvatar";

const PerfilPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Usar o hook personalizado para avatar
  const avatarUrl = useAvatar();

  // Dados mockados para demonstração
  const userData = {
    name: user?.user_metadata?.username || localStorage.getItem("username") || "Usuário Premium",
    email: user?.email || "usuario@exemplo.com",
    userId: user?.id?.slice(0, 8) || "USR12345",
    plan: t('eliteMember'),
    joinDate: new Date().toLocaleDateString('pt-BR'),
    avatar: avatarUrl
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <ModernSidebar
        username={userData.name}
        selectedAvatar={userData.avatar}
        onProfileClick={handleProfileClick}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content with sidebar spacing */}
      <div className="md:ml-20 transition-all duration-200 ease-out">
        <div className="container max-w-4xl mx-auto px-6 py-8">
          {/* Cabeçalho da página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-purple-600 bg-clip-text text-transparent">
              {t('myProfile')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('profileDescription')}
            </p>
          </div>

          {/* Card principal do perfil */}
          <div className="glass-card shadow-cyrus-card">
            <CardHeader className="text-center pb-4">
              <div className="flex flex-col items-center space-y-4">
                {/* Avatar grande */}
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-[#A855F7]/50 shadow-2xl">
                    <AvatarImage src={userData.avatar} alt={userData.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white text-3xl font-bold">
                      {userData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-[#A855F7] rounded-full p-2 shadow-lg">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Nome e tipo de conta */}
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {userData.name}
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white font-medium px-4 py-1 text-sm">
                    {userData.plan}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Informações principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-[#A855F7]" />
                    <span className="text-sm font-medium text-muted-foreground">{t('email')}</span>
                  </div>
                  <p className="text-foreground font-medium">{userData.email}</p>
                </div>

                {/* ID do usuário */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Hash className="h-5 w-5 text-[#A855F7]" />
                    <span className="text-sm font-medium text-muted-foreground">{t('userId')}</span>
                  </div>
                  <p className="text-foreground font-medium font-mono">#{userData.userId}</p>
                </div>

                {/* Plano atual */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="h-5 w-5 text-[#A855F7]" />
                    <span className="text-sm font-medium text-muted-foreground">{t('currentPlan')}</span>
                  </div>
                  <p className="text-foreground font-medium">{userData.plan}</p>
                </div>

                {/* Data de ingresso */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-[#A855F7]" />
                    <span className="text-sm font-medium text-muted-foreground">{t('memberSince')}</span>
                  </div>
                  <p className="text-foreground font-medium">{userData.joinDate}</p>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                <Button
                  onClick={() => navigate("/editar-perfil")}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Edit className="h-4 w-4" />
                  {t('editProfile')}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate("/configuracoes")}
                  className="flex items-center gap-2 border-border bg-card text-foreground hover:bg-muted"
                >
                  {t('goToSettings')}
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
