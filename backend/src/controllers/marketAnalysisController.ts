/**
 * Market Analysis Controller (Part 6)
 * Endpoints for calculating, saving, retrieving, and comparing market & competition intelligence.
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { db } from '../config/database.js';
import { locationService } from '../services/locationService.js';
import { calculateMarketMetrics, MarketCalculationResult } from '../services/marketAnalysisCalculator.js';

/**
 * POST /api/market-analysis/calculate
 * Computes live market and competition metrics from real OpenStreetMap data without persisting.
 */
export async function calculateMarketAnalysis(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      businessIdea,
      businessCategory = 'General Commercial',
      latitude,
      longitude,
      radiusKm = 2,
      locationName,
      address,
    } = req.body;

    if (!businessIdea || typeof businessIdea !== 'string') {
      sendError(res, 'A valid business idea is required.', 400);
      return;
    }

    const lat = parseFloat(String(latitude));
    const lng = parseFloat(String(longitude));
    if (isNaN(lat) || isNaN(lng)) {
      sendError(res, 'Valid latitude and longitude coordinates are required.', 400);
      return;
    }

    const rKm = Math.min(Math.max(parseFloat(String(radiusKm)) || 2, 0.5), 10);
    const radiusMeters = Math.round(rKm * 1000);

    // 1. Fetch real businesses via Google Places API (New) with fallback
    const businesses = await locationService.getNearbyBusinesses(
      lat,
      lng,
      radiusMeters,
      locationName || 'Target Area',
      businessCategory,
      businessIdea
    );

    // 2. Perform authoritative backend calculations
    const result = calculateMarketMetrics({
      businessIdea: businessIdea.trim(),
      businessCategory: (businessCategory || '').trim(),
      latitude: lat,
      longitude: lng,
      radiusKm: rKm,
      locationName: locationName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      address: address || locationName,
      businesses,
    });

    sendSuccess(res, result, 'Market and competition metrics calculated successfully');
  } catch (err: any) {
    sendError(res, 'Failed to calculate market analysis.', 500, err?.message);
  }
}

/**
 * POST /api/market-analysis
 * Creates and saves a market analysis to database.
 */
export async function createMarketAnalysis(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || 2;
    const {
      businessPlanId,
      locationAnalysisId,
      businessIdea,
      businessCategory = 'General Commercial',
      latitude,
      longitude,
      radiusKm = 2,
      locationName,
      address,
      city,
    } = req.body;

    if (!businessIdea) {
      sendError(res, 'Business idea is required.', 400);
      return;
    }

    const lat = parseFloat(String(latitude));
    const lng = parseFloat(String(longitude));
    if (isNaN(lat) || isNaN(lng)) {
      sendError(res, 'Valid coordinates are required.', 400);
      return;
    }

    const rKm = Math.min(Math.max(parseFloat(String(radiusKm)) || 2, 0.5), 10);
    const radiusMeters = Math.round(rKm * 1000);

    // 1. Retrieve businesses via Google Places API (New) with fallback
    const businesses = await locationService.getNearbyBusinesses(
      lat,
      lng,
      radiusMeters,
      locationName,
      businessCategory,
      businessIdea
    );

    // 2. Calculate authoritative metrics
    const calc = calculateMarketMetrics({
      businessIdea: businessIdea.trim(),
      businessCategory: (businessCategory || '').trim(),
      latitude: lat,
      longitude: lng,
      radiusKm: rKm,
      locationName: locationName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      address: address || locationName,
      businesses,
    });

    // 3. Persist to database
    const saved = await db.createMarketAnalysis(
      {
        user_id: userId,
        business_plan_id: businessPlanId ? Number(businessPlanId) : null,
        location_analysis_id: locationAnalysisId ? Number(locationAnalysisId) : null,
        business_idea: calc.businessIdea,
        business_category: calc.businessCategory,
        location_name: calc.location.name,
        address: calc.location.address,
        latitude: calc.location.latitude,
        longitude: calc.location.longitude,
        city: city || null,
        radius_km: calc.radiusKm,
        total_businesses: calc.totalBusinesses,
        relevant_businesses: calc.relevantCompetitorsCount,
        competitor_density: calc.competitorDensity,
        average_competitor_distance: calc.distanceMetrics.averageDistanceFormatted,
        nearest_competitor_distance: calc.distanceMetrics.nearestDistanceFormatted,
        farthest_competitor_distance: calc.distanceMetrics.farthestDistanceFormatted,
        concentration_level: calc.concentration.level,
        competition_risk: calc.competitionRisk.level,
        market_opportunity: calc.marketOpportunity.indicator,
        category_distribution: calc.categoryDistribution,
        distance_distribution: calc.competitorDistanceBuckets,
        market_gap_observations: calc.marketGapObservations,
        insights: calc.insights,
      },
      calc.competitors.map((c) => ({
        business_name: c.name,
        category: c.category,
        latitude: c.latitude,
        longitude: c.longitude,
        address: c.address,
        distance_km: c.distance_km,
        distance_meters: c.distance_meters,
        website: c.website,
        phone: c.phone,
        opening_hours: c.opening_hours,
        source: c.source,
        source_timestamp: c.source_timestamp,
      }))
    );

    sendSuccess(res, { ...calc, id: saved.id, savedAt: saved.created_at }, 'Market analysis saved successfully', 201);
  } catch (err: any) {
    sendError(res, 'Failed to save market analysis.', 500, err?.message);
  }
}

