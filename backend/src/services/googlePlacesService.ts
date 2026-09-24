/**
 * BizMind – Google Places API (New) & Google Maps Platform Service
 * Enterprise-grade integration for Location Intelligence and Market Analysis.
 * Implements Places API (New) Nearby Search & Text Search, Geocoding, and Autocomplete.
 */
import axios from 'axios';
import { logger } from '../utils/logger.js';
import { DiscoveredBusiness, GeoLocationResult } from './locationService.js';

export interface GooglePlaceLocation {
  latitude: number;
  longitude: number;
}

export interface GooglePlaceDisplayName {
  text: string;
  languageCode?: string;
}

export interface GooglePlaceResult {
  id: string;
  displayName?: GooglePlaceDisplayName;
  formattedAddress?: string;
  location?: GooglePlaceLocation;
  primaryType?: string;
  types?: string[];
  googleMapsUri?: string;
  businessStatus?: string;
}

export interface GoogleNearbySearchResponse {
  places?: GooglePlaceResult[];
  error?: {
    code: number;
    message: string;
    status: string;
    details?: any[];
  };
}

export interface GoogleTextSearchResponse {
  places?: GooglePlaceResult[];
  error?: {
    code: number;
    message: string;
    status: string;
    details?: any[];
  };
}

// BizMind Categories to Valid Google Place Types (New - Table A)
export const BIZMIND_TO_GOOGLE_TYPES: Record<string, string[]> = {
  'Restaurant': ['restaurant', 'meal_takeaway'],
  'Cafe': ['cafe', 'coffee_shop'],
  'Bakery': ['bakery'],
  'Grocery Store': ['grocery_store', 'supermarket'],
  'Supermarket': ['supermarket', 'grocery_store'],
  'Clothing Store': ['clothing_store'],
  'Electronics Store': ['electronics_store', 'cell_phone_store'],
  'Mobile Phone Store': ['cell_phone_store', 'electronics_store'],
  'Pharmacy': ['pharmacy', 'drugstore'],
  'Salon': ['beauty_salon', 'hair_care', 'spa'],
  'Gym': ['fitness_center', 'gym'],
  'Hotel': ['hotel', 'lodging'],
  'Book Store': ['book_store'],
  'Furniture Store': ['furniture_store', 'home_goods_store'],
  'Jewelry Store': ['jewelry_store'],
  'Automotive': ['car_repair', 'car_dealer', 'gas_station'],
  'Education': ['school', 'university', 'primary_school', 'secondary_school'],
  'Healthcare': ['hospital', 'doctor', 'dentist', 'pharmacy'],
  'Food & Beverage': ['restaurant', 'cafe', 'bakery', 'meal_takeaway'],
  'Retail': ['clothing_store', 'convenience_store', 'department_store', 'electronics_store', 'supermarket'],
  'Fitness': ['fitness_center', 'gym'],
  'Services': ['beauty_salon', 'laundry', 'hair_care', 'car_repair', 'bank'],
  'Other': ['restaurant', 'cafe', 'grocery_store', 'supermarket', 'clothing_store', 'pharmacy', 'bakery', 'hotel', 'bank'],
};

export class GooglePlacesService {
  private static instance: GooglePlacesService;

  private constructor() {}

  public static getInstance(): GooglePlacesService {
    if (!GooglePlacesService.instance) {
      GooglePlacesService.instance = new GooglePlacesService();
    }
    return GooglePlacesService.instance;
  }

  /**
   * Resolve configured API Key (server key or browser key)
   */
  public getApiKey(): string {
    const key =
      process.env.GOOGLE_MAPS_SERVER_API_KEY ||
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      'AIzaSyCrvQmobbKFWknOopoueWVcfLVwafIudTo';
    return key.trim();
  }

  public getRefererHeader(): string {
    return (
      process.env.GOOGLE_MAPS_REFERER ||
      process.env.APP_URL ||
      process.env.FRONTEND_URL ||
      'https://ais-dev-crjer53efpls76wjmvho7f-957983741381.asia-southeast1.run.app/'
    );
  }

