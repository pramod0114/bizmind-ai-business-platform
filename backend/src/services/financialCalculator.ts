/**
 * BizMind – Authoritative Financial Feasibility Calculation Engine
 * 
 * Centralized financial formulas, unit economics, scenario simulation,
 * 12-month projections, sensitivity analysis, break-even modeling,
 * and transparent rule-based financial feasibility evaluation.
 */

export interface InitialInvestmentInput {
  equipmentCost?: number;
  furnitureCost?: number;
  setupCost?: number;
  interiorSetup?: number;
  securityDeposit?: number;
  propertyDeposit?: number;
  licenseCost?: number;
  technologyCost?: number;
  marketingLaunchCost?: number;
  launchMarketing?: number;
  initialInventoryCost?: number;
  initialInventory?: number;
  otherInitialCost?: number;
}

export interface MonthlyExpensesInput {
  rent?: number;
  salaries?: number;
  utilities?: number;
  internetCost?: number;
  internet?: number;
  softwareCost?: number;
  software?: number;
  insurance?: number;
  loanEmi?: number;
  maintenance?: number;
  otherFixedExpenses?: number;
  otherExpenses?: number;

  // Variable Expense line items
  rawMaterialCost?: number;
  inventoryMonthlyCost?: number;
  packagingCost?: number;
  deliveryCost?: number;
  paymentGatewayCost?: number;
  salesCommission?: number;
  marketingCost?: number;
  otherVariableExpenses?: number;

  // Variable expense percentage of revenue option (e.g. 20%)
  variableExpensePercentage?: number;
  variableExpenseMode?: 'itemized' | 'percentage' | 'unit_based';
}

export interface RevenueAndUnitEconomicsInput {
  revenueApproach?: 'direct' | 'calculated';
  expectedMonthlySales?: number;
  directMonthlyRevenue?: number;

  sellingPrice?: number;
  averageSellingPrice?: number;
  expectedCustomersPerDay?: number;
  estimatedCustomers?: number;
  operatingDays?: number;
  otherRevenue?: number;
  variableCostPerUnit?: number;
}

export interface FinancialTargetsInput {
  targetMonthlyProfit?: number;
  targetRoi?: number;
  targetPaybackPeriod?: number;
  targetProfitMargin?: number;
}

export interface FullFinancialInput {
  investment?: InitialInvestmentInput;
  expenses?: MonthlyExpensesInput;
  revenueEconomics?: RevenueAndUnitEconomicsInput;
  targets?: FinancialTargetsInput;
  revenueGrowthRate?: number;
}

export interface ScenarioAdjustmentConfig {
  conservative: {
    revenueAdjustment: number; // e.g. -20 for -20%
    expenseAdjustment: number; // e.g. +10 for +10%
  };
  expected: {
    revenueAdjustment: number; // 0%
    expenseAdjustment: number; // 0%
  };
  optimistic: {
    revenueAdjustment: number; // e.g. +20 for +20%
    expenseAdjustment: number; // e.g. -10 for -10%
  };
}

export interface ScenarioResult {
  scenarioName: 'Conservative' | 'Expected' | 'Optimistic';
  revenueAdjustment: number;
  expenseAdjustment: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyProfit: number;
  profitMargin: number;
  annualProfit: number;
  annualRoi: number | null;
  paybackPeriod: number | null;
  paybackStatusText: string;
  breakEvenRevenue: number | null;
  breakEvenUnits: number | null;
}

export interface SensitivityPoint {
  adjustmentPercentage: number; // -20, -10, 0, +10, +20
  label: string;
  monthlyProfit: number;
  annualProfit: number;
  roi: number | null;
}

export interface SensitivityAnalysisResult {
  revenueSensitivity: SensitivityPoint[];
  expenseSensitivity: SensitivityPoint[];
  investmentSensitivity: SensitivityPoint[];
}

export interface MonthProjection {
  month: number;
  monthName: string;
  revenue: number;
  fixedExpenses: number;
  variableExpenses: number;
  totalExpenses: number;
  profit: number;
  cumulativeProfit: number;
  investmentRecovery: number; // cumulative profit - total investment
}

export interface RiskIndicator {
  area: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}

export type FeasibilityStatus =
  | 'Strong Financial Feasibility'
  | 'Moderate Financial Feasibility'
  | 'Needs Review'
  | 'Financially Challenging';

export interface TargetComparisonItem {
  targetName: string;
  unit: string;
  targetValue: number;
  projectedValue: number;
  difference: number;
  status: 'MET' | 'BELOW' | 'EXCEEDED';
  displayText: string;
}

export interface CalculatedFinancialResults {
  // Investment
  totalInitialInvestment: number;
  itemizedInvestment: Record<string, number>;

  // Monthly Expenses
  totalMonthlyFixedExpenses: number;
  totalMonthlyVariableExpenses: number;
  totalMonthlyExpenses: number;
  itemizedFixedExpenses: Record<string, number>;
  itemizedVariableExpenses: Record<string, number>;
  variableExpensePercentageUsed: number;

