/**
 * BizMind – Business Plan & Financial Feasibility Controller
 * 
 * Server-side authoritative validation and calculation execution.
 * Exposes full Part 5 Financial Feasibility APIs.
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { db } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import {
  calculateFinancials,
  FullFinancialInput,
  ScenarioAdjustmentConfig,
  DEFAULT_SCENARIO_CONFIG,
} from '../services/financialCalculator.js';
import { logger } from '../utils/logger.js';

/**
 * Helper to extract FullFinancialInput from any request body or stored plan object
 */
export function extractFinancialInput(data: any): FullFinancialInput {
  const d = data || {};

  return {
    investment: {
      equipmentCost: Number(d.equipmentCost ?? d.equipment_cost ?? 0),
      furnitureCost: Number(d.furnitureCost ?? d.furniture_cost ?? 0),
      setupCost: Number(d.setupCost ?? d.setup_cost ?? d.interiorSetup ?? d.interior_setup ?? 0),
      securityDeposit: Number(d.securityDeposit ?? d.security_deposit ?? d.propertyDeposit ?? d.property_deposit ?? 0),
      licenseCost: Number(d.licenseCost ?? d.license_cost ?? 0),
      technologyCost: Number(d.technologyCost ?? d.technology_cost ?? 0),
      marketingLaunchCost: Number(d.marketingLaunchCost ?? d.marketing_launch_cost ?? d.launchMarketing ?? d.launch_marketing ?? 0),
      initialInventoryCost: Number(d.initialInventoryCost ?? d.initial_inventory_cost ?? d.initialInventory ?? d.initial_inventory ?? 0),
      otherInitialCost: Number(d.otherInitialCost ?? d.other_initial_cost ?? 0),
    },
    expenses: {
      rent: Number(d.rent ?? 0),
      salaries: Number(d.salaries ?? 0),
      utilities: Number(d.utilities ?? 0),
      internetCost: Number(d.internetCost ?? d.internet_cost ?? d.internet ?? 0),
      softwareCost: Number(d.softwareCost ?? d.software_cost ?? d.software ?? 0),
      insurance: Number(d.insurance ?? 0),
      loanEmi: Number(d.loanEmi ?? d.loan_emi ?? 0),
      maintenance: Number(d.maintenance ?? 0),
      otherFixedExpenses: Number(d.otherFixedExpenses ?? d.other_fixed_expenses ?? d.otherExpenses ?? d.other_expenses ?? 0),

      rawMaterialCost: Number(d.rawMaterialCost ?? d.raw_material_cost ?? 0),
      inventoryMonthlyCost: Number(d.inventoryMonthlyCost ?? d.inventory_monthly_cost ?? 0),
      packagingCost: Number(d.packagingCost ?? d.packaging_cost ?? 0),
      deliveryCost: Number(d.deliveryCost ?? d.delivery_cost ?? 0),
      paymentGatewayCost: Number(d.paymentGatewayCost ?? d.payment_gateway_cost ?? 0),
      salesCommission: Number(d.salesCommission ?? d.sales_commission ?? 0),
      marketingCost: Number(d.marketingCost ?? d.marketing_cost ?? d.marketing ?? 0),
      otherVariableExpenses: Number(d.otherVariableExpenses ?? d.other_variable_expenses ?? 0),

      variableExpensePercentage: d.variableExpensePercentage !== undefined && d.variableExpensePercentage !== null
        ? Number(d.variableExpensePercentage ?? d.variable_expense_percentage)
        : undefined,
      variableExpenseMode: d.variableExpenseMode ?? d.variable_expense_mode,
    },
    revenueEconomics: {
      revenueApproach: d.revenueApproach ?? d.revenue_approach ?? (d.expectedMonthlySales ? 'direct' : 'calculated'),
      expectedMonthlySales: Number(d.expectedMonthlySales ?? d.expected_monthly_sales ?? d.directMonthlyRevenue ?? d.monthlyRevenue ?? d.monthly_revenue ?? 0),
      directMonthlyRevenue: Number(d.directMonthlyRevenue ?? d.expectedMonthlySales ?? d.expected_monthly_sales ?? 0),

      sellingPrice: Number(d.sellingPrice ?? d.selling_price ?? d.averageSellingPrice ?? d.average_selling_price ?? 0),
      averageSellingPrice: Number(d.averageSellingPrice ?? d.average_selling_price ?? d.sellingPrice ?? d.selling_price ?? 0),
      expectedCustomersPerDay: Number(d.expectedCustomersPerDay ?? d.expected_customers_per_day ?? 0),
      estimatedCustomers: Number(d.estimatedCustomers ?? d.estimated_customers ?? 0),
      operatingDays: Number(d.operatingDays ?? d.operating_days ?? 30),
      otherRevenue: Number(d.otherRevenue ?? d.other_revenue ?? 0),
      variableCostPerUnit: Number(d.variableCostPerUnit ?? d.variable_cost_per_unit ?? 0),
    },
    targets: {
      targetMonthlyProfit: d.targetMonthlyProfit !== undefined ? Number(d.targetMonthlyProfit) : (d.target_monthly_profit !== undefined ? Number(d.target_monthly_profit) : undefined),
      targetRoi: d.targetRoi !== undefined ? Number(d.targetRoi) : (d.target_roi !== undefined ? Number(d.target_roi) : undefined),
      targetPaybackPeriod: d.targetPaybackPeriod !== undefined ? Number(d.targetPaybackPeriod) : (d.target_payback_period !== undefined ? Number(d.target_payback_period) : undefined),
      targetProfitMargin: d.targetProfitMargin !== undefined ? Number(d.targetProfitMargin) : (d.target_profit_margin !== undefined ? Number(d.target_profit_margin) : undefined),
    },
    revenueGrowthRate: Number(d.revenueGrowthRate ?? d.revenue_growth_rate ?? 0),
  };
}

