import { Router } from 'express';
import { getMarketTrends, getMarketIndustries, analyzeCompetitors } from '../controllers/marketController.js';

const router = Router();
router.get('/trends', getMarketTrends);
router.get('/industries', getMarketIndustries);
router.post('/competitors/analyze', analyzeCompetitors);

export default router;
