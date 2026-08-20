import express, { Express } from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { config } from './config/env.js';

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

  // Mount API Routes
  app.use('/api', apiRoutes);

  return app;
}
