import { Router } from 'express';
import { createPlan, listPlans } from '../controllers/planController.js';

const router = Router();
router.post('/', createPlan);
router.get('/', listPlans);

export default router;
