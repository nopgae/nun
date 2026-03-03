import { useState, useCallback } from 'react';
import { MAP_DEFAULTS } from '../utils/constants';

interface MapState {
  center: [number, number];
  zoom: number;
  clickedLatLng: [number, number] | null;
  isScanning: boolean;
}

export function useMap() {
  const [state, setState] = useState<MapState>({
    center: MAP_DEFAULTS.center,
    zoom: MAP_DEFAULTS.zoom,
    clickedLatLng: null,
    isScanning: false,
  });

  const setCenter = useCallback((center: [number, number], zoom?: number) => {
    setState(prev => ({ ...prev, center, zoom: zoom ?? prev.zoom }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom }));
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setState(prev => ({ ...prev, clickedLatLng: [lat, lng], isScanning: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, isScanning: false }));
    }, 2000);
  }, []);

  const clearClick = useCallback(() => {
    setState(prev => ({ ...prev, clickedLatLng: null }));
  }, []);

  return {
    ...state,
    setCenter,
    setZoom,
    handleMapClick,
    clearClick,
  };
}
