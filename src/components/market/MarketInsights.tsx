import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Lightbulb, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface MarketInsightsProps {
  insights: string[];
  className?: string;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ insights = [], className = '' }) => {
  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] ${className}`}>
      <CardHeader className="pb-3 border-b border-[#27272A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#FFBF24]" />
            <CardTitle>Data-Derived Market Insights</CardTitle>
          </div>
          <span className="text-[10px] text-[#A1A1AA] font-mono">Factual Synthesis</span>
        </div>
        <CardDescription>
          Direct empirical deductions calculated from verified OpenStreetMap listings.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-2.5 text-xs">
        {insights.length === 0 ? (
          <p className="text-[#A1A1AA] italic">No empirical insights available.</p>
        ) : (
          insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#111113] border border-[#27272A] flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
              <p className="text-slate-200 text-[11px] leading-relaxed font-medium">{insight}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
