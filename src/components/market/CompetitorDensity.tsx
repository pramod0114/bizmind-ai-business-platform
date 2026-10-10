import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Layers, ChevronRight, Calculator } from 'lucide-react';

interface CompetitorDensityProps {
  relevantCompetitors: number;
  radiusKm: number;
  areaKm2: number;
  density: number;
  className?: string;
  defaultExpanded?: boolean;
}

export const CompetitorDensity: React.FC<CompetitorDensityProps> = ({
  relevantCompetitors,
  radiusKm,
  areaKm2,
  density,
  className = '',
  defaultExpanded = false,
}) => {
  const [showDetails, setShowDetails] = useState(defaultExpanded);

  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] flex flex-col justify-between ${className}`}>
      <div>
        <CardHeader className="pb-3 border-b border-[#27272A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FFBF24]" />
              <CardTitle>Competitor Spatial Density</CardTitle>
            </div>
            <Badge variant="primary" size="sm">
              {density.toFixed(2)} / km²
            </Badge>
          </div>
          <CardDescription>
            Estimated competitor density based on retrieved data.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-3 text-xs">
          {/* Key Stat Cards (Always visible) */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A]">
              <span className="text-[#A1A1AA] text-[10px] block font-mono">Radius</span>
              <span className="text-sm font-bold text-[#F8FAFC]">{radiusKm} km</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A]">
              <span className="text-[#A1A1AA] text-[10px] block font-mono">Surface Area</span>
              <span className="text-sm font-bold text-[#F8FAFC]">{areaKm2} km²</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#27272A]">
              <span className="text-[#A1A1AA] text-[10px] block font-mono">Relevant Count</span>
              <span className="text-sm font-bold text-[#FFBF24]">{relevantCompetitors}</span>
            </div>
          </div>

          <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
            {relevantCompetitors === 0
              ? 'No category competitors detected in this geographic boundary. Low crowding observed in available OpenStreetMap data.'
              : density < 0.5
              ? 'Low spatial saturation: competitors are widely dispersed with ample geographic buffering.'
              : density < 1.5
              ? 'Moderate spatial density: regular distribution typical of established neighborhood commercial zones.'
              : 'Elevated spatial clustering: competitors occupy proximate frontage within this trade zone.'}
          </p>

          {/* Collapsible Mathematical Formulation */}
          {showDetails && (
            <div className="p-3.5 rounded-lg bg-[#111113] border border-[#27272A] space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-[10px] text-[#FFBF24] uppercase tracking-wider font-mono">
                <Calculator className="w-3.5 h-3.5" />
                <span>Mathematical Formulation</span>
              </div>
              <div className="font-mono text-xs text-[#FFBF24] bg-[#18181B] p-2.5 rounded border border-[#27272A] leading-relaxed">
                Area = π × ({radiusKm} km)² = {areaKm2} km²<br />
                Density = {relevantCompetitors} competitors ÷ {areaKm2} km² ={' '}
                <span className="font-bold text-white">{density.toFixed(2)} competitors / km²</span>
              </div>
              <p className="text-[10px] text-[#71717A] leading-tight">
                Calculated uniformly across the circular trade zone. Actual frontage distribution may vary based on terrain and road arteries.
              </p>
            </div>
          )}
        </CardContent>
      </div>

      {/* Interactive Toggle Footer */}
      <div className="px-5 py-3 border-t border-[#27272A] flex items-center justify-between bg-[#141416] rounded-b-xl">
        <span className="text-[11px] text-[#71717A] font-mono">
          {showDetails ? 'Formula active' : 'Click Details to view formula'}
        </span>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] rounded text-[11px] font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
          title={showDetails ? 'Hide detailed formula' : 'View mathematical formula'}
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
