import { Router } from 'express';
import { getUserProfile, updateProfile } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// /api/users/profile
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateProfile);

export default router;
