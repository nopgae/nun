import { Request, Response } from 'express';

export async function proxyFeed(feedUrl: string, res: Response): Promise<void> {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NunCameraViewer/1.0)',
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'Feed unavailable' });
      return;
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');

    if (response.body) {
      response.body.pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    res.status(502).json({ error: 'Failed to proxy feed', details: String(err) });
  }
}

export async function fetchSnapshot(feedUrl: string, res: Response): Promise<void> {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NunCameraViewer/1.0)',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'Snapshot unavailable' });
      return;
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch snapshot', details: String(err) });
  }
}

export async function validateFeed(url: string): Promise<{ alive: boolean; status?: number; contentType?: string }> {
  try {
    const { default: fetch } = await import('node-fetch');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal as Parameters<typeof fetch>[1] extends { signal?: infer S } ? S : never,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NunCameraViewer/1.0)',
      },
    });

    clearTimeout(timeout);

    return {
      alive: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type') ?? undefined,
    };
  } catch {
    return { alive: false };
  }
}
