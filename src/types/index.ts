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
  userId?: number | string;
  user_id?: number | string;
  businessId?: number | string;
  business_id?: number | string;
  planTitle?: string;
  plan_title?: string;
  businessName: string;
  business_name?: string;
  category: string;
  description?: string;
  location?: string;
  location_name?: string;
  city?: string;
  area?: string;
  latitude?: number | null;
  longitude?: number | null;
  targetCustomer?: string;
  target_customer?: string;
  businessModel?: string;
  business_model?: string;
  executiveSummary?: string;
  executive_summary?: string;

  // Investment
  propertyDeposit?: number;
  securityDeposit?: number;
  interiorSetup?: number;
  setupCost?: number;
  equipmentCost?: number;
  furnitureCost?: number;
  licenseCost?: number;
  technologyCost?: number;
  initialInventory?: number;
  initialInventoryCost?: number;
  launchMarketing?: number;
  marketingLaunchCost?: number;
  otherInitialCost?: number;
  totalInitialInvestment: number;

  // Fixed Monthly Expenses
  rent?: number;
  salaries?: number;
  utilities?: number;
  internet?: number;
  internetCost?: number;
  maintenance?: number;
  marketing?: number;
  transportation?: number;
  insurance?: number;
  software?: number;
  softwareCost?: number;
  loanEmi?: number;
  otherExpenses?: number;
  otherFixedExpenses?: number;
  totalMonthlyFixedExpenses: number;

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
  totalMonthlyVariableExpenses?: number;

  // Unit Economics & Revenue
  revenueApproach?: 'direct' | 'calculated';
  expectedMonthlySales?: number;
  averageSellingPrice?: number;
  estimatedCustomers?: number;
  otherRevenue?: number;
  sellingPrice: number;
  expectedCustomersPerDay: number;
  operatingDays: number;
  variableCostPerUnit: number;
  expectedMonthlyUnits?: number;
  monthlyRevenue: number;
  annualRevenue?: number;
  annualExpenses?: number;
  monthlyVariableCost: number;
  totalMonthlyExpenses?: number;

  // Targets & Assumptions
  targetMonthlyProfit?: number;
  targetRoi?: number;
  targetPaybackPeriod?: number;
  targetProfitMargin?: number;
  revenueGrowthRate?: number;

  // Calculated Performance Metrics
  monthlyProfit: number;
  annualProfit?: number;
  profitMargin: number;
  contributionMarginPerUnit?: number;
  contributionMarginRatio?: number;
  breakEvenUnits?: number | null;
  breakEvenRevenue?: number | null;
  breakEvenCapacityPercentage?: number | null;
  breakEvenCalculable?: boolean;
  breakEvenMessage?: string;
  roi?: number | null;
  annualRoi?: number | null;
  paybackPeriodMonths?: number | null;
  paybackPeriod?: number | null;
  paybackStatusText?: string;
  feasibilityScore: number;
  feasibilityLevel?: string;
  feasibilityStatus?: string;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'low' | 'moderate' | 'high' | 'critical' | string;

  planStatus: 'draft' | 'analyzed' | 'archived';
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
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

export interface GeoLocationResult {
  place_id: string | number;
  name: string;
  display_name: string;
  latitude: number;
  longitude: number;
  type: string;
  importance?: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    road?: string;
  };
}

export interface DiscoveredBusiness {
  id?: string | number;
  osm_id: string;
  name: string;
  category: string;
  broadCategory: 'Food & Beverage' | 'Retail' | 'Healthcare' | 'Education' | 'Finance' | 'Automotive' | 'Services' | 'Fitness' | 'Accommodation' | 'Other';
  latitude: number;
  longitude: number;
  distance_meters: number;
  distance_formatted: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  opening_hours: string | null;
  brand: string | null;
  cuisine: string | null;
  operator: string | null;
  email: string | null;
  isDirectCompetitor?: boolean;
  is_direct_competitor?: boolean;
  isRelated?: boolean;
}

export interface LocationAnalysisResult {
  targetLocation: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    city?: string;
    suburb?: string;
  };
  radiusMeters: number;
  radiusKm?: number;
  businesses?: DiscoveredBusiness[];
  totalBusinesses: number;
  relevantBusinesses?: number;
  categoriesFound: number;
  nearestBusiness: DiscoveredBusiness | null;
  mostCommonCategory: string;
  areaKm2: number;
  businessDensity?: number;
  businessDensityPerKm2: number;
  relevantBusinessDensity?: number;
  averageRelevantDistance?: string;
  averageRelevantDistanceMeters?: number;
  concentrationLevel?: 'Low concentration' | 'Moderate concentration' | 'High concentration';
  concentrationDescription?: string;
  categoryDistribution: { category: string; broadCategory: string; count: number; percentage: number }[];
  broadCategoryDistribution: { broadCategory: string; count: number; percentage: number }[];
  distanceDistribution: { range: string; minM: number; maxM: number; count: number }[];
  insights?: string[];
  targetBusinessInfo?: {
    name?: string;
    category?: string;
  };
  competition: {
    directCompetitorCount: number;
    relatedBusinessCount: number;
    directCompetitors: DiscoveredBusiness[];
    relatedBusinesses: DiscoveredBusiness[];
    competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    concentrationLevel?: 'Low concentration' | 'Moderate concentration' | 'High concentration';
    marketGapSignal: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  opportunityScore: {
    overallScore: number;
    competitionScore: number;
    categoryGapScore: number;
    densityScore: number;
    explanation: string;
  };
  attribution: string;
  dataSource: string;
  disclaimer: string;
}

