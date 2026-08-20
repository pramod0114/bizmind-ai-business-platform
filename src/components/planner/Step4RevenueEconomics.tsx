import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Input } from '../common/Input';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  Tag,
  Users,
  Calendar,
  Layers,
  Scale,
  ArrowRight,
  Info,
} from 'lucide-react';

export interface RevenueEconomicsFormData {
  sellingPrice: number;
  expectedCustomersPerDay: number;
  operatingDays: number;
  variableCostPerUnit: number;
}

interface Step4Props {
  data: RevenueEconomicsFormData;
  onChange: (field: keyof RevenueEconomicsFormData, value: number) => void;
  totalMonthlyFixedExpenses: number;
}

export const Step4RevenueEconomics: React.FC<Step4Props> = ({
  data,
  onChange,
  totalMonthlyFixedExpenses,
}) => {
  const sellingPrice = Number(data.sellingPrice) || 0;
  const customersPerDay = Number(data.expectedCustomersPerDay) || 0;
  const operatingDays = Math.min(Math.max(Number(data.operatingDays) || 30, 1), 31);
  const variableCostPerUnit = Number(data.variableCostPerUnit) || 0;

  const expectedMonthlyUnits = Math.round(customersPerDay * operatingDays);
  const monthlyRevenue = sellingPrice * expectedMonthlyUnits;
  const monthlyVariableCost = variableCostPerUnit * expectedMonthlyUnits;
  const unitContribution = sellingPrice - variableCostPerUnit;
  const contributionMarginPercent = sellingPrice > 0 ? (unitContribution / sellingPrice) * 100 : 0;
  const totalMonthlyExpenses = totalMonthlyFixedExpenses + monthlyVariableCost;
  const estimatedProfit = monthlyRevenue - totalMonthlyExpenses;

  const handleNumberChange = (key: keyof RevenueEconomicsFormData, raw: string, max?: number) => {
    const clean = raw.replace(/[^0-9]/g, '');
    let val = clean ? parseInt(clean, 10) : 0;
    if (max && val > max) val = max;
    onChange(key, val);
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#27272A] bg-[#111113]">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Revenue Assumptions & Unit Economics</CardTitle>
              <CardDescription>
                Model your pricing power, customer footfall velocity, operating schedule, and per-unit direct costs.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 4 Core Input Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Selling Price */}
            <div className="p-3.5 rounded-xl bg-[#16161B] border border-[#27272A] space-y-2">
              <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span>Avg Selling Price (Ticket Size) *</span>
              </label>
              <p className="text-[11px] text-[#71717A]">
                Average spend per customer order or service billing
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#71717A]">
                  ₹
                </span>
                <input
                  id="input-selling-price"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 220"
                  value={sellingPrice === 0 ? '' : sellingPrice.toLocaleString('en-IN')}
                  onChange={(e) => handleNumberChange('sellingPrice', e.target.value)}
                  className="w-full bg-[#111113] border border-[#27272A] rounded-lg pl-7 pr-3 py-2 text-xs text-[#F8FAFC] font-mono font-bold focus:outline-none focus:border-[#FFBF24] focus:ring-1 focus:ring-[#FFBF24]"
                />
              </div>
            </div>

            {/* 2. Customer Demand per Day */}
            <div className="p-3.5 rounded-xl bg-[#16161B] border border-[#27272A] space-y-2">
              <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Expected Customers / Day *</span>
              </label>
              <p className="text-[11px] text-[#71717A]">
                Target paid transactions or client visits daily
              </p>
              <div className="relative">
                <input
                  id="input-customers-per-day"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 48"
                  value={customersPerDay === 0 ? '' : customersPerDay.toString()}
                  onChange={(e) => handleNumberChange('expectedCustomersPerDay', e.target.value)}
                  className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] font-mono font-bold focus:outline-none focus:border-[#FFBF24] focus:ring-1 focus:ring-[#FFBF24]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#71717A] font-mono">
                  customers/day
                </span>
              </div>
            </div>

            {/* 3. Operating Days per Month */}
            <div className="p-3.5 rounded-xl bg-[#16161B] border border-[#27272A] space-y-2">
              <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Operating Days / Month *</span>
              </label>
              <p className="text-[11px] text-[#71717A]">
                Active business days per calendar month (1–31)
              </p>
              <div className="relative">
                <input
                  id="input-operating-days"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="e.g. 30"
                  value={operatingDays}
                  onChange={(e) => handleNumberChange('operatingDays', e.target.value, 31)}
                  className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] font-mono font-bold focus:outline-none focus:border-[#FFBF24] focus:ring-1 focus:ring-[#FFBF24]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#71717A] font-mono">
                  days/mo
                </span>
              </div>
            </div>

            {/* 4. Variable Cost per Unit */}
            <div className="p-3.5 rounded-xl bg-[#16161B] border border-[#27272A] space-y-2">
              <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#F472B6]" />
                <span>Variable Cost / Unit (COGS) *</span>
              </label>
              <p className="text-[11px] text-[#71717A]">
                Raw materials, packaging & direct cost per sale
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#71717A]">
                  ₹
                </span>
                <input
                  id="input-variable-cost"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 55"
                  value={variableCostPerUnit === 0 ? '' : variableCostPerUnit.toLocaleString('en-IN')}
                  onChange={(e) => handleNumberChange('variableCostPerUnit', e.target.value)}
                  className="w-full bg-[#111113] border border-[#27272A] rounded-lg pl-7 pr-3 py-2 text-xs text-[#F8FAFC] font-mono font-bold focus:outline-none focus:border-[#FFBF24] focus:ring-1 focus:ring-[#FFBF24]"
                />
              </div>
            </div>
          </div>

          {/* Unit Contribution Warning if Variable Cost exceeds Selling Price */}
          {sellingPrice > 0 && variableCostPerUnit >= sellingPrice && (
            <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                <strong>Warning:</strong> Variable cost per unit ({formatCurrency(variableCostPerUnit)}) is greater than or equal to selling price ({formatCurrency(sellingPrice)}). Contribution margin is non-positive.
              </span>
            </div>
          )}

          {/* Live Unit Economics & Run-Rate Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
              <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-medium">
                Target Monthly Volume
              </span>
              <p className="text-xl font-bold text-[#F8FAFC] font-mono mt-1">
                {expectedMonthlyUnits.toLocaleString('en-IN')}{' '}
                <span className="text-xs text-[#71717A] font-normal">units / mo</span>
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5 font-mono">
                {customersPerDay} / day × {operatingDays} days
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
              <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-medium">
                Unit Contribution Margin
              </span>
              <p
                className={`text-xl font-bold font-mono mt-1 ${
                  unitContribution > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                }`}
              >
                {formatCurrency(unitContribution)}
                <span className="text-xs font-normal text-[#A1A1AA]">
                  {' '}
                  ({contributionMarginPercent.toFixed(1)}%)
                </span>
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5 font-mono">
                Price ({formatCurrency(sellingPrice)}) - COGS ({formatCurrency(variableCostPerUnit)})
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
              <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-medium">
                Estimated Monthly Revenue
              </span>
              <p className="text-xl font-bold text-[#FFBF24] font-mono mt-1">
                {formatCurrency(monthlyRevenue)}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5 font-mono">
                {formatCurrency(monthlyRevenue * 12)} / year
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111113] border border-[#27272A]">
              <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-medium">
                Estimated Monthly Profit
              </span>
              <p
                className={`text-xl font-bold font-mono mt-1 ${
                  estimatedProfit > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                }`}
              >
                {formatCurrency(estimatedProfit)}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5 font-mono">
                Revenue - Fixed ({formatCurrency(totalMonthlyFixedExpenses)}) - Var ({formatCurrency(monthlyVariableCost)})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
