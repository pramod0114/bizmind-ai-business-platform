/**
 * BizMind – Google Maps Platform & Places API (New) Routes
 * Dedicated endpoints for secure server-side Google Maps Platform integrations.
 */
import { Router, Request, Response } from 'express';
import { googlePlacesService } from '../services/googlePlacesService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * GET /api/google/config
 * Check if Google Maps Platform API is active without exposing the secret key
 */
router.get('/config', (_req: Request, res: Response) => {
  const isConfigured = googlePlacesService.isKeyConfigured();
  const apiKey = googlePlacesService.getApiKey();
  sendSuccess(res, {
    configured: isConfigured,
    apiKey: isConfigured ? apiKey : null,
    provider: 'Google Maps Platform / Google Places API (New)',
    features: ['searchNearby', 'searchText', 'geocode', 'autocomplete', 'AdvancedMarker'],
  });
});

/**
 * POST /api/google/nearby
 * Search nearby businesses using Places API (New) Nearby Search
 */
router.post('/nearby', async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, radius = 2000, businessType, category, businessIdea } = req.body;

    const lat = parseFloat(String(latitude));
    const lng = parseFloat(String(longitude));
    const rMeters = Math.min(Math.max(parseInt(String(radius), 10) || 2000, 100), 50000);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      sendError(res, 'Valid latitude (-90 to 90) and longitude (-180 to 180) coordinates are required.', 400);
      return;
    }

    if (!googlePlacesService.isKeyConfigured()) {
      sendError(
        res,
        'Google Maps Platform API key is not configured. Please provide your Google Maps API key in the environment variables (VITE_GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_SERVER_API_KEY).',
        503
      );
      return;
    }

    // Determine place types
    const placeTypes = googlePlacesService.mapCategoryToGoogleTypes(businessType || category || businessIdea);

    // Call Google Places API (New)
    const rawPlaces = await googlePlacesService.searchNearby({
      latitude: lat,
      longitude: lng,
      radiusMeters: rMeters,
      placeTypes,
      maxResultCount: 20,
    });

    // Normalize to BizMind DiscoveredBusiness
    const businesses = googlePlacesService.normalizeGooglePlaces(
      rawPlaces,
      lat,
      lng,
      category || businessType,
      businessIdea
    );

    sendSuccess(
      res,
      {
        total: businesses.length,
        radius: rMeters,
        businesses,
        attribution: 'Map and place information provided by Google Maps Platform / Google Places (New).',
      },
      `Discovered ${businesses.length} places via Google Places API (New)`
    );
  } catch (err: any) {
    logger.error('POST /api/google/nearby error:', err?.message || err);
    sendError(
      res,
      err?.message || 'Unable to load nearby businesses. Please check your Google Maps API configuration.',
      500,
      err?.message
    );
  }
});

/**
 * POST /api/google/text-search
 * Search places by freeform business idea or text query using Places API (New) Text Search
 */
router.post('/text-search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { textQuery, businessIdea, latitude, longitude, radius = 2000, category } = req.body;
    const query = (textQuery || businessIdea || '').trim();

    if (!query) {
      sendError(res, 'A text query or business idea is required for Text Search.', 400);
      return;
    }

    const lat = latitude !== undefined ? parseFloat(String(latitude)) : undefined;
    const lng = longitude !== undefined ? parseFloat(String(longitude)) : undefined;
    const rMeters = Math.min(Math.max(parseInt(String(radius), 10) || 2000, 100), 50000);

    if (!googlePlacesService.isKeyConfigured()) {
      sendError(
        res,
        'Google Maps Platform API key is not configured. Please provide your Google Maps API key in the environment variables.',
        503
      );
      return;
    }

    const rawPlaces = await googlePlacesService.searchText({
      textQuery: query,
      latitude: lat,
      longitude: lng,
      radiusMeters: rMeters,
      maxResultCount: 20,
    });

    const targetLat = lat !== undefined ? lat : 0;
    const targetLng = lng !== undefined ? lng : 0;

    const businesses = googlePlacesService.normalizeGooglePlaces(
      rawPlaces,
      targetLat,
      targetLng,
      category,
      query
    );

    sendSuccess(
      res,
      {
        total: businesses.length,
        radius: rMeters,
        businesses,
        attribution: 'Map and place information provided by Google Maps Platform / Google Places (New).',
      },
      `Discovered ${businesses.length} places matching "${query}" via Google Places Text Search (New)`
    );
  } catch (err: any) {
    logger.error('POST /api/google/text-search error:', err?.message || err);
    sendError(
      res,
      err?.message || 'Unable to complete text search. Please check your Google Maps API configuration.',
      500,
      err?.message
    );
  }
});

