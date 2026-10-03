/**
 * BizMind – Google Maps Platform & Places API (New) Routes
 * Dedicated endpoints for secure server-side Google Maps Platform integrations.
 */
import { Router, Request, Response } from 'express';
import { googlePlacesService } from '../services/googlePlacesService.js';
import { locationService } from '../services/locationService.js';
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
 * Search nearby businesses using Places API (New) Nearby Search with spatial engine fallback
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

    let businesses: any[] = [];
    let attribution = 'Map and place information provided by Google Maps Platform / Google Places (New).';

    if (googlePlacesService.isKeyConfigured()) {
      try {
        const placeTypes = googlePlacesService.mapCategoryToGoogleTypes(businessType || category || businessIdea);
        const rawPlaces = await googlePlacesService.searchNearby({
          latitude: lat,
          longitude: lng,
          radiusMeters: rMeters,
          placeTypes,
          maxResultCount: 20,
        });

        businesses = googlePlacesService.normalizeGooglePlaces(
          rawPlaces,
          lat,
          lng,
          category || businessType,
          businessIdea
        );
      } catch (err: any) {
        logger.info('Google Places searchNearby unavailable, falling back to spatial engine:', err?.message || err);
      }
    }

    if (!businesses || businesses.length === 0) {
      try {
        businesses = await locationService.getNearbyBusinesses(
          lat,
          lng,
          rMeters,
          undefined,
          category || businessType,
          businessIdea
        );
        attribution = 'Place and business data provided by OpenStreetMap contributors.';
      } catch (err: any) {
        logger.info('Spatial engine getNearbyBusinesses fallback notice:', err?.message || err);
      }
    }

    sendSuccess(
      res,
      {
        total: (businesses || []).length,
        radius: rMeters,
        businesses: businesses || [],
        attribution,
      },
      `Discovered ${(businesses || []).length} places`
    );
  } catch (err: any) {
    logger.error('POST /api/google/nearby error:', err?.message || err);
    sendError(
      res,
      err?.message || 'Unable to load nearby businesses.',
      500,
      err?.message
    );
  }
});

/**
 * POST /api/google/text-search
 * Search places by freeform business idea or text query using Places API (New) Text Search with spatial fallback
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

    let businesses: any[] = [];
    let attribution = 'Map and place information provided by Google Maps Platform / Google Places (New).';

    if (googlePlacesService.isKeyConfigured()) {
      try {
        const rawPlaces = await googlePlacesService.searchText({
          textQuery: query,
          latitude: lat,
          longitude: lng,
          radiusMeters: rMeters,
          maxResultCount: 20,
        });

        const targetLat = lat !== undefined ? lat : 0;
        const targetLng = lng !== undefined ? lng : 0;

        businesses = googlePlacesService.normalizeGooglePlaces(
          rawPlaces,
          targetLat,
          targetLng,
          category,
          query
        );
      } catch (err: any) {
        logger.info('Google Places searchText unavailable, falling back to spatial engine:', err?.message || err);
      }
    }

    if (!businesses || businesses.length === 0) {
      try {
        businesses = await locationService.getNearbyBusinesses(
          lat || 0,
          lng || 0,
          rMeters,
          undefined,
          category,
          query
        );
        attribution = 'Place and business data provided by OpenStreetMap contributors.';
      } catch (err: any) {
        logger.info('Spatial engine fallback notice in text-search:', err?.message || err);
      }
    }

    sendSuccess(
      res,
      {
        total: (businesses || []).length,
        radius: rMeters,
        businesses: businesses || [],
        attribution,
      },
      `Discovered ${(businesses || []).length} places matching "${query}"`
    );
  } catch (err: any) {
    logger.error('POST /api/google/text-search error:', err?.message || err);
    sendError(
      res,
      err?.message || 'Unable to complete text search.',
      500,
      err?.message
    );
  }
});

/**
 * GET /api/google/geocode?address=...
 * Geocode an address, city, landmark, or PIN code with spatial fallback
 */
router.get('/geocode', async (req: Request, res: Response): Promise<void> => {
  try {
    const address = (req.query.address as string) || (req.query.q as string) || '';
    if (!address.trim()) {
      sendSuccess(res, [], 'Empty address provided');
      return;
    }

    let results: any[] = [];

    if (googlePlacesService.isKeyConfigured()) {
      try {
        results = await googlePlacesService.geocode(address);
      } catch (err: any) {
        logger.info('Google geocode API unavailable, using spatial engine fallback:', err?.message || err);
      }
    }

    if (!results || results.length === 0) {
      try {
        results = await locationService.searchLocations(address);
      } catch (err: any) {
        logger.info('Spatial engine searchLocations fallback notice:', err?.message || err);
      }
    }

    sendSuccess(res, results || [], `Geocoded ${(results || []).length} locations for "${address}"`);
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

    let result = null;
    if (googlePlacesService.isKeyConfigured()) {
      try {
        result = await googlePlacesService.reverseGeocode(lat, lng);
      } catch (err: any) {
        logger.info('Google reverseGeocode notice, delegating to spatial engine:', err?.message || err);
      }
    }

    if (!result) {
      try {
        result = await locationService.reverseGeocode(lat, lng);
      } catch (err: any) {
        logger.info('Spatial engine reverseGeocode notice:', err?.message || err);
      }
    }

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
 * Places Autocomplete (New) for location search inputs with spatial fallback
 */
router.post('/autocomplete', async (req: Request, res: Response): Promise<void> => {
  try {
    const { input, latitude, longitude, radius } = req.body;
    const trimmedInput = String(input || '').trim();
    if (!trimmedInput) {
      sendSuccess(res, []);
      return;
    }

    const lat = latitude !== undefined ? parseFloat(String(latitude)) : undefined;
    const lng = longitude !== undefined ? parseFloat(String(longitude)) : undefined;
    const rMeters = radius ? parseInt(String(radius), 10) : undefined;

    let suggestions: any[] = [];

    if (googlePlacesService.isKeyConfigured()) {
      try {
        suggestions = await googlePlacesService.autocomplete({
          input: trimmedInput,
          latitude: lat,
          longitude: lng,
          radiusMeters: rMeters,
        });
      } catch (err: any) {
        logger.info('Google autocomplete unavailable, using spatial engine fallback:', err?.message || err);
      }
    }

    if (!suggestions || suggestions.length === 0) {
      try {
        const places = await locationService.searchLocations(trimmedInput);
        suggestions = places.map((p) => ({
          placeId: String(p.place_id || ''),
          description: p.display_name,
          mainText: p.name,
          secondaryText: p.display_name,
        }));
      } catch (err: any) {
        logger.info('Spatial engine autocomplete fallback notice:', err?.message || err);
      }
    }

    sendSuccess(res, suggestions || [], `Returned ${(suggestions || []).length} autocomplete predictions`);
  } catch (err: any) {
    logger.error('POST /api/google/autocomplete error:', err?.message || err);
    sendError(res, err?.message || 'Failed to fetch autocomplete suggestions.', 500, err?.message);
  }
});

export default router;
