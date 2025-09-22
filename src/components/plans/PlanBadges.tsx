import { Plan } from "./types";
interface PlanBadgesProps {
  plans: Plan[];
}
const PlanBadges = ({
  plans
}: PlanBadgesProps) => {
  return <div className="flex justify-center gap-8 mb-16 relative">
      {plans.map((plan, index) => plan.badge && <div key={index} className="relative">
            {/* Badge with improved styling */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
              
            </div>
            
            {/* Plan name indicator */}
            
          </div>)}
    </div>;
};
export default PlanBadges;