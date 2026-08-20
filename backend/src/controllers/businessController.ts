import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getCategories(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, [
    { id: 1, name: 'Retail & Grocery', code: 'RETAIL' },
    { id: 2, name: 'Food & Beverage', code: 'FNB' },
    { id: 3, name: 'Healthcare & Wellness', code: 'HEALTH' },
    { id: 4, name: 'Tech & Services', code: 'TECH' },
    { id: 5, name: 'Education & Training', code: 'EDU' },
  ], 'Business categories architecture placeholder');
}

export async function listBusinesses(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, [], 'Business repository placeholder - database synchronization in subsequent part.');
}

export async function getBusinessById(req: Request, res: Response): Promise<void> {
  sendSuccess(res, { id: req.params.id, status: 'scaffold' }, 'Business detail placeholder');
}
