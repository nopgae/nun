import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Camera } from '../src/types/camera.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAMERAS_PATH = path.join(__dirname, '../src/data/cameras-korea.json');

async function validateUrl(url: string): Promise<boolean> {
  const { default: fetch } = await import('node-fetch');
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { method: 'HEAD' });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  const cameras: Camera[] = JSON.parse(fs.readFileSync(CAMERAS_PATH, 'utf-8'));
  console.log(`Validating ${cameras.length} camera feeds...\n`);

  let alive = 0;
  let dead = 0;

  for (const cam of cameras) {
    if (cam.feedType === 'youtube') {
      console.log(`  ✓ [YOUTUBE] ${cam.nameEn}`);
      alive++;
      continue;
    }

    const ok = await validateUrl(cam.feedUrl);
    if (ok) {
      console.log(`  ✓ [ALIVE]  ${cam.nameEn}`);
      alive++;
    } else {
      console.log(`  ✗ [DEAD]   ${cam.nameEn} — ${cam.feedUrl}`);
      dead++;
      cam.isActive = false;
      cam.lastChecked = new Date().toISOString();
    }
  }

  fs.writeFileSync(CAMERAS_PATH, JSON.stringify(cameras, null, 2));
  console.log(`\nResults: ${alive} alive, ${dead} dead out of ${cameras.length} total`);
}

main().catch(console.error);