/**
 * Preview calculations without persisting
 * POST /api/business-plans/calculate or POST /api/plans/calculate
 */
export async function previewCalculations(req: AuthRequest, res: Response): Promise<void> {
  try {
    const input = extractFinancialInput(req.body);
    const calculations = calculateFinancials(input);
    sendSuccess(res, calculations, 'Financial metrics calculated successfully');
  } catch (err: any) {
    logger.error('Error during financial calculation preview:', err);
    sendError(res, 'Failed to calculate financial metrics', 500, err?.message);
  }
}

/**
 * Create a new Business Plan
 * POST /api/business-plans or POST /api/plans
 */
export async function createPlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, 'Authentication required to create a business plan.', 401);
      return;
    }

    const bName = (req.body.businessName || req.body.business_name || '').trim();
    if (!bName) {
      sendError(res, 'Business name is required.', 400);
      return;
    }

    const cat = (req.body.category || 'Retail').trim();

    // Authoritatively calculate all metrics on server
    const financialInput = extractFinancialInput(req.body);
    const results = calculateFinancials(financialInput);

    // Prepare persistent record
    const planRecord = {
      userId,
      user_id: userId,
      businessName: bName,
      business_name: bName,
      category: cat,
      description: (req.body.description || '').trim(),
      location: (req.body.location || req.body.location_name || '').trim(),
      location_name: (req.body.location || req.body.location_name || '').trim(),
      city: (req.body.city || '').trim(),
      area: (req.body.area || '').trim(),
      latitude: req.body.latitude ? Number(req.body.latitude) : null,
      longitude: req.body.longitude ? Number(req.body.longitude) : null,
      targetCustomer: (req.body.targetCustomer || req.body.target_customer || '').trim(),
      target_customer: (req.body.targetCustomer || req.body.target_customer || '').trim(),
      businessModel: (req.body.businessModel || req.body.business_model || 'Retail').trim(),
      business_model: (req.body.businessModel || req.body.business_model || 'Retail').trim(),
      executiveSummary: (req.body.executiveSummary || req.body.executive_summary || '').trim(),
      executive_summary: (req.body.executiveSummary || req.body.executive_summary || '').trim(),

      // Investment fields
      ...financialInput.investment,
      totalInitialInvestment: results.totalInitialInvestment,

      // Expenses fields
      ...financialInput.expenses,
      totalMonthlyFixedExpenses: results.totalMonthlyFixedExpenses,
      totalMonthlyVariableExpenses: results.totalMonthlyVariableExpenses,
      totalMonthlyExpenses: results.totalMonthlyExpenses,

      // Revenue & Unit Economics
      ...financialInput.revenueEconomics,
      expectedMonthlyUnits: results.expectedMonthlyUnits,
      monthlyRevenue: results.monthlyRevenue,
      annualRevenue: results.annualRevenue,
      annualExpenses: results.annualExpenses,
      monthlyVariableCost: results.totalMonthlyVariableExpenses,

      // Targets
      ...financialInput.targets,
      revenueGrowthRate: financialInput.revenueGrowthRate,

      // Calculated performance metrics
      monthlyProfit: results.monthlyProfit,
      annualProfit: results.annualProfit,
      profitMargin: results.profitMargin,
      contributionMarginPerUnit: results.contributionMarginPerUnit,
      contributionMarginRatio: results.contributionMarginRatio,
      breakEvenUnits: results.breakEvenUnits,
      breakEvenRevenue: results.breakEvenRevenue,
      breakEvenCapacityPercentage: results.breakEvenCapacityPercentage,
      breakEvenCalculable: results.breakEvenCalculable,
      breakEvenMessage: results.breakEvenMessage,
      roi: results.annualRoi,
      annualRoi: results.annualRoi,
      paybackPeriodMonths: results.paybackPeriod,
      paybackPeriod: results.paybackPeriod,
      paybackStatusText: results.paybackStatusText,
      feasibilityScore: results.feasibilityScore,
      feasibilityLevel: results.feasibilityStatus,
      feasibilityStatus: results.feasibilityStatus,
      riskLevel: results.riskLevel,

      planStatus: req.body.planStatus === 'analyzed' ? 'analyzed' : 'draft',
    };

    const savedPlan = await db.createBusinessPlan(planRecord);

    await db.addAuditLog(
      'PLAN_CREATED',
      `New business plan "${bName}" created with feasibility score ${results.feasibilityScore}/100`,
      'INFO',
      req.user?.email || 'USER'
    );

    sendSuccess(
      res,
      {
        plan: savedPlan,
        analysis: results,
      },
      'Business plan created successfully',
      201
    );
  } catch (err: any) {
    logger.error('Error creating business plan:', err);
    sendError(res, 'Failed to create business plan', 500, err?.message);
  }
}

