
import React from "react";
import UniversalNavbar from "@/components/UniversalNavbar";
import Footer from "@/components/Footer";
import CyrusBackground from "@/components/shared/CyrusBackground";
import AffiliateHeroSection from "@/components/affiliates/AffiliateHeroSection";
import AffiliateBenefitsSection from "@/components/affiliates/AffiliateBenefitsSection";
import AffiliateStepsSection from "@/components/affiliates/AffiliateStepsSection";
import AffiliateSocialProof from "@/components/affiliates/AffiliateSocialProof";
import AffiliateResourcesSection from "@/components/affiliates/AffiliateResourcesSection";
import AffiliateFAQSection from "@/components/affiliates/AffiliateFAQSection";
import AffiliateFinalCTA from "@/components/affiliates/AffiliateFinalCTA";

const AfiliadosPublicPage = () => {
  return (
    <CyrusBackground>
      <UniversalNavbar />
      
      {/* 1. Hero Reestruturado */}
      <AffiliateHeroSection />
      
      {/* 2. Benefícios de Ser Afiliado */}
      <AffiliateBenefitsSection />
      
      {/* 3. Como Funciona (Passo a Passo) */}
      <AffiliateStepsSection />
      
      {/* 4. Provas Sociais */}
      <AffiliateSocialProof />
      
      {/* 5. Recursos Exclusivos para Afiliados */}
      <AffiliateResourcesSection />
      
      {/* 6. FAQ */}
      <AffiliateFAQSection />
      
      {/* 7. CTA Final */}
      <AffiliateFinalCTA />

      <Footer />
    </CyrusBackground>
  );
};

export default AfiliadosPublicPage;