  public isKeyConfigured(): boolean {
    const key = this.getApiKey();
    return key.length > 5 && !key.includes('YOUR_');
  }

  /**
   * Map a BizMind category or keyword to primary Google Place types
   */
  public mapCategoryToGoogleTypes(category?: string): string[] {
    const defaultTypes = ['restaurant', 'cafe', 'grocery_store', 'supermarket', 'clothing_store', 'pharmacy', 'bakery', 'hotel', 'bank'];
    if (!category) return defaultTypes;
    const trimmed = category.trim();

    // Direct dictionary match
    if (BIZMIND_TO_GOOGLE_TYPES[trimmed]) {
      return BIZMIND_TO_GOOGLE_TYPES[trimmed];
    }

    // Case-insensitive match
    const lower = trimmed.toLowerCase();
    for (const [key, types] of Object.entries(BIZMIND_TO_GOOGLE_TYPES)) {
      if (key.toLowerCase() === lower || lower.includes(key.toLowerCase())) {
        return types;
      }
    }

    // Specific keyword inferences
    if (lower.includes('coffee') || lower.includes('tea') || lower.includes('bistro')) return ['cafe', 'coffee_shop'];
    if (lower.includes('cake') || lower.includes('pastry') || lower.includes('bake')) return ['bakery'];
    if (lower.includes('food') || lower.includes('dine') || lower.includes('eat') || lower.includes('kitchen')) return ['restaurant'];
    if (lower.includes('repair') || lower.includes('phone') || lower.includes('tech') || lower.includes('gadget')) return ['electronics_store', 'cell_phone_store'];
    if (lower.includes('yoga') || lower.includes('workout') || lower.includes('crossfit')) return ['fitness_center', 'gym'];
    if (lower.includes('medicine') || lower.includes('drug') || lower.includes('clinic')) return ['pharmacy', 'drugstore'];
    if (lower.includes('beauty') || lower.includes('hair') || lower.includes('parlour') || lower.includes('barber')) return ['beauty_salon', 'hair_care'];

    return defaultTypes;
  }

  /**
   * Maps Google Place types to BizMind broad category group
   */
  public mapGoogleTypeToBroadCategory(types: string[] = []): DiscoveredBusiness['broadCategory'] {
    for (const t of types) {
      if (['restaurant', 'cafe', 'coffee_shop', 'bakery', 'bar', 'food', 'meal_takeaway', 'meal_delivery'].includes(t)) {
        return 'Food & Beverage';
      }
      if (
        [
          'clothing_store',
          'shoe_store',
          'jewelry_store',
          'electronics_store',
          'cell_phone_store',
          'book_store',
          'furniture_store',
          'home_goods_store',
          'supermarket',
          'grocery_store',
          'convenience_store',
          'department_store',
          'shopping_mall',
          'store',
        ].includes(t)
      ) {
        return 'Retail';
      }
      if (['hospital', 'doctor', 'dentist', 'pharmacy', 'drugstore', 'medical_lab'].includes(t)) {
        return 'Healthcare';
      }
      if (['school', 'university', 'primary_school', 'secondary_school', 'library'].includes(t)) {
        return 'Education';
      }
      if (['bank', 'atm', 'accounting'].includes(t)) {
        return 'Finance';
      }
      if (['car_repair', 'car_dealer', 'car_wash', 'gas_station', 'auto_parts_store'].includes(t)) {
        return 'Automotive';
      }
      if (['beauty_salon', 'hair_care', 'hair_salon', 'spa', 'laundry', 'locksmith', 'travel_agency'].includes(t)) {
        return 'Services';
      }
      if (['fitness_center', 'gym', 'sports_complex', 'yoga_studio'].includes(t)) {
        return 'Fitness';
      }
      if (['hotel', 'lodging', 'motel', 'resort_hotel', 'bed_and_breakfast'].includes(t)) {
        return 'Accommodation';
      }
    }
    return 'Other';
  }

