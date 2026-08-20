import { Router } from 'express';
import { getCategories, listBusinesses, getBusinessById } from '../controllers/businessController.js';

const router = Router();
router.get('/categories', getCategories);
router.get('/', listBusinesses);
router.get('/:id', getBusinessById);

export default router;
