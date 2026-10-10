import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, ChevronRight } from 'lucide-react';

interface CompetitionRiskProps {
  level: 'Low' | 'Moderate' | 'High';
  reason: string;
  competitorCount: number;
  density: number;
  className?: string;
  defaultExpanded?: boolean;
}

export const CompetitionRisk: React.FC<CompetitionRiskProps> = ({
  level,
  reason,
  competitorCount,
  density,
  className = '',
  defaultExpanded = false,
}) => {
  const [showDetails, setShowDetails] = useState(defaultExpanded);

  const getBadgeVariant = () => {
    if (level === 'Low') return 'success';
    if (level === 'Moderate') return 'warning';
    return 'error';
  };

  const getIcon = () => {
    if (level === 'Low') return <ShieldCheck className="w-5 h-5 text-[#22C55E]" />;
    if (level === 'Moderate') return <AlertTriangle className="w-5 h-5 text-[#FACC15]" />;
    return <ShieldAlert className="w-5 h-5 text-[#EF4444]" />;
  };

  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] flex flex-col justify-between ${className}`}>
      <div>
        <CardHeader className="pb-3 border-b border-[#27272A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIcon()}
              <CardTitle>Competition Intensity & Risk</CardTitle>
            </div>
            <Badge variant={getBadgeVariant()} size="sm">
              {level} Competition
            </Badge>
          </div>
          <CardDescription>
            Descriptive structural indicator derived from observed market crowding.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-3 text-xs">
          {/* Main takeaway */}
          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#A1A1AA] uppercase font-mono">
              <span>Rule Evaluation</span>
              <span className="font-semibold text-[#FFBF24]">{competitorCount} Incumbents</span>
            </div>
            <p className="text-xs text-[#F8FAFC] font-semibold leading-snug">{reason}</p>
          </div>

          {/* Multi-tier progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#A1A1AA]">
              <span>Observed Density Scale</span>
              <span className="font-mono text-[#F8FAFC]">
                {competitorCount} competitors ({density.toFixed(2)}/km²)
              </span>
            </div>
            <div className="h-2 w-full bg-[#111113] rounded-full overflow-hidden flex border border-[#27272A]">
              <div
                className={`h-full transition-all ${
                  level === 'Low'
                    ? 'bg-[#22C55E] w-1/3'
                    : level === 'Moderate'
                    ? 'bg-[#FACC15] w-2/3'
                    : 'bg-[#EF4444] w-full'
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#71717A] font-mono">
              <span>Low (0–3)</span>
              <span>Moderate (4–8)</span>
              <span>High (&gt;8)</span>
            </div>
          </div>

          {/* Collapsible Methodology Note & In-Depth Rationale */}
          {showDetails && (
            <div className="space-y-2.5 animate-in fade-in duration-150 pt-1">
              <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] text-[11px] text-[#A1A1AA] flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Methodology Note:</strong> This is a descriptive risk classification, not a prediction of business failure. High competitor presence often indicates proven customer footfall and product-market viability.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111113] border border-[#27272A] text-[11px] text-[#71717A] leading-relaxed">
                Strategic takeaway: Incumbents in this density bracket often benefit from shared foot traffic. Differentiate via superior service, distinct menu/inventory items, or operational speed.
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Interactive Toggle Footer */}
      <div className="px-5 py-3 border-t border-[#27272A] flex items-center justify-between bg-[#141416] rounded-b-xl">
        <span className="text-[11px] text-[#71717A] font-mono">
          {showDetails ? 'Methodology active' : 'Click Details for methodology'}
        </span>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] rounded text-[11px] font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
          title={showDetails ? 'Hide methodology note' : 'View methodology details'}
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
