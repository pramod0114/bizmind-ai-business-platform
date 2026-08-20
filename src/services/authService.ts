/**
 * Authentication Service for BizMind Frontend
 */
import { api, apiClient } from './api';
import { User, ApiResponse } from '../types';

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  confirm_password?: string;
  confirmPassword?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  phone?: string | null;
  profile_image?: string | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterPayload): Promise<AuthResponseData> {
    const res = await api.post<AuthResponseData>('/auth/register', data);
    if (!res.data) throw new Error(res.message || 'Registration failed');
    return res.data;
  },

  /**
   * Log in an existing user
   */
  async login(data: LoginPayload): Promise<AuthResponseData> {
    const res = await api.post<AuthResponseData>('/auth/login', data);
    if (!res.data) throw new Error(res.message || 'Login failed');
    return res.data;
  },

  /**
   * Log out the current user session
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },

  /**
   * Retrieve current authenticated user record
   */
  async getCurrentUser(): Promise<User> {
    const res = await api.get<{ user: User }>('/auth/me');
    if (!res.data?.user) throw new Error('Unauthenticated');
    return res.data.user;
  },

  /**
   * Update user profile information
   */
  async updateProfile(data: UpdateProfilePayload): Promise<User> {
    const res = await api.put<{ user: User }>('/auth/profile', data);
    if (!res.data?.user) throw new Error(res.message || 'Failed to update profile');
    return res.data.user;
  },

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordPayload): Promise<void> {
    await api.put('/auth/change-password', data);
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post('/auth/forgot-password', { email }).then((res) => res.data);
  },
};
