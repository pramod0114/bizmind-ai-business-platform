import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createApp } from './backend/src/app.js';
import { logger } from './backend/src/utils/logger.js';
import { errorHandler } from './backend/src/middleware/errorHandler.js';

async function startServer() {
  const app = createApp();
  const PORT = 3000;

  // Vite middleware for development or static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    logger.info('Vite development middleware mounted');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use((await import('express')).default.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    logger.info('Production static file handler configured');
  }

  // Global Error Handler
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`BizMind Full-Stack Server running at http://0.0.0.0:${PORT}`);
    logger.info(`Health check available at http://0.0.0.0:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
