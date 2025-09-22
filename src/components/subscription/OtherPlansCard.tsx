import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Star, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  current: boolean;
}
interface OtherPlansCardProps {
  availablePlans: Plan[];
}
const OtherPlansCard = ({
  availablePlans
}: OtherPlansCardProps) => {
  const {
    t
  } = useLanguage();
  return <UnifiedCard variant="subscription" title={t('otherPlans')} headerAction={<Star className="h-5 w-5 text-[#A855F7]" />} className="h-fit py-[18px]">
      <div className="space-y-3">
        {availablePlans.map((plan, index) => <div key={index} className={`p-3 rounded-lg border transition-all duration-300 ${plan.current ? 'border-[#A855F7] bg-[#A855F7]/10' : 'border-border bg-muted/50 hover:border-border/80'}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground text-sm">{plan.name}</h4>
                <p className="text-[#A855F7] font-medium text-sm">{plan.price}/{plan.period}</p>
              </div>
              {plan.current && <Badge className="bg-[#A855F7] text-white text-xs">{t('current')}</Badge>}
            </div>
            
            <div className="space-y-1 mb-3">
              {plan.features.slice(0, 2).map((feature, featureIndex) => <div key={featureIndex} className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-400 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </div>)}
            </div>

            {!plan.current && <Button size="sm" className="w-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white text-xs">
                {t('makeUpgrade')}
              </Button>}
          </div>)}
      </div>
    </UnifiedCard>;
};
export default OtherPlansCard;