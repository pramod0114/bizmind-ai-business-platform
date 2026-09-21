import React from 'react';
import { MonthProjection } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, Sliders, CheckCircle2 } from 'lucide-react';

interface Projection12MonthTableProps {
  projections: MonthProjection[];
  growthRate: number;
  onGrowthRateChange?: (newRate: number) => void;
  totalInitialInvestment: number;
}

export const Projection12MonthTable: React.FC<Projection12MonthTableProps> = ({
  projections,
  growthRate,
  onGrowthRateChange,
  totalInitialInvestment,
}) => {
  // Find which month investment recovery is reached
  const recoveryMonth = projections.find((p) => p.cumulativeProfit >= totalInitialInvestment)?.month;

  return (
    <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">12-Month Financial Projection</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Month-by-month cash flow trajectory, operational expense coverage, and capital recovery
          </p>
        </div>

        {/* Growth Rate Slider */}
        <div className="flex items-center gap-3 bg-[#27272A]/60 px-3.5 py-2 rounded-lg border border-[#3F3F46]">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 whitespace-nowrap">Monthly Growth Rate:</span>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={growthRate}
              disabled={!onGrowthRateChange}
              onChange={(e) => onGrowthRateChange && onGrowthRateChange(parseFloat(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-indigo-400 min-w-[38px] text-right">
              {growthRate}%
            </span>
          </div>
        </div>
      </div>

      {recoveryMonth ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Initial investment of {formatCurrency(totalInitialInvestment)} is fully recovered in{' '}
            <strong className="text-emerald-300 font-semibold">Month {recoveryMonth}</strong> under this growth assumption.
          </span>
        </div>
      ) : (
        <div className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
          Initial investment of {formatCurrency(totalInitialInvestment)} is amortizing; recovery extends beyond Month 12 at {growthRate}% growth.
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#27272A] text-slate-400 font-semibold uppercase tracking-wider bg-[#202024]">
              <th className="py-3 px-3">Month</th>
              <th className="py-3 px-3 text-right">Revenue</th>
              <th className="py-3 px-3 text-right">Fixed Costs</th>
              <th className="py-3 px-3 text-right">Variable Costs</th>
              <th className="py-3 px-3 text-right">Total Expenses</th>
              <th className="py-3 px-3 text-right">Monthly Profit</th>
              <th className="py-3 px-3 text-right">Cumulative Profit</th>
              <th className="py-3 px-3 text-right">CapEx Recovery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]/70">
            {projections.map((row) => {
              const isRecovered = row.cumulativeProfit >= totalInitialInvestment;
              const isProfitPositive = row.profit > 0;
              const isRecoveryTargetMonth = row.month === recoveryMonth;

              return (
                <tr
                  key={row.month}
                  className={`hover:bg-[#27272A]/40 transition-colors ${
                    isRecoveryTargetMonth ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-medium text-white flex items-center gap-1.5">
                    {row.monthName}
                    {isRecoveryTargetMonth && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded font-semibold">
                        Payback
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-blue-400">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {formatCurrency(row.fixedExpenses)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {formatCurrency(row.variableExpenses)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-rose-300">
                    {formatCurrency(row.totalExpenses)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-semibold ${
                      isProfitPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {formatCurrency(row.profit)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-semibold ${
                      row.cumulativeProfit >= 0 ? 'text-slate-100' : 'text-red-400'
                    }`}
                  >
                    {formatCurrency(row.cumulativeProfit)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-medium ${
                      isRecovered ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {row.investmentRecovery >= 0
                      ? `+${formatCurrency(row.investmentRecovery)}`
                      : formatCurrency(row.investmentRecovery)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#3F3F46] font-bold text-white bg-[#202024]">
              <td className="py-3 px-3">Total (12 Mo)</td>
              <td className="py-3 px-3 text-right text-blue-400">
                {formatCurrency(projections.reduce((sum, p) => sum + p.revenue, 0))}
              </td>
              <td className="py-3 px-3 text-right text-slate-300">
                {formatCurrency(projections.reduce((sum, p) => sum + p.fixedExpenses, 0))}
              </td>
              <td className="py-3 px-3 text-right text-slate-300">
                {formatCurrency(projections.reduce((sum, p) => sum + p.variableExpenses, 0))}
              </td>
              <td className="py-3 px-3 text-right text-rose-300">
                {formatCurrency(projections.reduce((sum, p) => sum + p.totalExpenses, 0))}
              </td>
              <td
                className={`py-3 px-3 text-right ${
                  projections.reduce((sum, p) => sum + p.profit, 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {formatCurrency(projections.reduce((sum, p) => sum + p.profit, 0))}
              </td>
              <td className="py-3 px-3 text-right text-slate-100">
                {formatCurrency(projections[projections.length - 1]?.cumulativeProfit || 0)}
              </td>
              <td
                className={`py-3 px-3 text-right ${
                  (projections[projections.length - 1]?.investmentRecovery || 0) >= 0
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {(projections[projections.length - 1]?.investmentRecovery || 0) >= 0
                  ? `+${formatCurrency(projections[projections.length - 1]?.investmentRecovery || 0)}`
                  : formatCurrency(projections[projections.length - 1]?.investmentRecovery || 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
