import { plans, featuresData, featureIcons } from "./data";
import PlanHeader from "./PlanHeader";
import PlanBadges from "./PlanBadges";
import { Feature } from "./types";

interface PlansTableProps {
  onSubscribeClick?: (priceId: string) => void;
  plans?: any[];
}

const PlansTable = ({ onSubscribeClick, plans: propsPlans }: PlansTableProps) => {
  const plansToUse = propsPlans || plans;
  // Convert featuresData to Feature objects with JSX icons
  const features: Feature[] = featuresData.map(feature => {
    const IconComponent = featureIcons[feature.iconName];
    return {
      icon: <IconComponent className="w-5 h-5" />,
      name: feature.name,
      value: feature.value,
      included: feature.included
    };
  });
  return <div className="w-full max-w-7xl my-0 py-0 px-[2px] mx-0">
      {/* Badges above table */}
      <PlanBadges plans={plansToUse} />

      {/* Main table container */}
      <div className="bg-gradient-to-br from-black via-[#0e0e0e] to-[#1a002d] rounded-3xl border border-[#8b5cf6]/30 shadow-[0_0_50px_rgba(139,92,246,0.2)] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-8 min-h-full">
            {/* Features column header */}
            <div className="bg-gradient-to-b from-[#8b5cf6]/15 to-[#8b5cf6]/10 border-r border-[#8b5cf6]/20 p-8 flex items-center justify-center">
              <div className="text-[#8b5cf6] font-bold text-xl tracking-wider text-center">RECURSOS</div>
            </div>
            
            {/* Plan headers */}
            {plansToUse.map((plan, index) => <div key={index} className={`border-r border-[#8b5cf6]/20 last:border-r-0 ${plan.highlight ? 'bg-gradient-to-b from-[#8b5cf6]/20 to-[#8b5cf6]/10' : 'bg-[#8b5cf6]/5 hover:bg-[#8b5cf6]/10'} transition-all duration-300`}>
                <PlanHeader plan={plan} onSubscribeClick={onSubscribeClick} />
              </div>)}
            
            {/* Feature rows */}
            {features.map((feature, featureIndex) => <div key={`feature-row-${featureIndex}`} className="contents">
                {/* Feature name cell */}
                <div className={`bg-gradient-to-r from-[#8b5cf6]/10 to-[#8b5cf6]/5 border-r border-[#8b5cf6]/20 px-8 py-8 flex items-center ${featureIndex < features.length - 1 ? 'border-b border-[#8b5cf6]/10' : ''}`}>
                  <div className="flex items-center space-x-4 w-full justify-center text-center">
                    <div className="text-[#8b5cf6] flex-shrink-0">
                      {feature.icon}
                    </div>
                    <span className="text-white text-left font-normal text-base">{feature.name}</span>
                  </div>
                </div>
                
                {/* Feature values for each plan */}
                {plansToUse.map((plan, planIndex) => {
              const isTestPlan = plan.name === "Teste";
              let showFeature = true;
              if (isTestPlan && feature.name === "Acesso Ilimitado") {
                showFeature = false;
              }
              return <div key={`feature-${featureIndex}-plan-${planIndex}`} className={`
                      border-r border-[#8b5cf6]/20 last:border-r-0 px-8 py-8 flex items-center justify-center
                      ${featureIndex < features.length - 1 ? 'border-b border-[#8b5cf6]/10' : ''}
                      ${plan.highlight ? 'bg-[#8b5cf6]/5' : 'bg-transparent hover:bg-[#8b5cf6]/5'}
                      transition-all duration-300
                    `}>
                      {feature.value ? <span className="text-white font-bold text-2xl text-center">{feature.value}</span> : showFeature && feature.included ? <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a259ff] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/40">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div> : <div className="w-10 h-10 rounded-full bg-gray-700/60 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>}
                    </div>;
            })}
              </div>)}
          </div>
        </div>

        {/* Mobile Slider */}
        <div className="lg:hidden overflow-x-auto">
          <div className="flex gap-6 p-6 min-w-max">
            {plansToUse.map((plan, index) => <div key={index} className={`
                min-w-[280px] rounded-2xl border border-[#8b5cf6]/30 
                ${plan.highlight ? 'bg-gradient-to-b from-[#8b5cf6]/20 to-[#8b5cf6]/10 shadow-lg shadow-[#8b5cf6]/30' : 'bg-[#8b5cf6]/5'}
              `}>
                <PlanHeader plan={plan} onSubscribeClick={onSubscribeClick} />
                
                <div className="p-6 space-y-4">
                  {features.map((feature, featureIndex) => {
                const isTestPlan = plan.name === "Teste";
                let showFeature = true;
                if (isTestPlan && feature.name === "Acesso Ilimitado") {
                  showFeature = false;
                }
                return <div key={featureIndex} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-[#8b5cf6]">{feature.icon}</div>
                          <span className="text-white font-medium">{feature.name}</span>
                        </div>
                        
                        <div>
                          {feature.value ? <span className="text-white font-bold">{feature.value}</span> : showFeature && feature.included ? <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a259ff] flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div> : <div className="w-6 h-6 rounded-full bg-gray-700/60 flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>}
                        </div>
                      </div>;
              })}
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default PlansTable;