  // Monthly Revenue & Unit Economics
  revenueApproachUsed: 'direct' | 'calculated';
  monthlyRevenue: number;
  annualRevenue: number;
  annualExpenses: number;
  sellingPrice: number;
  expectedMonthlyUnits: number;
  variableCostPerUnit: number;

  // Profitability
  monthlyProfit: number;
  annualProfit: number;
  profitMargin: number; // Percentage

  // ROI & Payback
  annualRoi: number | null;
  paybackPeriod: number | null;
  paybackStatusText: string;

  // Break-Even Analysis
  contributionMarginPerUnit: number;
  contributionMarginRatio: number;
  breakEvenUnits: number | null;
  breakEvenRevenue: number | null;
  breakEvenCapacityPercentage: number | null;
  breakEvenCalculable: boolean;
  breakEvenMessage: string;

  // Projections
  twelveMonthProjection: MonthProjection[];
  revenueGrowthRate: number;

  // Scenarios
  scenarios: {
    conservative: ScenarioResult;
    expected: ScenarioResult;
    optimistic: ScenarioResult;
  };
  scenarioAdjustments: ScenarioAdjustmentConfig;

  // Sensitivity Matrix
  sensitivity: SensitivityAnalysisResult;

  // Feasibility & Risk
  feasibilityStatus: FeasibilityStatus;
  feasibilityScore: number; // 0 - 100
  feasibilityReasons: string[];
  riskIndicators: RiskIndicator[];
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';

  // Targets
  targetComparisons: TargetComparisonItem[];

  // Normalized summary for AI-ready consumer
  aiReadyFinancialSummary: {
    initialInvestment: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    monthlyProfit: number;
    annualProfit: number;
    profitMargin: number;
    annualRoi: number | null;
    paybackPeriodMonths: number | null;
    breakEvenRevenue: number | null;
    feasibilityStatus: FeasibilityStatus;
    riskTier: string;
  };
}

/**
 * Helper to safely sanitize non-negative numbers
 */
export function sanitizeNonNegative(val: unknown, fallback = 0): number {
  if (val === null || val === undefined || val === '') return fallback;
  const num = Number(val);
  if (isNaN(num) || !isFinite(num) || num < 0) return fallback;
  return num;
}

/**
 * Safe rounding to 2 decimal places
 */
