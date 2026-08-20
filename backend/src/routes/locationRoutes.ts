import { Router } from 'express';
import { getCoordinatesInfo, searchLocations } from '../controllers/locationController.js';

const router = Router();
router.get('/info', getCoordinatesInfo);
router.get('/search', searchLocations);

export default router;
