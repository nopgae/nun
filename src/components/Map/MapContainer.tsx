import { useState, useCallback, useRef } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Camera } from '../../types/camera';
import { MAP_DEFAULTS, MAP_TILES } from '../../utils/constants';
import { CameraCluster } from './CameraCluster';
import { MapControls } from './MapControls';
import { HUDOverlay } from '../UI/HUDOverlay';
import { LoadingOverlay } from '../UI/LoadingOverlay';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapEventsProps {
  onMapClick: (lat: number, lng: number) => void;
  onMoveEnd: (lat: number, lng: number, zoom: number) => void;
}

function MapEvents({ onMapClick, onMoveEnd }: MapEventsProps) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
    moveend: (e) => {
      const center = e.target.getCenter();
      const zoom = e.target.getZoom();
      onMoveEnd(center.lat, center.lng, zoom);
    },
  });
  return null;
}

interface MapContainerProps {
  cameras: Camera[];
  selectedCameraId: string | null;
  isScanning: boolean;
  onCameraClick: (camera: Camera) => void;
  onMapClick: (lat: number, lng: number) => void;
}

export function MapContainer({
  cameras,
  selectedCameraId,
  isScanning,
  onCameraClick,
  onMapClick,
}: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [currentLat, setCurrentLat] = useState(MAP_DEFAULTS.center[0]);
  const [currentLng, setCurrentLng] = useState(MAP_DEFAULTS.center[1]);
  const [currentZoom, setCurrentZoom] = useState<number>(MAP_DEFAULTS.zoom);

  const handleMoveEnd = useCallback((lat: number, lng: number, zoom: number) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    setCurrentZoom(zoom);
  }, []);

  const handleResetView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(MAP_DEFAULTS.center, MAP_DEFAULTS.zoom);
    }
  }, []);

  const tileUrl = isSatellite ? MAP_TILES.satellite : MAP_TILES.darkMatter;
  const tileAttribution = isSatellite ? MAP_TILES.satelliteAttribution : MAP_TILES.darkMatterAttribution;

  return (
    <div className="relative w-full h-full hud-grid">
      <LeafletMapContainer
        center={MAP_DEFAULTS.center}
        zoom={MAP_DEFAULTS.zoom}
        minZoom={MAP_DEFAULTS.minZoom}
        maxZoom={MAP_DEFAULTS.maxZoom}
        className="w-full h-full"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          url={tileUrl}
          attribution={tileAttribution}
          maxZoom={MAP_DEFAULTS.maxZoom}
        />

        <CameraCluster
          cameras={cameras}
          selectedCameraId={selectedCameraId}
          onCameraClick={onCameraClick}
        />

        <MapEvents
          onMapClick={onMapClick}
          onMoveEnd={handleMoveEnd}
        />
      </LeafletMapContainer>

      {/* Controls overlay */}
      <MapControls
        onResetView={handleResetView}
        onToggleSatellite={() => setIsSatellite(prev => !prev)}
        isSatellite={isSatellite}
      />

      {/* Scanning overlay */}
      {isScanning && <LoadingOverlay isVisible={true} message="SCANNING AREA..." />}

      {/* HUD overlay */}
      <HUDOverlay lat={currentLat} lng={currentLng} zoom={currentZoom} />
    </div>
  );
}