export interface SavedLocationAnalysis {
  id: number;
  user_id: number;
  location_name: string;
  city?: string | null;
  address: string;
  latitude: number;
  longitude: number;
  business_idea?: string | null;
  business_category?: string | null;
  radius_km?: number;
  total_businesses?: number;
  relevant_businesses?: number;
  business_density?: number;
  average_relevant_distance?: string | number | null;
  concentration_level?: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  radius?: number;
  business_count?: number;
  category_summary?: Record<string, number> | string;
  competition_level?: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  opportunity_score?: number;
  business_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedBusiness {
  id: number;
  user_id: number;
  osm_id: string | number;
  business_name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  website: string | null;
  opening_hours: string | null;
  brand: string | null;
  cuisine: string | null;
  distance_meters: number | null;
  saved_at: string;
}

export interface LocationAdminStats {
  totalAnalyses: number;
  totalSavedBusinesses: number;
  avgBusinessesFound: number;
  mostPopularRadius: string;
  topLocations: { name: string; count: number }[];
  topCategories: { name: string; count: number }[];
  radiusDistribution: { radius: string; count: number }[];
}

// ==========================================
// Part 6: Market & Competition Analysis Types
// ==========================================

export interface MarketCompetitor {
  id?: number | string;
  osm_id?: string;
  name: string;
  business_name?: string;
  category: string;
  broadCategory?: string;
  latitude: number;
  longitude: number;
  distance_meters: number;
  distance_km: number;
  distance_formatted: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  opening_hours: string | null;
  isDirectCompetitor?: boolean;
  relevanceReason?: string;
  source: string;
  source_timestamp: string;
}

export interface CategorySummaryItem {
  category: string;
  count: number;
  percentage: number;
  isDirectCategory: boolean;
}

export interface MarketAnalysisData {
  id?: number | string;
  businessIdea: string;
  businessCategory: string;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
  areaKm2: number;
  totalBusinesses: number;
  relevantCompetitorsCount: number;
  otherBusinessesCount: number;
  competitorDensity: number;
  competitorDensityFormatted: string;
  distanceMetrics: {
    nearestDistanceKm: number | null;
    nearestDistanceFormatted: string;
    farthestDistanceKm: number | null;
    farthestDistanceFormatted: string;
    averageDistanceKm: number | null;
    averageDistanceFormatted: string;
    medianDistanceKm: number | null;
    medianDistanceFormatted: string;
  };
  concentration: {
    level: 'Low Concentration' | 'Moderate Concentration' | 'High Concentration';
    explanation: string;
    benchmarkNote: string;
  };
  competitionRisk: {
    level: 'Low' | 'Moderate' | 'High';
    reason: string;
  };
  marketOpportunity: {
    indicator: 'Potential Opportunity' | 'Moderate Opportunity' | 'Limited Observed Opportunity' | 'Needs Further Investigation';
    explanation: string;
  };
  categoryDistribution: CategorySummaryItem[];
  competitorDistanceBuckets: { range: string; count: number }[];
  marketGapObservations: string[];
  insights: string[];
  competitors: MarketCompetitor[];
  otherBusinesses: MarketCompetitor[];
  dataSource: {
    name: string;
    attribution: string;
    retrievedAt: string;
    priceInfoAvailable: boolean;
    priceInfoNote: string;
    historicalTrendNote: string;
    limitations: string[];
  };
  savedAt?: string;
}

export interface LocationComparisonItem {
  locationName: string;
  address: string;
  totalBusinesses: number;
  relevantBusinesses: number;
  competitorDensity: number;
  averageDistance: string;
  nearestCompetitor: string;
  concentrationLevel: string;
  competitionRisk: string;
  marketOpportunity: string;
}

export interface LocationComparisonResponse {
  businessIdea: string;
  businessCategory: string;
  radiusKm: number;
  comparisons: LocationComparisonItem[];
  note: string;
}

export type {
  CalculatedFinancialResults,
  ScenarioResult,
  ScenarioAdjustmentConfig,
  SensitivityPoint,
  SensitivityAnalysisResult,
  MonthProjection,
  RiskIndicator,
  FeasibilityStatus,
  TargetComparisonItem,
  FinancialTargetsInput,
  InitialInvestmentInput,
  MonthlyExpensesInput,
  RevenueAndUnitEconomicsInput,
  FullFinancialInput,
} from '../utils/financialCalculator';




