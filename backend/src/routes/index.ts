import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import businessRoutes from './businessRoutes.js';
import marketRoutes from './marketRoutes.js';
import marketAnalysisRoutes from './marketAnalysisRoutes.js';
import locationRoutes from './locationRoutes.js';
import planRoutes from './planRoutes.js';
import predictionRoutes from './predictionRoutes.js';
import reportRoutes from './reportRoutes.js';
import adminRoutes from './adminRoutes.js';
import googleRoutes from './googleRoutes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/google', googleRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/businesses', businessRoutes);
router.use('/market', marketRoutes);
router.use('/market-analysis', marketAnalysisRoutes);
router.use('/location', locationRoutes);
router.use('/locations', locationRoutes);
router.use('/plans', planRoutes);
router.use('/business-plans', planRoutes);
router.use('/predictions', predictionRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

export default router;
