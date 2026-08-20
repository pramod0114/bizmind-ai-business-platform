/**
 * BizMind – Core TypeScript Type Definitions
 */

export type UserRole = 'USER' | 'ADMIN' | 'user' | 'admin';

export interface User {
  id: number | string;
  email: string;
  full_name: string;
  fullName?: string;
  role: UserRole;
  phone?: string | null;
  profile_image?: string | null;
  profileImage?: string | null;
  created_at: string;
  createdAt?: string;
  updated_at?: string;
  last_login?: string | null;
  lastLogin?: string | null;
  is_active?: boolean;
}

export interface BusinessCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  avgInitialInvestment: number;
  avgMarginPercentage: number;
}

export interface LocationEntity {
  id: number | string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  areaTier: 'tier_1' | 'tier_2' | 'tier_3' | 'rural';
  populationDensity?: number;
  commercialFootfallScore?: number; // 0 - 10
  avgRentalSqft?: number;
}

export interface BusinessEntity {
  id: number | string;
  userId: number | string;
  categoryId: number;
  locationId: number | string;
  businessName: string;
  targetDemographic: string;
  operationalStage: 'idea' | 'planning' | 'ready_to_launch' | 'operating';
  createdAt: string;
}

export interface MarketData {
  id: number | string;
  categoryId: number;
  locationId: number | string;
  marketSizeEstimate: number;
  annualGrowthRate: number;
  saturationIndex: number; // 0 - 10
  averageTicketSize: number;
  demandScore: number;
  lastUpdated: string;
}

export interface Competitor {
  id: number | string;
  categoryId: number;
  locationId: number | string;
  competitorName: string;
  latitude: number;
  longitude: number;
  estimatedMarketShare?: number;
  customerRating?: number;
  priceTier: 'budget' | 'mid_range' | 'premium' | 'luxury';
}

export interface BusinessPlan {
  id: number | string;
  userId: number | string;
  businessId: number | string;
  planTitle: string;
  executiveSummary?: string;
  initialCapital: number;
  plannedTimelineMonths: number;
  planStatus: 'draft' | 'analyzed' | 'archived';
  createdAt: string;
}

export interface FinancialProjection {
  id: number | string;
  planId: number | string;
  monthlyFixedCosts: number;
  variableCostPercentage: number;
  projectedMonthlyRevenue: number;
  breakEvenPeriodMonths?: number;
  projectedRoi1Yr?: number;
  projectedRoi3Yr?: number;
  cashflowRunwayMonths?: number;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface PredictionResult {
  id: number | string;
  planId: number | string;
  successProbability: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  riskTier: RiskLevel;
  modelVersion: string;
  featuresSnapshot: Record<string, unknown>;
  riskFactors?: string[];
  createdAt: string;
}

export interface Recommendation {
  id: number | string;
  predictionId: number | string;
  recommendationType: 'location' | 'pricing' | 'marketing' | 'risk_mitigation' | 'capital';
  actionTitle: string;
  detailedAdvice: string;
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
  timestamp: string;
}

export interface SystemHealth {
  platform: string;
  version: string;
  status: string;
  uptime: number;
  timestamp: string;
  services: {
    api: { status: string; port: number };
    database: { connected: boolean; driver: string; host: string; database: string; message: string };
    mlEngine: { service: string; url: string; available: boolean; status: string };
  };
  capabilities: string[];
}

export interface AdminSystemStats {
  totalUsers: number;
  adminUsers: number;
  standardUsers: number;
  activeUsers: number;
  totalBusinessBenchmarks: number;
  totalMarketDatasets: number;
  activeMLModels: number;
  totalPredictions: number;
  totalPlans: number;
  systemLoad: string;
  nodeVersion: string;
  uptimeSeconds: number;
  dbStatus: {
    connected: boolean;
    driver: string;
    host: string;
    database: string;
    mode: string;
    message: string;
  };
}

export interface BusinessDataset {
  id: number;
  name: string;
  category: string;
  typicalCapex: string;
  avgMargin: string;
  riskIndex: string;
  breakevenMonths: number;
  targetFootfall: string;
  status: string;
  updatedAt: string;
}

export interface MarketDataset {
  id: string;
  region: string;
  city: string;
  footfallIndex: number;
  avgHouseholdIncome: string;
  commercialRentPerSqFt: string;
  competitorDensity: string;
  growthTrend: string;
  lastRefreshed: string;
  status: string;
}

export interface MLModel {
  id: string;
  name: string;
  version: string;
  architecture: string;
  accuracy: string;
  f1Score: string;
  avgLatencyMs: number;
  totalInferences: number;
  status: string;
  lastTrained: string;
  featureWeights: { feature: string; weight: number }[];
}

export interface SystemAnalytics {
  timeSeriesRegistrations: { date: string; newUsers: number; activeSessions: number }[];
  featureUsageDistribution: { name: string; usagePercent: number; totalCalls: number }[];
  apiPerformance: {
    avgResponseTimeMs: number;
    uptimePercentage: number;
    errorRatePercentage: number;
    totalRequests24h: number;
  };
}

export interface AuditLog {
  id: number;
  action: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS' | string;
  user: string;
  ip: string;
  timestamp: string;
}

export interface PlatformSettings {
  maintenanceMode: boolean;
  publicRegistrations: boolean;
  maxRequestsPerMinute: number;
  jwtExpiryDays: number;
  enableDetailedAuditLogs: boolean;
  autoBackupDaily: boolean;
  systemNotificationBanner: string;
  defaultCurrency: string;
  aiEngineVersion: string;
}

