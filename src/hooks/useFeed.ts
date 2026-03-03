import { useState, useCallback } from 'react';
import type { Camera, FeedState } from '../types/camera';

export function useFeed() {
  const [feedState, setFeedState] = useState<FeedState>({
    camera: null,
    isLoading: false,
    error: null,
    isPlaying: false,
  });

  const [gridCameras, setGridCameras] = useState<Camera[]>([]);
  const [isGridMode, setIsGridMode] = useState(false);

  const selectCamera = useCallback((camera: Camera) => {
    setFeedState({
      camera,
      isLoading: true,
      error: null,
      isPlaying: false,
    });
  }, []);

  const onFeedLoaded = useCallback(() => {
    setFeedState(prev => ({ ...prev, isLoading: false, isPlaying: true }));
  }, []);

  const onFeedError = useCallback((message: string) => {
    setFeedState(prev => ({ ...prev, isLoading: false, error: message, isPlaying: false }));
  }, []);

  const clearFeed = useCallback(() => {
    setFeedState({ camera: null, isLoading: false, error: null, isPlaying: false });
  }, []);

  const addToGrid = useCallback((camera: Camera) => {
    setGridCameras(prev => {
      if (prev.find(c => c.id === camera.id)) return prev;
      if (prev.length >= 9) return prev;
      return [...prev, camera];
    });
    setIsGridMode(true);
  }, []);

  const removeFromGrid = useCallback((cameraId: string) => {
    setGridCameras(prev => prev.filter(c => c.id !== cameraId));
  }, []);

  const toggleGridMode = useCallback(() => {
    setIsGridMode(prev => !prev);
  }, []);

  return {
    ...feedState,
    gridCameras,
    isGridMode,
    selectCamera,
    onFeedLoaded,
    onFeedError,
    clearFeed,
    addToGrid,
    removeFromGrid,
    toggleGridMode,
  };
}
