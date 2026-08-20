import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getCoordinatesInfo(req: Request, res: Response): Promise<void> {
  const { lat, lng } = req.query;
  sendSuccess(res, {
    coordinates: { lat, lng },
    engine: 'OpenStreetMap / Leaflet Spatial Pipeline',
    status: 'Spatial analysis endpoints configured for Part 4 location integration',
  }, 'Location coordinate info placeholder');
}

export async function searchLocations(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, [], 'Location search placeholder');
}
