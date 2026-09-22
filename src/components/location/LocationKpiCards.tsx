import React from 'react';
import {
  Building2,
  Users,
  BarChart3,
  Navigation,
  ShieldAlert,
  Gauge,
  Info,
} from 'lucide-react';
import { LocationAnalysisResult } from '../../types';

export interface LocationKpiCardsProps {
  analysis: LocationAnalysisResult;
  className?: string;
}

export const LocationKpiCards: React.FC<LocationKpiCardsProps> = ({
  analysis,
  className = '',
}) => {
  const directCount = analysis.relevantBusinesses !== undefined ? analysis.relevantBusinesses : (analysis.competition?.directCompetitorCount || 0);
  const totalCount = analysis.totalBusinesses || 0;
  const density = analysis.businessDensity !== undefined ? analysis.businessDensity : (analysis.businessDensityPerKm2 || 0);
  const avgDistance = analysis.averageRelevantDistance || (analysis.nearestBusiness?.distance_formatted || 'N/A');
  const concLevel = analysis.concentrationLevel || (directCount >= 8 ? 'High concentration' : directCount >= 3 ? 'Moderate concentration' : 'Low concentration');
  const score = analysis.opportunityScore?.overallScore || 70;

  const getConcBadge = (level: string) => {
    if (level.toLowerCase().includes('high')) {
      return { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' };
    }
    if (level.toLowerCase().includes('mod') || level.toLowerCase().includes('med')) {
      return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' };
    }
    return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' };
  };

  const getConcShortLabel = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('high')) return 'High';
    if (l.includes('mod') || l.includes('med')) return 'Moderate';
    return 'Low';
  };

  const concShort = getConcShortLabel(concLevel);
  const concTheme = getConcBadge(concLevel);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 ${className}`}>
      {/* 1. Total Businesses */}
      <div className="p-3.5 bg-[#111113] rounded-xl border border-[#27272A] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-[#71717A]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total POIs</span>
          <Building2 className="w-4 h-4 text-[#FFBF24]" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-[#F8FAFC] tracking-tight">{totalCount}</div>
          <div className="text-[10px] text-[#71717A] mt-0.5 truncate">Retrieved in radius</div>
        </div>
      </div>

      {/* 2. Relevant Businesses */}
      <div className="p-3.5 bg-[#111113] rounded-xl border border-[#27272A] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-[#71717A]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Relevant</span>
          <Users className="w-4 h-4 text-[#38BDF8]" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-[#F8FAFC] tracking-tight">{directCount}</div>
          <div className="text-[10px] text-[#71717A] mt-0.5 truncate">Direct Category Match</div>
        </div>
      </div>

      {/* 3. Business Density */}
      <div className="p-3.5 bg-[#111113] rounded-xl border border-[#27272A] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-[#71717A]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Density</span>
          <BarChart3 className="w-4 h-4 text-[#A855F7]" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-[#F8FAFC] tracking-tight">{density.toFixed(1)}</div>
          <div className="text-[10px] text-[#71717A] mt-0.5 truncate">businesses / km²</div>
        </div>
      </div>

      {/* 4. Average Relevant Distance */}
      <div className="p-3.5 bg-[#111113] rounded-xl border border-[#27272A] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-[#71717A]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Distance</span>
          <Navigation className="w-4 h-4 text-[#34D399]" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-black text-[#F8FAFC] tracking-tight truncate">{avgDistance}</div>
          <div className="text-[10px] text-[#71717A] mt-0.5 truncate">to relevant competitors</div>
        </div>
      </div>

      {/* 5. Concentration Level */}
      <div className="p-3.5 bg-[#111113] rounded-xl border border-[#27272A] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-[#71717A]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Concentration</span>
          <ShieldAlert className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2">
          <span
            className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${concTheme.bg} ${concTheme.text} ${concTheme.border} whitespace-nowrap`}
            title={concLevel}
          >
            {concShort}
          </span>
          <div className="text-[10px] text-[#71717A] mt-1 truncate">
            {directCount === 0 ? 'No direct rivals' : `${directCount} direct match${directCount === 1 ? '' : 'es'}`}
          </div>
        </div>
      </div>

      {/* 6. Opportunity Score */}
      <div className="p-3.5 bg-[#111113] rounded-xl border border-[#27272A] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-[#71717A]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Opportunity</span>
          <Gauge className="w-4 h-4 text-[#FFBF24]" />
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#FFBF24]">{score}</span>
            <span className="text-xs text-[#71717A]">/100</span>
          </div>
          <div className="text-[9px] text-[#71717A] mt-0.5 flex items-center gap-0.5" title="Analytical indicator based on density and competitor gap.">
            <Info className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">Analytical signal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
