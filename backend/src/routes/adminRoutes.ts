import { Router } from 'express';
import { getSystemStats, getAuditLogs, getAdminUsersList } from '../controllers/adminController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// All admin routes strictly require valid authentication and ADMIN role
router.use(authenticateUser, requireAdmin);

router.get('/stats', getSystemStats);
router.get('/users', getAdminUsersList);
router.get('/audit-logs', getAuditLogs);

export default router;
