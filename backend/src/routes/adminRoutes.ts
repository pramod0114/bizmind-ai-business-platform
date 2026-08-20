import { Router } from 'express';
import {
  getSystemStats,
  getAdminUsersList,
  createUserByAdmin,
  updateUserStatus,
  updateUserRole,
  deleteUserByAdmin,
  getBusinessDatasets,
  createBusinessDataset,
  updateBusinessDataset,
  deleteBusinessDataset,
  getMarketDatasets,
  createMarketDataset,
  updateMarketDataset,
  deleteMarketDataset,
  getMLModels,
  retrainMLModel,
  getSystemAnalytics,
  getAuditLogs,
  getSystemSettings,
  updateSystemSettings,
} from '../controllers/adminController.js';
import { getAdminBusinessPlansOverview } from '../controllers/planController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// CRITICAL SECURITY: All admin routes strictly require valid authentication AND ADMIN role verified on the backend
router.use(authenticateUser, requireAdmin);

// System Overview Metrics
router.get('/stats', getSystemStats);

// Business Plans Telemetry Overview
router.get('/business-plans', getAdminBusinessPlansOverview);

// User Management Endpoints
router.get('/users', getAdminUsersList);
router.post('/users', createUserByAdmin);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserByAdmin);

// Business Data Management Endpoints
router.get('/businesses', getBusinessDatasets);
router.post('/businesses', createBusinessDataset);
router.put('/businesses/:id', updateBusinessDataset);
router.delete('/businesses/:id', deleteBusinessDataset);

// Market Dataset Management Endpoints
router.get('/market-data', getMarketDatasets);
router.post('/market-data', createMarketDataset);
router.put('/market-data/:id', updateMarketDataset);
router.delete('/market-data/:id', deleteMarketDataset);

// ML Management & Model Monitoring Endpoints
router.get('/ml-models', getMLModels);
router.post('/ml-models/:id/retrain', retrainMLModel);

// System-wide Analytics
router.get('/analytics', getSystemAnalytics);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// System Settings / Platform Configuration
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

export default router;

