
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store/auth.store";
import ModernSidebar from "@/components/member/ModernSidebar";
import MemberFooter from "@/components/member/MemberFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy, 
  ExternalLink,
  BarChart3,
  Calendar,
  Eye,
  MousePointer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAffiliateStatement } from "@/hooks/useAffiliateStatement";

const AfiliadosDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { downloadStatement, isDownloading } = useAffiliateStatement();
  const [affiliateLink, setAffiliateLink] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data - replace with real data from API
  const stats = {
    totalEarnings: 1250.50,
    thisMonth: 350.75,
    totalClicks: 1845,
    conversions: 23,
    conversionRate: 1.25,
    activeReferrals: 8
  };

  // Dados do usuário para o sidebar
  const userData = {
    name: localStorage.getItem("username") || "Afiliado",
    avatar: localStorage.getItem("selectedAvatar") || "https://cdn-icons-png.flaticon.com/128/7790/7790136.png"
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  useEffect(() => {
    if (user?.id) {
      setAffiliateLink(`https://cyrus.com/ref/${user.id}`);
    }
  }, [user]);

  const copyAffiliateLink = () => {
    if (affiliateLink) {
      navigator.clipboard.writeText(affiliateLink);
      toast({
        title: "Link copiado!",
        description: "Seu link de afiliado foi copiado para a área de transferência.",
      });
    }
  };

  // Função wrapper para o download de extrato
  const handleDownloadStatement = () => {
    downloadStatement(); // Chama sem parâmetro ou com um ID padrão
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
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard de Afiliados
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seus ganhos e performance como afiliado CYRUS
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ganho
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {stats.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                +R$ {stats.thisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} este mês
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Cliques
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalClicks.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% desde o último mês
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversões
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.conversions}
              </div>
              <p className="text-xs text-muted-foreground">
                Taxa: {stats.conversionRate}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Indicações Ativas
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.activeReferrals}
              </div>
              <p className="text-xs text-muted-foreground">
                Assinantes ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              Meus Links
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="materials" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              Materiais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Seu Link de Afiliado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm text-foreground">
                    {affiliateLink}
                  </div>
                  <Button
                    onClick={copyAffiliateLink}
                    variant="outline"
                    size="icon"
                    className="border-border"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-primary text-primary-foreground">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Compartilhar Link
                  </Button>
                  <Button variant="outline" className="border-border">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Performance Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Hoje</p>
                      <p className="text-sm text-muted-foreground">15 cliques, 1 conversão</p>
                    </div>
                    <Badge variant="secondary">+R$ 29,10</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Ontem</p>
                      <p className="text-sm text-muted-foreground">23 cliques, 2 conversões</p>
                    </div>
                    <Badge variant="secondary">+R$ 58,20</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Últimos 7 dias</p>
                      <p className="text-sm text-muted-foreground">156 cliques, 8 conversões</p>
                    </div>
                    <Badge variant="secondary">+R$ 232,80</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Gerenciar Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidade em desenvolvimento. Em breve você poderá criar e gerenciar múltiplos links personalizados.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Histórico de Faturas</CardTitle>
                <Button
                  onClick={handleDownloadStatement}
                  disabled={isDownloading}
                  variant="outline"
                  size="sm"
                  className="border-border"
                >
                  {isDownloading ? "Gerando..." : "Baixar Extrato"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock data baseado na referência das imagens */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">R$ 97,00</p>
                        <p className="text-sm text-muted-foreground">15/12/2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Pago</Badge>
                      <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/10">
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">R$ 97,00</p>
                        <p className="text-sm text-muted-foreground">15/11/2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Pago</Badge>
                      <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/10">
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">R$ 97,00</p>
                        <p className="text-sm text-muted-foreground">15/10/2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Pago</Badge>
                      <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/10">
                        Baixar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Materiais de Divulgação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidade em desenvolvimento. Em breve você terá acesso a banners, textos e outros materiais promocionais.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      <MemberFooter />
    </div>
  );
};

export default AfiliadosDashboard;
