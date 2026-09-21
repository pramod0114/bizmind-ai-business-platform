import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';
import { MonthProjection } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { BarChart3, LineChart as LineChartIcon, PieChart, Activity } from 'lucide-react';

interface FinancialChartsProps {
  projections: MonthProjection[];
  monthlyRevenue: number;
  monthlyFixedExpenses: number;
  monthlyVariableExpenses: number;
  totalInitialInvestment: number;
  sellingPrice?: number;
  breakEvenUnits?: number | null;
  breakEvenRevenue?: number | null;
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({
  projections,
  monthlyRevenue,
  monthlyFixedExpenses,
  monthlyVariableExpenses,
  totalInitialInvestment,
  sellingPrice = 0,
  breakEvenUnits,
  breakEvenRevenue,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'revenue-expenses' | 'profit' | 'lines' | 'breakeven' | 'recovery'>('all');

  // Prepare break-even curve data points across 0% to 160% capacity
  const breakEvenChartData = React.useMemo(() => {
    const points = [];
    const baseRevenue = monthlyRevenue > 0 ? monthlyRevenue : (breakEvenRevenue ? breakEvenRevenue * 1.2 : 100000);
    const variableRatio = monthlyRevenue > 0 ? monthlyVariableExpenses / monthlyRevenue : 0.4;

    for (let percent = 0; percent <= 160; percent += 20) {
      const volumeRatio = percent / 100;
      const currentRev = Math.round(baseRevenue * volumeRatio);
      const currentVar = Math.round(currentRev * variableRatio);
      const totalCost = Math.round(monthlyFixedExpenses + currentVar);
      const profit = currentRev - totalCost;

      points.push({
        capacityPercent: `${percent}%`,
        revenue: currentRev,
        totalCost: totalCost,
        fixedCost: monthlyFixedExpenses,
        profit: profit,
      });
    }
    return points;
  }, [monthlyRevenue, monthlyFixedExpenses, monthlyVariableExpenses, breakEvenRevenue]);

  return (
    <div className="space-y-6">
      {/* Chart View Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272A] pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Financial Feasibility Visualizations</h3>
        </div>

        <div className="flex flex-wrap gap-1 bg-[#18181B] p-1 rounded-lg border border-[#27272A]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#27272A]'
            }`}
          >
            All Charts
          </button>
          <button
            onClick={() => setActiveTab('revenue-expenses')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'revenue-expenses'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#27272A]'
            }`}
          >
            Rev vs Exp
          </button>
          <button
            onClick={() => setActiveTab('profit')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'profit'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#27272A]'
            }`}
          >
            Monthly Profit
          </button>
          <button
            onClick={() => setActiveTab('lines')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'lines'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#27272A]'
            }`}
          >
            Performance Lines
          </button>
          <button
            onClick={() => setActiveTab('breakeven')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'breakeven'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#27272A]'
            }`}
          >
            Break-Even
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'recovery'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#27272A]'
            }`}
          >
            Investment Recovery
          </button>
        </div>
      </div>

      {/* Grid of charts based on active selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Revenue vs Expenses (Bar Chart) */}
        {(activeTab === 'all' || activeTab === 'revenue-expenses') && (
          <div className="bg-[#18181B] p-5 rounded-xl border border-[#27272A]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Chart 1: Revenue vs Expenses</h4>
                <p className="text-xs text-slate-400">12-month comparison of projected top-line and total cost</p>
              </div>
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projections} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="monthName" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#71717A"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${((Number(v) || 0) / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalExpenses" name="Total Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 2: Monthly Profit (Bar Chart) */}
        {(activeTab === 'all' || activeTab === 'profit') && (
          <div className="bg-[#18181B] p-5 rounded-xl border border-[#27272A]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Chart 2: Monthly Profit Trajectory</h4>
                <p className="text-xs text-slate-400">Net operating profit generated across each projected month</p>
              </div>
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projections} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="monthName" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#71717A"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${((Number(v) || 0) / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Net Profit']}
                  />
                  <ReferenceLine y={0} stroke="#71717A" />
                  <Bar
                    dataKey="profit"
                    name="Monthly Profit"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 3: Revenue, Expense & Profit (Line Chart) */}
        {(activeTab === 'all' || activeTab === 'lines') && (
          <div className="bg-[#18181B] p-5 rounded-xl border border-[#27272A]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Chart 3: Revenue, Expense & Profit Trends</h4>
                <p className="text-xs text-slate-400">Full operational relationship over 12 months</p>
              </div>
              <LineChartIcon className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projections} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="monthName" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#71717A"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${((Number(v) || 0) / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="totalExpenses" name="Expenses" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 4: Break-Even Chart */}
        {(activeTab === 'all' || activeTab === 'breakeven') && (
          <div className="bg-[#18181B] p-5 rounded-xl border border-[#27272A]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Chart 4: Break-Even Analysis Curve</h4>
                <p className="text-xs text-slate-400">Intersection of Total Revenue and Total Operating Costs</p>
              </div>
              <PieChart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={breakEvenChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="capacityPercent" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#71717A"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${((Number(v) || 0) / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  {breakEvenRevenue != null && breakEvenRevenue > 0 && (
                    <ReferenceLine
                      y={breakEvenRevenue}
                      stroke="#A855F7"
                      strokeDasharray="4 4"
                      label={{ value: `BE: ₹${((Number(breakEvenRevenue) || 0) / 1000).toFixed(0)}k`, fill: '#C084FC', fontSize: 10, position: 'insideTopLeft' }}
                    />
                  )}
                  <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#3B82F6" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="totalCost" name="Total Cost" stroke="#F43F5E" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="fixedCost" name="Fixed Overhead" stroke="#71717A" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 5: Investment Recovery Curve (Full width if alone or in all mode) */}
        {(activeTab === 'all' || activeTab === 'recovery') && (
          <div className={`bg-[#18181B] p-5 rounded-xl border border-[#27272A] ${activeTab === 'all' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Chart 5: Investment Recovery Horizon (Payback Curve)</h4>
                <p className="text-xs text-slate-400">
                  Cumulative operating cash flow recovering total upfront capital of {formatCurrency(totalInitialInvestment)}
                </p>
              </div>
              <LineChartIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projections} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profitRecoveryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="monthName" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#71717A"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${((Number(v) || 0) / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  {totalInitialInvestment != null && totalInitialInvestment > 0 && (
                    <ReferenceLine
                      y={totalInitialInvestment}
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      label={{
                        value: `Total CapEx Target: ₹${((Number(totalInitialInvestment) || 0) / 1000).toFixed(0)}k`,
                        fill: '#FBBF24',
                        fontSize: 11,
                        position: 'insideTopLeft',
                      }}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="cumulativeProfit"
                    name="Cumulative Cash Flow"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#profitRecoveryGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
