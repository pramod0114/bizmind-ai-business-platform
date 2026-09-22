import React, { useState } from 'react';
import { PieChart, BarChart2, Layers } from 'lucide-react';
import { LocationAnalysisResult } from '../../types';

export interface CategoryDistributionChartProps {
  analysis: LocationAnalysisResult;
  className?: string;
}

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  analysis,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'detailed' | 'broad'>('detailed');

  const detailedList = analysis.categoryDistribution || [];
  const broadList = analysis.broadCategoryDistribution || [];
  const dataList = viewMode === 'detailed' ? detailedList : broadList;
  const total = analysis.totalBusinesses || 1;

  return (
    <div className={`p-4 bg-[#111113] rounded-xl border border-[#27272A] shadow-sm flex flex-col gap-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#FFBF24]" />
          <h4 className="text-sm font-bold text-[#F8FAFC]">Category Breakdown</h4>
        </div>

        <div className="flex items-center p-0.5 bg-[#1A1A1D] rounded-lg border border-[#27272A]">
          <button
            type="button"
            onClick={() => setViewMode('detailed')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded cursor-pointer transition-colors ${
              viewMode === 'detailed'
                ? 'bg-[#FFBF24] text-[#0B0B0C] font-bold'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            Sub-Categories
          </button>
          <button
            type="button"
            onClick={() => setViewMode('broad')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded cursor-pointer transition-colors ${
              viewMode === 'broad'
                ? 'bg-[#FFBF24] text-[#0B0B0C] font-bold'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            Broad Sectors
          </button>
        </div>
      </div>

      {dataList.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#71717A]">
          No category distribution data available for this radius.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#27272A]">
          {dataList.map((item, idx) => {
            const label = 'category' in item ? item.category : item.broadCategory;
            const percentage = item.percentage || Math.round((item.count / total) * 100);

            // Palette gradient for top ranks
            const barColors = [
              'bg-[#FFBF24]',
              'bg-sky-400',
              'bg-emerald-400',
              'bg-purple-400',
              'bg-pink-400',
              'bg-orange-400',
              'bg-teal-400',
              'bg-indigo-400',
            ];
            const activeColor = barColors[idx % barColors.length];

            return (
              <div key={label} className="group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#F8FAFC] group-hover:text-[#FFBF24] transition-colors truncate max-w-[200px]">
                    {label}
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono text-[#A1A1AA]">{item.count}</span>
                    <span className="font-mono text-[#71717A] w-9 text-right">{percentage}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#1A1A1D] overflow-hidden border border-[#27272A]/40">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${activeColor}`}
                    style={{ width: `${Math.max(4, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-2 border-t border-[#27272A] flex items-center justify-between text-[11px] text-[#71717A]">
        <span>Showing {dataList.length} categories</span>
        <span>Most common: <strong className="text-[#F8FAFC]">{analysis.mostCommonCategory || 'Commercial'}</strong></span>
      </div>
    </div>
  );
};
