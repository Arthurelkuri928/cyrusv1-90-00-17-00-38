
import UniversalNavbar from "@/components/UniversalNavbar";
import LandingPage from "@/components/sales/LandingPage";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Prevent text selection and copying
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    
    // Prevent context menu
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener("contextmenu", preventContextMenu);
    
    return () => {
      // Remove smooth scrolling when component unmounts
      document.documentElement.style.scrollBehavior = "";
      
      // Reset user selection
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      
      // Remove context menu prevention
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black pt-[72px]">
      <UniversalNavbar />
      <LandingPage />
    </div>
  );
};

export default Index;
