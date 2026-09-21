/**
 * BizMind – Business Plan & Financial Feasibility API Service
 */
import { api } from './api';
import {
  BusinessPlan,
  CalculatedFinancialResults,
  MonthProjection,
  ScenarioResult,
  ScenarioAdjustmentConfig,
  SensitivityAnalysisResult,
} from '../types';

export interface PlanCreatePayload {
  businessName: string;
  category: string;
  description?: string;
  location?: string;
  location_name?: string;
  city?: string;
  area?: string;
  latitude?: number | null;
  longitude?: number | null;
  targetCustomer?: string;
  businessModel?: string;
  executiveSummary?: string;

  // Investment
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

  // Fixed Monthly Expenses
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

  // Variable Monthly Expenses
  rawMaterialCost?: number;
  inventoryMonthlyCost?: number;
  packagingCost?: number;
  deliveryCost?: number;
  paymentGatewayCost?: number;
  salesCommission?: number;
  marketingCost?: number;
  otherVariableExpenses?: number;
  variableExpensePercentage?: number;
  variableExpenseMode?: 'itemized' | 'percentage' | 'unit_based';

  // Unit Economics & Revenue
  revenueApproach?: 'direct' | 'calculated';
  expectedMonthlySales?: number;
  directMonthlyRevenue?: number;
  averageSellingPrice?: number;
  sellingPrice?: number;
  expectedCustomersPerDay?: number;
  estimatedCustomers?: number;
  operatingDays?: number;
  otherRevenue?: number;
  variableCostPerUnit?: number;

  // Targets & Assumptions
  targetMonthlyProfit?: number;
  targetRoi?: number;
  targetPaybackPeriod?: number;
  targetProfitMargin?: number;
  revenueGrowthRate?: number;

  planStatus?: 'draft' | 'analyzed';
}

export interface PlanDetailResponse extends BusinessPlan {
  analysis?: CalculatedFinancialResults;
}

export interface AdminPlansTelemetry {
  totalPlans: number;
  analyzedPlans: number;
  draftPlans: number;
  averageFeasibilityScore: number;
  categoryDistribution: Record<string, number>;
  plans: BusinessPlan[];
}

