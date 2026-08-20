/**
 * BizMind – Business Plan & Financial Feasibility API Service
 */
import { api } from './api';
import { BusinessPlan, CalculatedFinancialResults } from '../types';

export interface PlanCreatePayload {
  businessName: string;
  category: string;
  description?: string;
  location?: string;
  targetCustomer?: string;
  businessModel?: string;
  executiveSummary?: string;

  // Investment
  propertyDeposit?: number;
  interiorSetup?: number;
  equipmentCost?: number;
  furnitureCost?: number;
  licenseCost?: number;
  technologyCost?: number;
  initialInventory?: number;
  launchMarketing?: number;
  otherInitialCost?: number;

  // Fixed Monthly Expenses
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

  // Unit Economics & Revenue
  sellingPrice: number;
  expectedCustomersPerDay: number;
  operatingDays: number;
  variableCostPerUnit: number;

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
   * Preview server-side financial calculations
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
