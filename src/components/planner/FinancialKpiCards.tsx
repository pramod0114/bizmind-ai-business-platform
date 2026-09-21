import React from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  DollarSign,
  Percent,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface FinancialKpiCardsProps {
  initialInvestment: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyProfit: number;
  profitMargin: number;
  roi: number | null;
  paybackPeriod: number | null;
  paybackStatusText?: string;
  breakEvenRevenue: number | null;
}

export const FinancialKpiCards: React.FC<FinancialKpiCardsProps> = ({
  initialInvestment,
  monthlyRevenue,
  monthlyExpenses,
  monthlyProfit,
  profitMargin,
  roi,
  paybackPeriod,
  paybackStatusText,
  breakEvenRevenue,
}) => {
  const isProfitable = monthlyProfit > 0;

  const cards = [
    {
      id: 'kpi-investment',
      title: 'Initial Investment',
      value: formatCurrency(initialInvestment),
      subtitle: 'Total upfront CapEx',
      icon: Wallet,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      tooltip: 'Total setup, equipment, deposit, license, and launch costs',
    },
    {
      id: 'kpi-revenue',
      title: 'Monthly Revenue',
      value: formatCurrency(monthlyRevenue),
      subtitle: 'Expected monthly sales',
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      tooltip: 'Gross revenue projected per operating month',
    },
    {
      id: 'kpi-expenses',
      title: 'Monthly Expenses',
      value: formatCurrency(monthlyExpenses),
      subtitle: 'Fixed + variable costs',
      icon: CreditCard,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      tooltip: 'Total operational costs including rent, salaries, and variable costs',
    },
    {
      id: 'kpi-profit',
      title: 'Monthly Profit',
      value: formatCurrency(monthlyProfit),
      subtitle: isProfitable ? 'Net operational surplus' : 'Projected monthly deficit',
      icon: DollarSign,
      color: isProfitable ? 'text-emerald-400' : 'text-red-400',
      bg: isProfitable ? 'bg-emerald-500/10' : 'bg-red-500/10',
      border: isProfitable ? 'border-emerald-500/20' : 'border-red-500/20',
      badge: isProfitable ? (
        <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <ArrowUpRight className="w-3 h-3 mr-0.5" /> Profit
        </span>
      ) : (
        <span className="flex items-center text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
          <ArrowDownRight className="w-3 h-3 mr-0.5" /> Deficit
        </span>
      ),
      tooltip: 'Net profit after subtracting all monthly fixed and variable expenses',
    },
    {
      id: 'kpi-margin',
      title: 'Profit Margin',
      value: formatPercentage(profitMargin),
      subtitle: profitMargin >= 20 ? 'Strong margin buffer' : profitMargin > 0 ? 'Moderate margin' : 'Negative margin',
      icon: Percent,
      color: profitMargin >= 15 ? 'text-emerald-400' : profitMargin > 0 ? 'text-amber-400' : 'text-red-400',
      bg: profitMargin >= 15 ? 'bg-emerald-500/10' : profitMargin > 0 ? 'bg-amber-500/10' : 'bg-red-500/10',
      border: profitMargin >= 15 ? 'border-emerald-500/20' : profitMargin > 0 ? 'border-amber-500/20' : 'border-red-500/20',
      tooltip: 'Percentage of revenue retained as profit (Monthly Profit / Monthly Revenue)',
    },
    {
      id: 'kpi-roi',
      title: 'Annual ROI',
      value: roi !== null ? formatPercentage(roi) : 'N/A',
      subtitle: roi && roi >= 40 ? 'Exceptional return' : roi && roi > 0 ? 'Healthy return' : 'Capital erosion',
      icon: Target,
      color: roi && roi >= 25 ? 'text-cyan-400' : 'text-slate-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      tooltip: 'Annualized return on initial investment (Annual Profit / Initial Investment)',
    },
    {
      id: 'kpi-payback',
      title: 'Payback Period',
      value: paybackPeriod != null ? `${paybackPeriod} mos` : 'Unrecoverable',
      subtitle: paybackPeriod != null ? `~${((Number(paybackPeriod) || 0) / 12).toFixed(1)} years` : 'Zero or negative profit',
      icon: Clock,
      color: paybackPeriod != null && paybackPeriod <= 24 ? 'text-emerald-400' : 'text-amber-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      tooltip: paybackStatusText || 'Number of months required to recover total initial investment from profits',
    },
    {
      id: 'kpi-breakeven',
      title: 'Break-Even Revenue',
      value: breakEvenRevenue !== null ? formatCurrency(breakEvenRevenue) : 'N/A',
      subtitle: 'Monthly sales to break even',
      icon: Target,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      tooltip: 'Monthly revenue required to cover 100% of fixed and variable operating expenses',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`relative p-5 rounded-xl bg-[#18181B] border ${card.border} transition-all duration-200 hover:border-[#3F3F46] group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
              </div>
              {card.badge && <div>{card.badge}</div>}
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white tracking-tight">
                {card.value}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{card.subtitle}</span>
              <div className="relative group/tip cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
                <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover/tip:block w-48 p-2 text-[11px] leading-tight text-slate-200 bg-[#27272A] border border-[#3F3F46] rounded-md shadow-xl z-20">
                  {card.tooltip}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
