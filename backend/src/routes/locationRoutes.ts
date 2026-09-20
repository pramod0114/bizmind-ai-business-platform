import { Router } from 'express';
import {
  geocodeLocation,
  reverseGeocodeLocation,
  ipLocate,
  getNearbyBusinesses,
  analyzeLocation,
  saveLocationAnalysis,
  listLocationAnalyses,
  getLocationAnalysisById,
  deleteLocationAnalysis,
  saveBusiness,
  listSavedBusinesses,
  deleteSavedBusiness,
  getLocationAdminStats,
} from '../controllers/locationController.js';
import { authenticateUser, optionalAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public / User Geocoding and OSM Discovery endpoints
router.get('/geocode', geocodeLocation);
router.get('/search', geocodeLocation);
router.get('/reverse-geocode', reverseGeocodeLocation);
router.get('/ip-locate', ipLocate);
router.get('/nearby-businesses', getNearbyBusinesses);
router.post('/analyze', analyzeLocation);

// User Saved Analyses & Saved Businesses (Supports authenticated user or guest session)
router.post('/analyses', optionalAuth, saveLocationAnalysis);
router.get('/analyses', optionalAuth, listLocationAnalyses);
router.get('/analyses/:id', optionalAuth, getLocationAnalysisById);
router.delete('/analyses/:id', optionalAuth, deleteLocationAnalysis);

router.post('/saved-businesses', optionalAuth, saveBusiness);
router.get('/saved-businesses', optionalAuth, listSavedBusinesses);
router.delete('/saved-businesses/:id', optionalAuth, deleteSavedBusiness);

// Admin-only aggregated stats
router.get('/admin/stats', authenticateUser, requireAdmin, getLocationAdminStats);

export default router;