/**
 * List plans for current authenticated user
 * GET /api/business-plans or GET /api/plans
 */
export async function listPlans(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN';

    const shouldFetchAll = isAdmin && req.query.all === 'true';
    const plans = await db.getBusinessPlans(shouldFetchAll ? undefined : userId);

    sendSuccess(res, plans, 'Business plans retrieved successfully');
  } catch (err: any) {
    logger.error('Error listing business plans:', err);
    sendError(res, 'Failed to retrieve business plans', 500, err?.message);
  }
}

/**
 * Get a specific business plan by ID with full analytical breakdown
 * GET /api/business-plans/:id or GET /api/plans/:id
 */
export async function getPlanById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const plan = await db.getBusinessPlanById(planId);

    if (!plan) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    // Ownership check (unless admin)
    if (req.user?.role !== 'ADMIN' && plan.userId !== req.user?.id && plan.user_id !== req.user?.id) {
      sendError(res, 'Access denied. You do not have permission to view this plan.', 403);
      return;
    }

    const financialInput = extractFinancialInput(plan);
    const analysis = calculateFinancials(financialInput);

    sendSuccess(
      res,
      {
        ...plan,
        analysis,
      },
      'Business plan details retrieved successfully'
    );
  } catch (err: any) {
    logger.error('Error getting business plan by ID:', err);
    sendError(res, 'Failed to retrieve business plan', 500, err?.message);
  }
}

/**
 * Update an existing Business Plan
 * PUT /api/business-plans/:id or PUT /api/plans/:id
 */
