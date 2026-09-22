import React from 'react';
import { Activity, Info, BarChart2 } from 'lucide-react';
import { LocationAnalysisResult } from '../../types';

export interface BusinessDensityCardProps {
  analysis: LocationAnalysisResult;
  className?: string;
}

export const BusinessDensityCard: React.FC<BusinessDensityCardProps> = ({
  analysis,
  className = '',
}) => {
  const density = analysis.businessDensity !== undefined ? analysis.businessDensity : (analysis.businessDensityPerKm2 || 0);
  const areaKm2 = analysis.areaKm2 || parseFloat((Math.PI * Math.pow(analysis.radiusMeters / 1000, 2)).toFixed(2));
  const totalB = analysis.totalBusinesses || 0;
  const radiusKm = analysis.radiusKm || parseFloat((analysis.radiusMeters / 1000).toFixed(1));

  let classification: 'Low commercial activity' | 'Moderate commercial activity' | 'High commercial activity';
  let badgeColor: string;
  let barPercent: number;
  let contextDescription: string;

  if (density < 5) {
    classification = 'Low commercial activity';
    badgeColor = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    barPercent = Math.min(100, Math.max(12, (density / 5) * 33));
    contextDescription =
      'Indicates a quiet, suburban, or developing commercial presence. Businesses here may experience lower baseline pedestrian footfall but significantly less saturation and lower leasing competition.';
  } else if (density <= 20) {
    classification = 'Moderate commercial activity';
    badgeColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    barPercent = 33 + Math.min(33, ((density - 5) / 15) * 33);
    contextDescription =
      'Balanced commercial ecosystem with active neighborhood foot traffic and steady daytime consumer activity without severe retail crowding or overwhelming overhead.';
  } else {
    classification = 'High commercial activity';
    badgeColor = 'text-purple-400 bg-purple-500/15 border-purple-500/30';
    barPercent = Math.min(100, 66 + ((density - 20) / 40) * 34);
    contextDescription =
      'Dense urban or central commercial hub with heavy daily foot traffic, strong transit access, and high customer volume, balanced by intense competition for prime retail storefronts.';
  }

  return (
    <div className={`p-4 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FFBF24]" />
            <h4 className="text-sm font-bold text-[#F8FAFC]">Business Density Analysis</h4>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${badgeColor}`}>
            {classification}
          </span>
        </div>

        {/* Big Metric Display */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-3xl font-black text-[#F8FAFC] tracking-tight">{density.toFixed(1)}</span>
          <span className="text-xs text-[#A1A1AA] font-medium">businesses / km²</span>
        </div>

        {/* Formula calculation badge */}
        <div className="mt-2 text-[11px] font-mono text-[#71717A] bg-[#1A1A1D] px-2.5 py-1 rounded border border-[#27272A] flex items-center justify-between">
          <span>Density = {totalB} businesses ÷ ~{areaKm2} km²</span>
          <span className="text-[10px] text-[#A1A1AA]">Radius: {radiusKm} km</span>
        </div>

        {/* Visual benchmark progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-[#71717A] mb-1">
            <span>Low (&lt;5)</span>
            <span>Moderate (5–20)</span>
            <span>High (&gt;20)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#1A1A1D] border border-[#27272A] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${barPercent}%` }}
            />
          </div>
        </div>

        {/* Foot traffic context */}
        <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
          {contextDescription}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#27272A]/50 flex items-center gap-1.5 text-[10px] text-[#71717A]">
        <Info className="w-3 h-3 text-[#FFBF24] shrink-0" />
        <span>Derived strictly from retrieved OpenStreetMap commercial nodes within the circle.</span>
      </div>
    </div>
  );
};
