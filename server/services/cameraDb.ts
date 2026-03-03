import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Camera, Region } from '../../src/types/camera.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAMERAS_PATH = path.join(__dirname, '../../src/data/cameras-korea.json');
const REGIONS_PATH = path.join(__dirname, '../../src/data/regions.json');

// In-memory store
let camerasCache: Camera[] | null = null;
let regionsCache: Region[] | null = null;

function loadCameras(): Camera[] {
  if (!camerasCache) {
    const raw = fs.readFileSync(CAMERAS_PATH, 'utf-8');
    camerasCache = JSON.parse(raw) as Camera[];
  }
  return camerasCache;
}

function loadRegions(): Region[] {
  if (!regionsCache) {
    const raw = fs.readFileSync(REGIONS_PATH, 'utf-8');
    regionsCache = JSON.parse(raw) as Region[];
  }
  return regionsCache;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getAllCameras(filters?: {
  region?: string;
  category?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}): Camera[] {
  let cameras = loadCameras();

  if (filters?.region) cameras = cameras.filter(c => c.region === filters.region);
  if (filters?.category) cameras = cameras.filter(c => c.category === filters.category);
  if (filters?.isActive !== undefined) cameras = cameras.filter(c => c.isActive === filters.isActive);

  cameras = cameras.sort((a, b) => a.name.localeCompare(b.name));

  const offset = filters?.offset ?? 0;
  const limit = filters?.limit;
  cameras = cameras.slice(offset, limit ? offset + limit : undefined);

  return cameras;
}

export function getCameraById(id: string): Camera | null {
  return loadCameras().find(c => c.id === id) ?? null;
}

export function getNearbyCameras(lat: number, lng: number, radiusKm = 50, limit = 20): Camera[] {
  return loadCameras()
    .filter(c => c.isActive && haversine(lat, lng, c.latitude, c.longitude) <= radiusKm)
    .sort((a, b) =>
      haversine(lat, lng, a.latitude, a.longitude) - haversine(lat, lng, b.latitude, b.longitude)
    )
    .slice(0, limit);
}

export function getCamerasByRegion(region: string): Camera[] {
  return loadCameras().filter(c => c.region === region && c.isActive);
}

export function searchCameras(query: string, limit = 20): Camera[] {
  const q = query.toLowerCase();
  return loadCameras()
    .filter(c =>
      c.isActive && (
        c.name.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      )
    )
    .slice(0, limit);
}

export function upsertCamera(camera: Camera): void {
  const cameras = loadCameras();
  const idx = cameras.findIndex(c => c.id === camera.id);
  if (idx >= 0) {
    cameras[idx] = camera;
  } else {
    cameras.push(camera);
  }
  camerasCache = cameras;
  fs.writeFileSync(CAMERAS_PATH, JSON.stringify(cameras, null, 2));
}

export function updateCameraStatus(id: string, isActive: boolean): void {
  const cameras = loadCameras();
  const cam = cameras.find(c => c.id === id);
  if (cam) {
    cam.isActive = isActive;
    cam.lastChecked = new Date().toISOString();
    camerasCache = cameras;
    fs.writeFileSync(CAMERAS_PATH, JSON.stringify(cameras, null, 2));
  }
}

export function getAllRegions(): Region[] {
  return loadRegions();
}

export function getCameraCount(): number {
  return loadCameras().filter(c => c.isActive).length;
}
