import { Response } from 'express';
import bcrypt from 'bcryptjs';
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
    const businesses = await db.getBusinessDatasets();
    const marketDatasets = await db.getMarketDatasets();
    const mlModels = await db.getMLModels();

    sendSuccess(res, {
      totalUsers: users.length,
      adminUsers: adminCount,
      standardUsers: userCount,
      activeUsers: activeCount,
      totalBusinessBenchmarks: businesses.length,
      totalMarketDatasets: marketDatasets.length,
      activeMLModels: mlModels.length,
      totalPredictions: 48320,
      totalPlans: 1240,
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
 * POST /api/admin/users
 */
export async function createUserByAdmin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { full_name, email, password, role, phone } = req.body;
    if (!full_name || !email || !password) {
      sendError(res, 'Name, email, and initial password are required.', 400);
      return;
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      sendError(res, 'A user with this email already exists.', 400);
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await db.createUser({
      full_name,
      email,
      password_hash,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      phone,
    });

    await db.addAuditLog('USER_CREATED_BY_ADMIN', `User ${email} created with role ${role || 'USER'}`, 'INFO', req.user?.email || 'ADMIN');

    const sanitized = {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      created_at: newUser.created_at,
      is_active: Boolean(newUser.is_active),
    };

    sendSuccess(res, sanitized, 'User created successfully by Administrator', 201);
  } catch (err: any) {
    sendError(res, 'Failed to create user.', 500, err?.message);
  }
}

/**
 * PUT /api/admin/users/:id/status
 */
export async function updateUserStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    if (typeof is_active !== 'boolean') {
      sendError(res, 'is_active boolean flag is required.', 400);
      return;
    }

    const success = await db.updateUserStatus(id, is_active);
    if (!success) {
      sendError(res, 'User not found or status could not be updated.', 404);
      return;
    }

    await db.addAuditLog('USER_STATUS_CHANGE', `User ID ${id} status set to ${is_active ? 'ACTIVE' : 'SUSPENDED'}`, 'WARNING', req.user?.email || 'ADMIN');
    sendSuccess(res, { id, is_active }, `User account ${is_active ? 'activated' : 'suspended'} successfully`);
  } catch (err: any) {
    sendError(res, 'Failed to update user status.', 500, err?.message);
  }
}

/**
 * PUT /api/admin/users/:id/role
 */
export async function updateUserRole(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (role !== 'USER' && role !== 'ADMIN') {
      sendError(res, "Role must be either 'USER' or 'ADMIN'.", 400);
      return;
    }

    const success = await db.updateUserRole(id, role);
    if (!success) {
      sendError(res, 'User not found or role could not be updated.', 404);
      return;
    }

    await db.addAuditLog('USER_ROLE_CHANGE', `User ID ${id} role updated to ${role}`, 'WARNING', req.user?.email || 'ADMIN');
    sendSuccess(res, { id, role }, `User role updated to ${role} successfully`);
  } catch (err: any) {
    sendError(res, 'Failed to update user role.', 500, err?.message);
  }
}

/**
 * DELETE /api/admin/users/:id
 */
export async function deleteUserByAdmin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (req.user?.id === Number(id)) {
      sendError(res, 'Administrators cannot delete their own active account.', 400);
      return;
    }

    const success = await db.deleteUser(id);
    if (!success) {
      sendError(res, 'User not found or could not be deleted.', 404);
      return;
    }

    await db.addAuditLog('USER_DELETED', `User ID ${id} was permanently removed`, 'ALERT', req.user?.email || 'ADMIN');
    sendSuccess(res, { id }, 'User deleted permanently from platform');
  } catch (err: any) {
    sendError(res, 'Failed to delete user.', 500, err?.message);
  }
}

/**
 * GET /api/admin/businesses
 */
export async function getBusinessDatasets(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const datasets = await db.getBusinessDatasets();
    sendSuccess(res, datasets, 'Business benchmark dataset list');
  } catch (err: any) {
    sendError(res, 'Failed to fetch business datasets.', 500, err?.message);
  }
}

/**
 * POST /api/admin/businesses
 */
export async function createBusinessDataset(req: AuthRequest, res: Response): Promise<void> {
  try {
    const created = await db.createBusinessDataset(req.body);
    await db.addAuditLog('BUSINESS_DATASET_CREATED', `Added benchmark for ${created.name}`, 'INFO', req.user?.email || 'ADMIN');
    sendSuccess(res, created, 'Business benchmark created successfully', 201);
  } catch (err: any) {
    sendError(res, 'Failed to create business benchmark.', 500, err?.message);
  }
}

/**
 * PUT /api/admin/businesses/:id
 */
export async function updateBusinessDataset(req: AuthRequest, res: Response): Promise<void> {
  try {
    const updated = await db.updateBusinessDataset(Number(req.params.id), req.body);
    if (!updated) {
      sendError(res, 'Business benchmark not found.', 404);
      return;
    }
    await db.addAuditLog('BUSINESS_DATASET_UPDATED', `Updated benchmark ID ${req.params.id}`, 'INFO', req.user?.email || 'ADMIN');
    sendSuccess(res, updated, 'Business benchmark updated');
  } catch (err: any) {
    sendError(res, 'Failed to update business benchmark.', 500, err?.message);
  }
}

