import React, { useState } from 'react';
import { SensitivityAnalysisResult } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Layers, Table, BarChart2 } from 'lucide-react';

interface SensitivityAnalysisSectionProps {
  sensitivity: SensitivityAnalysisResult;
}

export const SensitivityAnalysisSection: React.FC<SensitivityAnalysisSectionProps> = ({ sensitivity }) => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'expense' | 'investment'>('revenue');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const { revenueSensitivity, expenseSensitivity, investmentSensitivity } = sensitivity;

  const currentDataset =
    activeTab === 'revenue'
      ? revenueSensitivity
      : activeTab === 'expense'
      ? expenseSensitivity
      : investmentSensitivity;

  const chartData = currentDataset.map((item) => ({
    label: item.label,
    monthlyProfit: item.monthlyProfit,
    annualProfit: item.annualProfit,
    roi: item.roi ?? 0,
  }));

  return (
    <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Sensitivity Analysis (±20%)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate how operational fluctuations in revenue, expenses, and capital impact baseline profitability
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-[#27272A] p-0.5 rounded-lg border border-[#3F3F46]">
            <button
              onClick={() => setViewMode('chart')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'chart' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Chart View"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dimension Selector */}
          <div className="flex bg-[#27272A] p-1 rounded-lg border border-[#3F3F46] text-xs">
            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'revenue'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'expense'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('investment')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'investment'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CapEx
            </button>
          </div>
        </div>
      </div>

      {/* Content: Chart or Table */}
      {viewMode === 'chart' ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
              <XAxis dataKey="label" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="left"
                stroke="#71717A"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `₹${((Number(v) || 0) / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#71717A"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any, name: any) => [
                  name === 'ROI' ? `${(Number(val) || 0).toFixed(1)}%` : formatCurrency(Number(val)),
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <ReferenceLine yAxisId="left" y={0} stroke="#52525B" strokeDasharray="3 3" />
              {activeTab !== 'investment' && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="monthlyProfit"
                  name="Monthly Profit"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              )}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="roi"
                name="ROI"
                stroke="#38BDF8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] text-slate-400 font-semibold uppercase tracking-wider bg-[#202024]">
                <th className="py-2.5 px-3">Adjustment</th>
                <th className="py-2.5 px-3 text-right">Monthly Profit</th>
                <th className="py-2.5 px-3 text-right">Annual Profit</th>
                <th className="py-2.5 px-3 text-right">Projected ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/70 text-slate-200">
              {currentDataset.map((row) => (
                <tr
                  key={row.label}
                  className={`hover:bg-[#27272A]/40 transition-colors ${
                    row.adjustmentPercentage === 0 ? 'bg-indigo-500/10 font-medium' : ''
                  }`}
                >
                  <td className="py-2 px-3 flex items-center gap-2">
                    <span className="font-bold text-white">{row.label}</span>
                    {row.adjustmentPercentage === 0 && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.2 rounded">
                        Base
                      </span>
                    )}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-semibold ${
                      row.monthlyProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {formatCurrency(row.monthlyProfit)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-300">{formatCurrency(row.annualProfit)}</td>
                  <td className="py-2 px-3 text-right font-semibold text-cyan-400">
                    {row.roi !== null ? formatPercentage(row.roi) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