export async function updatePlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const existing = await db.getBusinessPlanById(planId);

    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    // Ownership check
    if (req.user?.role !== 'ADMIN' && existing.userId !== req.user?.id && existing.user_id !== req.user?.id) {
      sendError(res, 'Access denied. You do not have permission to modify this plan.', 403);
      return;
    }

    const bName = (req.body.businessName || req.body.business_name || existing.businessName || existing.business_name).trim();
    const cat = (req.body.category || existing.category || 'Retail').trim();

    // Recalculate with merged data
    const financialInput = extractFinancialInput({ ...existing, ...req.body });
    const results = calculateFinancials(financialInput);

    const updatePayload = {
      ...existing,
      businessName: bName,
      business_name: bName,
      category: cat,
      description: req.body.description !== undefined ? req.body.description.trim() : (existing.description || ''),
      location: req.body.location !== undefined ? req.body.location.trim() : (existing.location || ''),
      location_name: req.body.location !== undefined ? req.body.location.trim() : (existing.location_name || ''),
      city: req.body.city !== undefined ? req.body.city.trim() : (existing.city || ''),
      area: req.body.area !== undefined ? req.body.area.trim() : (existing.area || ''),
      latitude: req.body.latitude !== undefined ? Number(req.body.latitude) : existing.latitude,
      longitude: req.body.longitude !== undefined ? Number(req.body.longitude) : existing.longitude,
      targetCustomer: (req.body.targetCustomer || req.body.target_customer !== undefined ? req.body.targetCustomer || req.body.target_customer : existing.targetCustomer || '').trim(),
      target_customer: (req.body.targetCustomer || req.body.target_customer !== undefined ? req.body.targetCustomer || req.body.target_customer : existing.target_customer || '').trim(),
      businessModel: (req.body.businessModel || req.body.business_model !== undefined ? req.body.businessModel || req.body.business_model : existing.businessModel || 'Retail').trim(),
      business_model: (req.body.businessModel || req.body.business_model !== undefined ? req.body.businessModel || req.body.business_model : existing.business_model || 'Retail').trim(),
      executiveSummary: (req.body.executiveSummary || req.body.executive_summary !== undefined ? req.body.executiveSummary || req.body.executive_summary : existing.executiveSummary || '').trim(),
      executive_summary: (req.body.executiveSummary || req.body.executive_summary !== undefined ? req.body.executiveSummary || req.body.executive_summary : existing.executive_summary || '').trim(),

      // Investment fields
      ...financialInput.investment,
      totalInitialInvestment: results.totalInitialInvestment,

      // Expenses fields
      ...financialInput.expenses,
      totalMonthlyFixedExpenses: results.totalMonthlyFixedExpenses,
      totalMonthlyVariableExpenses: results.totalMonthlyVariableExpenses,
      totalMonthlyExpenses: results.totalMonthlyExpenses,

      // Revenue & Unit Economics
      ...financialInput.revenueEconomics,
      expectedMonthlyUnits: results.expectedMonthlyUnits,
      monthlyRevenue: results.monthlyRevenue,
      annualRevenue: results.annualRevenue,
      annualExpenses: results.annualExpenses,
      monthlyVariableCost: results.totalMonthlyVariableExpenses,

      // Targets
      ...financialInput.targets,
      revenueGrowthRate: financialInput.revenueGrowthRate,

      // Results
      monthlyProfit: results.monthlyProfit,
      annualProfit: results.annualProfit,
      profitMargin: results.profitMargin,
      contributionMarginPerUnit: results.contributionMarginPerUnit,
      contributionMarginRatio: results.contributionMarginRatio,
      breakEvenUnits: results.breakEvenUnits,
      breakEvenRevenue: results.breakEvenRevenue,
      breakEvenCapacityPercentage: results.breakEvenCapacityPercentage,
      breakEvenCalculable: results.breakEvenCalculable,
      breakEvenMessage: results.breakEvenMessage,
      roi: results.annualRoi,
      annualRoi: results.annualRoi,
      paybackPeriodMonths: results.paybackPeriod,
      paybackPeriod: results.paybackPeriod,
      paybackStatusText: results.paybackStatusText,
      feasibilityScore: results.feasibilityScore,
      feasibilityLevel: results.feasibilityStatus,
      feasibilityStatus: results.feasibilityStatus,
      riskLevel: results.riskLevel,

      planStatus: req.body.planStatus !== undefined ? req.body.planStatus : existing.planStatus,
    };

    const updatedPlan = await db.updateBusinessPlan(planId, updatePayload);

    await db.addAuditLog(
      'PLAN_UPDATED',
      `Business plan "${bName}" (ID: ${planId}) recalculated and saved`,
      'INFO',
      req.user?.email || 'USER'
    );

    sendSuccess(
      res,
      {
        plan: updatedPlan,
        analysis: results,
      },
      'Business plan updated successfully'
    );
  } catch (err: any) {
    logger.error('Error updating business plan:', err);
    sendError(res, 'Failed to update business plan', 500, err?.message);
  }
}

