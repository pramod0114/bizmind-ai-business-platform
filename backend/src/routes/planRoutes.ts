import { Router } from 'express';
import {
  createPlan,
  listPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  analyzePlan,
  previewCalculations,
  duplicatePlan,
  calculatePlanMetrics,
  getFinancialAnalysis,
  get12MonthProjection,
  getScenarioAnalysis,
  calculateCustomScenarios,
  getSensitivityAnalysis,
} from '../controllers/planController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// Financial calculation preview engine (public or authenticated)
router.post('/calculate', previewCalculations);

// Protected routes for Business Plans CRUD and Financial Feasibility
router.use(authenticateUser);

router.post('/', createPlan);
router.get('/', listPlans);
router.get('/:id', getPlanById);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

// Section 26 endpoints
router.post('/:id/calculate', calculatePlanMetrics);
router.get('/:id/financial-analysis', getFinancialAnalysis);
router.get('/:id/projection', get12MonthProjection);
router.get('/:id/scenarios', getScenarioAnalysis);
router.post('/:id/scenarios/calculate', calculateCustomScenarios);
router.get('/:id/sensitivity', getSensitivityAnalysis);
router.post('/:id/duplicate', duplicatePlan);
router.post('/:id/analyze', analyzePlan);

export default router;
