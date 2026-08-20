/**
 * BizMind – Financial Feasibility Calculation Engine
 * 
 * Centralized financial formulas, scenario modeling, break-even analysis,
 * sensitivity matrices, and transparent feasibility scoring.
 */

export interface InitialInvestmentInput {
  propertyDeposit?: number;
  interiorSetup?: number;
  equipmentCost?: number;
  furnitureCost?: number;
  licenseCost?: number;
  technologyCost?: number;
  initialInventory?: number;
  launchMarketing?: number;
  otherInitialCost?: number;
}

export interface MonthlyExpensesInput {
  rent?: number;
  salaries?: number;
  utilities?: number;
  internet?: number;
  maintenance?: number;
  marketing?: number;
  transportation?: number;
  insurance?: number;
  software?: number;
  loanEmi?: number;
  otherExpenses?: number;
}

export interface RevenueAndUnitEconomicsInput {
  sellingPrice: number;
  expectedCustomersPerDay: number;
  operatingDays: number;
  variableCostPerUnit?: number;
}

export interface FullFinancialInput {
  investment: InitialInvestmentInput;
  expenses: MonthlyExpensesInput;
  revenueEconomics: RevenueAndUnitEconomicsInput;
}

export interface ScenarioResult {
  scenarioName: 'Conservative' | 'Expected' | 'Optimistic';
  multiplierLabel: string;
  monthlyRevenue: number;
  monthlyFixedExpenses: number;
  monthlyVariableCost: number;
  monthlyTotalExpenses: number;
  monthlyProfit: number;
  annualProfit: number;
  profitMargin: number;
  roi: number | null;
  paybackPeriodMonths: number | null;
}

export interface SensitivityPoint {
  changePercent: number; // e.g. -20, -10, 0, 10, 20
  label: string;
  demandVariationProfit: number;
  priceVariationProfit: number;
  expenseVariationProfit: number;
}

export interface RiskIndicator {
  type: 'investment' | 'margin' | 'payback' | 'breakeven' | 'unit_economics' | 'expense_ratio';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
}

export type FeasibilityLevel =
  | 'Highly Feasible'
  | 'Moderately Feasible'
  | 'Needs Improvement'
  | 'High Financial Risk';

export type OverallRiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';

export interface CalculatedFinancialResults {
  // Investment Totals
  totalInitialInvestment: number;
  itemizedInvestment: Record<string, number>;

  // Monthly Expenses Totals
  totalMonthlyFixedExpenses: number;
  itemizedFixedExpenses: Record<string, number>;

  // Revenue & Variable Costs
  expectedMonthlyUnits: number;
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyVariableCost: number;
  annualVariableCost: number;
  totalMonthlyExpenses: number;
  variableCostPercentage: number;

  // Profitability
  monthlyProfit: number;
  annualProfit: number;
  profitMargin: number; // percentage (e.g. 24.5)

  // Unit Economics & Break-Even
  contributionMarginPerUnit: number;
  contributionMarginPercentage: number;
  breakEvenUnits: number | null;
  breakEvenRevenue: number | null;
  breakEvenCapacityPercentage: number | null;
  breakEvenCalculable: boolean;
  breakEvenMessage?: string;

  // Capital Efficiency
  roi: number | null; // Annual ROI percentage
  paybackPeriodMonths: number | null;
  paybackStatusText: string;

  // Feasibility & Risk
  feasibilityScore: number; // 0 - 100
  feasibilityLevel: FeasibilityLevel;
  riskLevel: OverallRiskLevel;
  riskIndicators: RiskIndicator[];

  // Scenario & Sensitivity Models
  scenarios: {
    conservative: ScenarioResult;
    expected: ScenarioResult;
    optimistic: ScenarioResult;
  };
  sensitivityMatrix: SensitivityPoint[];
  breakdown?: Record<string, number>;
}

/**
 * Scenario Adjustment Configuration
 */
export const SCENARIO_CONFIG = {
  conservative: {
    demandMultiplier: 0.80, // -20% customer demand
    sellingPriceMultiplier: 0.95, // -5% price realization
    fixedExpenseMultiplier: 1.10, // +10% higher overheads
    label: '-20% Demand, +10% Overheads',
  },
  expected: {
    demandMultiplier: 1.0,
    sellingPriceMultiplier: 1.0,
    fixedExpenseMultiplier: 1.0,
    label: 'Baseline Assumptions',
  },
  optimistic: {
    demandMultiplier: 1.20, // +20% customer demand
    sellingPriceMultiplier: 1.05, // +5% price realization
    fixedExpenseMultiplier: 0.95, // -5% operational efficiencies
    label: '+20% Demand, -5% Overheads',
  },
};

