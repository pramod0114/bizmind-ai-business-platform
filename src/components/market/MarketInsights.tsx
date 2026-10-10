import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';

interface MarketInsightsProps {
  insights: string[];
  className?: string;
  defaultExpanded?: boolean;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({
  insights = [],
  className = '',
  defaultExpanded = false,
}) => {
  const [showDetails, setShowDetails] = useState(defaultExpanded);

  const previewCount = 2;
  const visibleInsights = showDetails ? insights : insights.slice(0, previewCount);
  const hiddenCount = Math.max(0, insights.length - previewCount);

  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] flex flex-col justify-between ${className}`}>
      <div>
        <CardHeader className="pb-3 border-b border-[#27272A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#FFBF24]" />
              <CardTitle>Data-Derived Market Insights</CardTitle>
            </div>
            <span className="text-[10px] text-[#A1A1AA] font-mono">
              {insights.length} Empirical Points
            </span>
          </div>
          <CardDescription>
            Direct empirical deductions calculated from verified OpenStreetMap listings.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-2.5 text-xs">
          {insights.length === 0 ? (
            <p className="text-[#A1A1AA] italic">No empirical insights available.</p>
          ) : (
            visibleInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#111113] border border-[#27272A] flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <p className="text-slate-200 text-[11px] leading-relaxed font-medium">{insight}</p>
              </div>
            ))
          )}
        </CardContent>
      </div>

      {/* Interactive Toggle Footer */}
      {insights.length > previewCount && (
        <div className="px-5 py-3 border-t border-[#27272A] flex items-center justify-between bg-[#141416] rounded-b-xl">
          <span className="text-[11px] text-[#71717A] font-mono">
            {showDetails ? `Showing all ${insights.length} points` : `+${hiddenCount} more empirical deductions`}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] rounded text-[11px] font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
            title={showDetails ? 'Collapse insights list' : 'View all empirical market insights'}
          >
            <span>{showDetails ? 'Hide' : `Details (${insights.length})`}</span>
            <ChevronRight
              className={`w-3.5 h-3.5 text-[#FFBF24] transition-transform duration-200 ${
                showDetails ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>
      )}
    </Card>
  );
};
