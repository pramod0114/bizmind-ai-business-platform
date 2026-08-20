import { Router } from 'express';
import {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

// Protected auth endpoints
router.get('/me', authenticateUser, getCurrentUser);
router.put('/profile', authenticateUser, updateProfile);
router.put('/change-password', authenticateUser, changePassword);

export default router;
