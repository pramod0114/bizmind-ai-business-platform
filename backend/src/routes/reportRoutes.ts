import { Router } from 'express';
import { generateReport, listReports } from '../controllers/reportController.js';

const router = Router();
router.post('/generate', generateReport);
router.get('/', listReports);

export default router;
