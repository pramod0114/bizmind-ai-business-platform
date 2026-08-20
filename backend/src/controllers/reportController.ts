import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';

export async function generateReport(req: Request, res: Response): Promise<void> {
  sendSuccess(res, {
    reportId: 'rep_' + Date.now(),
    type: req.body?.type || 'executive_summary',
    status: 'Report generation service configured',
  }, 'Report generation placeholder');
}

export async function listReports(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, [], 'Reports repository placeholder');
}
