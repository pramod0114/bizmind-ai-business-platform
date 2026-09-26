import { Router } from 'express';
import {
  predictSuccess,
  getModelStatus,
  predictLocationBased,
  compareLocations,
  saveLocationPrediction,
  listLocationPredictions,
  getLocationPredictionById,
  deleteLocationPrediction,
} from '../controllers/predictionController.js';
import { authenticateUser, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Existing ML Success Prediction pipeline (preserved completely)
router.post('/predict', predictSuccess);
router.get('/status', getModelStatus);

// New Feature: Location-Based Business Success Prediction
router.post('/location-based', optionalAuth, predictLocationBased);
router.post('/compare-locations', optionalAuth, compareLocations);
router.post('/save', authenticateUser, saveLocationPrediction);
router.get('/location-based', authenticateUser, listLocationPredictions);
router.get('/location-based/:id', optionalAuth, getLocationPredictionById);
router.delete('/location-based/:id', authenticateUser, deleteLocationPrediction);

export default router;
