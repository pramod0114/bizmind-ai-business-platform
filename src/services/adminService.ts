/**
 * BizMind – Admin API Client Service
 * Strictly requires ADMIN authenticated session (verified on backend)
 */
import { apiClient } from './api';
import {
  AdminSystemStats,
  User,
  BusinessDataset,
  MarketDataset,
  MLModel,
  SystemAnalytics,
  AuditLog,
  PlatformSettings,
  ApiResponse,
} from '../types';

export const adminService = {
  /**
   * Fetch platform-wide overview statistics
   */
  getStats: async (): Promise<AdminSystemStats> => {
    const res = await apiClient.get<ApiResponse<AdminSystemStats>>('/admin/stats');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch admin stats');
    }
    return res.data.data;
  },

  /**
   * Fetch full user registry
   */
  getUsers: async (): Promise<User[]> => {
    const res = await apiClient.get<ApiResponse<User[]>>('/admin/users');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch user list');
    }
    return res.data.data;
  },

  /**
   * Create a new user account via admin console
   */
  createUser: async (payload: {
    full_name: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
    phone?: string;
  }): Promise<User> => {
    const res = await apiClient.post<ApiResponse<User>>('/admin/users', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to create user');
    }
    return res.data.data;
  },

  /**
   * Toggle user active/suspended status
   */
  updateUserStatus: async (userId: number | string, is_active: boolean): Promise<void> => {
    const res = await apiClient.put<ApiResponse<any>>(`/admin/users/${userId}/status`, { is_active });
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to update user status');
    }
  },

  /**
   * Change user role between USER and ADMIN
   */
  updateUserRole: async (userId: number | string, role: 'USER' | 'ADMIN'): Promise<void> => {
    const res = await apiClient.put<ApiResponse<any>>(`/admin/users/${userId}/role`, { role });
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to update user role');
    }
  },

  /**
   * Permanently delete user
   */
  deleteUser: async (userId: number | string): Promise<void> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/admin/users/${userId}`);
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to delete user');
    }
  },

  /**
   * Fetch business benchmark datasets
   */
  getBusinesses: async (): Promise<BusinessDataset[]> => {
    const res = await apiClient.get<ApiResponse<BusinessDataset[]>>('/admin/businesses');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch business benchmarks');
    }
    return res.data.data;
  },

  /**
   * Create business benchmark dataset
   */
  createBusiness: async (payload: Partial<BusinessDataset>): Promise<BusinessDataset> => {
    const res = await apiClient.post<ApiResponse<BusinessDataset>>('/admin/businesses', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to create business benchmark');
    }
    return res.data.data;
  },

  /**
   * Update business benchmark dataset
   */
  updateBusiness: async (id: number, payload: Partial<BusinessDataset>): Promise<BusinessDataset> => {
    const res = await apiClient.put<ApiResponse<BusinessDataset>>(`/admin/businesses/${id}`, payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to update business benchmark');
    }
    return res.data.data;
  },

  /**
   * Delete business benchmark dataset
   */
  deleteBusiness: async (id: number): Promise<void> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/admin/businesses/${id}`);
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to delete business benchmark');
    }
  },

  /**
   * Fetch market datasets
   */
  getMarketData: async (): Promise<MarketDataset[]> => {
    const res = await apiClient.get<ApiResponse<MarketDataset[]>>('/admin/market-data');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch market datasets');
    }
    return res.data.data;
  },

  /**
   * Create market dataset
   */
  createMarketData: async (payload: Partial<MarketDataset>): Promise<MarketDataset> => {
    const res = await apiClient.post<ApiResponse<MarketDataset>>('/admin/market-data', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to create market dataset');
    }
    return res.data.data;
  },

  /**
   * Update market dataset
   */
  updateMarketData: async (id: string, payload: Partial<MarketDataset>): Promise<MarketDataset> => {
    const res = await apiClient.put<ApiResponse<MarketDataset>>(`/admin/market-data/${id}`, payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to update market dataset');
    }
    return res.data.data;
  },

  /**
   * Delete market dataset
   */
  deleteMarketData: async (id: string): Promise<void> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/admin/market-data/${id}`);
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to delete market dataset');
    }
  },

  /**
   * Fetch ML models and monitoring telemetry
   */
  getMLModels: async (): Promise<MLModel[]> => {
    const res = await apiClient.get<ApiResponse<MLModel[]>>('/admin/ml-models');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch ML models');
    }
    return res.data.data;
  },

  /**
   * Trigger retraining on an ML model
   */
  retrainModel: async (modelId: string): Promise<MLModel> => {
    const res = await apiClient.post<ApiResponse<MLModel>>(`/admin/ml-models/${modelId}/retrain`, {});
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to retrain model');
    }
    return res.data.data;
  },

  /**
   * Fetch system-wide analytics
   */
  getAnalytics: async (): Promise<SystemAnalytics> => {
    const res = await apiClient.get<ApiResponse<SystemAnalytics>>('/admin/analytics');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch analytics');
    }
    return res.data.data;
  },

  /**
   * Fetch audit logs
   */
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await apiClient.get<ApiResponse<AuditLog[]>>('/admin/audit-logs');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch audit logs');
    }
    return res.data.data;
  },

  /**
   * Fetch platform settings
   */
  getSettings: async (): Promise<PlatformSettings> => {
    const res = await apiClient.get<ApiResponse<PlatformSettings>>('/admin/settings');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch settings');
    }
    return res.data.data;
  },

  /**
   * Update platform settings
   */
  updateSettings: async (settings: Partial<PlatformSettings>): Promise<PlatformSettings> => {
    const res = await apiClient.put<ApiResponse<PlatformSettings>>('/admin/settings', settings);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to update settings');
    }
    return res.data.data;
  },
};