/**
 * Calculate and save updated financial metrics for an existing plan
 * POST /api/business-plans/:id/calculate
 */
export async function calculatePlanMetrics(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const existing = await db.getBusinessPlanById(planId);

    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.userId !== req.user?.id && existing.user_id !== req.user?.id) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const merged = { ...existing, ...req.body };
    const financialInput = extractFinancialInput(merged);
    const results = calculateFinancials(financialInput);

    const updatedPlan = await db.updateBusinessPlan(planId, {
      ...merged,
      ...financialInput.investment,
      totalInitialInvestment: results.totalInitialInvestment,
      ...financialInput.expenses,
      totalMonthlyFixedExpenses: results.totalMonthlyFixedExpenses,
      totalMonthlyVariableExpenses: results.totalMonthlyVariableExpenses,
      totalMonthlyExpenses: results.totalMonthlyExpenses,
      ...financialInput.revenueEconomics,
      expectedMonthlyUnits: results.expectedMonthlyUnits,
      monthlyRevenue: results.monthlyRevenue,
      annualRevenue: results.annualRevenue,
      monthlyProfit: results.monthlyProfit,
      annualProfit: results.annualProfit,
      profitMargin: results.profitMargin,
      contributionMarginPerUnit: results.contributionMarginPerUnit,
      breakEvenUnits: results.breakEvenUnits,
      breakEvenRevenue: results.breakEvenRevenue,
      breakEvenCapacityPercentage: results.breakEvenCapacityPercentage,
      roi: results.annualRoi,
      annualRoi: results.annualRoi,
      paybackPeriodMonths: results.paybackPeriod,
      paybackPeriod: results.paybackPeriod,
      feasibilityScore: results.feasibilityScore,
      feasibilityLevel: results.feasibilityStatus,
      feasibilityStatus: results.feasibilityStatus,
      riskLevel: results.riskLevel,
    });

    sendSuccess(res, { plan: updatedPlan, analysis: results }, 'Plan financial metrics calculated');
  } catch (err: any) {
    logger.error('Error calculating plan metrics:', err);
    sendError(res, 'Failed to calculate plan metrics', 500, err?.message);
  }
}

/**
 * Get comprehensive financial analysis for a plan
 * GET /api/business-plans/:id/financial-analysis
 */
export async function getFinancialAnalysis(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const existing = await db.getBusinessPlanById(planId);

    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.userId !== req.user?.id && existing.user_id !== req.user?.id) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const growthRate = req.query.growthRate !== undefined ? Number(req.query.growthRate) : undefined;
    const financialInput = extractFinancialInput({
      ...existing,
      ...(growthRate !== undefined ? { revenueGrowthRate: growthRate } : {}),
    });

    const analysis = calculateFinancials(financialInput);
    sendSuccess(res, analysis, 'Financial analysis retrieved successfully');
  } catch (err: any) {
    logger.error('Error getting financial analysis:', err);
    sendError(res, 'Failed to retrieve financial analysis', 500, err?.message);
  }
}

/**
 * Get 12-month projection for a plan
 * GET /api/business-plans/:id/projection
 */