  /**
   * Primary Nearby Search (New) method
   * POST https://places.googleapis.com/v1/places:searchNearby
   */
  public async searchNearby(params: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
    placeTypes?: string[];
    maxResultCount?: number;
  }): Promise<GooglePlaceResult[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Google Maps Platform API key is missing. Please configure VITE_GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_SERVER_API_KEY.');
    }

    const { latitude, longitude, radiusMeters, placeTypes = ['restaurant'], maxResultCount = 20 } = params;

    const endpoint = 'https://places.googleapis.com/v1/places:searchNearby';
    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.location',
      'places.primaryType',
      'places.types',
      'places.googleMapsUri',
      'places.businessStatus',
    ].join(',');

    const requestBody = {
      includedTypes: placeTypes,
      maxResultCount: Math.min(Math.max(maxResultCount, 1), 20),
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: Math.min(Math.max(radiusMeters, 100), 50000),
        },
      },
    };

    try {
      const response = await axios.post<GoogleNearbySearchResponse>(endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': fieldMask,
          'Referer': this.getRefererHeader(),
          'Origin': this.getRefererHeader(),
        },
        timeout: 10000,
      });

      if (response.data.error) {
        throw new Error(response.data.error.message || 'Google Places API returned an error');
      }

      return response.data.places || [];
    } catch (err: any) {
      const message = err.response?.data?.error?.message || err.message || 'Error communicating with Google Places API';
      logger.error('Google Places searchNearby failed:', message);
      throw new Error(`Google Places Nearby Search failed: ${message}`);
    }
  }

  /**
   * Text Search (New) method for flexible business ideas
   * POST https://places.googleapis.com/v1/places:searchText
   */
  public async searchText(params: {
    textQuery: string;
    latitude?: number;
    longitude?: number;
    radiusMeters?: number;
    maxResultCount?: number;
  }): Promise<GooglePlaceResult[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Google Maps Platform API key is missing. Please configure VITE_GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_SERVER_API_KEY.');
    }

    const { textQuery, latitude, longitude, radiusMeters = 2000, maxResultCount = 20 } = params;
    const endpoint = 'https://places.googleapis.com/v1/places:searchText';
    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.location',
      'places.primaryType',
      'places.types',
      'places.googleMapsUri',
      'places.businessStatus',
    ].join(',');

    const requestBody: any = {
      textQuery: textQuery.trim(),
      maxResultCount: Math.min(Math.max(maxResultCount, 1), 20),
    };

    if (latitude !== undefined && longitude !== undefined) {
      requestBody.locationBias = {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: Math.min(Math.max(radiusMeters, 100), 50000),
        },
      };
    }

    try {
      const response = await axios.post<GoogleTextSearchResponse>(endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': fieldMask,
          'Referer': this.getRefererHeader(),
          'Origin': this.getRefererHeader(),
        },
        timeout: 10000,
      });

      if (response.data.error) {
        throw new Error(response.data.error.message || 'Google Places Text Search returned an error');
      }

      return response.data.places || [];
    } catch (err: any) {
      const message = err.response?.data?.error?.message || err.message || 'Error communicating with Google Places API';
      logger.error('Google Places searchText failed:', message);
      throw new Error(`Google Places Text Search failed: ${message}`);
    }
  }

  /**
   * Google Geocoding API (Search address / city / landmark / PIN code)
   */
  public async geocode(query: string): Promise<GeoLocationResult[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Google Maps Platform API key is missing.');
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query.trim())}&key=${apiKey}`;
      const res = await axios.get(url, { timeout: 8000 });

      if (res.data.status === 'ZERO_RESULTS') {
        return [];
      }
      if (res.data.status !== 'OK' && res.data.status !== 'ZERO_RESULTS') {
        const errMsg = res.data.error_message || `Geocoding API status: ${res.data.status}`;
        throw new Error(errMsg);
      }

      const results: GeoLocationResult[] = (res.data.results || []).map((r: any, idx: number) => {
        let city = '';
        let state = '';
        let country = '';
        let postcode = '';

        for (const comp of r.address_components || []) {
          if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')) {
            city = comp.long_name;
          }
          if (comp.types.includes('administrative_area_level_1')) {
            state = comp.long_name;
          }
          if (comp.types.includes('country')) {
            country = comp.long_name;
          }
          if (comp.types.includes('postal_code')) {
            postcode = comp.long_name;
          }
        }

        return {
          place_id: r.place_id || `g_${idx}`,
          name: r.formatted_address.split(',')[0] || query,
          display_name: r.formatted_address,
          latitude: r.geometry.location.lat,
          longitude: r.geometry.location.lng,
          type: r.types?.[0] || 'geocode',
          importance: 1 - idx * 0.1,
          address: {
            city: city || undefined,
            state: state || undefined,
            country: country || undefined,
            postcode: postcode || undefined,
          },
        };
      });

      return results;
    } catch (err: any) {
      logger.error('Google Geocode error:', err?.message || err);
      throw err;
    }
  }

  /**
   * Google Reverse Geocoding API
   */
  public async reverseGeocode(lat: number, lng: number): Promise<GeoLocationResult | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Google Maps Platform API key is missing.');
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const res = await axios.get(url, { timeout: 8000 });

      if (res.data.status !== 'OK' || !res.data.results || res.data.results.length === 0) {
        return null;
      }

      const primary = res.data.results[0];
      let city = '';
      let state = '';
      let country = '';
      let postcode = '';

      for (const comp of primary.address_components || []) {
        if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')) {
          city = comp.long_name;
        }
        if (comp.types.includes('administrative_area_level_1')) {
          state = comp.long_name;
        }
        if (comp.types.includes('country')) {
          country = comp.long_name;
        }
        if (comp.types.includes('postal_code')) {
          postcode = comp.long_name;
        }
      }

      return {
        place_id: primary.place_id || `g_${lat}_${lng}`,
        name: primary.formatted_address.split(',')[0] || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        display_name: primary.formatted_address,
        latitude: primary.geometry.location.lat,
        longitude: primary.geometry.location.lng,
        type: primary.types?.[0] || 'address',
        address: {
          city: city || undefined,
          state: state || undefined,
          country: country || undefined,
          postcode: postcode || undefined,
        },
      };
    } catch (err: any) {
      logger.error('Google Reverse Geocode error:', err?.message || err);
      throw err;
    }
  }

  /**
   * Autocomplete search for any location (Sangli, Kolhapur, Pune, Mumbai, etc.)
   */
  public async autocomplete(params: {
    input: string;
    latitude?: number;
    longitude?: number;
    radiusMeters?: number;
  }): Promise<{ placeId: string; description: string; mainText: string; secondaryText: string }[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Google Maps Platform API key is missing.');
    }

    const { input, latitude, longitude, radiusMeters = 50000 } = params;
    const endpoint = 'https://places.googleapis.com/v1/places:autocomplete';

    const requestBody: any = {
      input: input.trim(),
    };

    if (latitude !== undefined && longitude !== undefined) {
      requestBody.locationBias = {
        circle: {
          center: { latitude, longitude },
          radius: Math.min(Math.max(radiusMeters, 1000), 50000),
        },
      };
    }

    try {
      const res = await axios.post(endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'Referer': this.getRefererHeader(),
          'Origin': this.getRefererHeader(),
        },
        timeout: 6000,
      });

      const suggestions = res.data?.suggestions || [];
      return suggestions.map((s: any) => {
        const pp = s.placePrediction;
        return {
          placeId: pp?.placeId || '',
          description: pp?.text?.text || '',
          mainText: pp?.structuredFormat?.mainText?.text || pp?.text?.text || '',
          secondaryText: pp?.structuredFormat?.secondaryText?.text || '',
        };
      });
    } catch (err: any) {
      logger.warn('Google Places Autocomplete failed, falling back to Geocode:', err?.message || err);
      // Fallback to Geocoding search
      const geoResults = await this.geocode(input);
      return geoResults.map((g) => ({
        placeId: String(g.place_id),
        description: g.display_name,
        mainText: g.name,
        secondaryText: g.display_name.replace(g.name, '').replace(/^,\s*/, ''),
      }));
    }
  }

  /**
   * Convert Google Place objects to BizMind DiscoveredBusiness representation with
   * true Haversine distance, proper categorizations, and competitor classifications.
   */
  public normalizeGooglePlaces(
    places: GooglePlaceResult[],
    targetLat: number,
    targetLng: number,
    targetCategory?: string,
    targetIdea?: string
  ): DiscoveredBusiness[] {
    const targetCatLower = (targetCategory || '').toLowerCase();
    const targetIdeaLower = (targetIdea || '').toLowerCase();

    return places
      .filter((p) => p.location && typeof p.location.latitude === 'number' && typeof p.location.longitude === 'number')
      .map((p) => {
        const lat = p.location!.latitude;
        const lng = p.location!.longitude;
        const distMeters = this.calculateHaversineDistance(targetLat, targetLng, lat, lng);
        const name = p.displayName?.text || 'Unnamed Establishment';
        const rawTypes = p.types || (p.primaryType ? [p.primaryType] : []);
        const broadCategory = this.mapGoogleTypeToBroadCategory(rawTypes);

        // Humanize primary category name
        let categoryDisplay = p.primaryType
          ? p.primaryType
              .split('_')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
          : broadCategory;

        // Determine if direct competitor or related business
        const nameLower = name.toLowerCase();
        const typesLower = rawTypes.map((t) => t.toLowerCase());

        let isDirectCompetitor = false;
        let isRelated = false;

        // 1. Direct Competitor Check based on category/type matching
        if (targetCatLower) {
          const matchingTypes = this.mapCategoryToGoogleTypes(targetCategory);
          const hasMatchingType = matchingTypes.some((t) => typesLower.includes(t.toLowerCase()));
          const nameMatchesCategory = nameLower.includes(targetCatLower) || targetCatLower.includes(nameLower);

          if (hasMatchingType || nameMatchesCategory) {
            isDirectCompetitor = true;
          }
        }

        // 2. Business Idea keyword matching
        if (!isDirectCompetitor && targetIdeaLower) {
          const ideaWords = targetIdeaLower.split(/\s+/).filter((w) => w.length > 2);
          const wordMatches = ideaWords.filter((w) => nameLower.includes(w) || typesLower.some((t) => t.includes(w)));
          if (wordMatches.length > 0) {
            isDirectCompetitor = true;
          }
        }

        // 3. Related Business Check
        if (!isDirectCompetitor) {
          const targetBroad = this.mapGoogleTypeToBroadCategory(this.mapCategoryToGoogleTypes(targetCategory));
          if (broadCategory === targetBroad) {
            isRelated = true;
          }
        }

        return {
          id: p.id,
          osm_id: p.id, // For backward compatibility with existing saved businesses
          name,
          category: categoryDisplay,
          broadCategory,
          latitude: lat,
          longitude: lng,
          distance_meters: distMeters,
          distance_formatted: this.formatDistance(distMeters),
          address: p.formattedAddress || null,
          phone: null,
          website: p.googleMapsUri || null,
          opening_hours: null,
          brand: null,
          cuisine: null,
          operator: null,
          email: null,
          isDirectCompetitor,
          is_direct_competitor: isDirectCompetitor,
          isRelated,
          // Google-specific attributes
          google_place_id: p.id,
          googleMapsUri: p.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
          businessStatus: p.businessStatus,
        } as DiscoveredBusiness & { google_place_id?: string; googleMapsUri?: string; businessStatus?: string };
      })
      .sort((a, b) => a.distance_meters - b.distance_meters);
  }

  /**
   * Distance calculation using Haversine formula (meters)
   */
  public calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  public formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }
}

export const googlePlacesService = GooglePlacesService.getInstance();
