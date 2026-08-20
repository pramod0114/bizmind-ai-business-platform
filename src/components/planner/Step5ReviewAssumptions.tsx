import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { BusinessInfoFormData } from './Step1BusinessInfo';
import { InitialInvestmentFormData } from './Step2InitialInvestment';
import { MonthlyExpensesFormData } from './Step3MonthlyExpenses';
import { RevenueEconomicsFormData } from './Step4RevenueEconomics';
import {
  ClipboardCheck,
  Building2,
  Coins,
  Wallet,
  Calculator,
  Edit3,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Save,
} from 'lucide-react';

interface Step5Props {
  businessInfo: BusinessInfoFormData;
  investment: InitialInvestmentFormData;
  expenses: MonthlyExpensesFormData;
  revenue: RevenueEconomicsFormData;
  onJumpToStep: (step: number) => void;
  onAnalyze: () => void;
  onSaveDraft: () => void;
  isSaving?: boolean;
}

export const Step5ReviewAssumptions: React.FC<Step5Props> = ({
  businessInfo = {} as BusinessInfoFormData,
  investment = {} as InitialInvestmentFormData,
  expenses = {} as MonthlyExpensesFormData,
  revenue = {} as RevenueEconomicsFormData,
  onJumpToStep,
  onAnalyze,
  onSaveDraft,
  isSaving = false,
}) => {
  const safeInvestment = investment || ({} as InitialInvestmentFormData);
  const safeExpenses = expenses || ({} as MonthlyExpensesFormData);
  const safeRevenue = revenue || ({} as RevenueEconomicsFormData);
  const safeBusinessInfo = businessInfo || ({} as BusinessInfoFormData);

  const totalInvestment: number = (
    Number(safeInvestment.propertyDeposit || 0) +
    Number(safeInvestment.interiorSetup || 0) +
    Number(safeInvestment.equipmentCost || 0) +
    Number(safeInvestment.furnitureCost || 0) +
    Number(safeInvestment.licenseCost || 0) +
    Number(safeInvestment.technologyCost || 0) +
    Number(safeInvestment.initialInventory || 0) +
    Number(safeInvestment.launchMarketing || 0) +
    Number(safeInvestment.otherInitialCost || 0)
  );

  const totalFixedExpenses: number = (
    Number(safeExpenses.rent || 0) +
    Number(safeExpenses.salaries || 0) +
    Number(safeExpenses.utilities || 0) +
    Number(safeExpenses.internet || 0) +
    Number(safeExpenses.maintenance || 0) +
    Number(safeExpenses.marketing || 0) +
    Number(safeExpenses.transportation || 0) +
    Number(safeExpenses.insurance || 0) +
    Number(safeExpenses.software || 0) +
    Number(safeExpenses.loanEmi || 0) +
    Number(safeExpenses.otherExpenses || 0)
  );

  const sellingPrice = Number(safeRevenue.sellingPrice) || 0;
  const customersPerDay = Number(safeRevenue.expectedCustomersPerDay) || 0;
  const operatingDays = Math.min(Math.max(Number(safeRevenue.operatingDays) || 30, 1), 31);
  const variableCostPerUnit = Number(safeRevenue.variableCostPerUnit) || 0;

  const monthlyUnits = Math.round(customersPerDay * operatingDays);
  const monthlyRevenue = sellingPrice * monthlyUnits;
  const monthlyVariableCost = variableCostPerUnit * monthlyUnits;
  const totalMonthlyExpenses = totalFixedExpenses + monthlyVariableCost;
  const monthlyProfit = monthlyRevenue - totalMonthlyExpenses;
  const annualProfit = monthlyProfit * 12;
  const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;
  const unitContribution = sellingPrice - variableCostPerUnit;
  const breakEvenUnits = unitContribution > 0 ? Math.ceil(totalFixedExpenses / unitContribution) : 0;
  const roi = totalInvestment > 0 ? (annualProfit / totalInvestment) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="border-[#27272A] bg-[#111113]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Review Assumptions & Model Summary</CardTitle>
                <CardDescription>
                  Confirm your input parameters before triggering the full server-side Feasibility Engine.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveDraft}
                disabled={isSaving}
                className="text-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onAnalyze}
                disabled={isSaving}
                className="text-xs font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {isSaving ? 'Calculating...' : 'Run Feasibility Engine'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Snapshot KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#16161B] border border-[#27272A]">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                Initial CapEx
              </span>
              <p className="text-lg font-bold text-[#F8FAFC] font-mono mt-1">
                {formatCurrency(totalInvestment)}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5">Total upfront capital</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161B] border border-[#27272A]">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                Monthly Revenue
              </span>
              <p className="text-lg font-bold text-[#FFBF24] font-mono mt-1">
                {formatCurrency(monthlyRevenue)}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5">
                {monthlyUnits.toLocaleString()} units @ ₹{sellingPrice}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161B] border border-[#27272A]">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                Monthly Net Profit
              </span>
              <p
                className={`text-lg font-bold font-mono mt-1 ${
                  monthlyProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                }`}
              >
                {formatCurrency(monthlyProfit)}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5">
                Margin: {formatPercent(profitMargin)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161B] border border-[#27272A]">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                Break-even Target
              </span>
              <p className="text-lg font-bold text-[#38BDF8] font-mono mt-1">
                {unitContribution > 0 ? `${breakEvenUnits} units` : 'Incalculable'}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5">
                {unitContribution > 0
                  ? `${Math.round(breakEvenUnits / operatingDays)} sales / day`
                  : 'Negative contribution'}
              </p>
            </div>
          </div>

          {/* Review Grid Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 Profile Summary */}
            <div className="p-4 rounded-xl bg-[#16161B] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#FFBF24]" />
                  <span>1. Business Profile</span>
                </h4>
                <button
                  type="button"
                  onClick={() => onJumpToStep(1)}
                  className="text-xs text-[#FFBF24] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                  <span className="text-[#A1A1AA]">Business Name:</span>
                  <span className="font-semibold text-[#F8FAFC]">
                    {safeBusinessInfo.businessName || '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                  <span className="text-[#A1A1AA]">Category:</span>
                  <span className="font-mono text-[#FFBF24]">{safeBusinessInfo.category || 'General'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                  <span className="text-[#A1A1AA]">Location:</span>
                  <span className="text-[#D4D4D8]">{safeBusinessInfo.location || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                  <span className="text-[#A1A1AA]">Business Model:</span>
                  <span className="text-[#D4D4D8]">{safeBusinessInfo.businessModel || '—'}</span>
                </div>
                {safeBusinessInfo.targetCustomer && (
                  <div className="py-1">
                    <span className="text-[#A1A1AA] block mb-0.5">Target Demographic:</span>
                    <span className="text-[#D4D4D8] text-[11px] leading-relaxed">
                      {safeBusinessInfo.targetCustomer}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2 Investment Summary */}
            <div className="p-4 rounded-xl bg-[#16161B] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#FFBF24]" />
                  <span>2. Initial CapEx Allocation</span>
                </h4>
                <button
                  type="button"
                  onClick={() => onJumpToStep(2)}
                  className="text-xs text-[#FFBF24] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                {Object.entries(safeInvestment).map(([k, v]) => {
                  const num = Number(v) || 0;
                  if (num === 0) return null;
                  return (
                    <div key={k} className="flex justify-between py-0.5 text-[11px]">
                      <span className="text-[#A1A1AA] capitalize">
                        {k.replace(/([A-Z])/g, ' $1')}:
                      </span>
                      <span className="font-mono text-[#F8FAFC]">{formatCurrency(num)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between pt-2 border-t border-[#27272A] font-bold text-xs">
                  <span className="text-[#FFBF24]">Total CapEx:</span>
                  <span className="font-mono text-[#FFBF24]">{formatCurrency(totalInvestment)}</span>
                </div>
              </div>
            </div>

            {/* Step 3 Fixed Monthly Expenses Summary */}
            <div className="p-4 rounded-xl bg-[#16161B] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-[#FFBF24]" />
                  <span>3. Monthly Fixed OpEx</span>
                </h4>
                <button
                  type="button"
                  onClick={() => onJumpToStep(3)}
                  className="text-xs text-[#FFBF24] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                {Object.entries(safeExpenses).map(([k, v]) => {
                  const num = Number(v) || 0;
                  if (num === 0) return null;
                  return (
                    <div key={k} className="flex justify-between py-0.5 text-[11px]">
                      <span className="text-[#A1A1AA] capitalize">
                        {k.replace(/([A-Z])/g, ' $1')}:
                      </span>
                      <span className="font-mono text-[#F8FAFC]">{formatCurrency(num)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between pt-2 border-t border-[#27272A] font-bold text-xs">
                  <span className="text-[#FFBF24]">Monthly Fixed Total:</span>
                  <span className="font-mono text-[#FFBF24]">{formatCurrency(totalFixedExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Step 4 Unit Economics & Revenue */}
            <div className="p-4 rounded-xl bg-[#16161B] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-[#FFBF24]" />
                  <span>4. Revenue & Unit Economics</span>
                </h4>
                <button
                  type="button"
                  onClick={() => onJumpToStep(4)}
                  className="text-xs text-[#FFBF24] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                  <span className="text-[#A1A1AA]">Average Selling Price / Unit:</span>
                  <span className="font-mono text-[#F8FAFC]">₹{sellingPrice}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                  <span className="text-[#A1A1AA]">Variable Cost / Unit (COGS):</span>
                  <span className="font-mono text-[#EF4444]">₹{variableCostPerUnit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                  <span className="text-[#A1A1AA]">Gross Unit Contribution:</span>
                  <span className="font-mono text-[#22C55E]">
                    ₹{unitContribution} (
                    {sellingPrice > 0 ? ((unitContribution / sellingPrice) * 100).toFixed(0) : 0}
                    %)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                  <span className="text-[#A1A1AA]">Expected Daily Footfall / Volume:</span>
                  <span className="font-mono text-[#F8FAFC]">{customersPerDay} customers/day</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#27272A]/50">
                  <span className="text-[#A1A1AA]">Monthly Operating Schedule:</span>
                  <span className="font-mono text-[#F8FAFC]">{operatingDays} days / mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Callout Box */}
          <div className="p-4 rounded-xl bg-[#1A1A1D] border border-[#FFBF24]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#FFBF24] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">
                  Ready to Run Server-Side Feasibility Engine
                </h4>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  The backend engine will validate unit economics, stress-test 3 scenario variations, calculate ROI, payback curves, and compute your composite Feasibility Score.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveDraft}
                disabled={isSaving}
                className="text-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onAnalyze}
                disabled={isSaving}
                className="text-xs font-bold shadow-lg shadow-[#FFBF24]/20"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {isSaving ? 'Calculating...' : 'Run Feasibility Engine'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
