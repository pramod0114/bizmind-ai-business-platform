import { api } from './api';
import { SystemHealth } from '../types';

export const healthService = {
  getSystemHealth: async (): Promise<SystemHealth> => {
    const res = await api.get<SystemHealth>('/health');
    if (!res.data) {
      throw new Error('No health payload returned');
    }
    return res.data;
  },
};
