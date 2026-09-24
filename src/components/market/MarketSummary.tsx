import React from 'react';
import { MarketAnalysisData } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Compass, MapPin, Target, Users, TrendingUp, ShieldAlert, Award } from 'lucide-react';

interface MarketSummaryProps {
  data: MarketAnalysisData;
  className?: string;
}

export const MarketSummary: React.FC<MarketSummaryProps> = ({ data, className = '' }) => {
  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] ${className}`}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#FFBF24]" />
            <CardTitle>Market & Competition Executive Summary</CardTitle>
          </div>
          <CardDescription>
            Authoritative descriptive baseline computed from retrieved spatial establishments.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Badge variant={data.competitionRisk.level === 'Low' ? 'success' : data.competitionRisk.level === 'Moderate' ? 'warning' : 'error'} size="sm">
            {data.competitionRisk.level} Risk
          </Badge>
          <Badge variant="primary" size="sm">
            {data.marketOpportunity.indicator}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
            <span className="text-[#A1A1AA] text-[10px] uppercase font-mono block">Business Idea</span>
            <span className="text-sm font-bold text-[#F8FAFC] truncate block mt-0.5" title={data.businessIdea}>
              {data.businessIdea}
            </span>
            <span className="text-[10px] text-[#FFBF24]">{data.businessCategory}</span>
          </div>

          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
            <span className="text-[#A1A1AA] text-[10px] uppercase font-mono block">Trade Zone Location</span>
            <span className="text-sm font-bold text-[#F8FAFC] truncate block mt-0.5" title={data.location.name}>
              {data.location.name}
            </span>
            <span className="text-[10px] text-[#A1A1AA]">Radius: {data.radiusKm} km ({data.areaKm2} km²)</span>
          </div>

          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
            <span className="text-[#A1A1AA] text-[10px] uppercase font-mono block">Competitor Density</span>
            <span className="text-sm font-bold text-[#F8FAFC] block mt-0.5">
              {data.competitorDensityFormatted}
            </span>
            <span className="text-[10px] text-[#A1A1AA]">{data.relevantCompetitorsCount} in {data.areaKm2} km²</span>
          </div>

          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
            <span className="text-[#A1A1AA] text-[10px] uppercase font-mono block">Proximity Spacing</span>
            <span className="text-sm font-bold text-[#F8FAFC] block mt-0.5">
              Avg: {data.distanceMetrics.averageDistanceFormatted}
            </span>
            <span className="text-[10px] text-[#A1A1AA]">Nearest: {data.distanceMetrics.nearestDistanceFormatted}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-xs font-semibold text-[#F8FAFC] block">
              Market Concentration: <span className="text-[#FFBF24]">{data.concentration.level}</span>
            </span>
            <p className="text-[11px] text-[#A1A1AA] mt-0.5 leading-relaxed">
              {data.concentration.explanation}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-[10px] text-[#A1A1AA] font-mono block">Total Retrieved</span>
            <span className="text-xs font-bold text-[#F8FAFC]">
              {data.totalBusinesses} nearby ({data.relevantCompetitorsCount} direct, {data.otherBusinessesCount} other)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
