import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DistanceAnalysisProps {
  nearest: string;
  farthest: string;
  average: string;
  median: string;
  relevantCount: number;
  distanceBuckets: { range: string; count: number }[];
  className?: string;
}

export const DistanceAnalysis: React.FC<DistanceAnalysisProps> = ({
  nearest,
  farthest,
  average,
  median,
  relevantCount,
  distanceBuckets = [],
  className = '',
}) => {
  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] ${className}`}>
      <CardHeader className="pb-3 border-b border-[#27272A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#FFBF24]" />
            <CardTitle>Competitor Distance & Radial Dispersion</CardTitle>
          </div>
          <span className="text-[10px] text-[#A1A1AA] font-mono">
            {relevantCount} Competitors
          </span>
        </div>
        <CardDescription>
          Descriptive spatial distance metrics computed from target coordinates.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs">
        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] text-center">
            <span className="text-[#A1A1AA] text-[10px] uppercase font-mono block">Nearest</span>
            <span className="text-sm font-bold text-[#22C55E] block mt-0.5">{nearest}</span>
            <span className="text-[10px] text-[#71717A]">Immediate buffer</span>
          </div>

          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] text-center">
            <span className="text-[#A1A1AA] text-[10px] uppercase font-mono block">Average</span>
            <span className="text-sm font-bold text-[#FFBF24] block mt-0.5">{average}</span>
            <span className="text-[10px] text-[#71717A]">Mean separation</span>
          </div>

          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] text-center">
            <span className="text-[#A1A1AA] text-[10px] uppercase font-mono block">Median</span>
            <span className="text-sm font-bold text-[#38BDF8] block mt-0.5">{median}</span>
            <span className="text-[10px] text-[#71717A]">50th percentile</span>
          </div>

          <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] text-center">
            <span className="text-[#A1A1AA] text-[10px] uppercase font-mono block">Farthest</span>
            <span className="text-sm font-bold text-slate-300 block mt-0.5">{farthest}</span>
            <span className="text-[10px] text-[#71717A]">Perimeter limit</span>
          </div>
        </div>

        {/* Distance Range Buckets Chart */}
        {distanceBuckets.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-[#F8FAFC] block">
              Competitor Proximity Buckets
            </span>
            <div className="h-40 w-full bg-[#111113] p-2 rounded-lg border border-[#27272A]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distanceBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="range" stroke="#71717A" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="p-2 rounded bg-[#18181B] border border-[#27272A] text-xs">
                            <span className="text-[#F8FAFC] font-bold block">{item.range}</span>
                            <span className="text-[#FFBF24]">{item.count} competitors</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#FFBF24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
