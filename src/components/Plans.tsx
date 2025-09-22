
import PlansTable from "./plans/PlansTable";
import { useState, useEffect } from "react";

const Plans = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="pricing" className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Plans Table seguindo o padrão da home */}
        <div className={`transition-all duration-1000 delay-200 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative">
            {/* Container com estilo glassmorphism da home */}
            <div className="bg-gradient-to-br from-[#8E24AA]/20 to-transparent p-8 rounded-2xl border border-[#8E24AA]/30 backdrop-blur-sm">
              <PlansTable />
            </div>
          </div>
        </div>
      </div>

      {/* Background effects seguindo padrão da home */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(142,36,170,0.15),transparent_70%)]"></div>
      </div>
    </section>
  );
};

export default Plans;
