import { api } from './api';
import {
  GeoLocationResult,
  DiscoveredBusiness,
  LocationAnalysisResult,
  SavedLocationAnalysis,
  SavedBusiness,
  LocationAdminStats,
} from '../types';

export const locationApiService = {
  /**
   * Search locations by query or PIN code using OpenStreetMap Nominatim
   */
  searchLocations: async (query: string): Promise<GeoLocationResult[]> => {
    try {
      const response = await api.get<GeoLocationResult[]>(`/location/geocode?q=${encodeURIComponent(query)}`);
      return response.data || [];
    } catch (err) {
      console.error('searchLocations error:', err);
      return [];
    }
  },

  /**
   * Reverse geocode latitude and longitude to address
   */
  reverseGeocode: async (lat: number, lng: number): Promise<GeoLocationResult | null> => {
    try {
      const response = await api.get<GeoLocationResult>(`/location/reverse-geocode?lat=${lat}&lng=${lng}`);
      return response.data || null;
    } catch (err) {
      console.error('reverseGeocode error:', err);
      return null;
    }
  },

  /**
   * IP Geolocation fallback when browser GPS is blocked/denied in iframe
   */
  ipLocate: async (): Promise<{
    name: string;
    display_name: string;
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    country?: string;
    source?: string;
  }> => {
    // Try direct client ip lookup first for true client device IP
    try {
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.latitude && json.longitude) {
          const city = json.city || json.region || 'Detected Location';
          const state = json.region || '';
          const country = json.country || '';
          return {
            name: state ? `${city}, ${state}` : city,
            display_name: `${city}, ${state}, ${country}`,
            latitude: parseFloat(json.latitude),
            longitude: parseFloat(json.longitude),
            city,
            state,
            country,
            source: 'ip-direct',
          };
        }
      }
    } catch {
      // ignore, proceed to backend fallback
    }

    try {
      const response = await api.get<any>('/location/ip-locate');
      if (response.data && response.data.latitude) {
        return response.data;
      }
    } catch (err) {
      console.error('ipLocate backend error:', err);
    }

    return {
      name: 'Indiranagar, Bengaluru',
      display_name: 'Indiranagar, 100 Feet Road, Bengaluru, Karnataka, 560038, India',
      latitude: 12.9784,
      longitude: 77.6408,
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      source: 'fallback',
    };
  },

  /**
   * Discover real businesses within radius from Google Places API (New) / fallback
   */
  getNearbyBusinesses: async (
    lat: number,
    lng: number,
    radius: number = 2000,
    areaName?: string,
    category?: string,
    businessIdea?: string
  ): Promise<{ total: number; radius: number; businesses: DiscoveredBusiness[]; attribution: string }> => {
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        radius: String(radius),
      });
      if (areaName) params.append('areaName', areaName);
      if (category) params.append('category', category);
      if (businessIdea) params.append('businessIdea', businessIdea);

      const response = await api.get<{
        total: number;
        radius: number;
        businesses: DiscoveredBusiness[];
        attribution: string;
      }>(`/location/nearby-businesses?${params.toString()}`);
      return response.data || { total: 0, radius, businesses: [], attribution: 'Google Maps Platform / Google Places' };
    } catch (err) {
      console.error('getNearbyBusinesses error:', err);
      return { total: 0, radius, businesses: [], attribution: 'Google Maps Platform / Google Places' };
    }
  },

  /**
   * Direct Google Places API (New) Nearby Search
   */
  googleNearby: async (params: {
    latitude: number;
    longitude: number;
    radius?: number;
    category?: string;
    businessType?: string;
    businessIdea?: string;
  }): Promise<{ total: number; radius: number; businesses: DiscoveredBusiness[]; attribution: string }> => {
    const response = await api.post<{
      total: number;
      radius: number;
      businesses: DiscoveredBusiness[];
      attribution: string;
    }>('/google/nearby', params);
    return response.data;
  },

  /**
   * Direct Google Places API (New) Text Search
   */
  googleTextSearch: async (params: {
    textQuery: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    category?: string;
  }): Promise<{ total: number; radius: number; businesses: DiscoveredBusiness[]; attribution: string }> => {
    const response = await api.post<{
      total: number;
      radius: number;
      businesses: DiscoveredBusiness[];
      attribution: string;
    }>('/google/text-search', params);
    return response.data;
  },

  /**
   * Direct Google Geocode API
   */
  googleGeocode: async (address: string): Promise<GeoLocationResult[]> => {
    const response = await api.get<GeoLocationResult[]>(`/google/geocode?address=${encodeURIComponent(address)}`);
    return response.data || [];
  },

  /**
   * Direct Google Places Autocomplete API
   */
  googleAutocomplete: async (params: {
    input: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }): Promise<{ placeId: string; description: string; mainText: string; secondaryText: string }[]> => {
    const response = await api.post<{ placeId: string; description: string; mainText: string; secondaryText: string }[]>(
      '/google/autocomplete',
      params
    );
    return response.data || [];
  },

  /**
   * Check if Google Maps Platform backend is active
   */
  getGoogleConfig: async (): Promise<{ configured: boolean; provider: string; features: string[] }> => {
    try {
      const response = await api.get<{ configured: boolean; provider: string; features: string[] }>('/google/config');
      return response.data;
    } catch {
      return { configured: false, provider: 'Google Maps Platform', features: [] };
    }
  },

  /**
   * Complete spatial intelligence analysis
   */
  analyzeLocation: async (params: {
    latitude: number;
    longitude: number;
    radius?: number;
    businessName?: string;
    businessCategory?: string;
  }): Promise<LocationAnalysisResult> => {
    const response = await api.post<LocationAnalysisResult>('/location/analyze', params);
    return response.data;
  },

  /**
   * Save a location analysis to user's history
   */
  saveLocationAnalysis: async (data: {
    location_name: string;
    city?: string | null;
    address: string;
    latitude: number;
    longitude: number;
    business_idea?: string | null;
    business_category?: string | null;
    radius_km?: number;
    radius?: number;
    total_businesses?: number;
    business_count?: number;
    relevant_businesses?: number;
    business_density?: number;
    average_relevant_distance?: string | number | null;
    concentration_level?: string;
    category_summary?: Record<string, number> | string;
    competition_level?: 'LOW' | 'MEDIUM' | 'HIGH' | string;
    opportunity_score?: number;
    business_name?: string | null;
  }): Promise<SavedLocationAnalysis> => {
    const response = await api.post<SavedLocationAnalysis>('/location/analyses', data);
    return response.data;
  },

  /**
   * List saved location analyses for current user
   */
  listLocationAnalyses: async (): Promise<SavedLocationAnalysis[]> => {
    try {
      const response = await api.get<SavedLocationAnalysis[]>('/location/analyses');
      return response.data || [];
    } catch (err) {
      console.error('listLocationAnalyses error:', err);
      return [];
    }
  },

  /**
   * Get single location analysis by ID
   */
  getLocationAnalysisById: async (id: number | string): Promise<SavedLocationAnalysis> => {
    const response = await api.get<SavedLocationAnalysis>(`/location/analyses/${id}`);
    return response.data;
  },

  /**
   * Delete saved location analysis
   */
  deleteLocationAnalysis: async (id: number | string): Promise<void> => {
    await api.delete(`/location/analyses/${id}`);
  },

  /**
   * Save a single business to bookmarked list
   */
  saveBusiness: async (data: {
    osm_id: string | number;
    business_name: string;
    category: string;
    latitude: number;
    longitude: number;
    address?: string | null;
    phone?: string | null;
    website?: string | null;
    opening_hours?: string | null;
    brand?: string | null;
    cuisine?: string | null;
    distance_meters?: number | null;
  }): Promise<SavedBusiness> => {
    const response = await api.post<SavedBusiness>('/location/saved-businesses', data);
    return response.data;
  },

  /**
   * List saved businesses
   */
  listSavedBusinesses: async (): Promise<SavedBusiness[]> => {
    try {
      const response = await api.get<SavedBusiness[]>('/location/saved-businesses');
      return response.data || [];
    } catch (err) {
      console.error('listSavedBusinesses error:', err);
      return [];
    }
  },

  /**
   * Delete saved business
   */
  deleteSavedBusiness: async (id: number | string): Promise<void> => {
    await api.delete(`/location/saved-businesses/${id}`);
  },

  /**
   * Admin stats
   */
  getAdminStats: async (): Promise<LocationAdminStats> => {
    const response = await api.get<LocationAdminStats>('/location/admin/stats');
    return response.data;
  },

  /**
   * Alias for listSavedBusinesses
   */
  getSavedBusinesses: async (): Promise<SavedBusiness[]> => {
    return locationApiService.listSavedBusinesses();
  },
};

export const locationService = locationApiService;

