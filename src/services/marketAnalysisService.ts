import { api } from './api';
import {
  MarketAnalysisData,
  MarketCompetitor,
  LocationComparisonResponse,
} from '../types';

export interface CalculateMarketParams {
  businessIdea: string;
  businessCategory?: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  locationName: string;
  address?: string;
}

export interface SaveMarketAnalysisParams extends CalculateMarketParams {
  businessPlanId?: number | string | null;
  locationAnalysisId?: number | string | null;
  city?: string | null;
}

export interface CompareLocationsParams {
  businessIdea: string;
  businessCategory?: string;
  radiusKm?: number;
  locations: Array<{
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
  }>;
}

class MarketAnalysisService {
  /**
   * Calculate live market and competition metrics on backend
   */
  async calculate(params: CalculateMarketParams): Promise<MarketAnalysisData> {
    const res = await api.post<MarketAnalysisData>('/market-analysis/calculate', params);
    return res.data;
  }

  /**
   * Persist a completed market analysis to the database
   */
  async save(params: SaveMarketAnalysisParams): Promise<MarketAnalysisData> {
    const res = await api.post<MarketAnalysisData>('/market-analysis', params);
    return res.data;
  }

  /**
   * List all saved market analyses for current user
   */
  async list(): Promise<any[]> {
    const res = await api.get<any[]>('/market-analysis');
    return res.data || [];
  }

  /**
   * Retrieve a saved market analysis by ID
   */
  async getById(id: number | string): Promise<MarketAnalysisData> {
    const res = await api.get<MarketAnalysisData>(`/market-analysis/${id}`);
    return res.data;
  }

  /**
   * Retrieve market analysis linked to a specific business plan
   */
  async getByPlanId(planId: number | string): Promise<MarketAnalysisData | null> {
    try {
      const res = await api.get<MarketAnalysisData>(`/market-analysis/plan/${planId}`);
      return res.data;
    } catch {
      return null;
    }
  }

  /**
   * Get competitor list for a specific analysis
   */
  async getCompetitors(id: number | string): Promise<MarketCompetitor[]> {
    const res = await api.get<MarketCompetitor[]>(`/market-analysis/${id}/competitors`);
    return res.data || [];
  }

  /**
   * Delete a saved market analysis
   */
  async delete(id: number | string): Promise<boolean> {
    const res = await api.delete<{ id: number | string }>(`/market-analysis/${id}`);
    return res.success;
  }

  /**
   * Compare 2 to 4 locations side-by-side
   */
  async compare(params: CompareLocationsParams): Promise<LocationComparisonResponse> {
    const res = await api.post<LocationComparisonResponse>('/market-analysis/compare', params);
    return res.data;
  }
}

export const marketAnalysisService = new MarketAnalysisService();
