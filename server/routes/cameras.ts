import { Router } from 'express';
import {
  getAllCameras,
  getCameraById,
  getNearbyCameras,
  getCamerasByRegion,
  getCameraCount,
} from '../services/cameraDb.js';
import { fetchItsCameras, isItsApiConfigured } from '../services/itsApi.js';

const router = Router();

// GET /api/cameras — JSON 카메라 + ITS API 카메라 병합
router.get('/', async (req, res) => {
  const { region, category, active, limit, offset, source } = req.query;

  const localCameras = getAllCameras({
    region: region as string | undefined,
    category: category as string | undefined,
    isActive: active !== undefined ? active === 'true' : undefined,
  });

  // ITS 카메라도 포함 (source=its 파라미터거나 기본 포함)
  let itsCameras = source !== 'local' ? await fetchItsCameras() : [];
  if (region) {
    itsCameras = itsCameras.filter(c => c.region === region);
  }
  if (category) {
    itsCameras = itsCameras.filter(c => c.category === category);
  }

  const all = [...localCameras, ...itsCameras];

  const start = offset ? parseInt(offset as string, 10) : 0;
  const end = limit ? start + parseInt(limit as string, 10) : undefined;
  const paged = all.slice(start, end);

  res.json({ cameras: paged, total: all.length, itsAvailable: isItsApiConfigured() });
});

// GET /api/cameras/count
router.get('/count', async (_req, res) => {
  const localCount = getCameraCount();
  const itsCount = (await fetchItsCameras()).length;
  res.json({ count: localCount + itsCount, local: localCount, its: itsCount });
});

// GET /api/cameras/nearby
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius, limit } = req.query;
  if (!lat || !lng) {
    res.status(400).json({ error: 'lat and lng are required' });
    return;
  }

  const localCameras = getNearbyCameras(
    parseFloat(lat as string),
    parseFloat(lng as string),
    radius ? parseFloat(radius as string) : 50,
    limit ? parseInt(limit as string, 10) : 20
  );

  // ITS 카메라도 근처에서 찾기
  const itsCameras = await fetchItsCameras();
  const { haversineDistance } = await import('../../src/utils/coordinates.js');
  const nearbyIts = itsCameras
    .filter(c => haversineDistance(
      parseFloat(lat as string), parseFloat(lng as string),
      c.latitude, c.longitude
    ) <= (radius ? parseFloat(radius as string) : 50))
    .slice(0, 10);

  res.json({ cameras: [...localCameras, ...nearbyIts] });
});

// GET /api/cameras/region/:region
router.get('/region/:region', async (req, res) => {
  const local = getCamerasByRegion(req.params.region);
  const its = (await fetchItsCameras()).filter(c => c.region === req.params.region);
  res.json({ cameras: [...local, ...its] });
});

// GET /api/cameras/:id
router.get('/:id', async (req, res) => {
  const camera = getCameraById(req.params.id);
  if (camera) {
    res.json({ camera });
    return;
  }
  // ITS 카메라에서도 찾기
  const its = await fetchItsCameras();
  const itsCam = its.find(c => c.id === req.params.id);
  if (itsCam) {
    res.json({ camera: itsCam });
    return;
  }
  res.status(404).json({ error: 'Camera not found' });
});

export default router;