/**
 * GET /api/market-analysis
 * Lists saved market analyses for the authenticated user.
 */
export async function listMarketAnalyses(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const analyses = await db.listMarketAnalyses(userId);
    sendSuccess(res, analyses, 'User saved market analyses');
  } catch (err: any) {
    sendError(res, 'Failed to list market analyses.', 500, err?.message);
  }
}

/**
 * GET /api/market-analysis/:id
 * Retrieves a single saved market analysis by ID with authorization verification.
 */
export async function getMarketAnalysisById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.id;

    const analysis = await db.getMarketAnalysisById(id, userId);
    if (!analysis) {
      sendError(res, 'Market analysis not found or access denied.', 404);
      return;
    }

    sendSuccess(res, analysis, 'Market analysis retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to fetch market analysis.', 500, err?.message);
  }
}

/**
 * GET /api/market-analysis/plan/:businessPlanId
 * Also supports alias GET /api/market-analysis/:businessPlanId
 */
export async function getMarketAnalysisByPlanId(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { businessPlanId, id } = req.params;
    const targetPlanId = businessPlanId || id;
    const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.id;

    // First check if it's a numeric ID matching a direct analysis
    if (id && !isNaN(Number(id))) {
      const direct = await db.getMarketAnalysisById(id, userId);
      if (direct) {
        sendSuccess(res, direct, 'Market analysis found');
        return;
      }
    }

    const analysis = await db.getMarketAnalysisByPlanId(targetPlanId, userId);
    if (!analysis) {
      sendError(res, 'No market analysis associated with this business plan.', 404);
      return;
    }

    sendSuccess(res, analysis, 'Market analysis for business plan retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to fetch market analysis for business plan.', 500, err?.message);
  }
}

/**
 * GET /api/market-analysis/:id/competitors
 * Returns the competitor list for a saved market analysis.
 */
export async function getMarketCompetitors(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.id;

    const analysis = await db.getMarketAnalysisById(id, userId);
    if (!analysis) {
      sendError(res, 'Market analysis not found or access denied.', 404);
      return;
    }

    const competitors = await db.getMarketCompetitors(id);
    sendSuccess(res, competitors, 'Competitors list retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to fetch competitors.', 500, err?.message);
  }
}

/**
 * GET /api/market-analysis/:id/summary
 * Returns a high-level summary of a saved market analysis.
 */