/**
 * DELETE /api/admin/businesses/:id
 */
export async function deleteBusinessDataset(req: AuthRequest, res: Response): Promise<void> {
  try {
    const success = await db.deleteBusinessDataset(Number(req.params.id));
    if (!success) {
      sendError(res, 'Business benchmark not found.', 404);
      return;
    }
    await db.addAuditLog('BUSINESS_DATASET_DELETED', `Removed benchmark ID ${req.params.id}`, 'WARNING', req.user?.email || 'ADMIN');
    sendSuccess(res, { id: req.params.id }, 'Business benchmark deleted');
  } catch (err: any) {
    sendError(res, 'Failed to delete business benchmark.', 500, err?.message);
  }
}

/**
 * GET /api/admin/market-data
 */
export async function getMarketDatasets(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const datasets = await db.getMarketDatasets();
    sendSuccess(res, datasets, 'Market datasets retrieved');
  } catch (err: any) {
    sendError(res, 'Failed to fetch market datasets.', 500, err?.message);
  }
}

/**
 * POST /api/admin/market-data
 */
export async function createMarketDataset(req: AuthRequest, res: Response): Promise<void> {
  try {
    const created = await db.createMarketDataset(req.body);
    await db.addAuditLog('MARKET_DATASET_CREATED', `Added market record for ${created.city}`, 'INFO', req.user?.email || 'ADMIN');
    sendSuccess(res, created, 'Market dataset created', 201);
  } catch (err: any) {
    sendError(res, 'Failed to create market dataset.', 500, err?.message);
  }
}

/**
 * PUT /api/admin/market-data/:id
 */
export async function updateMarketDataset(req: AuthRequest, res: Response): Promise<void> {
  try {
    const updated = await db.updateMarketDataset(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Market dataset not found.', 404);
      return;
    }
    await db.addAuditLog('MARKET_DATASET_UPDATED', `Refreshed market parameters for ID ${req.params.id}`, 'INFO', req.user?.email || 'ADMIN');
    sendSuccess(res, updated, 'Market dataset updated');
  } catch (err: any) {
    sendError(res, 'Failed to update market dataset.', 500, err?.message);
  }
}

/**
 * DELETE /api/admin/market-data/:id
 */
export async function deleteMarketDataset(req: AuthRequest, res: Response): Promise<void> {
  try {
    const success = await db.deleteMarketDataset(req.params.id);
    if (!success) {
      sendError(res, 'Market dataset not found.', 404);
      return;
    }
    await db.addAuditLog('MARKET_DATASET_DELETED', `Deleted market dataset ${req.params.id}`, 'WARNING', req.user?.email || 'ADMIN');
    sendSuccess(res, { id: req.params.id }, 'Market dataset deleted');
  } catch (err: any) {
    sendError(res, 'Failed to delete market dataset.', 500, err?.message);
  }
}

/**
 * GET /api/admin/ml-models
 */
export async function getMLModels(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const models = await db.getMLModels();
    sendSuccess(res, models, 'ML model monitoring registry');
  } catch (err: any) {
    sendError(res, 'Failed to fetch ML models.', 500, err?.message);
  }
}

/**
 * POST /api/admin/ml-models/:id/retrain
 */
export async function retrainMLModel(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const model = await db.retrainMLModel(id);
    if (!model) {
      sendError(res, 'ML Model not found.', 404);
      return;
    }
    await db.addAuditLog('ML_MODEL_RETRAINED', `Retraining triggered for ${model.name} (${model.version})`, 'SUCCESS', req.user?.email || 'ADMIN');
    sendSuccess(res, model, `Model ${model.name} retrained and redeployed to production`);
  } catch (err: any) {
    sendError(res, 'Failed to retrain model.', 500, err?.message);
  }
}

/**
 * GET /api/admin/analytics
 */
export async function getSystemAnalytics(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const analytics = await db.getSystemAnalytics();
    sendSuccess(res, analytics, 'System-wide analytics and traffic metrics');
  } catch (err: any) {
    sendError(res, 'Failed to fetch analytics.', 500, err?.message);
  }
}

/**
 * GET /api/admin/audit-logs
 */
export async function getAuditLogs(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const logs = await db.getAllAuditLogs();
    sendSuccess(res, logs, 'System audit log records');
  } catch (err: any) {
    sendError(res, 'Failed to fetch audit logs.', 500, err?.message);
  }
}

/**
 * GET /api/admin/settings
 */
export async function getSystemSettings(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const settings = await db.getSystemSettings();
    sendSuccess(res, settings, 'Platform configuration parameters');
  } catch (err: any) {
    sendError(res, 'Failed to fetch settings.', 500, err?.message);
  }
}

/**
 * PUT /api/admin/settings
 */
export async function updateSystemSettings(req: AuthRequest, res: Response): Promise<void> {
  try {
    const updated = await db.updateSystemSettings(req.body);
    sendSuccess(res, updated, 'Platform configuration settings updated');
  } catch (err: any) {
    sendError(res, 'Failed to update system settings.', 500, err?.message);
  }
}

