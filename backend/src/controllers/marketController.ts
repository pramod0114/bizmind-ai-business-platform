import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';
import { db } from '../config/database.js';

export interface IndustryTrend {
  id: string;
  name: string;
  category: string;
  marketSizeInBillions: number;
  cagr: number;
  saturationIndex: number; // 0 - 10
  avgTicketSize: number;
  demandGrowthRate: number;
  riskTier: 'Low' | 'Moderate' | 'High';
  keyDrivers: string[];
  projectedOutlook: string;
}

const INDUSTRY_DATA: IndustryTrend[] = [
  {
    id: 'ind-food-beverage',
    name: 'Specialty Food & Beverage',
    category: 'Food & Beverage',
    marketSizeInBillions: 68.4,
    cagr: 11.2,
    saturationIndex: 6.8,
    avgTicketSize: 280,
    demandGrowthRate: 14.5,
    riskTier: 'Moderate',
    keyDrivers: ['Urban disposable income expansion', 'Third-wave coffee appreciation', 'On-the-go experiential dining'],
    projectedOutlook: 'High repeat patronage with margin sensitivity to prime street frontage real estate.',
  },
  {
    id: 'ind-fitness-wellness',
    name: 'Boutique Fitness & Holistic Wellness',
    category: 'Fitness',
    marketSizeInBillions: 14.2,
    cagr: 15.8,
    saturationIndex: 4.2,
    avgTicketSize: 3200,
    demandGrowthRate: 18.0,
    riskTier: 'Low',
    keyDrivers: ['Preventative healthcare prioritization', 'Community-driven group workout adoption', 'Tiered subscription retention'],
    projectedOutlook: 'Exceptional retention rates and high recurring customer lifetime value with minimal variable costs.',
  },
  {
    id: 'ind-retail-grocery',
    name: 'Specialty Organic Retail & Grocers',
    category: 'Retail',
    marketSizeInBillions: 112.0,
    cagr: 8.6,
    saturationIndex: 7.4,
    avgTicketSize: 640,
    demandGrowthRate: 9.8,
    riskTier: 'Moderate',
    keyDrivers: ['Clean-label and organic consumer preferences', 'Hyperlocal delivery integration', 'Fresh produce traceability'],
    projectedOutlook: 'Consistent volume demand requiring disciplined inventory turn ratios and supply chain contracts.',
  },
  {
    id: 'ind-healthcare-pharma',
    name: 'Community Pharmacy & Diagnostic Hubs',
    category: 'Healthcare',
    marketSizeInBillions: 42.6,
    cagr: 13.4,
    saturationIndex: 5.1,
    avgTicketSize: 850,
    demandGrowthRate: 12.2,
    riskTier: 'Low',
    keyDrivers: ['Aging demographic density', 'Point-of-care rapid testing integration', 'Generic medication penetration'],
    projectedOutlook: 'Inelastic consumer demand providing defensive revenue stability during macroeconomic shifts.',
  },
  {
    id: 'ind-pet-services',
    name: 'Pet Care, Grooming & Specialized Supplies',
    category: 'Services',
    marketSizeInBillions: 8.9,
    cagr: 19.4,
    saturationIndex: 3.5,
    avgTicketSize: 1400,
    demandGrowthRate: 22.1,
    riskTier: 'Low',
    keyDrivers: ['Pet humanization and premium nutrition spending', 'Double-income urban households', 'Recurring grooming appointments'],
    projectedOutlook: 'Rapidly emerging high-margin sector with low regional competitor saturation.',
  },
  {
    id: 'ind-coworking-tech',
    name: 'Flexible Co-Working & Creative Studios',
    category: 'Commercial Spaces',
    marketSizeInBillions: 24.5,
    cagr: 12.0,
    saturationIndex: 6.2,
    avgTicketSize: 8500,
    demandGrowthRate: 11.5,
    riskTier: 'Moderate',
    keyDrivers: ['Hybrid workforce formalization', 'Independent creator & freelancer surge', 'Flexible enterprise satellite hubs'],
    projectedOutlook: 'High upfront capital expenditure offset by predictable medium-term lease agreements.',
  },
];

export async function getMarketTrends(_req: Request, res: Response): Promise<void> {
  const marketDatasets = await db.getMarketDatasets();
  sendSuccess(res, {
    industries: INDUSTRY_DATA,
    regionalBenchmarks: marketDatasets,
    summary: {
      totalMarketTrackedBillions: 270.6,
      averageCAGR: 13.4,
      highestGrowthSector: 'Pet Care, Grooming & Specialized Supplies (+19.4% CAGR)',
      lowestRiskSector: 'Community Pharmacy & Diagnostic Hubs',
    },
  }, 'Market intelligence trends retrieved successfully');
}

export async function getMarketIndustries(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, INDUSTRY_DATA, 'Market industries retrieved successfully');
}

export async function analyzeCompetitors(req: Request, res: Response): Promise<void> {
  const { category, latitude, longitude, radius = 2000 } = req.body;
  const matchedIndustry = INDUSTRY_DATA.find(
    (i) => i.category.toLowerCase() === (category || '').toLowerCase()
  ) || INDUSTRY_DATA[0];

  sendSuccess(res, {
    industry: matchedIndustry,
    searchParams: { category, latitude, longitude, radius },
    projectedSaturation: matchedIndustry.saturationIndex,
    marketOpportunityRecommendation:
      matchedIndustry.saturationIndex < 5
        ? 'High Opportunity: Sector exhibits low market saturation and healthy demand expansion.'
        : matchedIndustry.saturationIndex < 7
        ? 'Moderate Opportunity: Viable with distinct competitive differentiation and prime footfall.'
        : 'High Competition: Intense incumbent density requires superior pricing or niche positioning.',
  }, 'Competitor market analysis generated');
}
