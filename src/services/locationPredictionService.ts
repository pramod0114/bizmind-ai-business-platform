/**
 * BizMind – Frontend Location-Based Business Success Prediction Service
 */
import { api } from './api';

export interface LocationPredictionFinancialInputs {
  initialInvestment?: number;
  expectedMonthlyRevenue?: number;
  monthlyFixedExpenses?: number;
  estimatedVariableExpenses?: number;
  expectedAverageSellingPrice?: number;
  expectedCustomersPerDay?: number;
}

export interface CompetitorDetail {
  id: string;
  name: string;
  category: string;
  broadCategory: string;
  address: string | null;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  distanceFormatted: string;
  googleMapsUri: string;
  isDirectCompetitor: boolean;
  isRelated: boolean;
  businessStatus?: string;
}

export interface CompetitorMetrics {
  totalBusinessesRetrieved: number;
  relevantCompetitorCount: number;
  relatedBusinessesCount: number;
  otherBusinessesCount: number;
  radiusMeters: number;
  radiusKm: number;
  areaSqKm: number;
  competitorDensityPerSqKm: number;
  nearestCompetitorDistanceMeters: number | null;
  nearestCompetitorDistanceFormatted: string;
  averageCompetitorDistanceMeters: number | null;
  averageCompetitorDistanceFormatted: string;
  farthestCompetitorDistanceMeters: number | null;
  farthestCompetitorDistanceFormatted: string;
  distanceDistribution: {
    within500m: number;
    between500mAnd1km: number;
    between1kmAnd2km: number;
    between2kmAnd5km: number;
  };
  categoryDistribution: Record<string, number>;
  competitors: CompetitorDetail[];
}

export interface MarketAnalysisOutput {
  concentrationLevel: 'Low Concentration' | 'Moderate Concentration' | 'High Concentration';
  competitionRisk: 'Low' | 'Moderate' | 'High';
  marketOpportunityAssessment: string;
  observedMarketGaps: string[];
  favorableIndicators: string[];
  potentialChallenges: string[];
  unresolvedQuestions: string[];
  dataLimitations: string[];
}

export interface FinancialFeasibilityOutput {
  hasFinancialData: boolean;
  initialInvestment: number;
  monthlyFixedExpenses: number;
  monthlyVariableExpenses: number;
  totalMonthlyExpenses: number;
  expectedMonthlyRevenue: number;
  expectedMonthlyProfit: number;
  profitMargin: number;
  breakEvenMonthlyRevenue: number;
  breakEvenPeriodMonths: number | null;
  annualizedRoi: number | null;
  scenarios: {
    conservative: { revenue: number; expenses: number; profit: number; margin: number; breakEvenMonths: number | null };
    base: { revenue: number; expenses: number; profit: number; margin: number; breakEvenMonths: number | null };
    optimistic: { revenue: number; expenses: number; profit: number; margin: number; breakEvenMonths: number | null };
  };
  assumptions: {
    sellingPrice?: number;
    dailyCustomers?: number;
    operatingDaysPerMonth: number;
  };
}

export interface PredictionAssessmentOutput {
  mlModelValidated: boolean;
  validationStatus: 'VALIDATED_ML_MODEL' | 'UNVALIDATED_INSUFFICIENT_DATA';
  successProbability: number | null;
  confidenceScore: number | null;
  riskTier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  modelType: string;
  modelNotice: string;
  feasibilityAssessment: {
    scoreOutOf100: number;
    feasibilityGrade: 'High Feasibility' | 'Moderate Feasibility' | 'Cautious / High Risk';
    summary: string;
    keyFactors: Array<{
      name: string;
      score: number;
      weight: number;
      impact: 'Positive' | 'Neutral' | 'Negative';
      explanation: string;
    }>;
  };
}

export interface LocationPredictionResult {
  id?: number;
  businessIdea: string;
  businessCategory: string;
  locationName: string;
  formattedAddress: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radiusMeters: number;
  competitorMetrics: CompetitorMetrics;
  marketAnalysis: MarketAnalysisOutput;
  financialFeasibility: FinancialFeasibilityOutput;
  predictionAssessment: PredictionAssessmentOutput;
  recommendations: string[];
  timestamp: string;
}

export interface LocationComparisonItem extends LocationPredictionResult {
  label: string;
}

export interface LocationComparisonResponse {
  businessIdea: string;
  radiusMeters: number;
  locations: LocationComparisonItem[];
  comparativeSummary: {
    lowestCompetitionLocation: string;
    highestComplementaryFootfallLocation: string;
    highestFeasibilityLocation: string;
    notes: string[];
  };
}

class LocationPredictionClient {
  public async analyzeOpportunity(params: {
    businessIdea: string;
    latitude: number;
    longitude: number;
    radiusMeters?: number;
    locationName?: string;
    formattedAddress?: string;
    financialInputs?: LocationPredictionFinancialInputs;
  }): Promise<LocationPredictionResult> {
    const res = await api.post<LocationPredictionResult>('/predictions/location-based', params);
    return res.data;
  }

  public async compareLocations(params: {
    businessIdea: string;
    locations: Array<{
      label: string;
      name: string;
      latitude: number;
      longitude: number;
      formattedAddress?: string;
    }>;
    radiusMeters?: number;
    financialInputs?: LocationPredictionFinancialInputs;
  }): Promise<LocationComparisonResponse> {
    const res = await api.post<LocationComparisonResponse>('/predictions/compare-locations', params);
    return res.data;
  }

  public async savePrediction(
    result: LocationPredictionResult,
    financialInputs?: LocationPredictionFinancialInputs
  ): Promise<any> {
    const res = await api.post('/predictions/save', { result, financialInputs });
    return res.data;
  }

  public async listSavedPredictions(): Promise<any[]> {
    const res = await api.get<any[]>('/predictions/location-based');
    return res.data || [];
  }

  public async getSavedPredictionById(id: number | string): Promise<any> {
    const res = await api.get<any>(`/predictions/location-based/${id}`);
    return res.data;
  }

  public async deleteSavedPrediction(id: number | string): Promise<boolean> {
    const res = await api.delete(`/predictions/location-based/${id}`);
    return res.success;
  }
}

export const locationPredictionClient = new LocationPredictionClient();
