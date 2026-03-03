import type { Camera, Region, CameraFilter } from '../types/camera';
import { API_BASE_URL } from '../utils/constants';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function fetchCameras(filters?: CameraFilter): Promise<Camera[]> {
  const params = new URLSearchParams();
  if (filters?.region) params.set('region', filters.region);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.isActive !== undefined) params.set('active', String(filters.isActive));

  const query = params.toString();
  const data = await fetchJson<{ cameras: Camera[] }>(
    `${API_BASE_URL}/cameras${query ? `?${query}` : ''}`
  );
  return data.cameras;
}

export async function fetchCameraById(id: string): Promise<Camera> {
  const data = await fetchJson<{ camera: Camera }>(`${API_BASE_URL}/cameras/${id}`);
  return data.camera;
}

export async function fetchNearbyCameras(
  lat: number,
  lng: number,
  radius = 50,
  limit = 20
): Promise<Camera[]> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
    limit: String(limit),
  });
  const data = await fetchJson<{ cameras: Camera[] }>(
    `${API_BASE_URL}/cameras/nearby?${params.toString()}`
  );
  return data.cameras;
}

export async function fetchCamerasByRegion(region: string): Promise<Camera[]> {
  const data = await fetchJson<{ cameras: Camera[] }>(
    `${API_BASE_URL}/cameras/region/${encodeURIComponent(region)}`
  );
  return data.cameras;
}

export async function searchCameras(query: string, limit = 20): Promise<Camera[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  const data = await fetchJson<{ results: Camera[] }>(
    `${API_BASE_URL}/search?${params.toString()}`
  );
  return data.results;
}

export async function fetchRegions(): Promise<Region[]> {
  const data = await fetchJson<{ regions: Region[] }>(`${API_BASE_URL}/search/regions`);
  return data.regions;
}

export async function fetchCameraCount(): Promise<number> {
  const data = await fetchJson<{ count: number }>(`${API_BASE_URL}/cameras/count`);
  return data.count;
}
