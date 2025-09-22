
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import ModernSidebar from "@/components/member/ModernSidebar";
import { useSubscriptionInvoice } from "@/hooks/useSubscriptionInvoice";
import { useSubscriptionHistory } from "@/hooks/useSubscriptionHistory";
import CurrentPlanCard from "@/components/subscription/CurrentPlanCard";
import OtherPlansCard from "@/components/subscription/OtherPlansCard";
import InvoiceHistoryCard from "@/components/subscription/InvoiceHistoryCard";

const AssinaturaPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { downloadInvoice, isDownloading } = useSubscriptionInvoice();
  const { invoices, loading: historyLoading, refreshHistory } = useSubscriptionHistory();

  // Dados do usuário para o sidebar
  const userData = {
    name: user?.user_metadata?.username || localStorage.getItem("username") || "Usuário Premium",
    avatar: localStorage.getItem("selectedAvatar") || "https://cdn-icons-png.flaticon.com/128/7790/7790136.png"
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  // Dados simulados da assinatura atual
  const currentPlan = {
    name: t('eliteMember'),
    price: "R$ 97,00",
    period: t('monthly'),
    nextBilling: "15/01/2025",
    status: t('active')
  };

  const benefits = [
    t('completeAccess'),
    t('support24x7'),
    t('automaticUpdates'),
    t('unlimitedUsage'),
    t('exclusiveCommunity')
  ];

  const availablePlans = [
    {
      name: t('basicPlan'),
      price: "R$ 47,00",
      period: t('monthly'),
      features: [t('limitedAccess'), t('emailSupport'), t('toolsLimit')],
      current: false
    },
    {
      name: t('elitePlan'),
      price: "R$ 97,00",
      period: t('monthly'),
      features: [t('fullAccess'), t('prioritySupport'), t('allTools')],
      current: true
    },
    {
      name: t('premiumPlan'),
      price: "R$ 197,00",
      period: t('monthly'),
      features: [t('everythingFromElite'), t('oneOnOneConsulting'), t('earlyAccess')],
      current: false
    }
  ];

  const handleDownloadInvoice = async (transactionId: string) => {
    console.log('🔽 Baixando fatura de assinatura para transaction ID:', transactionId);
    console.log('🔍 Estado de loading antes do download:', isDownloading);
    
    try {
      await downloadInvoice(transactionId);
      console.log('✅ Processo de download finalizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no processo de download:', error);
    }
  };

  // Função de debug temporária
  const handleDebugInvoices = async () => {
    console.log('🔍 Debug: Verificando faturas disponíveis...');
    console.log('🔍 Current user:', user);
    console.log('🔍 Available invoices:', invoices);
    
    if (invoices.length > 0) {
      console.log('🔍 First invoice details:', invoices[0]);
      console.log('🔍 Trying to download first invoice...');
      await handleDownloadInvoice(invoices[0].id_transacao);
    } else {
      console.log('❌ No invoices available for debugging');
    }

    // Refresh the invoices list
    await refreshHistory();
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
        <div className="container max-w-6xl mx-auto px-6 py-8">
          {/* Cabeçalho da página */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-purple-600 bg-clip-text text-transparent">
              {t('mySubscription')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('subscriptionDescription')}
            </p>
          </div>

          {/* Layout otimizado - sem gaps excessivos */}
          <div className="space-y-4">
            {/* Grid principal - Plano Atual e Outros Planos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Plano Atual - 2 colunas */}
              <div className="lg:col-span-2">
                <CurrentPlanCard 
                  currentPlan={currentPlan}
                  benefits={benefits}
                />
              </div>

              {/* Outros Planos - 1 coluna */}
              <div className="lg:col-span-1">
                <OtherPlansCard availablePlans={availablePlans} />
              </div>
            </div>

            {/* Histórico de Faturas - ocupando toda largura */}
            <InvoiceHistoryCard
              invoices={invoices}
              historyLoading={historyLoading}
              isDownloading={isDownloading}
              onDownloadInvoice={handleDownloadInvoice}
              onDebugInvoices={handleDebugInvoices}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssinaturaPage;
