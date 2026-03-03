import express from 'express';
import cors from 'cors';
import cameraRoutes from './routes/cameras.js';
import feedRoutes from './routes/feeds.js';
import searchRoutes from './routes/search.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/cameras', cameraRoutes);
app.use('/api/feeds', feedRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`눈 (Nun) API server running on http://localhost:${PORT}`);
});

export default app;