export const planService = {
  /**
   * List business plans for the current authenticated user
   */
  async getPlans(): Promise<BusinessPlan[]> {
    const response = await api.get<BusinessPlan[]>('/business-plans');
    return response.data || [];
  },

  /**
   * Get single business plan by ID with full analytical report
   */
  async getPlanById(id: string | number): Promise<PlanDetailResponse> {
    const response = await api.get<PlanDetailResponse>(`/business-plans/${id}`);
    if (!response.data) throw new Error('Business plan not found');
    return response.data;
  },

  /**
   * Create new business plan
   */
  async createPlan(payload: PlanCreatePayload): Promise<{ plan: BusinessPlan; analysis: CalculatedFinancialResults }> {
    const response = await api.post<{ plan: BusinessPlan; analysis: CalculatedFinancialResults }>(
      '/business-plans',
      payload
    );
    if (!response.data) throw new Error('Failed to create business plan');
    return response.data;
  },

  /**
   * Update existing business plan
   */
  async updatePlan(
    id: string | number,
    payload: Partial<PlanCreatePayload>
  ): Promise<{ plan: BusinessPlan; analysis: CalculatedFinancialResults }> {
    const response = await api.put<{ plan: BusinessPlan; analysis: CalculatedFinancialResults }>(
      `/business-plans/${id}`,
      payload
    );
    if (!response.data) throw new Error('Failed to update business plan');
    return response.data;
  },

  /**
   * Delete business plan
   */
  async deletePlan(id: string | number): Promise<void> {
    await api.delete(`/business-plans/${id}`);
  },

  /**
   * Duplicate a business plan (creates clone named "[original] - Copy")
   */
  async duplicatePlan(id: string | number): Promise<BusinessPlan> {
    const response = await api.post<BusinessPlan>(`/business-plans/${id}/duplicate`);
    if (!response.data) throw new Error('Failed to duplicate business plan');
    return response.data;
  },

  /**
   * Calculate financial metrics for existing plan
   */
  async calculatePlan(
    id: string | number,
    payload?: Partial<PlanCreatePayload>
  ): Promise<{ plan: BusinessPlan; analysis: CalculatedFinancialResults }> {
    const response = await api.post<{ plan: BusinessPlan; analysis: CalculatedFinancialResults }>(
      `/business-plans/${id}/calculate`,
      payload || {}
    );
    if (!response.data) throw new Error('Failed to calculate business plan metrics');
    return response.data;
  },

  /**
   * Get comprehensive financial analysis for a plan
   */
  async getFinancialAnalysis(id: string | number, growthRate?: number): Promise<CalculatedFinancialResults> {
    const query = growthRate !== undefined ? `?growthRate=${growthRate}` : '';
    const response = await api.get<CalculatedFinancialResults>(`/business-plans/${id}/financial-analysis${query}`);
    if (!response.data) throw new Error('Failed to retrieve financial analysis');
    return response.data;
  },

  /**
   * Get 12-month projection for a plan
   */
  async get12MonthProjection(
    id: string | number,
    growthRate?: number
  ): Promise<{ growthRate: number; projection: MonthProjection[] }> {
    const query = growthRate !== undefined ? `?growthRate=${growthRate}` : '';
    const response = await api.get<{ growthRate: number; projection: MonthProjection[] }>(
      `/business-plans/${id}/projection${query}`
    );
    if (!response.data) throw new Error('Failed to retrieve 12-month projection');
    return response.data;
  },

  /**
   * Get scenario analysis for a plan
   */
  async getScenarios(
    id: string | number
  ): Promise<{ scenarios: Record<string, ScenarioResult>; adjustments: ScenarioAdjustmentConfig }> {
    const response = await api.get<{
      scenarios: Record<string, ScenarioResult>;
      adjustments: ScenarioAdjustmentConfig;
    }>(`/business-plans/${id}/scenarios`);
    if (!response.data) throw new Error('Failed to retrieve scenario analysis');
    return response.data;
  },

  /**
   * Calculate custom scenarios with user-defined percentage adjustments
   */
  async calculateCustomScenarios(
    id: string | number,
    customAdjustments: {
      conservativeRevenue?: number;
      conservativeExpense?: number;
      optimisticRevenue?: number;
      optimisticExpense?: number;
    }
  ): Promise<{ scenarios: Record<string, ScenarioResult>; adjustments: ScenarioAdjustmentConfig }> {
    const response = await api.post<{
      scenarios: Record<string, ScenarioResult>;
      adjustments: ScenarioAdjustmentConfig;
    }>(`/business-plans/${id}/scenarios/calculate`, customAdjustments);
    if (!response.data) throw new Error('Failed to calculate custom scenarios');
    return response.data;
  },

  /**
   * Get sensitivity analysis for a plan
   */
  async getSensitivity(id: string | number): Promise<SensitivityAnalysisResult> {
    const response = await api.get<SensitivityAnalysisResult>(`/business-plans/${id}/sensitivity`);
    if (!response.data) throw new Error('Failed to retrieve sensitivity analysis');
    return response.data;
  },

  /**
   * Trigger full feasibility analysis
   */
  async analyzePlan(id: string | number): Promise<{ plan: BusinessPlan; analysis: CalculatedFinancialResults }> {
    const response = await api.post<{ plan: BusinessPlan; analysis: CalculatedFinancialResults }>(
      `/business-plans/${id}/analyze`
    );
    if (!response.data) throw new Error('Failed to analyze business plan');
    return response.data;
  },

  /**
   * Preview server-side financial calculations without persisting
   */
  async previewCalculations(payload: any): Promise<CalculatedFinancialResults> {
    const response = await api.post<CalculatedFinancialResults>('/business-plans/calculate', payload);
    if (!response.data) throw new Error('Failed to preview calculations');
    return response.data;
  },

  /**
   * Admin: Get all business plans and telemetry
   */
  async getAdminPlansTelemetry(): Promise<AdminPlansTelemetry> {
    const response = await api.get<AdminPlansTelemetry>('/admin/business-plans');
    return (
      response.data || {
        totalPlans: 0,
        analyzedPlans: 0,
        draftPlans: 0,
        averageFeasibilityScore: 0,
        categoryDistribution: {},
        plans: [],
      }
    );
  },
};