export function round2(val: number): number {
  if (isNaN(val) || !isFinite(val)) return 0;
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Clamp a number between min and max
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Default scenario configuration
 */
export const DEFAULT_SCENARIO_CONFIG: ScenarioAdjustmentConfig = {
  conservative: {
    revenueAdjustment: -20, // -20%
    expenseAdjustment: 10,  // +10%
  },
  expected: {
    revenueAdjustment: 0,
    expenseAdjustment: 0,
  },
  optimistic: {
    revenueAdjustment: 20,  // +20%
    expenseAdjustment: -10, // -10%
  },
};

/**
 * Performs full authoritative financial feasibility calculations
 */
export function calculateFinancials(
  input: FullFinancialInput,
  customScenarioConfig?: Partial<ScenarioAdjustmentConfig>
): CalculatedFinancialResults {
  const inv = input.investment || {};
  const exp = input.expenses || {};
  const rev = input.revenueEconomics || {};
  const targets = input.targets || {};
  const revenueGrowthRate = sanitizeNonNegative(input.revenueGrowthRate, 0);

  // -------------------------------------------------------------
  // 1. INITIAL INVESTMENT
  // -------------------------------------------------------------
  const equipmentCost = sanitizeNonNegative(inv.equipmentCost);
  const furnitureCost = sanitizeNonNegative(inv.furnitureCost);
  const setupCost = sanitizeNonNegative(inv.setupCost ?? inv.interiorSetup);
  const securityDeposit = sanitizeNonNegative(inv.securityDeposit ?? inv.propertyDeposit);
  const licenseCost = sanitizeNonNegative(inv.licenseCost);
  const technologyCost = sanitizeNonNegative(inv.technologyCost);
  const marketingLaunchCost = sanitizeNonNegative(inv.marketingLaunchCost ?? inv.launchMarketing);
  const initialInventoryCost = sanitizeNonNegative(inv.initialInventoryCost ?? inv.initialInventory);
  const otherInitialCost = sanitizeNonNegative(inv.otherInitialCost);

  const totalInitialInvestment = round2(
    equipmentCost +
    furnitureCost +
    setupCost +
    securityDeposit +
    licenseCost +
    technologyCost +
    marketingLaunchCost +
    initialInventoryCost +
    otherInitialCost
  );

  const itemizedInvestment: Record<string, number> = {
    equipmentCost,
    furnitureCost,
    setupCost,
    securityDeposit,
    licenseCost,
    technologyCost,
    marketingLaunchCost,
    initialInventoryCost,
    otherInitialCost,
  };

  // -------------------------------------------------------------
  // 2. MONTHLY REVENUE & UNIT ECONOMICS
  // -------------------------------------------------------------
  const approach: 'direct' | 'calculated' =
    rev.revenueApproach === 'direct' || (rev.expectedMonthlySales !== undefined && rev.expectedMonthlySales > 0 && !rev.sellingPrice)
      ? 'direct'
      : 'calculated';

  let monthlyRevenue = 0;
  let sellingPrice = sanitizeNonNegative(rev.sellingPrice ?? rev.averageSellingPrice);
  let variableCostPerUnit = sanitizeNonNegative(rev.variableCostPerUnit);
  let expectedMonthlyUnits = 0;

  if (approach === 'direct') {
    monthlyRevenue = round2(sanitizeNonNegative(rev.expectedMonthlySales ?? rev.directMonthlyRevenue));
    const customers = sanitizeNonNegative(rev.estimatedCustomers ?? rev.expectedCustomersPerDay);
    if (customers > 0 && sellingPrice > 0) {
      expectedMonthlyUnits = Math.round(customers);
    } else if (sellingPrice > 0) {
      expectedMonthlyUnits = Math.round(monthlyRevenue / sellingPrice);
    }
  } else {
    // Approach 2: (Customers * Average Price) + Other Revenue
    const operatingDays = clamp(sanitizeNonNegative(rev.operatingDays, 30), 1, 31);
    const dailyCustomers = sanitizeNonNegative(rev.expectedCustomersPerDay);
    const totalCustomersMonth = rev.estimatedCustomers !== undefined && rev.estimatedCustomers > 0
      ? sanitizeNonNegative(rev.estimatedCustomers)
      : Math.round(dailyCustomers * operatingDays);

    expectedMonthlyUnits = totalCustomersMonth;
    const otherRev = sanitizeNonNegative(rev.otherRevenue);
    monthlyRevenue = round2(expectedMonthlyUnits * sellingPrice + otherRev);
  }

  const annualRevenue = round2(monthlyRevenue * 12);

  // -------------------------------------------------------------
  // 3. MONTHLY EXPENSES (FIXED & VARIABLE)
  // -------------------------------------------------------------
  const rent = sanitizeNonNegative(exp.rent);
  const salaries = sanitizeNonNegative(exp.salaries);
  const utilities = sanitizeNonNegative(exp.utilities);
  const internetCost = sanitizeNonNegative(exp.internetCost ?? exp.internet);
  const softwareCost = sanitizeNonNegative(exp.softwareCost ?? exp.software);
  const insurance = sanitizeNonNegative(exp.insurance);
  const loanEmi = sanitizeNonNegative(exp.loanEmi);
  const maintenance = sanitizeNonNegative(exp.maintenance);
  const otherFixedExpenses = sanitizeNonNegative(exp.otherFixedExpenses ?? exp.otherExpenses);

  const totalMonthlyFixedExpenses = round2(
    rent +
    salaries +
    utilities +
    internetCost +
    softwareCost +
    insurance +
    loanEmi +
    maintenance +
    otherFixedExpenses
  );

  const itemizedFixedExpenses: Record<string, number> = {
    rent,
    salaries,
    utilities,
    internetCost,
    softwareCost,
    insurance,
    loanEmi,
    maintenance,
    otherFixedExpenses,
  };

  // Variable Expenses
  const rawMaterialCost = sanitizeNonNegative(exp.rawMaterialCost);
  const inventoryMonthlyCost = sanitizeNonNegative(exp.inventoryMonthlyCost);
  const packagingCost = sanitizeNonNegative(exp.packagingCost);
  const deliveryCost = sanitizeNonNegative(exp.deliveryCost);
  const paymentGatewayCost = sanitizeNonNegative(exp.paymentGatewayCost);
  const salesCommission = sanitizeNonNegative(exp.salesCommission);
  const marketingCost = sanitizeNonNegative(exp.marketingCost);
  const otherVariableExpenses = sanitizeNonNegative(exp.otherVariableExpenses);

  const itemizedVariableTotal =
    rawMaterialCost +
    inventoryMonthlyCost +
    packagingCost +
    deliveryCost +
    paymentGatewayCost +
    salesCommission +
    marketingCost +
    otherVariableExpenses;

  let totalMonthlyVariableExpenses = 0;
  let variableExpensePercentageUsed = 0;

  if (exp.variableExpensePercentage !== undefined && exp.variableExpensePercentage > 0) {
    variableExpensePercentageUsed = clamp(sanitizeNonNegative(exp.variableExpensePercentage), 0, 100);
    totalMonthlyVariableExpenses = round2((monthlyRevenue * variableExpensePercentageUsed) / 100);
  } else if (itemizedVariableTotal > 0) {
    totalMonthlyVariableExpenses = round2(itemizedVariableTotal);
    variableExpensePercentageUsed = monthlyRevenue > 0 ? round2((totalMonthlyVariableExpenses / monthlyRevenue) * 100) : 0;
  } else if (variableCostPerUnit > 0 && expectedMonthlyUnits > 0) {
    totalMonthlyVariableExpenses = round2(variableCostPerUnit * expectedMonthlyUnits);
    variableExpensePercentageUsed = monthlyRevenue > 0 ? round2((totalMonthlyVariableExpenses / monthlyRevenue) * 100) : 0;
  }

  const itemizedVariableExpenses: Record<string, number> = {
    rawMaterialCost,
    inventoryMonthlyCost,
    packagingCost,
    deliveryCost,
    paymentGatewayCost,
    salesCommission,
    marketingCost,
    otherVariableExpenses,
  };

  const totalMonthlyExpenses = round2(totalMonthlyFixedExpenses + totalMonthlyVariableExpenses);
  const annualExpenses = round2(totalMonthlyExpenses * 12);

  // -------------------------------------------------------------
  // 4. CORE PROFITABILITY METRICS
  // -------------------------------------------------------------
  const monthlyProfit = round2(monthlyRevenue - totalMonthlyExpenses);
  const annualProfit = round2(monthlyProfit * 12);
  const profitMargin = monthlyRevenue > 0 ? round2((monthlyProfit / monthlyRevenue) * 100) : 0;

  // -------------------------------------------------------------
  // 5. ROI & PAYBACK PERIOD
  // -------------------------------------------------------------
  let annualRoi: number | null = null;
  if (totalInitialInvestment > 0) {
    annualRoi = round2((annualProfit / totalInitialInvestment) * 100);
  }

  let paybackPeriod: number | null = null;
  let paybackStatusText = '';

  if (totalInitialInvestment === 0) {
    paybackPeriod = 0;
    paybackStatusText = 'Instant payback (Zero initial investment)';
  } else if (monthlyProfit <= 0) {
    paybackPeriod = null;
    paybackStatusText = 'Payback period cannot be estimated because the projected monthly profit is not positive.';
  } else {
    paybackPeriod = round2(totalInitialInvestment / monthlyProfit);
    const yrs = round2(paybackPeriod / 12);
    paybackStatusText = `${paybackPeriod} months (~${yrs} years)`;
  }

  // -------------------------------------------------------------
  // 6. BREAK-EVEN ANALYSIS
  // -------------------------------------------------------------
  let contributionMarginPerUnit = 0;
  let contributionMarginRatio = 0;
  let breakEvenUnits: number | null = null;
  let breakEvenRevenue: number | null = null;
  let breakEvenCapacityPercentage: number | null = null;
  let breakEvenCalculable = false;
  let breakEvenMessage = '';

  if (sellingPrice > 0) {
    // If unit variable cost wasn't explicitly set, derive it from total variable cost / units
    if (variableCostPerUnit === 0 && expectedMonthlyUnits > 0 && totalMonthlyVariableExpenses > 0) {
      variableCostPerUnit = round2(totalMonthlyVariableExpenses / expectedMonthlyUnits);
    }
    contributionMarginPerUnit = round2(sellingPrice - variableCostPerUnit);
    contributionMarginRatio = round2(contributionMarginPerUnit / sellingPrice);

    if (contributionMarginPerUnit <= 0) {
      breakEvenCalculable = false;
      breakEvenMessage = 'Break-even cannot be reached under the current assumptions: Variable cost per unit equals or exceeds selling price.';
    } else {
      breakEvenCalculable = true;
      breakEvenUnits = Math.ceil(totalMonthlyFixedExpenses / contributionMarginPerUnit);
      breakEvenRevenue = round2(breakEvenUnits * sellingPrice);
      if (expectedMonthlyUnits > 0) {
        breakEvenCapacityPercentage = round2((breakEvenUnits / expectedMonthlyUnits) * 100);
      }
      breakEvenMessage = `Break-even reached at ${breakEvenUnits} units / ₹${breakEvenRevenue.toLocaleString('en-IN')} revenue per month.`;
    }
  } else if (monthlyRevenue > 0) {
    // Macro contribution ratio
    const marginRatio = (monthlyRevenue - totalMonthlyVariableExpenses) / monthlyRevenue;
    if (marginRatio <= 0) {
      breakEvenCalculable = false;
      breakEvenMessage = 'Break-even cannot be reached under the current assumptions: Variable costs exceed monthly revenue.';
    } else {
      breakEvenCalculable = true;
      contributionMarginRatio = round2(marginRatio);
      breakEvenRevenue = round2(totalMonthlyFixedExpenses / marginRatio);
      breakEvenUnits = null;
      breakEvenCapacityPercentage = round2((breakEvenRevenue / monthlyRevenue) * 100);
      breakEvenMessage = `Break-even reached at monthly revenue of ₹${breakEvenRevenue.toLocaleString('en-IN')}.`;
    }
  } else {
    breakEvenCalculable = false;
    breakEvenMessage = 'Break-even cannot be reached under the current assumptions: Enter valid revenue assumptions.';
  }

  // -------------------------------------------------------------
  // 7. 12-MONTH FINANCIAL PROJECTIONS
  // -------------------------------------------------------------
  const twelveMonthProjection: MonthProjection[] = [];
  let runningCumulativeProfit = 0;
  const variableToRevenueRatio = monthlyRevenue > 0 ? totalMonthlyVariableExpenses / monthlyRevenue : 0;

  for (let m = 1; m <= 12; m++) {
    // Compounded growth
    const growthMultiplier = Math.pow(1 + revenueGrowthRate / 100, m - 1);
    const mRevenue = round2(monthlyRevenue * growthMultiplier);
    const mFixed = totalMonthlyFixedExpenses;
    const mVariable = round2(mRevenue * variableToRevenueRatio);
    const mTotalExp = round2(mFixed + mVariable);
    const mProfit = round2(mRevenue - mTotalExp);

    runningCumulativeProfit = round2(runningCumulativeProfit + mProfit);
    const investmentRecovery = round2(runningCumulativeProfit - totalInitialInvestment);

    twelveMonthProjection.push({
      month: m,
      monthName: `Month ${m}`,
      revenue: mRevenue,
      fixedExpenses: mFixed,
      variableExpenses: mVariable,
      totalExpenses: mTotalExp,
      profit: mProfit,
      cumulativeProfit: runningCumulativeProfit,
      investmentRecovery,
    });
  }

  // -------------------------------------------------------------
  // 8. SCENARIO ANALYSIS (Conservative, Expected, Optimistic)
  // -------------------------------------------------------------
  const scenarioConfig: ScenarioAdjustmentConfig = {
    conservative: {
      revenueAdjustment: customScenarioConfig?.conservative?.revenueAdjustment ?? DEFAULT_SCENARIO_CONFIG.conservative.revenueAdjustment,
      expenseAdjustment: customScenarioConfig?.conservative?.expenseAdjustment ?? DEFAULT_SCENARIO_CONFIG.conservative.expenseAdjustment,
    },
    expected: {
      revenueAdjustment: 0,
      expenseAdjustment: 0,
    },
    optimistic: {
      revenueAdjustment: customScenarioConfig?.optimistic?.revenueAdjustment ?? DEFAULT_SCENARIO_CONFIG.optimistic.revenueAdjustment,
      expenseAdjustment: customScenarioConfig?.optimistic?.expenseAdjustment ?? DEFAULT_SCENARIO_CONFIG.optimistic.expenseAdjustment,
    },
  };

  function computeScenario(
    name: 'Conservative' | 'Expected' | 'Optimistic',
    revAdj: number,
    expAdj: number
  ): ScenarioResult {
    const sRev = round2(monthlyRevenue * (1 + revAdj / 100));
    const sExp = round2(totalMonthlyExpenses * (1 + expAdj / 100));
    const sProfit = round2(sRev - sExp);
    const sAnnProfit = round2(sProfit * 12);
    const sMargin = sRev > 0 ? round2((sProfit / sRev) * 100) : 0;
    const sRoi = totalInitialInvestment > 0 ? round2((sAnnProfit / totalInitialInvestment) * 100) : null;

    let sPayback: number | null = null;
    let sPaybackText = '';
    if (totalInitialInvestment === 0) {
      sPayback = 0;
      sPaybackText = 'Instant';
    } else if (sProfit <= 0) {
      sPayback = null;
      sPaybackText = 'Unrecoverable';
    } else {
      sPayback = round2(totalInitialInvestment / sProfit);
      sPaybackText = `${sPayback} mos`;
    }

    let sBeRev: number | null = null;
    let sBeUnits: number | null = null;
    if (breakEvenCalculable && contributionMarginRatio > 0) {
      const sFixed = totalMonthlyFixedExpenses * (1 + expAdj / 100);
      sBeRev = round2(sFixed / contributionMarginRatio);
      if (sellingPrice > 0) {
        sBeUnits = Math.ceil(sBeRev / sellingPrice);
      }
    }

    return {
      scenarioName: name,
      revenueAdjustment: revAdj,
      expenseAdjustment: expAdj,
      monthlyRevenue: sRev,
      monthlyExpenses: sExp,
      monthlyProfit: sProfit,
      profitMargin: sMargin,
      annualProfit: sAnnProfit,
      annualRoi: sRoi,
      paybackPeriod: sPayback,
      paybackStatusText: sPaybackText,
      breakEvenRevenue: sBeRev,
      breakEvenUnits: sBeUnits,
    };
  }

  const scenarios = {
    conservative: computeScenario(
      'Conservative',
      scenarioConfig.conservative.revenueAdjustment,
      scenarioConfig.conservative.expenseAdjustment
    ),
    expected: computeScenario('Expected', 0, 0),
    optimistic: computeScenario(
      'Optimistic',
      scenarioConfig.optimistic.revenueAdjustment,
      scenarioConfig.optimistic.expenseAdjustment
    ),
  };

  // -------------------------------------------------------------
  // 9. SENSITIVITY ANALYSIS (-20%, -10%, 0%, +10%, +20%)
  // -------------------------------------------------------------
  const sensitivityPercentages = [-20, -10, 0, 10, 20];

  const revenueSensitivity: SensitivityPoint[] = sensitivityPercentages.map((pct) => {
    const adjRev = round2(monthlyRevenue * (1 + pct / 100));
    const profit = round2(adjRev - totalMonthlyExpenses);
    const annProfit = round2(profit * 12);
    const roi = totalInitialInvestment > 0 ? round2((annProfit / totalInitialInvestment) * 100) : null;
    return {
      adjustmentPercentage: pct,
      label: pct === 0 ? 'Base (0%)' : `${pct > 0 ? '+' : ''}${pct}%`,
      monthlyProfit: profit,
      annualProfit: annProfit,
      roi,
    };
  });

  const expenseSensitivity: SensitivityPoint[] = sensitivityPercentages.map((pct) => {
    const adjExp = round2(totalMonthlyExpenses * (1 + pct / 100));
    const profit = round2(monthlyRevenue - adjExp);
    const annProfit = round2(profit * 12);
    const roi = totalInitialInvestment > 0 ? round2((annProfit / totalInitialInvestment) * 100) : null;
    return {
      adjustmentPercentage: pct,
      label: pct === 0 ? 'Base (0%)' : `${pct > 0 ? '+' : ''}${pct}%`,
      monthlyProfit: profit,
      annualProfit: annProfit,
      roi,
    };
  });

  const investmentSensitivity: SensitivityPoint[] = sensitivityPercentages.map((pct) => {
    const adjInv = round2(totalInitialInvestment * (1 + pct / 100));
    const roi = adjInv > 0 ? round2((annualProfit / adjInv) * 100) : null;
    return {
      adjustmentPercentage: pct,
      label: pct === 0 ? 'Base (0%)' : `${pct > 0 ? '+' : ''}${pct}%`,
      monthlyProfit,
      annualProfit,
      roi,
    };
  });

  // -------------------------------------------------------------
  // 10. FINANCIAL FEASIBILITY EVALUATION (RULE-BASED)
  // -------------------------------------------------------------
  let feasibilityScore = 0;
  const reasons: string[] = [];

  // A. Profitability test (max 35 pts)
  if (monthlyProfit > 0) {
    if (profitMargin >= 30) {
      feasibilityScore += 35;
      reasons.push(`Exceptional profit margin of ${profitMargin}% provides strong buffer against cost variations.`);
    } else if (profitMargin >= 20) {
      feasibilityScore += 30;
      reasons.push(`Healthy profit margin of ${profitMargin}% meets strong commercial benchmarks.`);
    } else if (profitMargin >= 10) {
      feasibilityScore += 22;
      reasons.push(`Moderate profit margin of ${profitMargin}%; operations are profitable with disciplined oversight.`);
    } else {
      feasibilityScore += 12;
      reasons.push(`Low profit margin of ${profitMargin}%; vulnerable to small decreases in revenue or cost increases.`);
    }
  } else {
    reasons.push(`Projected monthly net loss of ₹${Math.abs(monthlyProfit).toLocaleString('en-IN')}; expenses exceed revenue.`);
  }

  // B. Capital Return & ROI test (max 25 pts)
  if (annualRoi !== null) {
    if (annualRoi >= 75) {
      feasibilityScore += 25;
      reasons.push(`Outstanding projected annual ROI of ${annualRoi}%.`);
    } else if (annualRoi >= 40) {
      feasibilityScore += 20;
      reasons.push(`Strong annual ROI of ${annualRoi}%.`);
    } else if (annualRoi >= 20) {
      feasibilityScore += 15;
      reasons.push(`Moderate annual ROI of ${annualRoi}%.`);
    } else if (annualRoi > 0) {
      feasibilityScore += 8;
      reasons.push(`Low annual ROI of ${annualRoi}%; returns are modest relative to capital deployed.`);
    } else {
      reasons.push(`Negative annual ROI (${annualRoi}%); capital is eroding.`);
    }
  } else if (totalInitialInvestment === 0 && monthlyProfit > 0) {
    feasibilityScore += 25;
    reasons.push('Zero initial capital outlay with immediate net operating cash flow.');
  }

  // C. Payback Period test (max 25 pts)
  if (paybackPeriod !== null) {
    if (paybackPeriod <= 12) {
      feasibilityScore += 25;
      reasons.push(`Rapid payback period of ${paybackPeriod} months (under 1 year).`);
    } else if (paybackPeriod <= 24) {
      feasibilityScore += 20;
      reasons.push(`Reasonable payback period of ${paybackPeriod} months (~${round2(paybackPeriod / 12)} years).`);
    } else if (paybackPeriod <= 36) {
      feasibilityScore += 12;
      reasons.push(`Payback period of ${paybackPeriod} months (~3 years); requires sustained long-term commitment.`);
    } else {
      feasibilityScore += 5;
      reasons.push(`Extended payback period of ${paybackPeriod} months (>3 years); elevated risk of capital tie-up.`);
    }
  } else {
    reasons.push('Investment is not recoverable under current loss-making operations.');
  }

  // D. Break-Even Capacity test (max 15 pts)
  if (breakEvenCapacityPercentage !== null) {
    if (breakEvenCapacityPercentage <= 50) {
      feasibilityScore += 15;
      reasons.push(`Comfortable break-even point requiring only ${breakEvenCapacityPercentage}% of projected volume.`);
    } else if (breakEvenCapacityPercentage <= 75) {
      feasibilityScore += 10;
      reasons.push(`Break-even requires ${breakEvenCapacityPercentage}% of target monthly volume.`);
    } else if (breakEvenCapacityPercentage <= 100) {
      feasibilityScore += 5;
      reasons.push(`High break-even barrier requiring ${breakEvenCapacityPercentage}% of capacity to cover costs.`);
    } else {
      reasons.push(`Break-even requires ${breakEvenCapacityPercentage}% of projected volume (exceeds 100% capacity).`);
    }
  }

  feasibilityScore = clamp(Math.round(feasibilityScore), 0, 100);

  let feasibilityStatus: FeasibilityStatus = 'Financially Challenging';
  if (feasibilityScore >= 75) {
    feasibilityStatus = 'Strong Financial Feasibility';
  } else if (feasibilityScore >= 55) {
    feasibilityStatus = 'Moderate Financial Feasibility';
  } else if (feasibilityScore >= 35) {
    feasibilityStatus = 'Needs Review';
  } else {
    feasibilityStatus = 'Financially Challenging';
  }

  // -------------------------------------------------------------
  // 11. FINANCIAL RISK INDICATORS
  // -------------------------------------------------------------
  const riskIndicators: RiskIndicator[] = [];

  if (monthlyProfit < 0) {
    riskIndicators.push({
      area: 'Monthly Cash Flow',
      severity: 'HIGH',
      reason: `Projected monthly deficit of ₹${Math.abs(monthlyProfit).toLocaleString('en-IN')}. Business will deplete reserves without revenue growth or expense cuts.`,
    });
  } else if (profitMargin < 12) {
    riskIndicators.push({
      area: 'Profit Margin',
      severity: 'MEDIUM',
      reason: `Thin profit margin of ${profitMargin}%. A minor 5–10% drop in revenue or supplier price hike could lead to losses.`,
    });
  }

  if (totalInitialInvestment > 2000000 && (annualRoi === null || annualRoi < 25)) {
    riskIndicators.push({
      area: 'Initial Investment',
      severity: 'MEDIUM',
      reason: `High initial capital requirement of ₹${totalInitialInvestment.toLocaleString('en-IN')} with modest projected returns.`,
    });
  }

  if (paybackPeriod === null) {
    riskIndicators.push({
      area: 'Payback Period',
      severity: 'HIGH',
      reason: 'Investment capital cannot be recovered under current negative or zero net profit projections.',
    });
  } else if (paybackPeriod > 36) {
    riskIndicators.push({
      area: 'Payback Period',
      severity: 'MEDIUM',
      reason: `Payback window is ${paybackPeriod} months (>3 years). Long payback horizon increases exposure to competitive shifts.`,
    });
  }

  if (monthlyRevenue > 0 && totalMonthlyFixedExpenses / monthlyRevenue > 0.7) {
    riskIndicators.push({
      area: 'Fixed Expense Burden',
      severity: 'HIGH',
      reason: `Fixed expenses account for ${round2((totalMonthlyFixedExpenses / monthlyRevenue) * 100)}% of monthly revenue, leaving little room for operational flexibility.`,
    });
  }

  if (breakEvenCapacityPercentage !== null && breakEvenCapacityPercentage > 85) {
    riskIndicators.push({
      area: 'Break-Even Dependency',
      severity: breakEvenCapacityPercentage > 100 ? 'HIGH' : 'MEDIUM',
      reason: `Business must maintain at least ${breakEvenCapacityPercentage}% of projected sales volume just to avoid operational losses.`,
    });
  }

  let riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' = 'Low Risk';
  const highRisks = riskIndicators.filter((r) => r.severity === 'HIGH').length;
  const medRisks = riskIndicators.filter((r) => r.severity === 'MEDIUM').length;

  if (highRisks >= 1 || feasibilityScore < 40) {
    riskLevel = 'High Risk';
  } else if (medRisks >= 2 || feasibilityScore < 70) {
    riskLevel = 'Medium Risk';
  } else {
    riskLevel = 'Low Risk';
  }

  // -------------------------------------------------------------
  // 12. TARGET COMPARISONS
  // -------------------------------------------------------------
  const targetComparisons: TargetComparisonItem[] = [];

  if (targets.targetMonthlyProfit !== undefined && targets.targetMonthlyProfit > 0) {
    const diff = monthlyProfit - targets.targetMonthlyProfit;
    targetComparisons.push({
      targetName: 'Target Monthly Profit',
      unit: '₹',
      targetValue: targets.targetMonthlyProfit,
      projectedValue: monthlyProfit,
      difference: round2(diff),
      status: diff >= 0 ? (diff > 0 ? 'EXCEEDED' : 'MET') : 'BELOW',
      displayText: diff >= 0
        ? `Exceeds target by ₹${Math.abs(diff).toLocaleString('en-IN')}`
        : `Below target by ₹${Math.abs(diff).toLocaleString('en-IN')}`,
    });
  }

  if (targets.targetRoi !== undefined && targets.targetRoi > 0) {
    const pRoi = annualRoi ?? 0;
    const diff = pRoi - targets.targetRoi;
    targetComparisons.push({
      targetName: 'Target Annual ROI',
      unit: '%',
      targetValue: targets.targetRoi,
      projectedValue: pRoi,
      difference: round2(diff),
      status: diff >= 0 ? (diff > 0 ? 'EXCEEDED' : 'MET') : 'BELOW',
      displayText: diff >= 0
        ? `Exceeds target by ${round2(Math.abs(diff))} percentage points`
        : `Below target by ${round2(Math.abs(diff))} percentage points`,
    });
  }

  if (targets.targetPaybackPeriod !== undefined && targets.targetPaybackPeriod > 0) {
    const pPayback = paybackPeriod ?? 999;
    const diff = targets.targetPaybackPeriod - pPayback; // Positive diff means faster payback (better!)
    targetComparisons.push({
      targetName: 'Target Payback Period',
      unit: 'months',
      targetValue: targets.targetPaybackPeriod,
      projectedValue: paybackPeriod ?? 0,
      difference: round2(Math.abs(diff)),
      status: diff >= 0 && paybackPeriod !== null ? 'MET' : 'BELOW',
      displayText: paybackPeriod === null
        ? 'Unrecoverable under current assumptions'
        : diff >= 0
        ? `Recovers capital ${round2(diff)} months faster than target window`
        : `Exceeds target payback window by ${round2(Math.abs(diff))} months`,
    });
  }

  if (targets.targetProfitMargin !== undefined && targets.targetProfitMargin > 0) {
    const diff = profitMargin - targets.targetProfitMargin;
    targetComparisons.push({
      targetName: 'Target Profit Margin',
      unit: '%',
      targetValue: targets.targetProfitMargin,
      projectedValue: profitMargin,
      difference: round2(diff),
      status: diff >= 0 ? (diff > 0 ? 'EXCEEDED' : 'MET') : 'BELOW',
      displayText: diff >= 0
        ? `Exceeds target by ${round2(Math.abs(diff))} percentage points`
        : `Below target by ${round2(Math.abs(diff))} percentage points`,
    });
  }

  return {
    totalInitialInvestment,
    itemizedInvestment,
    totalMonthlyFixedExpenses,
    totalMonthlyVariableExpenses,
    totalMonthlyExpenses,
    itemizedFixedExpenses,
    itemizedVariableExpenses,
    variableExpensePercentageUsed,
    revenueApproachUsed: approach,
    monthlyRevenue,
    annualRevenue,
    annualExpenses,
    sellingPrice,
    expectedMonthlyUnits,
    variableCostPerUnit,
    monthlyProfit,
    annualProfit,
    profitMargin,
    annualRoi,
    paybackPeriod,
    paybackStatusText,
    contributionMarginPerUnit,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenRevenue,
    breakEvenCapacityPercentage,
    breakEvenCalculable,
    breakEvenMessage,
    twelveMonthProjection,
    revenueGrowthRate,
    scenarios,
    scenarioAdjustments: scenarioConfig,
    sensitivity: {
      revenueSensitivity,
      expenseSensitivity,
      investmentSensitivity,
    },
    feasibilityStatus,
    feasibilityScore,
    feasibilityReasons: reasons,
    riskIndicators,
    riskLevel,
    targetComparisons,
    aiReadyFinancialSummary: {
      initialInvestment: totalInitialInvestment,
      monthlyRevenue,
      monthlyExpenses: totalMonthlyExpenses,
      monthlyProfit,
      annualProfit,
      profitMargin,
      annualRoi,
      paybackPeriodMonths: paybackPeriod,
      breakEvenRevenue,
      feasibilityStatus,
      riskTier: riskLevel,
    },
  };
}
