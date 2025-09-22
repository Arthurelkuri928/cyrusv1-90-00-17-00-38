
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import ModernSidebar from "@/components/member/ModernSidebar";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Copy,
  ChevronDown,
  ChevronUp,
  Share2,
  Target,
  Gift,
  Calendar
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AfiliadosPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    links: false,
    comissoes: false,
    materiais: false
  });

  // Dados do usuário para o sidebar
  const userData = {
    name: user?.user_metadata?.username || localStorage.getItem("username") || "Usuário Premium",
    avatar: localStorage.getItem("selectedAvatar") || "https://cdn-icons-png.flaticon.com/128/7790/7790136.png"
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Copy link to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t('linkCopied'),
        description: t('linkCopiedDesc'),
      });
    });
  };

  // Mock data
  const affiliateStats = {
    totalReferrals: 23,
    monthlyEarnings: "R$ 1.847,50",
    conversionRate: "12.5%",
    pendingCommission: "R$ 325,00"
  };

  const affiliateLinks = [
    {
      name: t('mainLink'),
      url: "https://cyrus.com/?ref=USER123",
      clicks: 156,
      conversions: 8
    },
    {
      name: t('plansLink'),
      url: "https://cyrus.com/planos/?ref=USER123",
      clicks: 89,
      conversions: 5
    }
  ];

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
        <div className="container max-w-6xl mx-auto px-6 py-8">
          {/* Cabeçalho da página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-purple-600 bg-clip-text text-transparent">
              {t('affiliateProgram')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('affiliateDescription')}
            </p>
          </div>

          {/* Dashboard Section */}
          <Card className="glass-card shadow-cyrus-card mb-6">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('dashboard')}
            >
              <CardTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#A855F7]" />
                  {t('performanceDashboard')}
                </div>
                {expandedSections.dashboard ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {expandedSections.dashboard && (
              <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="bg-muted/50 rounded-xl p-4 border border-border">
                     <div className="flex items-center gap-3 mb-2">
                       <Users className="h-5 w-5 text-cyrus-primary" />
                       <span className="text-sm font-medium text-muted-foreground">{t('totalReferrals')}</span>
                     </div>
                     <p className="text-2xl font-bold text-foreground">{affiliateStats.totalReferrals}</p>
                   </div>

                   <div className="bg-muted/50 rounded-xl p-4 border border-border">
                     <div className="flex items-center gap-3 mb-2">
                       <DollarSign className="h-5 w-5 text-green-500" />
                       <span className="text-sm font-medium text-muted-foreground">{t('monthlyEarnings')}</span>
                     </div>
                     <p className="text-2xl font-bold text-green-500">{affiliateStats.monthlyEarnings}</p>
                   </div>

                   <div className="bg-muted/50 rounded-xl p-4 border border-border">
                     <div className="flex items-center gap-3 mb-2">
                       <Target className="h-5 w-5 text-blue-500" />
                       <span className="text-sm font-medium text-muted-foreground">{t('conversionRate')}</span>
                     </div>
                     <p className="text-2xl font-bold text-blue-500">{affiliateStats.conversionRate}</p>
                   </div>

                   <div className="bg-muted/50 rounded-xl p-4 border border-border">
                     <div className="flex items-center gap-3 mb-2">
                       <Calendar className="h-5 w-5 text-yellow-500" />
                       <span className="text-sm font-medium text-muted-foreground">{t('pendingCommission')}</span>
                     </div>
                     <p className="text-2xl font-bold text-yellow-500">{affiliateStats.pendingCommission}</p>
                   </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Links de Afiliado */}
          <Card className="glass-card shadow-cyrus-card mb-6">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('links')}
            >
              <CardTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-3">
                  <Share2 className="h-6 w-6 text-[#A855F7]" />
                  {t('affiliateLinks')}
                </div>
                {expandedSections.links ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {expandedSections.links && (
               <CardContent className="space-y-4">
                 {affiliateLinks.map((link, index) => (
                   <div key={index} className="bg-muted/50 rounded-xl p-4 border border-border">
                     <div className="flex items-center justify-between mb-3">
                       <h4 className="font-semibold text-foreground">{link.name}</h4>
                       <div className="flex items-center gap-2">
                         <Badge className="bg-blue-500/20 text-blue-400">{link.clicks} {t('clicks')}</Badge>
                         <Badge className="bg-green-500/20 text-green-400">{link.conversions} {t('conversions')}</Badge>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="flex-1 bg-muted rounded-lg p-2 font-mono text-sm text-muted-foreground border border-border">
                         {link.url}
                       </div>
                       <Button
                         onClick={() => copyToClipboard(link.url)}
                         size="sm"
                         className="bg-cyrus-primary hover:bg-cyrus-primary/90 text-white"
                       >
                         <Copy className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>
                 ))}
              </CardContent>
            )}
          </Card>

          {/* Estrutura de Comissões */}
          <Card className="glass-card shadow-cyrus-card mb-6">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('comissoes')}
            >
              <CardTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-[#A855F7]" />
                  {t('commissionStructure')}
                </div>
                {expandedSections.comissoes ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {expandedSections.comissoes && (
               <CardContent>
                 <div className="space-y-4">
                   <div className="bg-muted/50 rounded-xl p-4 border border-border">
                     <h4 className="font-semibold text-foreground mb-2">{t('basicPlan')} - R$ 47/mês</h4>
                     <p className="text-muted-foreground mb-2">{t('commission')}: <span className="text-green-500 font-medium">30% = R$ 14,10</span></p>
                     <p className="text-sm text-muted-foreground">{t('forEachNewClient')}</p>
                   </div>
                   
                   <div className="bg-muted/50 rounded-xl p-4 border border-border">
                     <h4 className="font-semibold text-foreground mb-2">{t('elitePlan')} - R$ 97/mês</h4>
                     <p className="text-muted-foreground mb-2">{t('commission')}: <span className="text-green-500 font-medium">30% = R$ 29,10</span></p>
                     <p className="text-sm text-muted-foreground">{t('forEachNewClient')}</p>
                   </div>
                   
                   <div className="bg-muted/50 rounded-xl p-4 border border-border">
                     <h4 className="font-semibold text-foreground mb-2">{t('premiumPlan')} - R$ 197/mês</h4>
                     <p className="text-muted-foreground mb-2">{t('commission')}: <span className="text-green-500 font-medium">30% = R$ 59,10</span></p>
                     <p className="text-sm text-muted-foreground">{t('forEachNewClient')}</p>
                   </div>
                 </div>
               </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AfiliadosPage;