/**
 * Feasibility Score Thresholds
 */
export const FEASIBILITY_THRESHOLDS = {
  highlyFeasibleMin: 80,
  moderatelyFeasibleMin: 60,
  needsImprovementMin: 40,
};

/**
 * Helper to clamp values between min and max
 */
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Safe round to 2 decimal places
 */
function round2(val: number): number {
  if (isNaN(val) || !isFinite(val)) return 0;
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Safely sanitizes non-negative number
 */
export function sanitizeNonNegative(val: unknown, fallback = 0): number {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num) || num < 0) return fallback;
  return num;
}

/**
 * Calculates complete financial metrics, risk assessment, and feasibility score.
 */
export function calculateFinancials(input: FullFinancialInput): CalculatedFinancialResults {
  const inv = input.investment || {};
  const exp = input.expenses || {};
  const rev = input.revenueEconomics || {
    sellingPrice: 0,
    expectedCustomersPerDay: 0,
    operatingDays: 30,
    variableCostPerUnit: 0,
  };

  // 1. Initial Investment Itemization & Sum
  const itemizedInvestment: Record<string, number> = {
    propertyDeposit: sanitizeNonNegative(inv.propertyDeposit),
    interiorSetup: sanitizeNonNegative(inv.interiorSetup),
    equipmentCost: sanitizeNonNegative(inv.equipmentCost),
    furnitureCost: sanitizeNonNegative(inv.furnitureCost),
    licenseCost: sanitizeNonNegative(inv.licenseCost),
    technologyCost: sanitizeNonNegative(inv.technologyCost),
    initialInventory: sanitizeNonNegative(inv.initialInventory),
    launchMarketing: sanitizeNonNegative(inv.launchMarketing),
    otherInitialCost: sanitizeNonNegative(inv.otherInitialCost),
  };

  const totalInitialInvestment = Object.values(itemizedInvestment).reduce((acc, val) => acc + val, 0);

  // 2. Monthly Fixed Expenses Itemization & Sum
  const itemizedFixedExpenses: Record<string, number> = {
    rent: sanitizeNonNegative(exp.rent),
    salaries: sanitizeNonNegative(exp.salaries),
    utilities: sanitizeNonNegative(exp.utilities),
    internet: sanitizeNonNegative(exp.internet),
    maintenance: sanitizeNonNegative(exp.maintenance),
    marketing: sanitizeNonNegative(exp.marketing),
    transportation: sanitizeNonNegative(exp.transportation),
    insurance: sanitizeNonNegative(exp.insurance),
    software: sanitizeNonNegative(exp.software),
    loanEmi: sanitizeNonNegative(exp.loanEmi),
    otherExpenses: sanitizeNonNegative(exp.otherExpenses),
  };

  const totalMonthlyFixedExpenses = Object.values(itemizedFixedExpenses).reduce((acc, val) => acc + val, 0);

  // 3. Revenue & Unit Economics
  const sellingPrice = sanitizeNonNegative(rev.sellingPrice);
  const customersPerDay = sanitizeNonNegative(rev.expectedCustomersPerDay);
  const operatingDays = clamp(sanitizeNonNegative(rev.operatingDays, 30), 1, 31);
  const variableCostPerUnit = sanitizeNonNegative(rev.variableCostPerUnit);

  const expectedMonthlyUnits = Math.round(customersPerDay * operatingDays);
  const monthlyRevenue = round2(sellingPrice * expectedMonthlyUnits);
  const annualRevenue = round2(monthlyRevenue * 12);

  const monthlyVariableCost = round2(variableCostPerUnit * expectedMonthlyUnits);
  const annualVariableCost = round2(monthlyVariableCost * 12);
  const totalMonthlyExpenses = round2(totalMonthlyFixedExpenses + monthlyVariableCost);

  const variableCostPercentage = monthlyRevenue > 0
    ? round2((monthlyVariableCost / monthlyRevenue) * 100)
    : 0;

  // 4. Profit & Margins
  const monthlyProfit = round2(monthlyRevenue - totalMonthlyExpenses);
  const annualProfit = round2(monthlyProfit * 12);
  const profitMargin = monthlyRevenue > 0 ? round2((monthlyProfit / monthlyRevenue) * 100) : 0;

  // 5. Unit Contribution & Break-Even Analysis
  const contributionMarginPerUnit = round2(sellingPrice - variableCostPerUnit);
  const contributionMarginPercentage = sellingPrice > 0
    ? round2((contributionMarginPerUnit / sellingPrice) * 100)
    : 0;

  let breakEvenUnits: number | null = null;
  let breakEvenRevenue: number | null = null;
  let breakEvenCapacityPercentage: number | null = null;
  let breakEvenCalculable = false;
  let breakEvenMessage = '';

  if (sellingPrice <= 0) {
    breakEvenCalculable = false;
    breakEvenMessage = 'Break-even cannot be calculated: Selling price must be greater than zero.';
  } else if (contributionMarginPerUnit <= 0) {
    breakEvenCalculable = false;
    breakEvenMessage = 'Break-even cannot be calculated with current assumptions: Variable cost per unit exceeds or equals selling price.';
  } else {
    breakEvenCalculable = true;
    breakEvenUnits = Math.ceil(totalMonthlyFixedExpenses / contributionMarginPerUnit);
    breakEvenRevenue = round2(breakEvenUnits * sellingPrice);
    if (expectedMonthlyUnits > 0) {
      breakEvenCapacityPercentage = round2((breakEvenUnits / expectedMonthlyUnits) * 100);
    }
  }

  // 6. ROI & Payback Period
  let roi: number | null = null;
  if (totalInitialInvestment > 0) {
    roi = round2((annualProfit / totalInitialInvestment) * 100);
  }

  let paybackPeriodMonths: number | null = null;
  let paybackStatusText = '';

  if (totalInitialInvestment === 0) {
    paybackPeriodMonths = 0;
    paybackStatusText = 'Instant (Zero CapEx)';
  } else if (monthlyProfit <= 0) {
    paybackPeriodMonths = null;
    paybackStatusText = 'Not currently recoverable';
  } else {
    paybackPeriodMonths = round2(totalInitialInvestment / monthlyProfit);
    paybackStatusText = `${paybackPeriodMonths} Months (~${(paybackPeriodMonths / 12).toFixed(1)} Yrs)`;
  }

  // 7. Feasibility Scoring Algorithm (0 - 100)
  // Transparent point-based system:
  // - Profit Margin (max 30 pts)
  // - ROI (max 25 pts)
  // - Payback Period (max 20 pts)
  // - Break-Even Buffer / Capacity (max 15 pts)
  // - Revenue-to-Fixed-Cost Buffer (max 10 pts)
  let score = 0;

  // A. Margin Score (0 to 30)
  if (profitMargin >= 30) score += 30;
  else if (profitMargin >= 20) score += 25;
  else if (profitMargin >= 12) score += 18;
  else if (profitMargin >= 5) score += 10;
  else if (profitMargin > 0) score += 5;
  else score += 0; // negative or 0 margin

  // B. ROI Score (0 to 25)
  if (roi !== null) {
    if (roi >= 80) score += 25;
    else if (roi >= 50) score += 20;
    else if (roi >= 30) score += 15;
    else if (roi >= 15) score += 10;
    else if (roi > 0) score += 5;
  } else if (totalInitialInvestment === 0 && monthlyProfit > 0) {
    score += 25; // zero capex profitable venture
  }

  // C. Payback Score (0 to 20)
  if (paybackPeriodMonths !== null) {
    if (paybackPeriodMonths <= 12) score += 20;
    else if (paybackPeriodMonths <= 24) score += 15;
    else if (paybackPeriodMonths <= 36) score += 10;
    else if (paybackPeriodMonths <= 60) score += 5;
    else score += 2;
  }

  // D. Break-even Capacity Score (0 to 15)
  if (breakEvenCalculable && breakEvenCapacityPercentage !== null) {
    if (breakEvenCapacityPercentage <= 40) score += 15;
    else if (breakEvenCapacityPercentage <= 60) score += 12;
    else if (breakEvenCapacityPercentage <= 80) score += 8;
    else if (breakEvenCapacityPercentage <= 100) score += 4;
    else score += 0; // Break-even exceeds 100% capacity
  }

  // E. Revenue-to-Fixed-Expense Buffer (0 to 10)
  if (totalMonthlyFixedExpenses > 0) {
    const revenueCoverage = monthlyRevenue / totalMonthlyFixedExpenses;
    if (revenueCoverage >= 2.5) score += 10;
    else if (revenueCoverage >= 1.8) score += 8;
    else if (revenueCoverage >= 1.3) score += 5;
    else if (revenueCoverage >= 1.0) score += 2;
  } else if (monthlyRevenue > 0) {
    score += 10;
  }

  score = clamp(Math.round(score), 0, 100);

  // Determine Feasibility Category
  let feasibilityLevel: FeasibilityLevel = 'High Financial Risk';
  if (score >= FEASIBILITY_THRESHOLDS.highlyFeasibleMin) {
    feasibilityLevel = 'Highly Feasible';
  } else if (score >= FEASIBILITY_THRESHOLDS.moderatelyFeasibleMin) {
    feasibilityLevel = 'Moderately Feasible';
  } else if (score >= FEASIBILITY_THRESHOLDS.needsImprovementMin) {
    feasibilityLevel = 'Needs Improvement';
  } else {
    feasibilityLevel = 'High Financial Risk';
  }

  // Determine Risk Level & Risk Indicators
  const riskIndicators: RiskIndicator[] = [];

  if (contributionMarginPerUnit <= 0 && sellingPrice > 0) {
    riskIndicators.push({
      type: 'unit_economics',
      severity: 'high',
      title: 'Negative Unit Contribution',
      description: 'Variable cost per unit meets or exceeds selling price. Every sale increases losses.',
    });
  }

  if (monthlyProfit <= 0) {
    riskIndicators.push({
      type: 'margin',
      severity: 'high',
      title: 'Operating at Net Loss',
      description: `Projected monthly deficit of ${Math.abs(monthlyProfit).toLocaleString()}. Revenue is insufficient to cover expenses.`,
    });
  } else if (profitMargin < 10) {
    riskIndicators.push({
      type: 'margin',
      severity: 'medium',
      title: 'Thin Profit Margin',
      description: `Profit margin of ${profitMargin}% leaves low tolerance for demand dips or inflation.`,
    });
  }

  if (paybackPeriodMonths === null || paybackPeriodMonths > 36) {
    riskIndicators.push({
      type: 'payback',
      severity: paybackPeriodMonths === null ? 'high' : 'medium',
      title: paybackPeriodMonths === null ? 'Unrecoverable Investment' : 'Extended Payback Window',
      description: paybackPeriodMonths === null
        ? 'Capital cannot be recovered with current zero or negative monthly cash flows.'
        : `Payback exceeds 3 years (${paybackPeriodMonths} months), increasing capital exposure.`,
    });
  }

  if (breakEvenCapacityPercentage !== null && breakEvenCapacityPercentage > 85) {
    riskIndicators.push({
      type: 'breakeven',
      severity: breakEvenCapacityPercentage > 100 ? 'high' : 'medium',
      title: breakEvenCapacityPercentage > 100 ? 'Infeasible Break-Even' : 'High Break-Even Threshold',
      description: `Requires ${breakEvenCapacityPercentage}% of target monthly volume just to break even.`,
    });
  }

  if (totalInitialInvestment > 2500000 && (roi === null || roi < 25)) {
    riskIndicators.push({
      type: 'investment',
      severity: 'medium',
      title: 'Heavy Capital Intensity',
      description: 'Significant initial CapEx with modest returns relative to capital deployed.',
    });
  }

  let riskLevel: OverallRiskLevel = 'Low Risk';
  const highCount = riskIndicators.filter((r) => r.severity === 'high').length;
  const medCount = riskIndicators.filter((r) => r.severity === 'medium').length;

  if (highCount >= 1 || score < 40) {
    riskLevel = 'High Risk';
  } else if (medCount >= 2 || score < 70) {
    riskLevel = 'Medium Risk';
  } else {
    riskLevel = 'Low Risk';
  }

  // 8. Scenario Analysis (Conservative, Expected, Optimistic)
  function computeScenario(
    name: 'Conservative' | 'Expected' | 'Optimistic',
    cfg: typeof SCENARIO_CONFIG.conservative
  ): ScenarioResult {
    const sPrice = round2(sellingPrice * cfg.sellingPriceMultiplier);
    const sUnits = Math.round(expectedMonthlyUnits * cfg.demandMultiplier);
    const sRev = round2(sPrice * sUnits);
    const sFixedExp = round2(totalMonthlyFixedExpenses * cfg.fixedExpenseMultiplier);
    const sVarCost = round2(variableCostPerUnit * sUnits);
    const sTotExp = round2(sFixedExp + sVarCost);
    const sProfit = round2(sRev - sTotExp);
    const sAnnProfit = round2(sProfit * 12);
    const sMargin = sRev > 0 ? round2((sProfit / sRev) * 100) : 0;
    const sRoi = totalInitialInvestment > 0 ? round2((sAnnProfit / totalInitialInvestment) * 100) : null;
    const sPayback = sProfit > 0 && totalInitialInvestment > 0
      ? round2(totalInitialInvestment / sProfit)
      : null;

    return {
      scenarioName: name,
      multiplierLabel: cfg.label,
      monthlyRevenue: sRev,
      monthlyFixedExpenses: sFixedExp,
      monthlyVariableCost: sVarCost,
      monthlyTotalExpenses: sTotExp,
      monthlyProfit: sProfit,
      annualProfit: sAnnProfit,
      profitMargin: sMargin,
      roi: sRoi,
      paybackPeriodMonths: sPayback,
    };
  }

  const scenarios = {
    conservative: computeScenario('Conservative', SCENARIO_CONFIG.conservative),
    expected: computeScenario('Expected', SCENARIO_CONFIG.expected),
    optimistic: computeScenario('Optimistic', SCENARIO_CONFIG.optimistic),
  };

  // 9. Sensitivity Analysis Matrix (-20%, -10%, Base, +10%, +20%)
  const variationSteps = [-20, -10, 0, 10, 20];
  const sensitivityMatrix: SensitivityPoint[] = variationSteps.map((step) => {
    const factor = 1 + step / 100;

    // Demand Variation: units change
    const varUnits = Math.round(expectedMonthlyUnits * factor);
    const revDemand = round2(sellingPrice * varUnits);
    const expDemand = round2(totalMonthlyFixedExpenses + variableCostPerUnit * varUnits);
    const profitDemand = round2(revDemand - expDemand);

    // Price Variation: selling price changes
    const varPrice = round2(sellingPrice * factor);
    const revPrice = round2(varPrice * expectedMonthlyUnits);
    const expPrice = round2(totalMonthlyFixedExpenses + monthlyVariableCost);
    const profitPrice = round2(revPrice - expPrice);

    // Expense Variation: fixed & variable costs change
    const expVariationTotal = round2(totalMonthlyExpenses * factor);
    const profitExpense = round2(monthlyRevenue - expVariationTotal);

    return {
      changePercent: step,
      label: step === 0 ? 'Base (0%)' : `${step > 0 ? '+' : ''}${step}%`,
      demandVariationProfit: profitDemand,
      priceVariationProfit: profitPrice,
      expenseVariationProfit: profitExpense,
    };
  });

  return {
    totalInitialInvestment,
    itemizedInvestment,
    totalMonthlyFixedExpenses,
    itemizedFixedExpenses,
    expectedMonthlyUnits,
    monthlyRevenue,
    annualRevenue,
    monthlyVariableCost,
    annualVariableCost,
    totalMonthlyExpenses,
    variableCostPercentage,
    monthlyProfit,
    annualProfit,
    profitMargin,
    contributionMarginPerUnit,
    contributionMarginPercentage,
    breakEvenUnits,
    breakEvenRevenue,
    breakEvenCapacityPercentage,
    breakEvenCalculable,
    breakEvenMessage,
    roi,
    paybackPeriodMonths,
    paybackStatusText,
    feasibilityScore: score,
    feasibilityLevel,
    riskLevel,
    riskIndicators,
    scenarios,
    sensitivityMatrix,
    breakdown: {
      ...itemizedInvestment,
      ...itemizedFixedExpenses,
      sellingPrice,
      expectedCustomersPerDay: customersPerDay,
      operatingDays,
      variableCostPerUnit,
      expectedMonthlyUnits,
      monthlyRevenue,
      annualRevenue,
      monthlyVariableCost,
      annualVariableCost,
      totalMonthlyExpenses,
      totalMonthlyFixedExpenses,
      totalInitialInvestment,
      monthlyProfit,
      annualProfit,
      contributionMarginPerUnit,
    },
  };
}
