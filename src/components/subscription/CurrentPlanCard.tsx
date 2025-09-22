import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Crown, Check, Calendar, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
interface CurrentPlanCardProps {
  currentPlan: {
    name: string;
    price: string;
    period: string;
    nextBilling: string;
    status: string;
  };
  benefits: string[];
}
const CurrentPlanCard = ({
  currentPlan,
  benefits
}: CurrentPlanCardProps) => {
  const {
    t
  } = useLanguage();
  return <UnifiedCard variant="subscription" title={t('currentPlan')} headerAction={<Crown className="h-6 w-6 text-[#A855F7]" />} className="h-fit my-0 py-[45px]">
      {/* Status do plano */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#A855F7]/20 to-[#7C3AED]/10 rounded-xl border border-[#A855F7]/30 mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{currentPlan.name}</h3>
          <p className="text-[#A855F7] font-medium">{currentPlan.price}/{currentPlan.period}</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
          {currentPlan.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-[#A855F7]" />
            <span className="text-xs font-medium text-muted-foreground">{t('nextBilling')}</span>
          </div>
          <p className="text-foreground font-medium text-sm">{currentPlan.nextBilling}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-4 w-4 text-[#A855F7]" />
            <span className="text-xs font-medium text-muted-foreground">{t('paymentMethod')}</span>
          </div>
          <p className="text-foreground font-medium text-sm">**** **** **** 1234</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-base font-semibold text-foreground mb-3">{t('benefitsIncluded')}</h4>
        <div className="grid grid-cols-1 gap-2">
          {benefits.slice(0, 3).map((benefit, index) => <div key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{benefit}</span>
            </div>)}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-border">
        <Button variant="outline" size="sm" className="flex items-center gap-2 border-border bg-card text-foreground hover:bg-muted">
          <CreditCard className="h-3 w-3" />
          {t('updatePayment')}
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2 border-red-300 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
          {t('cancelSubscription')}
        </Button>
      </div>
    </UnifiedCard>;
};
export default CurrentPlanCard;