/**
 * BizMind – Business Plan & Financial Feasibility Controller
 * 
 * Server-side authoritative validation and calculation execution.
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { db } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { calculateFinancials, FullFinancialInput } from '../services/financialCalculator.js';
import { logger } from '../utils/logger.js';

/**
 * Helper to extract FullFinancialInput from request body
 */
function extractFinancialInput(body: any): FullFinancialInput {
  return {
    investment: {
      propertyDeposit: Number(body.propertyDeposit || body.property_deposit || 0),
      interiorSetup: Number(body.interiorSetup || body.interior_setup || 0),
      equipmentCost: Number(body.equipmentCost || body.equipment_cost || 0),
      furnitureCost: Number(body.furnitureCost || body.furniture_cost || 0),
      licenseCost: Number(body.licenseCost || body.license_cost || 0),
      technologyCost: Number(body.technologyCost || body.technology_cost || 0),
      initialInventory: Number(body.initialInventory || body.initial_inventory || 0),
      launchMarketing: Number(body.launchMarketing || body.launch_marketing || 0),
      otherInitialCost: Number(body.otherInitialCost || body.other_initial_cost || 0),
    },
    expenses: {
      rent: Number(body.rent || 0),
      salaries: Number(body.salaries || 0),
      utilities: Number(body.utilities || 0),
      internet: Number(body.internet || 0),
      maintenance: Number(body.maintenance || 0),
      marketing: Number(body.marketing || 0),
      transportation: Number(body.transportation || 0),
      insurance: Number(body.insurance || 0),
      software: Number(body.software || 0),
      loanEmi: Number(body.loanEmi || body.loan_emi || 0),
      otherExpenses: Number(body.otherExpenses || body.other_expenses || 0),
    },
    revenueEconomics: {
      sellingPrice: Number(body.sellingPrice || body.selling_price || 0),
      expectedCustomersPerDay: Number(body.expectedCustomersPerDay || body.expected_customers_per_day || 0),
      operatingDays: Number(body.operatingDays || body.operating_days || 30),
      variableCostPerUnit: Number(body.variableCostPerUnit || body.variable_cost_per_unit || 0),
    },
  };
}

/**
 * Preview calculations without persisting
 * POST /api/plans/calculate or POST /api/business-plans/calculate
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
 * POST /api/plans or POST /api/business-plans
 */
