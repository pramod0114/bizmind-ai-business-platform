/**
 * Authentication and Authorization Middleware for BizMind Express API
 */
import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.js';
import { db, UserRow } from '../config/database.js';
import { sendError } from '../utils/apiResponse.js';

export interface AuthenticatedUser {
  id: number;
  full_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone: string | null;
  profile_image: string | null;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Middleware: Requires a valid JWT token in Authorization header
 */
export async function authenticateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication token required. Please sign in.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      sendError(res, 'Malformed authorization header.', 401);
      return;
    }

    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        sendError(res, 'Session expired. Please log in again.', 401);
        return;
      }
      sendError(res, 'Invalid authentication token.', 401);
      return;
    }

    // Verify user still exists and is active in database
    const user = await db.findUserById(decoded.id);
    if (!user) {
      sendError(res, 'User account not found or was removed.', 401);
      return;
    }

    if (!user.is_active) {
      sendError(res, 'User account is deactivated. Please contact support.', 403);
      return;
    }

    // Attach safe user info (never password_hash)
    req.user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profile_image: user.profile_image,
      created_at: user.created_at,
      last_login: user.last_login,
      is_active: Boolean(user.is_active),
    };

    next();
  } catch (err: any) {
    sendError(res, 'Authentication processing failed.', 500, err?.message);
  }
}

/**
 * Middleware: Optional authentication (attaches user if valid token exists, otherwise proceeds as guest)
 */
export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) return next();

    try {
      const decoded = verifyToken(token);
      const user = await db.findUserById(decoded.id);
      if (user && user.is_active) {
        req.user = {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profile_image: user.profile_image,
          created_at: user.created_at,
          last_login: user.last_login,
          is_active: Boolean(user.is_active),
        };
      }
    } catch {
      // Ignore token verification errors for optional auth
    }
    next();
  } catch {
    next();
  }
}

/**
 * Middleware: Requires the authenticated user to have ADMIN role
 */
export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    sendError(res, 'Authentication required before accessing administrative endpoints.', 401);
    return;
  }

  if (req.user.role !== 'ADMIN') {
    sendError(
      res,
      'Access Denied. Administrator privileges are required to access this resource.',
      403
    );
    return;
  }

  next();
}
