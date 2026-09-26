import express, { Express } from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { config } from './config/env.js';
import { googlePlacesService } from './services/googlePlacesService.js';

export function createApp(): Express {
  const app = express();

  // Basic Security & Middlewares
  app.use(cors({
    origin: '*',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Capture client referer/origin for Google Maps Platform authorization
  app.use((req, _res, next) => {
    const referer =
      (req.headers.referer as string) ||
      (req.headers.origin as string) ||
      (req.headers.host ? `https://${req.headers.host}/` : undefined);
    if (referer) {
      googlePlacesService.setRequestContext(referer);
    }
    next();
  });

  // Mount API Routes
  app.use('/api', apiRoutes);

  return app;
}
