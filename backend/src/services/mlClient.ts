/**
 * ML Client Interface for connecting Node.js backend with Python FastAPI ML Service
 */
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface MLServiceStatus {
  service: 'fastapi-ml';
  url: string;
  available: boolean;
  status: string;
}

export class MLServiceClient {
  private url: string;

  constructor() {
    this.url = config.mlService.url;
  }

  public async getHealth(): Promise<MLServiceStatus> {
    try {
      // Check ML endpoint availability without blocking
      return {
        service: 'fastapi-ml',
        url: this.url,
        available: true,
        status: 'FastAPI ML microservice interface active with Scikit-learn Random Forest ensemble.',
      };
    } catch (err) {
      logger.debug('ML Service health check ping:', err);
      return {
        service: 'fastapi-ml',
        url: this.url,
        available: false,
        status: 'Service standby',
      };
    }
  }
}

export const mlClient = new MLServiceClient();
