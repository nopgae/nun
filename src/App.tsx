import { useCallback, useState, useEffect } from 'react';
import { API_BASE_URL } from './utils/constants';
import { StatusBar } from './components/UI/StatusBar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MapContainer } from './components/Map/MapContainer';
import { FeedViewer } from './components/Feed/FeedViewer';
import { useCameras } from './hooks/useCameras';
import { useFeed } from './hooks/useFeed';
import { useMap } from './hooks/useMap';
import type { Camera } from './types/camera';

export default function App() {
  const {
    cameras,
    allCameras,
    handleSearch,
    updateFilter,
    findNearbyCameras,
    filter,
  } = useCameras();

  const {
    camera: selectedCamera,
    gridCameras,
    isGridMode,
    isLoading: feedLoading,
    error: feedError,
    selectCamera,
    onFeedLoaded,
    onFeedError,
    clearFeed,
    addToGrid,
    removeFromGrid,
    toggleGridMode,
  } = useFeed();

  const { isScanning, handleMapClick } = useMap();
  const [isConnected, setIsConnected] = useState(true);
  const [itsAvailable, setItsAvailable] = useState<boolean | undefined>(undefined);

  // Check backend connectivity + ITS status
  useEffect(() => {
    fetch(`${API_BASE_URL}/cameras/count`)
      .then(r => r.json())
      .then((d: { count: number; its?: number }) => {
        setIsConnected(true);
        setItsAvailable(typeof d.its === 'number' && d.its > 0);
      })
      .catch(() => setIsConnected(false));
  }, []);

  const handleCameraClick = useCallback((cam: Camera) => {
    selectCamera(cam);
  }, [selectCamera]);

  const handleMapClickWithScan = useCallback(async (lat: number, lng: number) => {
    handleMapClick(lat, lng);
    const nearby = await findNearbyCameras(lat, lng);
    if (nearby.length > 0 && !selectedCamera) {
      selectCamera(nearby[0]);
    }
  }, [handleMapClick, findNearbyCameras, selectCamera, selectedCamera]);

  const handleRegionSelect = useCallback((region: string) => {
    updateFilter({ region: region || undefined });
  }, [updateFilter]);

  const selectedCameraId = selectedCamera?.id ?? null;
  const selectedRegion = filter.region ?? '';

  return (
    <div className="flex flex-col w-full h-full" style={{ background: '#0a0a0f' }}>
      {/* Top status bar */}
      <StatusBar
        cameraCount={allCameras.length}
        selectedRegion={selectedRegion}
        isConnected={isConnected}
        itsAvailable={itsAvailable}
      />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          cameras={cameras}
          selectedCameraId={selectedCameraId}
          selectedRegion={selectedRegion}
          onCameraClick={handleCameraClick}
          onSearch={handleSearch}
          onRegionSelect={handleRegionSelect}
        />

        {/* Map + Feed viewer column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map */}
          <div className="flex-1 relative overflow-hidden">
            <MapContainer
              cameras={cameras}
              selectedCameraId={selectedCameraId}
              isScanning={isScanning}
              onCameraClick={handleCameraClick}
              onMapClick={handleMapClickWithScan}
            />
          </div>

          {/* Feed viewer panel */}
          <FeedViewer
            camera={selectedCamera}
            gridCameras={gridCameras}
            isGridMode={isGridMode}
            isLoading={feedLoading}
            error={feedError}
            onFeedLoaded={onFeedLoaded}
            onFeedError={onFeedError}
            onClose={clearFeed}
            onAddToGrid={addToGrid}
            onRemoveFromGrid={removeFromGrid}
            onToggleGrid={toggleGridMode}
          />
        </div>
      </div>
    </div>
  );
}