export async function getMarketSummary(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.id;

    const analysis = await db.getMarketAnalysisById(id, userId);
    if (!analysis) {
      sendError(res, 'Market analysis not found or access denied.', 404);
      return;
    }

    const summary = {
      id: analysis.id,
      businessIdea: analysis.business_idea,
      businessCategory: analysis.business_category,
      locationName: analysis.location_name,
      address: analysis.address,
      radiusKm: analysis.radius_km,
      totalNearbyBusinesses: analysis.total_businesses,
      potentiallyRelevantBusinesses: analysis.relevant_businesses,
      competitorDensity: `${Number(analysis.competitor_density).toFixed(2)} competitors / km²`,
      averageCompetitorDistance: analysis.average_competitor_distance,
      nearestCompetitorDistance: analysis.nearest_competitor_distance,
      farthestCompetitorDistance: analysis.farthest_competitor_distance,
      concentrationLevel: analysis.concentration_level,
      competitionRisk: analysis.competition_risk,
      marketOpportunity: analysis.market_opportunity,
      insights: analysis.insights || [],
      savedAt: analysis.created_at,
    };

    sendSuccess(res, summary, 'Market summary retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to fetch market summary.', 500, err?.message);
  }
}

/**
 * GET /api/market-analysis/:id/category-distribution
 * Returns category distribution for an analysis.
 */
export async function getCategoryDistribution(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.id;

    const analysis = await db.getMarketAnalysisById(id, userId);
    if (!analysis) {
      sendError(res, 'Market analysis not found or access denied.', 404);
      return;
    }

    sendSuccess(res, analysis.category_distribution || {}, 'Category distribution retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to fetch category distribution.', 500, err?.message);
  }
}

/**
 * POST /api/market-analysis/compare
 * or GET /api/market-analysis/:id/comparison
 * Compares 2 to 4 locations side-by-side using actual calculated values.
 */
export async function compareLocations(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      businessIdea = 'Coffee Shop',
      businessCategory = 'Cafe',
      radiusKm = 2,
      locations = [],
    } = req.body;

    if (!Array.isArray(locations) || locations.length === 0) {
      sendError(res, 'Please provide an array of locations to compare.', 400);
      return;
    }

    const rKm = Math.min(Math.max(parseFloat(String(radiusKm)) || 2, 0.5), 10);
    const radiusMeters = Math.round(rKm * 1000);

    const comparisonResults: Array<{
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
    }> = [];

    for (const loc of locations.slice(0, 4)) {
      const lat = parseFloat(String(loc.latitude));
      const lng = parseFloat(String(loc.longitude));
      if (isNaN(lat) || isNaN(lng)) continue;

      const businesses = await locationService.getNearbyBusinesses(lat, lng, radiusMeters, loc.name);
      const metrics = calculateMarketMetrics({
        businessIdea,
        businessCategory,
        latitude: lat,
        longitude: lng,
        radiusKm: rKm,
        locationName: loc.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        address: loc.address || loc.name,
        businesses,
      });

      comparisonResults.push({
        locationName: metrics.location.name,
        address: metrics.location.address,
        totalBusinesses: metrics.totalBusinesses,
        relevantBusinesses: metrics.relevantCompetitorsCount,
        competitorDensity: metrics.competitorDensity,
        averageDistance: metrics.distanceMetrics.averageDistanceFormatted,
        nearestCompetitor: metrics.distanceMetrics.nearestDistanceFormatted,
        concentrationLevel: metrics.concentration.level,
        competitionRisk: metrics.competitionRisk.level,
        marketOpportunity: metrics.marketOpportunity.indicator,
      });
    }

    sendSuccess(
      res,
      {
        businessIdea,
        businessCategory,
        radiusKm: rKm,
        comparisons: comparisonResults,
        note: 'Factual differences based on retrieved geographic data. BizMind does not arbitrarily pick a single winner.',
      },
      'Location comparison generated successfully'
    );
  } catch (err: any) {
    sendError(res, 'Failed to compare locations.', 500, err?.message);
  }
}

/**
 * DELETE /api/market-analysis/:id
 * Deletes a saved market analysis by ID with authorization verification.
 */
export async function deleteMarketAnalysis(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.id;

    const success = await db.deleteMarketAnalysis(id, userId);
    if (!success) {
      sendError(res, 'Market analysis not found or access denied.', 404);
      return;
    }

    sendSuccess(res, { id }, 'Market analysis deleted successfully');
  } catch (err: any) {
    sendError(res, 'Failed to delete market analysis.', 500, err?.message);
  }
}
