import React from 'react';
import { Lightbulb, CheckCircle, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { LocationAnalysisResult } from '../../types';

export interface LocationInsightsProps {
  analysis: LocationAnalysisResult;
  className?: string;
}

export const LocationInsights: React.FC<LocationInsightsProps> = ({
  analysis,
  className = '',
}) => {
  const directCount = analysis.relevantBusinesses !== undefined ? analysis.relevantBusinesses : (analysis.competition?.directCompetitorCount || 0);
  const radiusKm = analysis.radiusKm || parseFloat((analysis.radiusMeters / 1000).toFixed(1));
  const density = analysis.businessDensity !== undefined ? analysis.businessDensity : (analysis.businessDensityPerKm2 || 0);
  const nearest = analysis.nearestBusiness;
  const targetCategory = analysis.targetBusinessInfo?.category || 'selected category';

  // Compute fact-based observations
  const generatedObservations: string[] = [];

  // Observation 1: Competitor count
  generatedObservations.push(
    `${directCount} potentially relevant ${targetCategory} businesses were identified within ${radiusKm} km.`
  );

  // Observation 2: Commercial density
  generatedObservations.push(
    `Commercial density is estimated at ${density.toFixed(1)} businesses / km² across an estimated ~${analysis.areaKm2} km² coverage area.`
  );

  // Observation 3: Nearest competitor proximity
  if (analysis.competition?.directCompetitors && analysis.competition.directCompetitors.length > 0) {
    const closest = analysis.competition.directCompetitors[0];
    generatedObservations.push(
      `The closest direct category competitor is ${closest.name}, located approximately ${closest.distance_formatted || `${closest.distance_meters} m`} away.`
    );
  } else if (nearest) {
    generatedObservations.push(
      `Closest active commercial POI is ${nearest.name} (~${nearest.distance_formatted || `${nearest.distance_meters} m`} away).`
    );
  }

  // Observation 4: Category dominance
  if (analysis.categoryDistribution && analysis.categoryDistribution.length > 0) {
    const topCat = analysis.categoryDistribution[0];
    generatedObservations.push(
      `${topCat.category} represents the largest single commercial category (${topCat.percentage || Math.round((topCat.count / (analysis.totalBusinesses || 1)) * 100)}% of retrieved points).`
    );
  }

  // Combine with backend-computed insights if available
  const displayInsights = (analysis.insights && analysis.insights.length > 0)
    ? analysis.insights
    : generatedObservations;

  return (
    <div className={`p-4 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#FFBF24]" />
          <h4 className="text-sm font-bold text-[#F8FAFC]">Grounded Location Insights</h4>
        </div>
        <span className="text-[10px] text-[#71717A] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Analytical & Grounded
        </span>
      </div>

      <div className="space-y-2.5">
        {displayInsights.map((insight, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#1A1A1D]/70 border border-[#27272A]/50 text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFBF24] mt-1.5 shrink-0" />
            <span className="text-[#F8FAFC] leading-relaxed">{insight}</span>
          </div>
        ))}
      </div>

      <div className="mt-1 pt-2 border-t border-[#27272A]/50 flex items-start gap-1.5 text-[11px] text-[#71717A]">
        <Info className="w-3 h-3 text-[#FFBF24] shrink-0 mt-0.5" />
        <span>
          Insights are descriptive and strictly derived from retrieved map data. They provide spatial context rather than financial or revenue guarantees.
        </span>
      </div>
    </div>
  );
};