export async function get12MonthProjection(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const existing = await db.getBusinessPlanById(planId);

    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.userId !== req.user?.id && existing.user_id !== req.user?.id) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const growthRate = req.query.growthRate !== undefined ? Number(req.query.growthRate) : existing.revenueGrowthRate;
    const financialInput = extractFinancialInput({
      ...existing,
      revenueGrowthRate: growthRate,
    });

    const analysis = calculateFinancials(financialInput);

    sendSuccess(
      res,
      {
        growthRate: analysis.revenueGrowthRate,
        projection: analysis.twelveMonthProjection,
      },
      '12-month projection retrieved successfully'
    );
  } catch (err: any) {
    logger.error('Error getting 12-month projection:', err);
    sendError(res, 'Failed to retrieve 12-month projection', 500, err?.message);
  }
}

/**
 * Get scenario analysis for a plan
 * GET /api/business-plans/:id/scenarios
 */
export async function getScenarioAnalysis(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const existing = await db.getBusinessPlanById(planId);

    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.userId !== req.user?.id && existing.user_id !== req.user?.id) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const financialInput = extractFinancialInput(existing);
    const analysis = calculateFinancials(financialInput);

    sendSuccess(
      res,
      {
        scenarios: analysis.scenarios,
        adjustments: analysis.scenarioAdjustments,
      },
      'Scenario analysis retrieved successfully'
    );
  } catch (err: any) {
    logger.error('Error getting scenario analysis:', err);
    sendError(res, 'Failed to retrieve scenario analysis', 500, err?.message);
  }
}

/**
 * Calculate custom scenarios with user-defined percentage adjustments
 * POST /api/business-plans/:id/scenarios/calculate
 */
export async function calculateCustomScenarios(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const existing = await db.getBusinessPlanById(planId);

    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.userId !== req.user?.id && existing.user_id !== req.user?.id) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const customAdjustments: Partial<ScenarioAdjustmentConfig> = {
      conservative: {
        revenueAdjustment: req.body.conservativeRevenue !== undefined ? Number(req.body.conservativeRevenue) : -20,
        expenseAdjustment: req.body.conservativeExpense !== undefined ? Number(req.body.conservativeExpense) : 10,
      },
      expected: {
        revenueAdjustment: 0,
        expenseAdjustment: 0,
      },
      optimistic: {
        revenueAdjustment: req.body.optimisticRevenue !== undefined ? Number(req.body.optimisticRevenue) : 20,
        expenseAdjustment: req.body.optimisticExpense !== undefined ? Number(req.body.optimisticExpense) : -10,
      },
    };

    const financialInput = extractFinancialInput(existing);
    const analysis = calculateFinancials(financialInput, customAdjustments);

    sendSuccess(
      res,
      {
        scenarios: analysis.scenarios,
        adjustments: analysis.scenarioAdjustments,
      },
      'Custom scenario analysis calculated successfully'
    );
  } catch (err: any) {
    logger.error('Error calculating custom scenarios:', err);
    sendError(res, 'Failed to calculate custom scenarios', 500, err?.message);
  }
}

/**
 * Get sensitivity analysis for a plan
 * GET /api/business-plans/:id/sensitivity
 */
export async function getSensitivityAnalysis(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const existing = await db.getBusinessPlanById(planId);

    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.userId !== req.user?.id && existing.user_id !== req.user?.id) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const financialInput = extractFinancialInput(existing);
    const analysis = calculateFinancials(financialInput);

    sendSuccess(res, analysis.sensitivity, 'Sensitivity analysis retrieved successfully');
  } catch (err: any) {
    logger.error('Error getting sensitivity analysis:', err);
    sendError(res, 'Failed to retrieve sensitivity analysis', 500, err?.message);
  }
}

/**
 * Duplicate a business plan (creates clone named "[original] - Copy")
 * POST /api/business-plans/:id/duplicate
 */
