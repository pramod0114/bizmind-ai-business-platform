/**
 * BizMind – Location Intelligence Controller
 * OpenStreetMap Nominatim Geocoding, Overpass Real Business Discovery & Spatial Analytics
 */
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { locationService } from '../services/locationService.js';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * GET /api/location/geocode?q=...
 * Search any location or PIN code using OpenStreetMap Nominatim
 */
export async function geocodeLocation(req: Request, res: Response): Promise<void> {
  try {
    const query = req.query.q as string || req.query.query as string || '';
    if (!query || query.trim().length === 0) {
      sendSuccess(res, [], 'Empty query provided');
      return;
    }

    const results = await locationService.searchLocations(query);
    sendSuccess(res, results, `Found ${results.length} locations matching "${query}"`);
  } catch (err: any) {
    sendError(res, 'Failed to search locations', 500, err?.message);
  }
}

/**
 * GET /api/location/reverse-geocode?lat=...&lng=...
 * Reverse geocode coordinates to human-readable address
 */
export async function reverseGeocodeLocation(req: Request, res: Response): Promise<void> {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string || req.query.lon as string);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      sendError(res, 'Valid latitude and longitude coordinates are required.', 400);
      return;
    }

    const result = await locationService.reverseGeocode(lat, lng);
    if (!result) {
      sendSuccess(
        res,
        {
          name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          display_name: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          latitude: lat,
          longitude: lng,
        },
        'Reverse geocode coordinate generated'
      );
      return;
    }

    sendSuccess(res, result, 'Location reverse geocoded successfully');
  } catch (err: any) {
    sendError(res, 'Failed to reverse geocode coordinates', 500, err?.message);
  }
}

/**
 * GET /api/location/ip-locate
 * Detect user location based on network IP address (reliable fallback for when browser GPS is blocked in iframe)
 */
export async function ipLocate(req: Request, res: Response): Promise<void> {
  try {
    const rawForwarded = req.headers['x-forwarded-for'];
    const clientIp = Array.isArray(rawForwarded)
      ? rawForwarded[0]
      : typeof rawForwarded === 'string'
      ? rawForwarded.split(',')[0].trim()
      : req.socket.remoteAddress || '';

    const result = await locationService.locateByIp(clientIp);
    sendSuccess(res, result, 'Location pinpointed via IP address');
  } catch (err: any) {
    sendSuccess(
      res,
      {
        name: 'Indiranagar, Bengaluru',
        display_name: 'Indiranagar, 100 Feet Road, Bengaluru, Karnataka, 560038, India',
        latitude: 12.9784,
        longitude: 77.6408,
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        source: 'fallback',
      },
      'Fallback location provided'
    );
  }
}

/**
 * GET /api/location/nearby-businesses?lat=...&lng=...&radius=...
 * Discover real businesses from OpenStreetMap Overpass within radius
 */
export async function getNearbyBusinesses(req: Request, res: Response): Promise<void> {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string || req.query.lon as string);
    const radius = parseInt(req.query.radius as string, 10) || 2000;

    if (isNaN(lat) || isNaN(lng)) {
      sendError(res, 'Valid latitude and longitude coordinates are required.', 400);
      return;
    }

    const businesses = await locationService.getNearbyBusinesses(lat, lng, radius);
    sendSuccess(
      res,
      {
        total: businesses.length,
        radius,
        businesses,
        attribution: '© OpenStreetMap contributors',
      },
      `Discovered ${businesses.length} real businesses from OpenStreetMap`
    );
  } catch (err: any) {
    sendError(res, 'Failed to retrieve nearby businesses from OpenStreetMap', 500, err?.message);
  }
}

/**
 * POST /api/location/analyze
 * Perform complete spatial intelligence analysis on target location and optional business category
 */
export async function analyzeLocation(req: Request, res: Response): Promise<void> {
  try {
    const { latitude, longitude, radius = 2000, businessName, businessCategory } = req.body;

    const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
    const lng = typeof longitude === 'number' ? longitude : parseFloat(longitude);
    const rad = typeof radius === 'number' ? radius : parseInt(radius, 10) || 2000;

    if (isNaN(lat) || isNaN(lng)) {
      sendError(res, 'Valid latitude and longitude coordinates are required for location analysis.', 400);
      return;
    }

    const analysis = await locationService.analyzeLocation(lat, lng, rad, {
      name: businessName,
      category: businessCategory,
    });

    sendSuccess(res, analysis, 'Location intelligence analysis generated successfully');
  } catch (err: any) {
    sendError(res, 'Failed to perform location intelligence analysis', 500, err?.message);
  }
}

/**
 * POST /api/location/analyses
 * Save location analysis for authenticated user or demo session
 */
