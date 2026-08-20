import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { TrendingUp, BarChart2, PieChart, Activity, Globe } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const MarketAnalysisPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Analysis & Intelligence"
        description="Macroeconomic industry size, growth CAGR indicators, and demand saturation benchmarks."
        badge="Part 3 Focus"
        actions={
          <Button size="sm" variant="outline" leftIcon={<Globe className="w-3.5 h-3.5" />}>
            Select Industry Domain
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry Growth Trends</CardTitle>
              <CardDescription>
                Historical and projected CAGR metrics across retail, tech, F&B, and healthcare sectors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<TrendingUp className="w-6 h-6 text-[#FFBF24]" />}
                title="Market Intelligence Engine Scheduled for Part 3"
                description="Comprehensive sector trends, demand indices, and competitor saturation charts will be populated during the Market & Financial Analysis module."
                actionLabel="Explore Categories"
                onAction={() => {}}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#FFBF24]" />
                <span>Analytical Metrics</span>
              </CardTitle>
              <CardDescription>
                Indicators modeled in Part 3.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-[#A1A1AA]">
              <div className="p-2.5 rounded bg-[#111113] border border-[#27272A]">
                <p className="font-semibold text-[#F8FAFC]">Saturation Index (0-10)</p>
                <p className="text-[11px] text-[#71717A] mt-0.5">Ratio of existing vendor density to local demographic demand volume.</p>
              </div>
              <div className="p-2.5 rounded bg-[#111113] border border-[#27272A]">
                <p className="font-semibold text-[#F8FAFC]">Average Ticket Size</p>
                <p className="text-[11px] text-[#71717A] mt-0.5">Estimated gross transaction size per customer visit.</p>
              </div>
              <div className="p-2.5 rounded bg-[#111113] border border-[#27272A]">
                <p className="font-semibold text-[#F8FAFC]">Annual Growth Rate (CAGR)</p>
                <p className="text-[11px] text-[#71717A] mt-0.5">Sector expansion velocity computed over 5-year horizons.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