export async function createPlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, 'Authentication required to create a business plan.', 401);
      return;
    }

    const {
      businessName,
      business_name,
      category,
      description,
      location,
      targetCustomer,
      target_customer,
      businessModel,
      business_model,
      executiveSummary,
      executive_summary,
      planStatus,
    } = req.body;

    const bName = (businessName || business_name || '').trim();
    if (!bName) {
      sendError(res, 'Business name is required.', 400);
      return;
    }

    const cat = (category || 'Other').trim();

    // 1. Authoritatively calculate all metrics on server
    const financialInput = extractFinancialInput(req.body);
    const results = calculateFinancials(financialInput);

    // 2. Prepare persistent record
    const planRecord = {
      userId,
      user_id: userId,
      businessName: bName,
      business_name: bName,
      category: cat,
      description: (description || '').trim(),
      location: (location || 'Bangalore, India').trim(),
      targetCustomer: (targetCustomer || target_customer || 'General Consumers').trim(),
      target_customer: (targetCustomer || target_customer || 'General Consumers').trim(),
      businessModel: (businessModel || business_model || 'B2C').trim(),
      business_model: (businessModel || business_model || 'B2C').trim(),
      executiveSummary: (executiveSummary || executive_summary || '').trim(),
      executive_summary: (executiveSummary || executive_summary || '').trim(),

      // Investment fields
      ...financialInput.investment,
      totalInitialInvestment: results.totalInitialInvestment,

      // Expenses fields
      ...financialInput.expenses,
      totalMonthlyFixedExpenses: results.totalMonthlyFixedExpenses,

      // Revenue & Unit Economics
      ...financialInput.revenueEconomics,
      expectedMonthlyUnits: results.expectedMonthlyUnits,
      monthlyRevenue: results.monthlyRevenue,
      annualRevenue: results.annualRevenue,
      monthlyVariableCost: results.monthlyVariableCost,
      totalMonthlyExpenses: results.totalMonthlyExpenses,

      // Calculated performance metrics
      monthlyProfit: results.monthlyProfit,
      annualProfit: results.annualProfit,
      profitMargin: results.profitMargin,
      contributionMarginPerUnit: results.contributionMarginPerUnit,
      breakEvenUnits: results.breakEvenUnits,
      breakEvenRevenue: results.breakEvenRevenue,
      breakEvenCapacityPercentage: results.breakEvenCapacityPercentage,
      breakEvenCalculable: results.breakEvenCalculable,
      breakEvenMessage: results.breakEvenMessage,
      roi: results.roi,
      paybackPeriodMonths: results.paybackPeriodMonths,
      paybackStatusText: results.paybackStatusText,
      feasibilityScore: results.feasibilityScore,
      feasibilityLevel: results.feasibilityLevel,
      riskLevel: results.riskLevel,

      planStatus: planStatus === 'analyzed' ? 'analyzed' : 'draft',
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
 * GET /api/plans or GET /api/business-plans
 */
export async function listPlans(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN';

    // If admin passes all=true, return all plans; otherwise return user's plans
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
 * GET /api/plans/:id or GET /api/business-plans/:id
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

    // Re-generate fresh real-time scenarios & sensitivity matrix
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
 * PUT /api/plans/:id or PUT /api/business-plans/:id
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

    const {
      businessName,
      business_name,
      category,
      description,
      location,
      targetCustomer,
      target_customer,
      businessModel,
      business_model,
      executiveSummary,
      executive_summary,
      planStatus,
    } = req.body;

    const bName = (businessName || business_name || existing.businessName || existing.business_name).trim();
    const cat = (category || existing.category || 'Other').trim();

    // 1. Authoritatively recalculate on server
    const financialInput = extractFinancialInput({ ...existing, ...req.body });
    const results = calculateFinancials(financialInput);

    const updatePayload = {
      businessName: bName,
      business_name: bName,
      category: cat,
      description: (description !== undefined ? description : existing.description || '').trim(),
      location: (location !== undefined ? location : existing.location || '').trim(),
      targetCustomer: (targetCustomer || target_customer !== undefined ? targetCustomer || target_customer : existing.targetCustomer || '').trim(),
      target_customer: (targetCustomer || target_customer !== undefined ? targetCustomer || target_customer : existing.target_customer || '').trim(),
      businessModel: (businessModel || business_model !== undefined ? businessModel || business_model : existing.businessModel || 'B2C').trim(),
      business_model: (businessModel || business_model !== undefined ? businessModel || business_model : existing.business_model || 'B2C').trim(),
      executiveSummary: (executiveSummary || executive_summary !== undefined ? executiveSummary || executive_summary : existing.executiveSummary || '').trim(),
      executive_summary: (executiveSummary || executive_summary !== undefined ? executiveSummary || executive_summary : existing.executive_summary || '').trim(),

      // Updated Investment fields
      ...financialInput.investment,
      totalInitialInvestment: results.totalInitialInvestment,

      // Updated Expenses fields
      ...financialInput.expenses,
      totalMonthlyFixedExpenses: results.totalMonthlyFixedExpenses,

      // Updated Revenue & Unit Economics
      ...financialInput.revenueEconomics,
      expectedMonthlyUnits: results.expectedMonthlyUnits,
      monthlyRevenue: results.monthlyRevenue,
      annualRevenue: results.annualRevenue,
      monthlyVariableCost: results.monthlyVariableCost,
      totalMonthlyExpenses: results.totalMonthlyExpenses,

      // Updated calculated results
      monthlyProfit: results.monthlyProfit,
      annualProfit: results.annualProfit,
      profitMargin: results.profitMargin,
      contributionMarginPerUnit: results.contributionMarginPerUnit,
      breakEvenUnits: results.breakEvenUnits,
      breakEvenRevenue: results.breakEvenRevenue,
      breakEvenCapacityPercentage: results.breakEvenCapacityPercentage,
      breakEvenCalculable: results.breakEvenCalculable,
      breakEvenMessage: results.breakEvenMessage,
      roi: results.roi,
      paybackPeriodMonths: results.paybackPeriodMonths,
      paybackStatusText: results.paybackStatusText,
      feasibilityScore: results.feasibilityScore,
      feasibilityLevel: results.feasibilityLevel,
      riskLevel: results.riskLevel,

      planStatus: planStatus !== undefined ? planStatus : existing.planStatus,
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
 * Run full feasibility analysis on plan and transition status to 'analyzed'
 * POST /api/plans/:id/analyze or POST /api/business-plans/:id/analyze
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
      feasibilityLevel: analysis.feasibilityLevel,
      riskLevel: analysis.riskLevel,
    });

    await db.addAuditLog(
      'PLAN_ANALYZED',
      `Feasibility analysis conducted on "${existing.businessName || existing.business_name}": Feasibility Score ${analysis.feasibilityScore}/100, ${analysis.riskLevel}`,
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
 * DELETE /api/plans/:id or DELETE /api/business-plans/:id
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
