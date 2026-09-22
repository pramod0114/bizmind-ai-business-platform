import React, { useState } from 'react';
import { Flame, Sparkles, MapPin, Phone, Globe, Info, ChevronRight, Shield } from 'lucide-react';
import { LocationAnalysisResult, DiscoveredBusiness } from '../../types';

export interface CompetitorAnalysisProps {
  analysis: LocationAnalysisResult;
  onSelectBusiness?: (business: DiscoveredBusiness) => void;
  className?: string;
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({
  analysis,
  onSelectBusiness,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'related'>('direct');

  const competition = analysis.competition || {
    directCompetitorCount: 0,
    relatedBusinessCount: 0,
    directCompetitors: [],
    relatedBusinesses: [],
    competitionLevel: 'LOW',
    marketGapSignal: 'MEDIUM',
  };

  const directList = competition.directCompetitors || [];
  const relatedList = competition.relatedBusinesses || [];
  const targetCategory = analysis.targetBusinessInfo?.category || 'General Commercial';
  const radiusKm = analysis.radiusKm || parseFloat((analysis.radiusMeters / 1000).toFixed(1));
  const concLevel = analysis.concentrationLevel || (directList.length >= 8 ? 'High concentration' : directList.length >= 3 ? 'Moderate concentration' : 'Low concentration');

  const getConcTheme = (level: string) => {
    if (level.toLowerCase().includes('high')) {
      return {
        badge: 'text-red-400 bg-red-500/15 border-red-500/30',
        barWidth: '85%',
        barColor: 'bg-red-500',
        note: `More than 8 relevant competitors (${directList.length}) exist in this ${radiusKm} km radius. High established customer habit, but requires strong differentiation or niche positioning.`,
      };
    }
    if (level.toLowerCase().includes('mod') || level.toLowerCase().includes('med')) {
      return {
        badge: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
        barWidth: '55%',
        barColor: 'bg-amber-500',
        note: `Between 3 and 8 relevant businesses (${directList.length}) found in ${radiusKm} km. Suggests a validated local market with healthy headroom for quality competitors.`,
      };
    }
    return {
      badge: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      barWidth: '25%',
      barColor: 'bg-emerald-500',
      note: `0 to 2 direct competitors (${directList.length}) detected within ${radiusKm} km. Low immediate crowding; verify if footfall or market demand exists.`,
    };
  };

  const theme = getConcTheme(concLevel);

  return (
    <div className={`p-4 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm flex flex-col gap-4 ${className}`}>
      {/* Header & Concentration Rule */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FFBF24]" />
            <h4 className="text-sm font-bold text-[#F8FAFC]">Competitor Relevance & Concentration</h4>
          </div>
          <p className="text-xs text-[#71717A] mt-0.5">
            Category target: <span className="text-[#FFBF24] font-medium">{targetCategory}</span> within {radiusKm} km
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded border ${theme.badge}`}>
            {concLevel}
          </span>
        </div>
      </div>

      {/* Rule-Based Transparent Explanation Box */}
      <div className="p-3 bg-[#1A1A1D] rounded-lg border border-[#27272A] text-xs">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-[#F8FAFC]">
              {directList.length} potentially relevant businesses were found within {radiusKm} km.
            </p>
            <p className="text-[#A1A1AA] leading-relaxed">
              {theme.note}
            </p>
            <p className="text-[11px] text-[#71717A] pt-1">
              *Transparent rule scale: Low (0–3), Moderate (4–8), High (&gt;8). This is an objective descriptive classification based on retrieved OpenStreetMap count and density.
            </p>
          </div>
        </div>
      </div>

      {/* Direct vs Related Tabs */}
      <div className="flex items-center gap-2 border-b border-[#27272A]">
        <button
          type="button"
          onClick={() => setActiveTab('direct')}
          className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'direct'
              ? 'text-[#FFBF24] border-[#FFBF24]'
              : 'text-[#71717A] border-transparent hover:text-[#A1A1AA]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Direct Competitors ({directList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('related')}
          className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'related'
              ? 'text-[#38BDF8] border-[#38BDF8]'
              : 'text-[#71717A] border-transparent hover:text-[#A1A1AA]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Related / Synergistic ({relatedList.length})</span>
        </button>
      </div>

      {/* Competitor List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#27272A]">
        {activeTab === 'direct' ? (
          directList.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#71717A]">
              No direct {targetCategory} competitors found in this radius.
            </div>
          ) : (
            directList.map((c, idx) => (
              <div
                key={c.osm_id || c.name || idx}
                onClick={() => onSelectBusiness && onSelectBusiness(c)}
                className="p-2.5 rounded-lg bg-[#151518] hover:bg-[#1A1A1D] border border-[#27272A] flex items-center justify-between gap-2 cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F8FAFC] truncate">{c.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/15 text-red-400 font-mono">
                      {c.distance_formatted || `${c.distance_meters}m`}
                    </span>
                  </div>
                  {c.address && (
                    <div className="text-[11px] text-[#71717A] truncate mt-0.5">{c.address}</div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-[#71717A] shrink-0" />
              </div>
            ))
          )
        ) : (
          relatedList.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#71717A]">
              No related complementary businesses identified in this radius.
            </div>
          ) : (
            relatedList.map((r, idx) => (
              <div
                key={r.osm_id || r.name || idx}
                onClick={() => onSelectBusiness && onSelectBusiness(r)}
                className="p-2.5 rounded-lg bg-[#151518] hover:bg-[#1A1A1D] border border-[#27272A] flex items-center justify-between gap-2 cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F8FAFC] truncate">{r.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400">
                      {r.category}
                    </span>
                    <span className="text-[10px] text-[#71717A] font-mono">
                      {r.distance_formatted || `${r.distance_meters}m`}
                    </span>
                  </div>
                  {r.address && (
                    <div className="text-[11px] text-[#71717A] truncate mt-0.5">{r.address}</div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-[#71717A] shrink-0" />
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};
