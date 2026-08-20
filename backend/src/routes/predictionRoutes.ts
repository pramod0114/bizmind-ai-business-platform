import { Router } from 'express';
import { predictSuccess, getModelStatus } from '../controllers/predictionController.js';

const router = Router();
router.post('/predict', predictSuccess);
router.get('/status', getModelStatus);

export default router;