export async function duplicatePlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      sendError(res, 'Authentication required to duplicate a business plan.', 401);
      return;
    }

    const existing = await db.getBusinessPlanById(planId);
    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.userId !== userId && existing.user_id !== userId) {
      sendError(res, 'Access denied. You can only duplicate plans you own.', 403);
      return;
    }

    const clonedPlan = await db.duplicateBusinessPlan(planId, userId);
    if (!clonedPlan) {
      sendError(res, 'Failed to duplicate business plan', 500);
      return;
    }

    await db.addAuditLog(
      'PLAN_DUPLICATED',
      `Duplicated plan "${existing.businessName || existing.business_name}" to "${clonedPlan.businessName}"`,
      'INFO',
      req.user?.email || 'USER'
    );

    sendSuccess(res, clonedPlan, 'Business plan duplicated successfully', 201);
  } catch (err: any) {
    logger.error('Error duplicating business plan:', err);
    sendError(res, 'Failed to duplicate business plan', 500, err?.message);
  }
}

/**
 * Run full feasibility analysis on plan and transition status to 'analyzed'
 * POST /api/business-plans/:id/analyze or POST /api/plans/:id/analyze
 */
export async function analyzePlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const existing = await db.getBusinessPlanById(planId);

    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.userId !== req.user?.id && existing.user_id !== req.user?.id) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const financialInput = extractFinancialInput(existing);
    const analysis = calculateFinancials(financialInput);

    const updatedPlan = await db.updateBusinessPlan(planId, {
      ...existing,
      planStatus: 'analyzed',
      feasibilityScore: analysis.feasibilityScore,
      feasibilityLevel: analysis.feasibilityStatus,
      feasibilityStatus: analysis.feasibilityStatus,
      riskLevel: analysis.riskLevel,
    });

    await db.addAuditLog(
      'PLAN_ANALYZED',
      `Feasibility analysis conducted on "${existing.businessName || existing.business_name}": Score ${analysis.feasibilityScore}/100, ${analysis.feasibilityStatus}`,
      'INFO',
      req.user?.email || 'USER'
    );

    sendSuccess(
      res,
      {
        plan: updatedPlan,
        analysis,
      },
      'Business plan analyzed and feasibility report generated'
    );
  } catch (err: any) {
    logger.error('Error analyzing business plan:', err);
    sendError(res, 'Failed to analyze business plan', 500, err?.message);
  }
}

/**
 * Delete a business plan
 * DELETE /api/business-plans/:id or DELETE /api/plans/:id
 */
export async function deletePlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const planId = req.params.id;
    const existing = await db.getBusinessPlanById(planId);

    if (!existing) {
      sendError(res, 'Business plan not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.userId !== req.user?.id && existing.user_id !== req.user?.id) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const success = await db.deleteBusinessPlan(planId);
    if (!success) {
      sendError(res, 'Failed to delete business plan', 500);
      return;
    }

    await db.addAuditLog(
      'PLAN_DELETED',
      `Business plan "${existing.businessName || existing.business_name}" (ID: ${planId}) removed`,
      'WARNING',
      req.user?.email || 'USER'
    );

    sendSuccess(res, { deletedId: planId }, 'Business plan deleted successfully');
  } catch (err: any) {
    logger.error('Error deleting business plan:', err);
    sendError(res, 'Failed to delete business plan', 500, err?.message);
  }
}

/**
 * Admin: Get all business plans with aggregate feasibility telemetry
 * GET /api/admin/business-plans
 */
export async function getAdminBusinessPlansOverview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const allPlans = await db.getAllBusinessPlansForAdmin();

    const totalPlans = allPlans.length;
    const analyzedPlans = allPlans.filter((p) => p.planStatus === 'analyzed').length;
    const draftPlans = allPlans.filter((p) => p.planStatus === 'draft').length;

    const avgScore = totalPlans > 0
      ? Math.round(allPlans.reduce((acc, p) => acc + (p.feasibilityScore || 0), 0) / totalPlans)
      : 0;

    const categoryDistribution: Record<string, number> = {};
    allPlans.forEach((p) => {
      const cat = p.category || 'Other';
      categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
    });

    sendSuccess(
      res,
      {
        totalPlans,
        analyzedPlans,
        draftPlans,
        averageFeasibilityScore: avgScore,
        categoryDistribution,
        plans: allPlans,
      },
      'Admin business plans telemetry retrieved'
    );
  } catch (err: any) {
    logger.error('Error getting admin business plans:', err);
    sendError(res, 'Failed to retrieve admin business plans overview', 500, err?.message);
  }
}
