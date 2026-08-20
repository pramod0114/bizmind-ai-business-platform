import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';

export async function createPlan(req: Request, res: Response): Promise<void> {
  sendSuccess(res, {
    planId: 'plan_draft_' + Date.now(),
    received: req.body,
    status: 'Plan engine scaffolded',
  }, 'Business plan creation placeholder');
}

export async function listPlans(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, [], 'Business plans list placeholder');
}
