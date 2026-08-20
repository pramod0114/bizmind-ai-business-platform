import { Router } from 'express';
import { getMarketTrends, analyzeCompetitors } from '../controllers/marketController.js';

const router = Router();
router.get('/trends', getMarketTrends);
router.post('/competitors/analyze', analyzeCompetitors);

export default router;
