import React from 'react';
import { CategorySummaryItem } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { BarChart2, PieChart as PieIcon, Flame, Building2 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface CategoryDistributionProps {
  categories: CategorySummaryItem[];
  businessIdea: string;
  className?: string;
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({
  categories = [],
  businessIdea,
  className = '',
}) => {
  // Sort and take top 8 for clean visualization
  const topCategories = categories.slice(0, 8);

  const directCategories = categories.filter((c) => c.isDirectCategory);
  const otherCategories = categories.filter((c) => !c.isDirectCategory);

  const COLORS = ['#FFBF24', '#F59E0B', '#38BDF8', '#818CF8', '#A78BFA', '#34D399', '#F472B6', '#94A3B8'];

  return (
    <Card className={`border-[#27272A] bg-[#1A1A1D] ${className}`}>
      <CardHeader className="pb-3 border-b border-[#27272A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#FFBF24]" />
            <CardTitle>Business Category & Commercial Mix</CardTitle>
          </div>
          <span className="text-[10px] text-[#A1A1AA] font-mono">
            {categories.length} Distinct Categories
          </span>
        </div>
        <CardDescription>
          Observed distribution of establishments within the trade perimeter.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#A1A1AA] bg-[#111113] rounded-lg border border-[#27272A]">
            No categorical records available for this radius.
          </div>
        ) : (
          <>
            {/* Visual Chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCategories} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                  <XAxis type="number" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="category"
                    type="category"
                    stroke="#A1A1AA"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as CategorySummaryItem;
                        return (
                          <div className="p-2.5 rounded-lg bg-[#111113] border border-[#27272A] text-xs shadow-xl space-y-1">
                            <span className="font-bold text-[#F8FAFC] block">{item.category}</span>
                            <span className="text-[#A1A1AA] text-[11px] block">
                              Count: <strong className="text-white">{item.count}</strong> ({item.percentage}% of zone)
                            </span>
                            <span
                              className={`text-[10px] font-semibold ${
                                item.isDirectCategory ? 'text-[#FFBF24]' : 'text-[#38BDF8]'
                              }`}
                            >
                              {item.isDirectCategory ? '• Direct Competitor Category' : '• Synergistic/Other Trade'}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {topCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isDirectCategory ? '#FFBF24' : '#38BDF8'}
                        opacity={entry.isDirectCategory ? 1 : 0.65}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Direct vs Related Breakdown Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFBF24]">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Direct / Highly Relevant Categories</span>
                </div>
                {directCategories.length === 0 ? (
                  <p className="text-[11px] text-[#71717A] italic">No direct category listings found.</p>
                ) : (
                  <div className="space-y-1.5">
                    {directCategories.map((c) => (
                      <div key={c.category} className="flex items-center justify-between text-[11px]">
                        <span className="text-[#F8FAFC] font-medium">{c.category}</span>
                        <span className="font-mono text-[#FFBF24]">{c.count} ({c.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#38BDF8]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Synergistic & Supporting Commercial Mix</span>
                </div>
                {otherCategories.length === 0 ? (
                  <p className="text-[11px] text-[#71717A] italic">No other categories cataloged.</p>
                ) : (
                  <div className="space-y-1.5">
                    {otherCategories.slice(0, 4).map((c) => (
                      <div key={c.category} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300">{c.category}</span>
                        <span className="font-mono text-[#A1A1AA]">{c.count} ({c.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
