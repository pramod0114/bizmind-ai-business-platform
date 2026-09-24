import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Award, Compass, Sparkles, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface MarketOpportunityProps {
  indicator: 'Potential Opportunity' | 'Moderate Opportunity' | 'Limited Observed Opportunity' | 'Needs Further Investigation';
  explanation: string;
  totalNearby: number;
  relevantCompetitors: number;
  className?: string;
}

export const MarketOpportunity: React.FC<MarketOpportunityProps> = ({
  indicator,
  explanation,
  totalNearby,
  relevantCompetitors,
  className = '',
}) => {
  const getBadgeVariant = () => {
    switch (indicator) {
      case 'Potential Opportunity':
        return 'success';
      case 'Moderate Opportunity':
        return 'primary';
      case 'Limited Observed Opportunity':
        return 'warning';
      case 'Needs Further Investigation':
      default:
        return 'outline';
    }
  };

  const getIcon = () => {
    switch (indicator) {
      case 'Potential Opportunity':
        return <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />;
      case 'Moderate Opportunity':
        return <Compass className="w-5 h-5 text-[#FFBF24]" />;
      case 'Limited Observed Opportunity':
        return <AlertCircle className="w-5 h-5 text-[#FACC15]" />;
      case 'Needs Further Investigation':
      default:
        return <HelpCircle className="w-5 h-5 text-[#38BDF8]" />;
    }
  };

  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] ${className}`}>
      <CardHeader className="pb-3 border-b border-[#27272A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle>Observed Market Opportunity</CardTitle>
          </div>
          <Badge variant={getBadgeVariant()} size="sm">
            {indicator}
          </Badge>
        </div>
        <CardDescription>
          Rule-based geographic trade environment evaluation (Non-predictive).
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-3 text-xs">
        <div className="p-3.5 rounded-lg bg-[#111113] border border-[#27272A] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#A1A1AA]">
            <span>Observed Market Ratio</span>
            <span className="font-mono text-[#F8FAFC]">
              {relevantCompetitors} direct vs {totalNearby} total commercial points
            </span>
          </div>
          <p className="text-xs text-[#F8FAFC] leading-relaxed font-medium">{explanation}</p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] text-[11px] text-[#A1A1AA] space-y-1">
          <span className="text-[#F8FAFC] font-semibold block text-[10px] uppercase font-mono">
            Analytical Foundation
          </span>
          <p className="leading-relaxed text-[11px]">
            Opportunity status is a descriptive synthesis of competitor saturation and commercial footfall indicators. It does not predict sales revenue or substitute for on-the-ground feasibility validation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
