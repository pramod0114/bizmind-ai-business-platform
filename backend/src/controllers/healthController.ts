import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';
import { db } from '../config/database.js';
import { mlClient } from '../services/mlClient.js';

export async function checkHealth(_req: Request, res: Response): Promise<void> {
  const dbStatus = db.getStatus();
  const mlStatus = await mlClient.getHealth();

  sendSuccess(res, {
    platform: 'BIZMIND AI Platform API',
    version: '1.0.0-part1',
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      api: { status: 'operational', port: process.env.PORT || 3000 },
      database: dbStatus,
      mlEngine: mlStatus,
    },
    capabilities: [
      'Business Planning Architecture',
      'Market & Location Analysis Engine',
      'Financial Modeling Pipeline',
      'ML Success Prediction Interface',
      'Leaflet/OSM Spatial Framework',
    ],
  }, 'BizMind API system operational');
}
