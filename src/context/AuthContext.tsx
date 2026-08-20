/**
 * Centralized Authentication Context and Provider for BizMind
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import {
  authService,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '../services/authService';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<User>;
  changePassword: (data: ChangePasswordPayload) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'bizmind_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(
    user && (user.role === 'ADMIN' || user.role === 'admin')
  );

  /**
   * Fetch current authenticated user record on mount or token change
   */
  const loadUser = useCallback(async (savedToken: string) => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.warn('Session verification failed, clearing auth cache:', err);
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      loadUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, [loadUser]);

  /**
   * User login
   */
  const login = async (credentials: LoginPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem(TOKEN_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * User registration
   */
  const register = async (payload: RegisterPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.register(payload);
      localStorage.setItem(TOKEN_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * User logout
   */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  };

  /**
   * Update profile
   */
  const updateProfile = async (data: UpdateProfilePayload): Promise<User> => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
    return updated;
  };

  /**
   * Change password
   */
  const changePassword = async (data: ChangePasswordPayload): Promise<void> => {
    await authService.changePassword(data);
  };

  /**
   * Refresh current user from server
   */
  const refreshUser = async (): Promise<void> => {
    if (!token) return;
    try {
      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
    } catch {
      // Ignored
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
