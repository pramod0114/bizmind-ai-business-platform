import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Compass, CheckCircle2, AlertCircle, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';

interface MarketOpportunityProps {
  indicator:
    | 'Potential Opportunity'
    | 'Moderate Opportunity'
    | 'Limited Observed Opportunity'
    | 'Needs Further Investigation';
  explanation: string;
  totalNearby: number;
  relevantCompetitors: number;
  className?: string;
  defaultExpanded?: boolean;
}

export const MarketOpportunity: React.FC<MarketOpportunityProps> = ({
  indicator,
  explanation,
  totalNearby,
  relevantCompetitors,
  className = '',
  defaultExpanded = false,
}) => {
  const [showDetails, setShowDetails] = useState(defaultExpanded);

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
    <Card className={`border-[#27272A] bg-[#1A1A1D] flex flex-col justify-between ${className}`}>
      <div>
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
          {/* Main Ratio & Primary Takeaway */}
          <div className="p-3.5 rounded-lg bg-[#111113] border border-[#27272A] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#A1A1AA]">
              <span>Observed Market Ratio</span>
              <span className="font-mono text-[#F8FAFC]">
                {relevantCompetitors} direct vs {totalNearby} total commercial points
              </span>
            </div>
            <p className="text-xs text-[#F8FAFC] leading-relaxed font-medium">{explanation}</p>
          </div>

          {/* Collapsible Analytical Foundation & In-Depth Disclaimers */}
          {showDetails && (
            <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] text-[11px] text-[#A1A1AA] space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-[#F8FAFC] font-semibold text-[10px] uppercase font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span>Analytical Foundation</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Opportunity status is a descriptive synthesis of competitor saturation and commercial footfall indicators. It does not predict sales revenue or substitute for on-the-ground feasibility validation.
              </p>
              <div className="pt-1 border-t border-[#27272A]/80 text-[10px] text-[#71717A]">
                Derived from spatial point density, relative category share, and radial clustering factors.
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Interactive Toggle Footer */}
      <div className="px-5 py-3 border-t border-[#27272A] flex items-center justify-between bg-[#141416] rounded-b-xl">
        <span className="text-[11px] text-[#71717A] font-mono">
          {showDetails ? 'Framework active' : 'Click Details for framework'}
        </span>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] rounded text-[11px] font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
          title={showDetails ? 'Hide analytical foundation' : 'View analytical foundation'}
        >
          <span>{showDetails ? 'Hide' : 'Details'}</span>
          <ChevronRight
            className={`w-3.5 h-3.5 text-[#FFBF24] transition-transform duration-200 ${
              showDetails ? 'rotate-90' : ''
            }`}
          />
        </button>
      </div>
    </Card>
  );
};
