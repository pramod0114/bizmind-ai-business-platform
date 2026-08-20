import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[API Error] ${req.method} ${req.originalUrl}: ${message}`, err.stack);

  sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined);
}
