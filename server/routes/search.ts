import { Router } from 'express';
import { searchCameras, getAllRegions } from '../services/cameraDb.js';

const router = Router();

// GET /api/search?q=
router.get('/', (req, res) => {
  const { q, limit } = req.query;
  if (!q || typeof q !== 'string') {
    res.status(400).json({ error: 'q parameter is required' });
    return;
  }
  const results = searchCameras(q, limit ? parseInt(limit as string, 10) : 20);
  res.json({ results, query: q });
});

// GET /api/regions
router.get('/regions', (_req, res) => {
  const regions = getAllRegions();
  res.json({ regions });
});

export default router;
