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
   * Discover real businesses within radius from OpenStreetMap Overpass
   */
  getNearbyBusinesses: async (
    lat: number,
    lng: number,
    radius: number = 2000
  ): Promise<{ total: number; radius: number; businesses: DiscoveredBusiness[]; attribution: string }> => {
    try {
      const response = await api.get<{
        total: number;
        radius: number;
        businesses: DiscoveredBusiness[];
        attribution: string;
      }>(`/location/nearby-businesses?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response.data || { total: 0, radius, businesses: [], attribution: '© OpenStreetMap contributors' };
    } catch (err) {
      console.error('getNearbyBusinesses error:', err);
      return { total: 0, radius, businesses: [], attribution: '© OpenStreetMap contributors' };
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
    address: string;
    latitude: number;
    longitude: number;
    radius: number;
    business_count: number;
    category_summary: Record<string, number>;
    competition_level: 'LOW' | 'MEDIUM' | 'HIGH';
    opportunity_score: number;
    business_name?: string | null;
    business_category?: string | null;
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
};
