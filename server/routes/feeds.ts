import { Router } from 'express';
import { getCameraById } from '../services/cameraDb.js';
import { proxyFeed, fetchSnapshot, validateFeed } from '../services/feedProxy.js';

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

// POST /api/cameras/validate
router.post('/validate', async (req, res) => {
  const { url } = req.body as { url?: string };
  if (!url) {
    res.status(400).json({ error: 'url is required' });
    return;
  }
  const result = await validateFeed(url);
  res.json(result);
});

export default router;
