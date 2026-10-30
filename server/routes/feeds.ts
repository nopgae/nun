import { Router } from 'express';
import { getCameraById } from '../services/cameraDb.js';
import { proxyFeed, fetchSnapshot } from '../services/feedProxy.js';

const router = Router();

// GET /api/feeds/:id/proxy
router.get('/:id/proxy', async (req, res) => {
  const camera = getCameraById(req.params.id);
  if (!camera) {
    res.status(404).json({ error: 'Camera not found' });
    return;
  }
  await proxyFeed(camera.feedUrl, res);
});

// GET /api/feeds/:id/snapshot
router.get('/:id/snapshot', async (req, res) => {
  const camera = getCameraById(req.params.id);
  if (!camera) {
    res.status(404).json({ error: 'Camera not found' });
    return;
  }
  await fetchSnapshot(camera.feedUrl, res);
});

export default router;
