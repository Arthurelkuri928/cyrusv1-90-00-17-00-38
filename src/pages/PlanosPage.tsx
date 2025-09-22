
import UniversalNavbar from "@/components/UniversalNavbar";
import Footer from "@/components/Footer";
import FloatingChatButton from "@/components/FloatingChatButton";
import PlansAssistantPopup from "@/components/PlansAssistantPopup";
import PlansHeroSection from "@/components/plans/PlansHeroSection";
import PlansTableWrapper from "@/components/plans/PlansTableWrapper";
import MoneyBackGuarantee from "@/components/plans/MoneyBackGuarantee";
import DecisionSupportSection from "@/components/plans/DecisionSupportSection";
import TestimonialsSection from "@/components/plans/TestimonialsSection";
import PlansComparison from "@/components/plans/PlansComparison";
import ObjectionsSection from "@/components/plans/ObjectionsSection";
import ImprovedFinalCTA from "@/components/plans/ImprovedFinalCTA";
import Faq from "@/components/Faq";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/config/appConfig";

const PlanosPage = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubscribe = (priceId: string) => {
    if (priceId) {
      navigate(`/checkout?priceId=${priceId}`);
    } else {
      console.error("No priceId provided to handleSubscribe");
    }
  };

  const abrirAssistentePlanos = () => {
    console.log('Abrindo assistente de planos...');
    setIsAssistantOpen(true);
  };

  const fecharAssistentePlanos = () => {
    console.log('Fechando assistente de planos...');
    setIsAssistantOpen(false);
  };

  const scrollToPlans = () => {
    const plansElement = document.getElementById('plans-table');
    if (plansElement) {
      plansElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const testPlan = [{
    id: 'test-plan',
    name: 'Teste',
    price: 9.90,
    period: '7 dias',
    validity: '7 dias de acesso',
    highlight: false,
    stripe_price_id: 'price_1S0sGiPeFCkwiBIoA0TTx9hh'
  }];

  return (
    <div className="w-full overflow-hidden bg-black text-white">
      {/* Background effects global */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0F1C] to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(142,36,170,0.03),transparent_70%)]"></div>
      </div>
      
      <div className="relative z-10">
        <UniversalNavbar />
        
        {/* Content with proper spacing for new navbar */}
        <div className="pt-[72px]">
          {/* Hero Section */}
          <PlansHeroSection 
            onScrollToPlans={scrollToPlans}
            onOpenAssistant={abrirAssistentePlanos}
          />
          
          {/* Tabela de Planos - Reduced spacing from hero */}
          <div className="-mt-8">
            <PlansTableWrapper plans={testPlan} loading={false} onSubscribeClick={handleSubscribe} />
          </div>
          
          {/* Bloco de Garantia */}
          <MoneyBackGuarantee />
          
          {/* Comparação com Concorrentes */}
          <PlansComparison />
          
          {/* Prova Social */}
          <TestimonialsSection />
          
          {/* Objeções Comuns */}
          <ObjectionsSection onOpenAssistant={abrirAssistentePlanos} />
          
          {/* FAQ and Decision Support - Reduced spacing between them */}
          <div className="-mb-8">
            <Faq />
          </div>
          
          {/* Bloco de Apoio à Decisão */}
          <div className="-mt-8">
            <DecisionSupportSection onOpenAssistant={abrirAssistentePlanos} />
          </div>
          
          {/* CTA Final */}
          <ImprovedFinalCTA onScrollToPlans={scrollToPlans} />
        </div>
        
        {/* Floating Button with correct z-index */}
        <div style={{ zIndex: APP_CONFIG.Z_INDEX.FLOATING }}>
          <FloatingChatButton onClick={abrirAssistentePlanos} />
        </div>
        
        {/* Plans Assistant Popup with correct z-index */}
        <div style={{ zIndex: APP_CONFIG.Z_INDEX.MODAL }}>
          <PlansAssistantPopup isOpen={isAssistantOpen} onClose={fecharAssistentePlanos} />
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default PlanosPage;
