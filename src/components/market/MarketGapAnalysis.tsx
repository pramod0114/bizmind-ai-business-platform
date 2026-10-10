import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Target, Search, AlertCircle, ChevronRight } from 'lucide-react';

interface MarketGapAnalysisProps {
  observations: string[];
  businessIdea: string;
  className?: string;
  defaultExpanded?: boolean;
}

export const MarketGapAnalysis: React.FC<MarketGapAnalysisProps> = ({
  observations = [],
  businessIdea,
  className = '',
  defaultExpanded = false,
}) => {
  const [showDetails, setShowDetails] = useState(defaultExpanded);

  const primaryObservation = observations.length > 0 ? observations[0] : null;
  const remainingObservations = observations.slice(1);

  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] flex flex-col justify-between ${className}`}>
      <div>
        <CardHeader className="pb-3 border-b border-[#27272A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FFBF24]" />
              <CardTitle>Market Gap & Category Whitespace</CardTitle>
            </div>
            <span className="text-[10px] text-[#FFBF24] font-mono uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {observations.length} Observations
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
            <>
              {/* Primary Observation (Always visible) */}
              {primaryObservation && (
                <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] flex items-start gap-2.5">
                  <Search className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[10px] font-mono uppercase text-[#A1A1AA] block mb-0.5">Primary Observation</span>
                    <p className="text-[#F8FAFC] leading-relaxed text-[11px] font-medium">{primaryObservation}</p>
                  </div>
                </div>
              )}

              {/* Extended Observations & Guidance when expanded */}
              {showDetails && (
                <div className="space-y-2.5 animate-in fade-in duration-150 pt-1">
                  {remainingObservations.map((obs, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#111113] border border-[#27272A] flex items-start gap-2.5">
                      <Search className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                      <p className="text-[#F8FAFC] leading-relaxed text-[11px]">{obs}</p>
                    </div>
                  ))}

                  <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] text-[11px] text-[#A1A1AA] flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Methodological Guidance:</strong> Lower observed business concentration may indicate an area worth further investigation; it does not constitute proof of consumer demand or commercial profitability.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </div>

      {/* Interactive Toggle Footer */}
      {observations.length > 0 && (
        <div className="px-5 py-3 border-t border-[#27272A] flex items-center justify-between bg-[#141416] rounded-b-xl">
          <span className="text-[11px] text-[#71717A] font-mono">
            {showDetails
              ? 'Showing all whitespace insights'
              : `${remainingObservations.length > 0 ? `+${remainingObservations.length} more gaps` : 'View guidance'}`}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] rounded text-[11px] font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
            title={showDetails ? 'Hide additional gap observations' : 'Show all gap observations and guidance'}
          >
            <span>{showDetails ? 'Hide' : 'Details'}</span>
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
