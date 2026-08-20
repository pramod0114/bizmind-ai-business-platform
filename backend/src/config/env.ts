/**
 * Environment configuration for BizMind Backend
 */
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'bizmind_user',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bizmind_db',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'bizmind_jwt_default_secret_for_development',
    expiresIn: '7d',
  },
  admin: {
    email:
      process.env.ADMIN_EMAIL && !process.env.ADMIN_EMAIL.includes('your_')
        ? process.env.ADMIN_EMAIL.trim().toLowerCase()
        : 'admin@bizmind.ai',
    password:
      process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD.includes('your_')
        ? process.env.ADMIN_PASSWORD
        : 'Admin@123456',
  },
  mlService: {
    url: process.env.ML_API_URL || 'http://localhost:8000',
    timeoutMs: 5000,
  },
};
