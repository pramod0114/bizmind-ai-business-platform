import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
  timestamp: string;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Operation successful',
  statusCode = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message = 'Internal server error',
  statusCode = 500,
  error?: string | Record<string, unknown>
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}
