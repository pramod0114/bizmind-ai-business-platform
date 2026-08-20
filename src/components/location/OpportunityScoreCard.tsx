import React from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Info, Flame, BarChart3, ShieldCheck } from 'lucide-react';
import { LocationAnalysisResult } from '../../types';

interface OpportunityScoreCardProps {
  analysis: LocationAnalysisResult;
}

export const OpportunityScoreCard: React.FC<OpportunityScoreCardProps> = ({ analysis }) => {
  const { opportunityScore, competition, businessDensityPerKm2, totalBusinesses } = analysis;
  const score = opportunityScore.overallScore;

  // Rating and Color scheme
  let ratingText = 'Favorable Opportunity';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let strokeColor = '#10B981';

  if (score >= 80) {
    ratingText = 'High Potential Location';
    badgeColor = 'bg-[#FFBF24]/10 text-[#FFBF24] border-[#FFBF24]/30';
    strokeColor = '#FFBF24';
  } else if (score >= 65) {
    ratingText = 'Moderate / Favorable';
    badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    strokeColor = '#3B82F6';
  } else if (score >= 50) {
    ratingText = 'Competitive Location';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    strokeColor = '#F59E0B';
  } else {
    ratingText = 'High Market Saturation';
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    strokeColor = '#EF4444';
  }

  // Circular gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      id="opportunity-score-card"
      className="p-5 rounded-2xl bg-[#111113] border border-[#27272A] space-y-4 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/20">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F8FAFC]">Location Opportunity Score</h4>
            <p className="text-[11px] text-[#A1A1AA]">Rule-based analytical feasibility indicator</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
          {ratingText}
        </span>
      </div>

      {/* Main Score Display & Dial */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-xl bg-[#18181B] border border-[#27272A]/60">
        {/* Radial Progress Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#27272A"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-[#F8FAFC] tracking-tight">{score}</span>
            <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase">/ 100</span>
          </div>
        </div>

        {/* Quick Diagnostics Badges */}
        <div className="space-y-2.5 w-full text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#27272A]/50">
            <span className="text-[#A1A1AA] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" /> Competition Level
            </span>
            <span
              className={`font-semibold uppercase ${
                competition.competitionLevel === 'LOW'
                  ? 'text-emerald-400'
                  : competition.competitionLevel === 'MEDIUM'
                  ? 'text-[#FFBF24]'
                  : 'text-rose-400'
              }`}
            >
              {competition.competitionLevel} ({competition.directCompetitorCount} direct)
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#27272A]/50">
            <span className="text-[#A1A1AA] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" /> Market Gap Signal
            </span>
            <span
              className={`font-semibold uppercase ${
                competition.marketGapSignal === 'HIGH'
                  ? 'text-emerald-400'
                  : competition.marketGapSignal === 'MEDIUM'
                  ? 'text-[#FFBF24]'
                  : 'text-rose-400'
              }`}
            >
              {competition.marketGapSignal}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[#A1A1AA] flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#8B5CF6]" /> Commercial Density
            </span>
            <span className="font-semibold text-[#F8FAFC]">
              {businessDensityPerKm2} / km² ({totalBusinesses} total)
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Score Breakdown Bars */}
      <div className="space-y-3 pt-1">
        <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
          Score Breakdown Component Analysis
        </div>

        {/* 1. Competition Headroom */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F8FAFC]">Competition Headroom</span>
            <span className="font-mono text-[#FFBF24] font-semibold">
              {opportunityScore.competitionScore} / 100
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
            <div
              className="h-full bg-[#FFBF24] rounded-full transition-all duration-500"
              style={{ width: `${opportunityScore.competitionScore}%` }}
            />
          </div>
        </div>

        {/* 2. Market Gap & Niche */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F8FAFC]">Category Gap & Niche Potential</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {opportunityScore.categoryGapScore} / 100
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${opportunityScore.categoryGapScore}%` }}
            />
          </div>
        </div>

        {/* 3. Footfall & Density Anchor */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F8FAFC]">Footfall & Commercial Activity Anchor</span>
            <span className="font-mono text-blue-400 font-semibold">
              {opportunityScore.densityScore} / 100
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${opportunityScore.densityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Transparent Explanation & Disclaimer */}
      <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]/50 text-xs text-[#A1A1AA] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          {opportunityScore.explanation}
        </p>
      </div>
    </div>
  );
};
