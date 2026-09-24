import { Router } from 'express';
import {
  calculateMarketAnalysis,
  createMarketAnalysis,
  listMarketAnalyses,
  getMarketAnalysisById,
  getMarketAnalysisByPlanId,
  getMarketCompetitors,
  getMarketSummary,
  getCategoryDistribution,
  compareLocations,
  deleteMarketAnalysis,
} from '../controllers/marketAnalysisController.js';
import { optionalAuth, authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// Calculation without saving
router.post('/calculate', optionalAuth, calculateMarketAnalysis);

// Comparison endpoint
router.post('/compare', optionalAuth, compareLocations);
router.get('/compare', optionalAuth, compareLocations);

// Saved analyses
router.get('/', optionalAuth, listMarketAnalyses);
router.post('/', optionalAuth, createMarketAnalysis);

// Plan-specific analysis retrieval
router.get('/plan/:businessPlanId', optionalAuth, getMarketAnalysisByPlanId);

// Sub-resources for an analysis (placed before :id route)
router.get('/:id/competitors', optionalAuth, getMarketCompetitors);
router.get('/:id/summary', optionalAuth, getMarketSummary);
router.get('/:id/category-distribution', optionalAuth, getCategoryDistribution);
router.get('/:id/comparison', optionalAuth, compareLocations);

// Single analysis operations
router.get('/:id', optionalAuth, getMarketAnalysisById);
router.delete('/:id', optionalAuth, deleteMarketAnalysis);

export default router;
