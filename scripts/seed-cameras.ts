/**
 * seed-cameras.ts
 * With JSON-file storage, the camera data in src/data/cameras-korea.json IS the database.
 * This script validates and pretty-prints the JSON.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Camera } from '../src/types/camera.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAMERAS_PATH = path.join(__dirname, '../src/data/cameras-korea.json');

const cameras: Camera[] = JSON.parse(fs.readFileSync(CAMERAS_PATH, 'utf-8'));

// Validate required fields
let valid = 0;
let invalid = 0;
for (const cam of cameras) {
  if (!cam.id || !cam.name || !cam.feedUrl || !cam.feedType) {
    console.error(`  ✗ Invalid camera: ${cam.id ?? '(no id)'}`);
    invalid++;
  } else {
    valid++;
  }
}

// Re-write formatted
fs.writeFileSync(CAMERAS_PATH, JSON.stringify(cameras, null, 2));

console.log(`✅ Camera data validated: ${valid} valid, ${invalid} invalid`);
console.log(`📍 Camera file: ${CAMERAS_PATH}`);
