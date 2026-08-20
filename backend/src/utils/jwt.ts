/**
 * JWT Utility Functions for BizMind
 * Cryptographic token signing and validation with environment-configured secrets.
 */
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface JwtPayload {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  iat?: number;
  exp?: number;
}

/**
 * Sign a new JWT token containing minimal, non-sensitive identity metadata
 */
export function generateToken(payload: { id: number; email: string; role: 'USER' | 'ADMIN' }): string {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn as any,
    }
  );
}

/**
 * Verify and decode an incoming JWT token
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}
