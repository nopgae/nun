import { useState, useEffect, useCallback, useRef } from 'react';
import type { Camera, CameraFilter } from '../types/camera';
import { fetchCameras, searchCameras, fetchNearbyCameras } from '../services/cameraService';
import camerasKoreaData from '../data/cameras-korea.json';
import { DEBOUNCE_DELAY } from '../utils/constants';
import { haversineDistance } from '../utils/coordinates';

// Type cast the imported JSON
const localCameras = camerasKoreaData as Camera[];

export function useCameras() {
  const [cameras, setCameras] = useState<Camera[]>(localCameras);
  const [filteredCameras, setFilteredCameras] = useState<Camera[]>(localCameras);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CameraFilter>({});
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadCameras = useCallback(async (f?: CameraFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCameras(f);
      setCameras(data);
      setFilteredCameras(data);
    } catch {
      // Fallback to local data if backend unavailable
      const filtered = applyLocalFilter(localCameras, f);
      setCameras(localCameras);
      setFilteredCameras(filtered);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyLocalFilter = (cams: Camera[], f?: CameraFilter): Camera[] => {
    if (!f) return cams;
    return cams.filter(c => {
      if (f.region && c.region !== f.region) return false;
      if (f.category && c.category !== f.category) return false;
      if (f.isActive !== undefined && c.isActive !== f.isActive) return false;
      if (f.search) {
        const q = f.search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.nameEn.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  };

  const updateFilter = useCallback((newFilter: Partial<CameraFilter>) => {
    const updated = { ...filter, ...newFilter };
    setFilter(updated);
    setFilteredCameras(applyLocalFilter(cameras, updated));
  }, [filter, cameras]);

  const handleSearch = useCallback((query: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setFilteredCameras(applyLocalFilter(cameras, { ...filter, search: undefined }));
        return;
      }
      try {
        const results = await searchCameras(query);
        setFilteredCameras(results);
      } catch {
        setFilteredCameras(applyLocalFilter(cameras, { ...filter, search: query }));
      }
    }, DEBOUNCE_DELAY);
  }, [cameras, filter]);

  const findNearbyCameras = useCallback(async (lat: number, lng: number): Promise<Camera[]> => {
    try {
      return await fetchNearbyCameras(lat, lng);
    } catch {
      return cameras
        .filter(c => haversineDistance(lat, lng, c.latitude, c.longitude) <= 50)
        .sort((a, b) =>
          haversineDistance(lat, lng, a.latitude, a.longitude) -
          haversineDistance(lat, lng, b.latitude, b.longitude)
        )
        .slice(0, 10);
    }
  }, [cameras]);

  useEffect(() => {
    loadCameras();
  }, [loadCameras]);

  return {
    cameras: filteredCameras,
    allCameras: cameras,
    isLoading,
    error,
    filter,
    updateFilter,
    handleSearch,
    findNearbyCameras,
    reload: loadCameras,
  };
}
