
import UniversalNavbar from "@/components/UniversalNavbar";
import Footer from "@/components/Footer";
import PartnershipHeroSection from "@/components/partnership/PartnershipHeroSection";
import PartnershipAuthoritySection from "@/components/partnership/PartnershipAuthoritySection";
import PartnershipPhilosophySection from "@/components/partnership/PartnershipPhilosophySection";
import CommissionStructureSection from "@/components/partnership/CommissionStructureSection";
import HowItWorksSection from "@/components/partnership/HowItWorksSection";
import PartnershipFAQSection from "@/components/partnership/PartnershipFAQSection";
import PartnershipFormSection from "@/components/partnership/PartnershipFormSection";
import FinalCTASection from "@/components/partnership/FinalCTASection";

const ParceriaPage = () => {
  return (
    <div className="w-full overflow-hidden bg-black text-white">
      <UniversalNavbar />
      
      <PartnershipHeroSection />
      <PartnershipAuthoritySection />
      <PartnershipPhilosophySection />
      <CommissionStructureSection />
      <HowItWorksSection />
      <PartnershipFormSection />
      <PartnershipFAQSection />
      <FinalCTASection />

      <Footer />
    </div>
  );
};

export default ParceriaPage;
