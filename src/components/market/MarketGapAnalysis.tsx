import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Target, Search, AlertCircle, Sparkles } from 'lucide-react';

interface MarketGapAnalysisProps {
  observations: string[];
  businessIdea: string;
  className?: string;
}

export const MarketGapAnalysis: React.FC<MarketGapAnalysisProps> = ({
  observations = [],
  businessIdea,
  className = '',
}) => {
  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] ${className}`}>
      <CardHeader className="pb-3 border-b border-[#27272A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#FFBF24]" />
            <CardTitle>Market Gap & Category Whitespace</CardTitle>
          </div>
          <span className="text-[10px] text-[#FFBF24] font-mono uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Geographic Observation
          </span>
        </div>
        <CardDescription>
          Rule-based identification of relatively lower commercial concentrations.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-3 text-xs">
        {observations.length === 0 ? (
          <p className="text-[#A1A1AA] italic">No specific market gap observations generated for this dataset.</p>
        ) : (
          <div className="space-y-2.5">
            {observations.map((obs, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#111113] border border-[#27272A] flex items-start gap-2.5">
                <Search className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <p className="text-[#F8FAFC] leading-relaxed text-[11px]">{obs}</p>
              </div>
            ))}
          </div>
        )}

        <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] text-[11px] text-[#A1A1AA] flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Methodological Guidance:</strong> Lower observed business concentration may indicate an area worth further investigation; it does not constitute proof of consumer demand or commercial profitability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
