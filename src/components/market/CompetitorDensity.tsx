import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Users, Info, PieChart, Layers } from 'lucide-react';

interface CompetitorDensityProps {
  relevantCompetitors: number;
  radiusKm: number;
  areaKm2: number;
  density: number;
  className?: string;
}

export const CompetitorDensity: React.FC<CompetitorDensityProps> = ({
  relevantCompetitors,
  radiusKm,
  areaKm2,
  density,
  className = '',
}) => {
  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] ${className}`}>
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
        {/* Formula Breakdown Callout */}
        <div className="p-3.5 rounded-lg bg-[#111113] border border-[#27272A] space-y-2">
          <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-mono block">
            Mathematical Formulation
          </span>
          <div className="font-mono text-xs text-[#FFBF24] bg-[#18181B] p-2 rounded border border-[#27272A]">
            Area = π × ({radiusKm} km)² = {areaKm2} km²<br />
            Density = {relevantCompetitors} competitors ÷ {areaKm2} km² = <span className="font-bold text-white">{density.toFixed(2)} competitors / km²</span>
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
};