/**
 * GET /api/google/geocode?address=...
 * Geocode an address, city, landmark, or PIN code
 */
router.get('/geocode', async (req: Request, res: Response): Promise<void> => {
  try {
    const address = (req.query.address as string) || (req.query.q as string) || '';
    if (!address.trim()) {
      sendSuccess(res, [], 'Empty address provided');
      return;
    }

    if (!googlePlacesService.isKeyConfigured()) {
      sendError(res, 'Google Maps Platform API key is not configured.', 503);
      return;
    }

    const results = await googlePlacesService.geocode(address);
    sendSuccess(res, results, `Geocoded ${results.length} locations for "${address}"`);
  } catch (err: any) {
    logger.error('GET /api/google/geocode error:', err?.message || err);
    sendError(res, err?.message || 'Failed to geocode address.', 500, err?.message);
  }
});

/**
 * GET /api/google/geocode/reverse?lat=...&lng=...
 * Reverse geocode latitude and longitude to formatted address
 */
router.get('/geocode/reverse', async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string || req.query.lon as string);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      sendError(res, 'Valid latitude and longitude coordinates are required.', 400);
      return;
    }

    if (!googlePlacesService.isKeyConfigured()) {
      sendError(res, 'Google Maps Platform API key is not configured.', 503);
      return;
    }

    const result = await googlePlacesService.reverseGeocode(lat, lng);
    if (!result) {
      sendSuccess(
        res,
        {
          place_id: `g_${lat}_${lng}`,
          name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          display_name: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          latitude: lat,
          longitude: lng,
          type: 'coordinate',
        },
        'Coordinate fallback generated'
      );
      return;
    }

    sendSuccess(res, result, 'Reverse geocode successful');
  } catch (err: any) {
    logger.error('GET /api/google/geocode/reverse error:', err?.message || err);
    sendError(res, err?.message || 'Failed to reverse geocode coordinates.', 500, err?.message);
  }
});

/**
 * POST /api/google/autocomplete
 * Places Autocomplete (New) for location search inputs
 */
router.post('/autocomplete', async (req: Request, res: Response): Promise<void> => {
  try {
    const { input, latitude, longitude, radius } = req.body;
    if (!input || !String(input).trim()) {
      sendSuccess(res, []);
      return;
    }

    if (!googlePlacesService.isKeyConfigured()) {
      sendError(res, 'Google Maps Platform API key is not configured.', 503);
      return;
    }

    const lat = latitude !== undefined ? parseFloat(String(latitude)) : undefined;
    const lng = longitude !== undefined ? parseFloat(String(longitude)) : undefined;
    const rMeters = radius ? parseInt(String(radius), 10) : undefined;

    const suggestions = await googlePlacesService.autocomplete({
      input: String(input).trim(),
      latitude: lat,
      longitude: lng,
      radiusMeters: rMeters,
    });

    sendSuccess(res, suggestions, `Returned ${suggestions.length} autocomplete predictions`);
  } catch (err: any) {
    logger.error('POST /api/google/autocomplete error:', err?.message || err);
    sendError(res, err?.message || 'Failed to fetch autocomplete suggestions.', 500, err?.message);
  }
});

export default router;