export async function saveLocationAnalysis(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || 1;

    const {
      location_name,
      locationName,
      address,
      latitude,
      longitude,
      radius = 2000,
      business_count,
      businessCount,
      category_summary,
      categorySummary,
      competition_level,
      competitionLevel,
      opportunity_score,
      opportunityScore,
      business_name,
      businessName,
      business_category,
      businessCategory,
    } = req.body;

    const locName = location_name || locationName || 'Target Location';
    const locAddr = address || `${latitude}, ${longitude}`;
    const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
    const lng = typeof longitude === 'number' ? longitude : parseFloat(longitude);
    const rad = typeof radius === 'number' ? radius : parseInt(radius, 10) || 2000;
    const bCount = business_count !== undefined ? Number(business_count) : Number(businessCount) || 0;
    const catSum = category_summary || categorySummary || {};
    const compLevel = competition_level || competitionLevel || 'MEDIUM';
    const oppScore = opportunity_score !== undefined ? Number(opportunity_score) : Number(opportunityScore) || 70;

    const record = await db.createLocationAnalysis({
      user_id: userId,
      location_name: locName,
      address: locAddr,
      latitude: lat,
      longitude: lng,
      radius: rad,
      business_count: bCount,
      category_summary: catSum,
      competition_level: compLevel as 'LOW' | 'MEDIUM' | 'HIGH',
      opportunity_score: oppScore,
      business_name: business_name || businessName || null,
      business_category: business_category || businessCategory || null,
    });

    sendSuccess(res, record, 'Location analysis saved successfully');
  } catch (err: any) {
    sendError(res, 'Failed to save location analysis', 500, err?.message);
  }
}

/**
 * GET /api/location/analyses
 * Get saved location analyses for authenticated user or demo session
 */
export async function listLocationAnalyses(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || 1;
    const analyses = await db.getLocationAnalyses(userId);
    sendSuccess(res, analyses || [], 'User location analyses retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to retrieve saved location analyses', 500, err?.message);
  }
}

/**
 * GET /api/location/analyses/:id
 * Get single location analysis by ID
 */
export async function getLocationAnalysisById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1;
    const record = await db.getLocationAnalysisById(id, req.user?.role === 'ADMIN' ? undefined : userId);

    if (!record) {
      sendError(res, 'Location analysis not found or access denied', 404);
      return;
    }

    sendSuccess(res, record, 'Location analysis retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to retrieve location analysis', 500, err?.message);
  }
}

/**
 * DELETE /api/location/analyses/:id
 * Delete saved location analysis
 */
export async function deleteLocationAnalysis(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1;
    const deleted = await db.deleteLocationAnalysis(id, req.user?.role === 'ADMIN' ? undefined : userId);

    if (!deleted) {
      sendError(res, 'Location analysis not found or access denied', 404);
      return;
    }

    sendSuccess(res, { id }, 'Location analysis removed');
  } catch (err: any) {
    sendError(res, 'Failed to delete location analysis', 500, err?.message);
  }
}

/**
 * POST /api/location/saved-businesses
 * Save discovered business for authenticated user or demo session
 */
export async function saveBusiness(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || 1;

    const {
      osm_id,
      osmId,
      business_name,
      businessName,
      category,
      latitude,
      longitude,
      address,
      phone,
      website,
      opening_hours,
      openingHours,
      brand,
      cuisine,
      distance_meters,
      distanceMeters,
    } = req.body;

    const oId = osm_id || osmId;
    const bName = business_name || businessName;

    if (!oId || !bName) {
      sendError(res, 'OSM ID and business name are required to save a business.', 400);
      return;
    }

    const saved = await db.saveBusiness({
      user_id: userId,
      osm_id: String(oId),
      business_name: bName,
      category: category || 'Commercial',
      latitude: Number(latitude),
      longitude: Number(longitude),
      address: address || null,
      phone: phone || null,
      website: website || null,
      opening_hours: opening_hours || openingHours || null,
      brand: brand || null,
      cuisine: cuisine || null,
      distance_meters: distance_meters !== undefined ? Number(distance_meters) : (distanceMeters !== undefined ? Number(distanceMeters) : null),
    });

    sendSuccess(res, saved, 'Business saved to bookmarked list');
  } catch (err: any) {
    sendError(res, 'Failed to save business', 500, err?.message);
  }
}

/**
 * GET /api/location/saved-businesses
 * List saved businesses for authenticated user or demo session
 */
export async function listSavedBusinesses(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id || 1;
    const businesses = await db.getSavedBusinesses(userId);
    sendSuccess(res, businesses || [], 'Saved businesses retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to retrieve saved businesses', 500, err?.message);
  }
}

/**
 * DELETE /api/location/saved-businesses/:id
 * Delete saved business
 */
export async function deleteSavedBusiness(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1;
    const deleted = await db.deleteSavedBusiness(id, req.user?.role === 'ADMIN' ? undefined : userId);

    if (!deleted) {
      sendError(res, 'Saved business not found or access denied', 404);
      return;
    }

    sendSuccess(res, { id }, 'Saved business removed');
  } catch (err: any) {
    sendError(res, 'Failed to delete saved business', 500, err?.message);
  }
}

/**
 * GET /api/location/admin/stats
 * Get aggregated location intelligence statistics for Admin console
 */
export async function getLocationAdminStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const stats = await db.getLocationAdminStats();
    sendSuccess(res, stats, 'Location administrative statistics retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to retrieve location admin stats', 500, err?.message);
  }
}
