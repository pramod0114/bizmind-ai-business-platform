import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
}
