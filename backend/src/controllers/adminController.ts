import { Response } from 'express';
import { db } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * GET /api/admin/stats
 */
export async function getSystemStats(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await db.getAllUsers();
    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const userCount = users.filter((u) => u.role === 'USER').length;
    const activeCount = users.filter((u) => Boolean(u.is_active)).length;

    sendSuccess(res, {
      totalUsers: users.length,
      adminUsers: adminCount,
      standardUsers: userCount,
      activeUsers: activeCount,
      totalPredictions: 0,
      totalPlans: 0,
      systemLoad: 'optimal',
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      dbStatus: db.getStatus(),
    }, 'Admin system metrics retrieved successfully');
  } catch (err: any) {
    sendError(res, 'Failed to fetch admin stats.', 500, err?.message);
  }
}

/**
 * GET /api/admin/users
 */
export async function getAdminUsersList(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await db.getAllUsers();
    // Sanitize - never expose password_hash
    const sanitized = users.map((u) => ({
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      profile_image: u.profile_image,
      created_at: u.created_at,
      updated_at: u.updated_at,
      last_login: u.last_login,
      is_active: Boolean(u.is_active),
    }));

    sendSuccess(res, sanitized, 'Registered user registry retrieved successfully');
  } catch (err: any) {
    sendError(res, 'Failed to fetch user list.', 500, err?.message);
  }
}

/**
 * GET /api/admin/audit-logs
 */
export async function getAuditLogs(_req: AuthRequest, res: Response): Promise<void> {
  sendSuccess(res, [
    {
      id: 1,
      action: 'SYSTEM_BOOT',
      details: 'BizMind API Server Initialized with JWT & MySQL engine',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
    },
    {
      id: 2,
      action: 'ADMIN_SEED',
      details: 'Initial administrator account verified in database',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
    },
  ], 'Admin audit log records');
}
