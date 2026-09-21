import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { formatCurrency, formatPercent, formatCompactNumber } from '../../utils/formatters';
import { CalculatedFinancialResults, BusinessPlan } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  TrendingUp,
  Coins,
  Wallet,
  PiggyBank,
  Percent,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  RefreshCw,
  Edit,
  Download,
  Info,
  Scale,
  Activity,
  Layers,
} from 'lucide-react';

interface Step6Props {
  plan: Partial<BusinessPlan>;
  analysis: CalculatedFinancialResults;
  onEditAssumptions: () => void;
  onNewPlan: () => void;
  onSave?: () => void;
  isSaving?: boolean;
}

const PIE_COLORS = [
  '#FFBF24',
  '#38BDF8',
  '#22C55E',
  '#F472B6',
  '#A78BFA',
  '#F97316',
  '#EAB308',
  '#06B6D4',
  '#84CC16',
];

export const Step6FinancialDashboard: React.FC<Step6Props> = ({
  plan,
  analysis,
  onEditAssumptions,
  onNewPlan,
  onSave,
  isSaving = false,
}) => {
  const [activeScenarioTab, setActiveScenarioTab] = useState<'chart' | 'table'>('chart');
  const [costBreakdownView, setCostBreakdownView] = useState<'capex' | 'opex'>('capex');

  const {
    totalInitialInvestment = 0,
    totalMonthlyFixedExpenses = 0,
    totalMonthlyExpenses = 0,
    monthlyRevenue = 0,
    annualRevenue = 0,
    monthlyProfit = 0,
    annualProfit = 0,
    profitMargin = 0,
    contributionMarginPerUnit = 0,
    breakEvenUnits = null,
    breakEvenRevenue = null,
    breakEvenCapacityPercentage = null,
    breakEvenCalculable = false,
    breakEvenMessage = '',
    roi,
    annualRoi,
    paybackPeriodMonths,
    paybackPeriod,
    paybackStatusText = 'N/A',
    feasibilityScore = 50,
    feasibilityLevel = 'Moderate',
    riskLevel = 'Medium Risk',
    scenarios,
    sensitivityMatrix,
    breakdown: rawBreakdown,
  } = (analysis as any) || {};

  const effectiveRoi = roi ?? annualRoi ?? analysis?.annualRoi ?? analysis?.roi ?? null;
  const effectivePaybackMonths = paybackPeriodMonths ?? paybackPeriod ?? analysis?.paybackPeriod ?? null;

  // Safe breakdown fallback
  const breakdown: Record<string, number> = {
    propertyDeposit: Number(rawBreakdown?.propertyDeposit ?? analysis?.itemizedInvestment?.propertyDeposit ?? plan?.propertyDeposit ?? 0),
    interiorSetup: Number(rawBreakdown?.interiorSetup ?? analysis?.itemizedInvestment?.interiorSetup ?? plan?.interiorSetup ?? 0),
    equipmentCost: Number(rawBreakdown?.equipmentCost ?? analysis?.itemizedInvestment?.equipmentCost ?? plan?.equipmentCost ?? 0),
    furnitureCost: Number(rawBreakdown?.furnitureCost ?? analysis?.itemizedInvestment?.furnitureCost ?? plan?.furnitureCost ?? 0),
    licenseCost: Number(rawBreakdown?.licenseCost ?? analysis?.itemizedInvestment?.licenseCost ?? plan?.licenseCost ?? 0),
    technologyCost: Number(rawBreakdown?.technologyCost ?? analysis?.itemizedInvestment?.technologyCost ?? plan?.technologyCost ?? 0),
    initialInventory: Number(rawBreakdown?.initialInventory ?? analysis?.itemizedInvestment?.initialInventory ?? plan?.initialInventory ?? 0),
    launchMarketing: Number(rawBreakdown?.launchMarketing ?? analysis?.itemizedInvestment?.launchMarketing ?? plan?.launchMarketing ?? 0),
    otherInitialCost: Number(rawBreakdown?.otherInitialCost ?? analysis?.itemizedInvestment?.otherInitialCost ?? plan?.otherInitialCost ?? 0),

    rent: Number(rawBreakdown?.rent ?? analysis?.itemizedFixedExpenses?.rent ?? plan?.rent ?? 0),
    salaries: Number(rawBreakdown?.salaries ?? analysis?.itemizedFixedExpenses?.salaries ?? plan?.salaries ?? 0),
    utilities: Number(rawBreakdown?.utilities ?? analysis?.itemizedFixedExpenses?.utilities ?? plan?.utilities ?? 0),
    internet: Number(rawBreakdown?.internet ?? analysis?.itemizedFixedExpenses?.internet ?? plan?.internet ?? 0),
    maintenance: Number(rawBreakdown?.maintenance ?? analysis?.itemizedFixedExpenses?.maintenance ?? plan?.maintenance ?? 0),
    marketing: Number(rawBreakdown?.marketing ?? analysis?.itemizedFixedExpenses?.marketing ?? plan?.marketing ?? 0),
    transportation: Number(rawBreakdown?.transportation ?? analysis?.itemizedFixedExpenses?.transportation ?? plan?.transportation ?? 0),
    insurance: Number(rawBreakdown?.insurance ?? analysis?.itemizedFixedExpenses?.insurance ?? plan?.insurance ?? 0),
    software: Number(rawBreakdown?.software ?? analysis?.itemizedFixedExpenses?.software ?? plan?.software ?? 0),
    loanEmi: Number(rawBreakdown?.loanEmi ?? analysis?.itemizedFixedExpenses?.loanEmi ?? plan?.loanEmi ?? 0),
    otherExpenses: Number(rawBreakdown?.otherExpenses ?? analysis?.itemizedFixedExpenses?.otherExpenses ?? plan?.otherExpenses ?? 0),

    monthlyVariableCost: Number(rawBreakdown?.monthlyVariableCost ?? analysis?.monthlyVariableCost ?? 0),
    expectedMonthlyUnits: Number(rawBreakdown?.expectedMonthlyUnits ?? analysis?.expectedMonthlyUnits ?? 0),
    sellingPrice: Number(rawBreakdown?.sellingPrice ?? plan?.sellingPrice ?? 0),
    variableCostPerUnit: Number(rawBreakdown?.variableCostPerUnit ?? plan?.variableCostPerUnit ?? 0),
  };

  // Safe scenarios fallback
  const safeScenarios = scenarios || {
    conservative: {
      monthlyRevenue: (monthlyRevenue || 0) * 0.8 * 0.95,
      totalMonthlyExpenses: (totalMonthlyFixedExpenses || 0) * 1.1 + (breakdown.monthlyVariableCost * 0.8),
      monthlyProfit: ((monthlyRevenue || 0) * 0.8 * 0.95) - ((totalMonthlyFixedExpenses || 0) * 1.1 + (breakdown.monthlyVariableCost * 0.8)),
      profitMargin: 0,
      paybackPeriodMonths: null,
    },
    expected: {
      monthlyRevenue: monthlyRevenue || 0,
      totalMonthlyExpenses: totalMonthlyExpenses || 0,
      monthlyProfit: monthlyProfit || 0,
      profitMargin: profitMargin || 0,
      paybackPeriodMonths: paybackPeriodMonths || null,
    },
    optimistic: {
      monthlyRevenue: (monthlyRevenue || 0) * 1.2 * 1.05,
      totalMonthlyExpenses: (totalMonthlyFixedExpenses || 0) * 0.95 + (breakdown.monthlyVariableCost * 1.2),
      monthlyProfit: ((monthlyRevenue || 0) * 1.2 * 1.05) - ((totalMonthlyFixedExpenses || 0) * 0.95 + (breakdown.monthlyVariableCost * 1.2)),
      profitMargin: 0,
      paybackPeriodMonths: null,
    },
  };

  // Sensitivity Matrix points lookup
  const getSensitivityPoint = (pct: number) => {
    if (Array.isArray(sensitivityMatrix)) {
      const found = sensitivityMatrix.find((p) => p.changePercent === pct);
      if (found) return found;
    }
    return {
      changePercent: pct,
      label: `${pct > 0 ? '+' : ''}${pct}%`,
      demandVariationProfit: monthlyProfit || 0,
      priceVariationProfit: monthlyProfit || 0,
      expenseVariationProfit: monthlyProfit || 0,
    };
  };

  const sensM20 = getSensitivityPoint(-20);
  const sensM10 = getSensitivityPoint(-10);
  const sensBase = getSensitivityPoint(0);
  const sensP10 = getSensitivityPoint(10);
  const sensP20 = getSensitivityPoint(20);

  // CapEx Pie Data
  const capexData = [
    { name: 'Deposit', value: breakdown.propertyDeposit || 0 },
    { name: 'Interior', value: breakdown.interiorSetup || 0 },
    { name: 'Equipment', value: breakdown.equipmentCost || 0 },
    { name: 'Furniture', value: breakdown.furnitureCost || 0 },
    { name: 'Licenses', value: breakdown.licenseCost || 0 },
    { name: 'Tech', value: breakdown.technologyCost || 0 },
    { name: 'Inventory', value: breakdown.initialInventory || 0 },
    { name: 'Marketing', value: breakdown.launchMarketing || 0 },
    { name: 'Other', value: breakdown.otherInitialCost || 0 },
  ].filter((d) => d.value > 0);

  // OpEx Pie Data
  const opexData = [
    { name: 'Rent', value: breakdown.rent || 0 },
    { name: 'Salaries', value: breakdown.salaries || 0 },
    { name: 'Utilities', value: breakdown.utilities || 0 },
    { name: 'Internet', value: breakdown.internet || 0 },
    { name: 'Maintenance', value: breakdown.maintenance || 0 },
    { name: 'Marketing', value: breakdown.marketing || 0 },
    { name: 'Transportation', value: breakdown.transportation || 0 },
    { name: 'Insurance', value: breakdown.insurance || 0 },
    { name: 'Software', value: breakdown.software || 0 },
    { name: 'EMI', value: breakdown.loanEmi || 0 },
    { name: 'Other', value: breakdown.otherExpenses || 0 },
  ].filter((d) => d.value > 0);

  // Revenue vs Expense Waterfall Bar Data
  const comparisonData = [
    {
      period: 'Monthly',
      Revenue: monthlyRevenue,
      FixedCosts: totalMonthlyFixedExpenses,
      VariableCosts: breakdown.monthlyVariableCost,
      NetProfit: monthlyProfit,
    },
    {
      period: 'Annualized',
      Revenue: annualRevenue,
      FixedCosts: totalMonthlyFixedExpenses * 12,
      VariableCosts: breakdown.monthlyVariableCost * 12,
      NetProfit: annualProfit,
    },
  ];

  // Break-even Curve Data (simulate unit volume curve from 0 to 2.5x expected volume)
  const maxUnitsToChart = Math.max(breakEvenUnits * 2, breakdown.expectedMonthlyUnits * 1.6, 500);
  const breakEvenCurveData = [];
  const step = Math.ceil(maxUnitsToChart / 10);
  for (let u = 0; u <= maxUnitsToChart; u += step) {
    const rev = u * breakdown.sellingPrice;
    const totalCost = totalMonthlyFixedExpenses + u * breakdown.variableCostPerUnit;
    breakEvenCurveData.push({
      units: u,
      FixedCost: totalMonthlyFixedExpenses,
      TotalCost: totalCost,
      TotalRevenue: rev,
    });
  }

  // Scenarios Bar Data
  const scenarioChartData = [
    {
      scenario: 'Conservative (-20% sales)',
      Revenue: safeScenarios.conservative.monthlyRevenue,
      Expenses: safeScenarios.conservative.totalMonthlyExpenses,
      Profit: safeScenarios.conservative.monthlyProfit,
    },
    {
      scenario: 'Expected (Baseline)',
      Revenue: safeScenarios.expected.monthlyRevenue,
      Expenses: safeScenarios.expected.totalMonthlyExpenses,
      Profit: safeScenarios.expected.monthlyProfit,
    },
    {
      scenario: 'Optimistic (+20% sales)',
      Revenue: safeScenarios.optimistic.monthlyRevenue,
      Expenses: safeScenarios.optimistic.totalMonthlyExpenses,
      Profit: safeScenarios.optimistic.monthlyProfit,
    },
  ];

  // Score tier color
  const getScoreColor = (score: number) => {
    if (score >= 75) return { text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/40', badge: 'bg-[#22C55E] text-[#0B0B0C]' };
    if (score >= 50) return { text: 'text-[#FFBF24]', bg: 'bg-[#FFBF24]/10', border: 'border-[#FFBF24]/40', badge: 'bg-[#FFBF24] text-[#0B0B0C]' };
    if (score >= 30) return { text: 'text-[#F97316]', bg: 'bg-[#F97316]/10', border: 'border-[#F97316]/40', badge: 'bg-[#F97316] text-[#0B0B0C]' };
    return { text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/40', badge: 'bg-[#EF4444] text-[#F8FAFC]' };
  };

  const scoreTheme = getScoreColor(feasibilityScore);

  return (
    <div className="space-y-6">
      {/* 1. Feasibility Engine Header Banner */}
      <div className="rounded-2xl bg-[#141417] border border-[#27272A] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBF24]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase bg-[#1A1A1D] border border-[#27272A] px-2.5 py-1 rounded-md text-[#FFBF24] font-semibold flex items-center gap-1.5">
                <Building2 className="w-3 h-3" />
                {plan.category || 'Business Plan'}
              </span>
              <span className="text-xs font-mono bg-[#1A1A1D] border border-[#27272A] px-2.5 py-1 rounded-md text-[#A1A1AA]">
                {plan.location || 'India'}
              </span>
              <span className="text-xs font-mono bg-[#1A1A1D] border border-[#27272A] px-2.5 py-1 rounded-md text-[#A1A1AA]">
                Model: {plan.businessModel || 'B2C'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
              {plan.businessName || 'Business Feasibility Report'}
            </h1>
            <p className="text-xs text-[#A1A1AA] max-w-2xl">
              Server-side algorithmic evaluation based on unit economics, capital sizing, operating fixed overheads, and stress-tested scenarios.
            </p>
          </div>

          {/* Feasibility Gauge & Risk Tier Badge */}
          <div className="flex items-center gap-4 bg-[#0E0E10] border border-[#27272A] p-4 rounded-xl shrink-0">
            {/* Score Ring */}
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full border-4 ${scoreTheme.border} ${scoreTheme.bg} flex flex-col items-center justify-center mx-auto`}
              >
                <span className={`text-xl font-black font-mono ${scoreTheme.text}`}>
                  {feasibilityScore}
                </span>
                <span className="text-[9px] text-[#71717A] -mt-1 font-semibold">/ 100</span>
              </div>
              <p className="text-[10px] text-[#A1A1AA] font-semibold mt-1">Feasibility Score</p>
            </div>

            {/* Risk & Feasibility Label */}
            <div className="space-y-1.5 border-l border-[#27272A] pl-4">
              <div>
                <span className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider">
                  Feasibility Rating
                </span>
                <p className={`text-sm font-bold ${scoreTheme.text}`}>{feasibilityLevel}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider">
                  Risk Category
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      riskLevel.includes('Low')
                        ? 'bg-[#22C55E]/15 text-[#22C55E]'
                        : riskLevel.includes('Moderate')
                        ? 'bg-[#FFBF24]/15 text-[#FFBF24]'
                        : 'bg-[#EF4444]/15 text-[#EF4444]'
                    }`}
                  >
                    {riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-[#27272A]">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEditAssumptions} className="text-xs">
              <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Assumptions
            </Button>
            {onSave && (
              <Button
                variant="primary"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                {isSaving ? 'Saving Changes...' : 'Save Plan Updates'}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export / Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onNewPlan} className="text-xs text-[#FFBF24]">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Start New Plan
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Primary 10 Financial KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* CapEx */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Initial CapEx</span>
            <Coins className="w-3.5 h-3.5 text-[#FFBF24]" />
          </div>
          <p className="text-lg font-bold text-[#F8FAFC] font-mono">
            {formatCurrency(totalInitialInvestment)}
          </p>
          <p className="text-[10px] text-[#71717A]">Total upfront setup capital</p>
        </div>

        {/* Monthly Revenue */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Monthly Revenue</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />
          </div>
          <p className="text-lg font-bold text-[#FFBF24] font-mono">
            {formatCurrency(monthlyRevenue)}
          </p>
          <p className="text-[10px] text-[#71717A]">{formatCurrency(annualRevenue)} / year</p>
        </div>

        {/* Monthly Total Expenses */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Monthly Expenses</span>
            <Wallet className="w-3.5 h-3.5 text-[#F472B6]" />
          </div>
          <p className="text-lg font-bold text-[#F8FAFC] font-mono">
            {formatCurrency(totalMonthlyExpenses)}
          </p>
          <p className="text-[10px] text-[#71717A]">
            Fixed {formatCurrency(totalMonthlyFixedExpenses)} + Var
          </p>
        </div>

        {/* Monthly Net Profit */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Monthly Profit</span>
            <PiggyBank
              className={`w-3.5 h-3.5 ${monthlyProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}
            />
          </div>
          <p
            className={`text-lg font-bold font-mono ${
              monthlyProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
            }`}
          >
            {formatCurrency(monthlyProfit)}
          </p>
          <p className="text-[10px] text-[#71717A]">
            {formatCurrency(annualProfit)} / yr net profit
          </p>
        </div>

        {/* Profit Margin */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Profit Margin</span>
            <Percent className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <p
            className={`text-lg font-bold font-mono ${
              (profitMargin ?? 0) >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
            }`}
          >
            {profitMargin != null ? `${Number(profitMargin).toFixed(1)}%` : '0.0%'}
          </p>
          <p className="text-[10px] text-[#71717A]">Net margin on sales</p>
        </div>

        {/* Break-Even Volume */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Break-Even Sales</span>
            <Scale className="w-3.5 h-3.5 text-[#FFBF24]" />
          </div>
          <p className="text-lg font-bold text-[#F8FAFC] font-mono">
            {breakEvenCalculable && breakEvenUnits != null ? `${Math.round(breakEvenUnits).toLocaleString('en-IN')} units` : 'N/A'}
          </p>
          <p className="text-[10px] text-[#71717A]">
            {breakEvenCalculable && breakEvenRevenue != null ? `${formatCurrency(breakEvenRevenue)} / mo` : 'Negative margin'}
          </p>
        </div>

        {/* Break-Even Capacity % */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">B/E Utilization</span>
            <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <p
            className={`text-lg font-bold font-mono ${
              (breakEvenCapacityPercentage ?? 100) <= 75
                ? 'text-[#22C55E]'
                : (breakEvenCapacityPercentage ?? 100) <= 90
                ? 'text-[#FFBF24]'
                : 'text-[#EF4444]'
            }`}
          >
            {breakEvenCalculable && breakEvenCapacityPercentage != null ? `${Number(breakEvenCapacityPercentage).toFixed(1)}%` : 'N/A'}
          </p>
          <p className="text-[10px] text-[#71717A]">Capacity needed to break even</p>
        </div>

        {/* ROI 1-Year */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">1-Yr Return (ROI)</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />
          </div>
          <p
            className={`text-lg font-bold font-mono ${
              effectiveRoi !== null && effectiveRoi >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
            }`}
          >
            {effectiveRoi != null ? `${Number(effectiveRoi).toFixed(1)}%` : 'N/A'}
          </p>
          <p className="text-[10px] text-[#71717A]">Annual net return on CapEx</p>
        </div>

        {/* Payback Period */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Payback Period</span>
            <Clock className="w-3.5 h-3.5 text-[#FFBF24]" />
          </div>
          <p className="text-lg font-bold text-[#F8FAFC] font-mono">{paybackStatusText}</p>
          <p className="text-[10px] text-[#71717A]">Time to recover initial capital</p>
        </div>

        {/* Unit Contribution */}
        <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Contribution / Unit</span>
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <p className="text-lg font-bold text-[#38BDF8] font-mono">
            {formatCurrency(contributionMarginPerUnit)}
          </p>
          <p className="text-[10px] text-[#71717A]">
            Per ticket gross margin: {formatCurrency(breakdown.sellingPrice)} - {formatCurrency(breakdown.variableCostPerUnit)}
          </p>
        </div>
      </div>

      {/* 3. Interactive Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue vs Cost Breakdown */}
        <Card className="border-[#27272A] bg-[#111113]">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FFBF24]" />
              Revenue vs. Fixed Costs vs. Net Profit
            </CardTitle>
            <CardDescription className="text-xs">
              Monthly vs. Annualized operational cashflow comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="period" stroke="#71717A" tick={{ fill: '#A1A1AA', fontSize: 11 }} />
                  <YAxis
                    stroke="#71717A"
                    tick={{ fill: '#A1A1AA', fontSize: 11 }}
                    tickFormatter={(val) => `₹${formatCompactNumber(val)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#16161B',
                      borderColor: '#27272A',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Revenue" fill="#FFBF24" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="FixedCosts" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="VariableCosts" fill="#F472B6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="NetProfit" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Break-Even Volume Curve */}
        <Card className="border-[#27272A] bg-[#111113]">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#38BDF8]" />
              Break-Even Volume & Capacity Intersection
            </CardTitle>
            <CardDescription className="text-xs">
              Where total revenue line crosses total operating cost curve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={breakEvenCurveData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis
                    dataKey="units"
                    stroke="#71717A"
                    tick={{ fill: '#A1A1AA', fontSize: 11 }}
                    tickFormatter={(val) => `${val} u`}
                  />
                  <YAxis
                    stroke="#71717A"
                    tick={{ fill: '#A1A1AA', fontSize: 11 }}
                    tickFormatter={(val) => `₹${formatCompactNumber(val)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#16161B',
                      borderColor: '#27272A',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="FixedCost"
                    stroke="#71717A"
                    strokeDasharray="4 4"
                    dot={false}
                    name="Fixed Overheads"
                  />
                  <Line
                    type="monotone"
                    dataKey="TotalCost"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    name="Total Operating Costs"
                  />
                  <Line
                    type="monotone"
                    dataKey="TotalRevenue"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={false}
                    name="Total Sales Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Scenario Stress Testing & Cost Structure Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Analysis (2 cols) */}
        <Card className="lg:col-span-2 border-[#27272A] bg-[#111113]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FFBF24]" />
                  Scenario Modeling (Conservative vs. Expected vs. Optimistic)
                </CardTitle>
                <CardDescription className="text-xs">
                  Stress-tested variations against demand volatility and operational costs
                </CardDescription>
              </div>

              <div className="flex items-center gap-1 bg-[#1A1A1D] border border-[#27272A] p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveScenarioTab('chart')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    activeScenarioTab === 'chart'
                      ? 'bg-[#FFBF24] text-[#0B0B0C] font-bold'
                      : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                  }`}
                >
                  Chart
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScenarioTab('table')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    activeScenarioTab === 'table'
                      ? 'bg-[#FFBF24] text-[#0B0B0C] font-bold'
                      : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {activeScenarioTab === 'chart' ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scenarioChartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                    <XAxis
                      dataKey="scenario"
                      stroke="#71717A"
                      tick={{ fill: '#A1A1AA', fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#71717A"
                      tick={{ fill: '#A1A1AA', fontSize: 11 }}
                      tickFormatter={(val) => `₹${formatCompactNumber(val)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#16161B',
                        borderColor: '#27272A',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => formatCurrency(Number(val))}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Revenue" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Profit" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#27272A] text-[#A1A1AA] text-left">
                      <th className="pb-2 font-semibold">Scenario</th>
                      <th className="pb-2 font-semibold">Assumptions</th>
                      <th className="pb-2 font-semibold text-right">Monthly Revenue</th>
                      <th className="pb-2 font-semibold text-right">Total Expenses</th>
                      <th className="pb-2 font-semibold text-right">Net Profit</th>
                      <th className="pb-2 font-semibold text-right">Profit Margin</th>
                      <th className="pb-2 font-semibold text-right">Payback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E22]">
                    <tr>
                      <td className="py-2.5 font-bold text-[#F97316]">Conservative</td>
                      <td className="py-2.5 text-[#71717A]">-20% volume, +10% expenses</td>
                      <td className="py-2.5 text-right font-mono text-[#F8FAFC]">
                        {formatCurrency(safeScenarios.conservative.monthlyRevenue)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#F8FAFC]">
                        {formatCurrency(safeScenarios.conservative.totalMonthlyExpenses)}
                      </td>
                      <td
                        className={`py-2.5 text-right font-mono font-bold ${
                          safeScenarios.conservative.monthlyProfit >= 0
                            ? 'text-[#22C55E]'
                            : 'text-[#EF4444]'
                        }`}
                      >
                        {formatCurrency(safeScenarios.conservative.monthlyProfit)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#A1A1AA]">
                        {safeScenarios.conservative?.profitMargin != null ? `${Number(safeScenarios.conservative.profitMargin).toFixed(1)}%` : '0.0%'}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#A1A1AA]">
                        {safeScenarios.conservative?.paybackPeriodMonths || (safeScenarios.conservative as any)?.paybackPeriod
                          ? `${safeScenarios.conservative?.paybackPeriodMonths || (safeScenarios.conservative as any)?.paybackPeriod} mo`
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr className="bg-[#1A1A1D]/50">
                      <td className="py-2.5 font-bold text-[#FFBF24]">Expected (Base)</td>
                      <td className="py-2.5 text-[#71717A]">Planned base parameters</td>
                      <td className="py-2.5 text-right font-mono text-[#FFBF24] font-bold">
                        {formatCurrency(safeScenarios.expected.monthlyRevenue)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#F8FAFC]">
                        {formatCurrency(safeScenarios.expected.totalMonthlyExpenses)}
                      </td>
                      <td
                        className={`py-2.5 text-right font-mono font-bold ${
                          safeScenarios.expected.monthlyProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                        }`}
                      >
                        {formatCurrency(safeScenarios.expected.monthlyProfit)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#FFBF24] font-semibold">
                        {safeScenarios.expected?.profitMargin != null ? `${Number(safeScenarios.expected.profitMargin).toFixed(1)}%` : '0.0%'}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#F8FAFC] font-semibold">
                        {safeScenarios.expected?.paybackPeriodMonths || (safeScenarios.expected as any)?.paybackPeriod
                          ? `${safeScenarios.expected?.paybackPeriodMonths || (safeScenarios.expected as any)?.paybackPeriod} mo`
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-[#22C55E]">Optimistic</td>
                      <td className="py-2.5 text-[#71717A]">+20% volume, -5% expenses</td>
                      <td className="py-2.5 text-right font-mono text-[#F8FAFC]">
                        {formatCurrency(safeScenarios.optimistic.monthlyRevenue)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#F8FAFC]">
                        {formatCurrency(safeScenarios.optimistic.totalMonthlyExpenses)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#22C55E] font-bold">
                        {formatCurrency(safeScenarios.optimistic.monthlyProfit)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#A1A1AA]">
                        {safeScenarios.optimistic?.profitMargin != null ? `${Number(safeScenarios.optimistic.profitMargin).toFixed(1)}%` : '0.0%'}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#A1A1AA]">
                        {safeScenarios.optimistic?.paybackPeriodMonths || (safeScenarios.optimistic as any)?.paybackPeriod
                          ? `${safeScenarios.optimistic?.paybackPeriodMonths || (safeScenarios.optimistic as any)?.paybackPeriod} mo`
                          : 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Allocation Donut (1 col) */}
        <Card className="border-[#27272A] bg-[#111113]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#FFBF24]" /> Cost Sizing
              </CardTitle>
              <div className="flex items-center gap-1 bg-[#1A1A1D] border border-[#27272A] p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setCostBreakdownView('capex')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    costBreakdownView === 'capex'
                      ? 'bg-[#FFBF24] text-[#0B0B0C] font-bold'
                      : 'text-[#A1A1AA]'
                  }`}
                >
                  CapEx
                </button>
                <button
                  type="button"
                  onClick={() => setCostBreakdownView('opex')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    costBreakdownView === 'opex'
                      ? 'bg-[#FFBF24] text-[#0B0B0C] font-bold'
                      : 'text-[#A1A1AA]'
                  }`}
                >
                  OpEx
                </button>
              </div>
            </div>
            <CardDescription className="text-xs">
              {costBreakdownView === 'capex'
                ? `Total CapEx: ${formatCurrency(totalInitialInvestment)}`
                : `Total Fixed OpEx: ${formatCurrency(totalMonthlyFixedExpenses)}/mo`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdownView === 'capex' ? capexData : opexData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(costBreakdownView === 'capex' ? capexData : opexData).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        stroke="#111113"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#16161B',
                      borderColor: '#27272A',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Micro Legend */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px]">
              {(costBreakdownView === 'capex' ? capexData : opexData).slice(0, 6).map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-[#A1A1AA] truncate">{item.name}</span>
                  <span className="text-[#F8FAFC] font-mono ml-auto">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Sensitivity Matrix Table */}
      <Card className="border-[#27272A] bg-[#111113]">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#FFBF24]" />
            Sensitivity Analysis Matrix (% Variance vs. Monthly Net Profit)
          </CardTitle>
          <CardDescription className="text-xs">
            Evaluates how sensitive your bottom line is to fluctuations in pricing, footfall, and rent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#27272A] text-[#A1A1AA] text-left">
                  <th className="pb-2 font-semibold">Key Sensitivity Driver</th>
                  <th className="pb-2 font-semibold text-center">-20% Variance</th>
                  <th className="pb-2 font-semibold text-center">-10% Variance</th>
                  <th className="pb-2 font-semibold text-center bg-[#1A1A1D] text-[#FFBF24]">
                    Base (0%)
                  </th>
                  <th className="pb-2 font-semibold text-center">+10% Variance</th>
                  <th className="pb-2 font-semibold text-center">+20% Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E22]">
                <tr>
                  <td className="py-2.5 font-semibold text-[#F8FAFC]">
                    Selling Price Variance (Ticket Size)
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono ${
                      sensM20.priceVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensM20.priceVariationProfit)}
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono ${
                      sensM10.priceVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensM10.priceVariationProfit)}
                  </td>
                  <td className="py-2.5 text-center font-mono font-bold bg-[#1A1A1D] text-[#FFBF24]">
                    {formatCurrency(sensBase.priceVariationProfit)}
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono ${
                      sensP10.priceVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensP10.priceVariationProfit)}
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono font-bold ${
                      sensP20.priceVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensP20.priceVariationProfit)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 font-semibold text-[#F8FAFC]">
                    Customer Volume Variance (Footfall / Demand)
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono ${
                      sensM20.demandVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensM20.demandVariationProfit)}
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono ${
                      sensM10.demandVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensM10.demandVariationProfit)}
                  </td>
                  <td className="py-2.5 text-center font-mono font-bold bg-[#1A1A1D] text-[#FFBF24]">
                    {formatCurrency(sensBase.demandVariationProfit)}
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono ${
                      sensP10.demandVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensP10.demandVariationProfit)}
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono font-bold ${
                      sensP20.demandVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensP20.demandVariationProfit)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 font-semibold text-[#F8FAFC]">
                    Operating Overheads & Expenses Variance
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono ${
                      sensM20.expenseVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensM20.expenseVariationProfit)}
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono ${
                      sensM10.expenseVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensM10.expenseVariationProfit)}
                  </td>
                  <td className="py-2.5 text-center font-mono font-bold bg-[#1A1A1D] text-[#FFBF24]">
                    {formatCurrency(sensBase.expenseVariationProfit)}
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono ${
                      sensP10.expenseVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensP10.expenseVariationProfit)}
                  </td>
                  <td
                    className={`py-2.5 text-center font-mono font-bold ${
                      sensP20.expenseVariationProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}
                  >
                    {formatCurrency(sensP20.expenseVariationProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 6. Mandatory Planning Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-[#16161B] border border-[#27272A] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          <strong>Mandatory Planning Disclaimer:</strong> These calculations are estimates based on the assumptions provided and are intended for business planning purposes only. Actual results may vary depending on local market conditions, competition, operational execution, and macroeconomic factors.
        </p>
      </div>
    </div>
  );
};
