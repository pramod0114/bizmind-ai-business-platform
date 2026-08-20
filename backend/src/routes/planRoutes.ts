import { Router } from 'express';
import {
  createPlan,
  listPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  analyzePlan,
  previewCalculations,
} from '../controllers/planController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// Financial calculation preview engine (public or authenticated)
router.post('/calculate', previewCalculations);

// Protected routes for Business Plans CRUD
router.use(authenticateUser);

router.post('/', createPlan);
router.get('/', listPlans);
router.get('/:id', getPlanById);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);
router.post('/:id/analyze', analyzePlan);

export default router;
