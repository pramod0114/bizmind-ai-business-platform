import React, { useState } from 'react';
import { ScenarioResult, ScenarioAdjustmentConfig } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { GitCompare, RefreshCw, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface ScenarioComparisonSectionProps {
  scenarios: {
    conservative: ScenarioResult;
    expected: ScenarioResult;
    optimistic: ScenarioResult;
  };
  adjustments?: ScenarioAdjustmentConfig;
  onRecalculate?: (adjustments: {
    conservativeRevenue: number;
    conservativeExpense: number;
    optimisticRevenue: number;
    optimisticExpense: number;
  }) => void;
  isLoading?: boolean;
}

export const ScenarioComparisonSection: React.FC<ScenarioComparisonSectionProps> = ({
  scenarios,
  adjustments,
  onRecalculate,
  isLoading = false,
}) => {
  const [conservativeRevenue, setConservativeRevenue] = useState<number>(
    adjustments?.conservative.revenueAdjustment ?? -20
  );
  const [conservativeExpense, setConservativeExpense] = useState<number>(
    adjustments?.conservative.expenseAdjustment ?? 10
  );
  const [optimisticRevenue, setOptimisticRevenue] = useState<number>(
    adjustments?.optimistic.revenueAdjustment ?? 20
  );
  const [optimisticExpense, setOptimisticExpense] = useState<number>(
    adjustments?.optimistic.expenseAdjustment ?? -10
  );

  const handleRecalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRecalculate) {
      onRecalculate({
        conservativeRevenue,
        conservativeExpense,
        optimisticRevenue,
        optimisticExpense,
      });
    }
  };

  const c = scenarios.conservative;
  const exp = scenarios.expected;
  const opt = scenarios.optimistic;

  return (
    <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Scenario Feasibility Modeling</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Stress-test operations under Conservative, Expected, and Optimistic commercial assumptions
          </p>
        </div>

        {onRecalculate && (
          <form onSubmit={handleRecalculate} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs bg-[#27272A] px-2.5 py-1.5 rounded-lg border border-[#3F3F46]">
              <span className="text-amber-400 font-medium">Cons. Rev:</span>
              <input
                type="number"
                value={conservativeRevenue}
                onChange={(e) => setConservativeRevenue(Number(e.target.value))}
                className="w-12 bg-[#18181B] text-white px-1.5 py-0.5 rounded text-center border border-[#3F3F46] text-xs font-bold"
              />
              <span className="text-slate-400">%</span>
            </div>

            <div className="flex items-center gap-2 text-xs bg-[#27272A] px-2.5 py-1.5 rounded-lg border border-[#3F3F46]">
              <span className="text-emerald-400 font-medium">Opt. Rev:</span>
              <input
                type="number"
                value={optimisticRevenue}
                onChange={(e) => setOptimisticRevenue(Number(e.target.value))}
                className="w-12 bg-[#18181B] text-white px-1.5 py-0.5 rounded text-center border border-[#3F3F46] text-xs font-bold"
              />
              <span className="text-slate-400">%</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Recalculate
            </button>
          </form>
        )}
      </div>

      {/* 3 Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conservative Card */}
        <div className="p-4 rounded-xl bg-[#202024] border border-amber-500/20 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Conservative</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Rev {c.revenueAdjustment > 0 ? '+' : ''}{c.revenueAdjustment}% | Exp {c.expenseAdjustment > 0 ? '+' : ''}{c.expenseAdjustment}%
            </span>
          </div>
          <div className="space-y-2 mt-3">
            <div>
              <span className="text-[11px] text-slate-400">Monthly Profit:</span>
              <div className={`text-lg font-bold ${c.monthlyProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(c.monthlyProfit)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#27272A]">
              <div>
                <span className="text-slate-400">Margin:</span>
                <span className="ml-1 font-semibold text-white">{formatPercentage(c.profitMargin)}</span>
              </div>
              <div>
                <span className="text-slate-400">ROI:</span>
                <span className="ml-1 font-semibold text-white">{c.annualRoi !== null ? formatPercentage(c.annualRoi) : 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Payback:</span>
                <span className="ml-1 font-semibold text-amber-300">{c.paybackStatusText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expected Card */}
        <div className="p-4 rounded-xl bg-[#202024] border border-blue-500/20 hover:border-blue-500/40 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-bl">
            BASE CASE
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Expected</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Base Plan (0%)</span>
          </div>
          <div className="space-y-2 mt-3">
            <div>
              <span className="text-[11px] text-slate-400">Monthly Profit:</span>
              <div className={`text-lg font-bold ${exp.monthlyProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(exp.monthlyProfit)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#27272A]">
              <div>
                <span className="text-slate-400">Margin:</span>
                <span className="ml-1 font-semibold text-white">{formatPercentage(exp.profitMargin)}</span>
              </div>
              <div>
                <span className="text-slate-400">ROI:</span>
                <span className="ml-1 font-semibold text-white">{exp.annualRoi !== null ? formatPercentage(exp.annualRoi) : 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Payback:</span>
                <span className="ml-1 font-semibold text-blue-300">{exp.paybackStatusText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Optimistic Card */}
        <div className="p-4 rounded-xl bg-[#202024] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Optimistic</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Rev {opt.revenueAdjustment > 0 ? '+' : ''}{opt.revenueAdjustment}% | Exp {opt.expenseAdjustment > 0 ? '+' : ''}{opt.expenseAdjustment}%
            </span>
          </div>
          <div className="space-y-2 mt-3">
            <div>
              <span className="text-[11px] text-slate-400">Monthly Profit:</span>
              <div className={`text-lg font-bold ${opt.monthlyProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(opt.monthlyProfit)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#27272A]">
              <div>
                <span className="text-slate-400">Margin:</span>
                <span className="ml-1 font-semibold text-white">{formatPercentage(opt.profitMargin)}</span>
              </div>
              <div>
                <span className="text-slate-400">ROI:</span>
                <span className="ml-1 font-semibold text-white">{opt.annualRoi !== null ? formatPercentage(opt.annualRoi) : 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Payback:</span>
                <span className="ml-1 font-semibold text-emerald-300">{opt.paybackStatusText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#27272A] text-slate-400 font-semibold uppercase tracking-wider bg-[#202024]">
              <th className="py-2.5 px-3">Metric</th>
              <th className="py-2.5 px-3 text-right text-amber-400">Conservative</th>
              <th className="py-2.5 px-3 text-right text-blue-400">Expected (Base)</th>
              <th className="py-2.5 px-3 text-right text-emerald-400">Optimistic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]/70 text-slate-200">
            <tr>
              <td className="py-2 px-3 font-medium text-slate-300">Monthly Revenue</td>
              <td className="py-2 px-3 text-right font-medium text-amber-300">{formatCurrency(c.monthlyRevenue)}</td>
              <td className="py-2 px-3 text-right font-medium text-blue-300">{formatCurrency(exp.monthlyRevenue)}</td>
              <td className="py-2 px-3 text-right font-medium text-emerald-300">{formatCurrency(opt.monthlyRevenue)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-300">Monthly Expenses</td>
              <td className="py-2 px-3 text-right text-slate-300">{formatCurrency(c.monthlyExpenses)}</td>
              <td className="py-2 px-3 text-right text-slate-300">{formatCurrency(exp.monthlyExpenses)}</td>
              <td className="py-2 px-3 text-right text-slate-300">{formatCurrency(opt.monthlyExpenses)}</td>
            </tr>
            <tr className="bg-[#27272A]/20">
              <td className="py-2.5 px-3 font-bold text-white">Monthly Profit</td>
              <td className={`py-2.5 px-3 text-right font-bold ${c.monthlyProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(c.monthlyProfit)}
              </td>
              <td className={`py-2.5 px-3 text-right font-bold ${exp.monthlyProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(exp.monthlyProfit)}
              </td>
              <td className={`py-2.5 px-3 text-right font-bold ${opt.monthlyProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(opt.monthlyProfit)}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-300">Profit Margin</td>
              <td className="py-2 px-3 text-right">{formatPercentage(c.profitMargin)}</td>
              <td className="py-2 px-3 text-right">{formatPercentage(exp.profitMargin)}</td>
              <td className="py-2 px-3 text-right">{formatPercentage(opt.profitMargin)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-300">Annual Net Profit</td>
              <td className="py-2 px-3 text-right">{formatCurrency(c.annualProfit)}</td>
              <td className="py-2 px-3 text-right">{formatCurrency(exp.annualProfit)}</td>
              <td className="py-2 px-3 text-right">{formatCurrency(opt.annualProfit)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-300">Annual ROI</td>
              <td className="py-2 px-3 text-right font-semibold">{c.annualRoi !== null ? formatPercentage(c.annualRoi) : 'N/A'}</td>
              <td className="py-2 px-3 text-right font-semibold">{exp.annualRoi !== null ? formatPercentage(exp.annualRoi) : 'N/A'}</td>
              <td className="py-2 px-3 text-right font-semibold">{opt.annualRoi !== null ? formatPercentage(opt.annualRoi) : 'N/A'}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-300">Payback Period</td>
              <td className="py-2 px-3 text-right">{c.paybackStatusText}</td>
              <td className="py-2 px-3 text-right">{exp.paybackStatusText}</td>
              <td className="py-2 px-3 text-right">{opt.paybackStatusText}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-300">Break-Even Revenue</td>
              <td className="py-2 px-3 text-right">{c.breakEvenRevenue !== null ? formatCurrency(c.breakEvenRevenue) : 'N/A'}</td>
              <td className="py-2 px-3 text-right">{exp.breakEvenRevenue !== null ? formatCurrency(exp.breakEvenRevenue) : 'N/A'}</td>
              <td className="py-2 px-3 text-right">{opt.breakEvenRevenue !== null ? formatCurrency(opt.breakEvenRevenue) : 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
