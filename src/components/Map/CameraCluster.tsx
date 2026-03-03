import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { Camera } from '../../types/camera';
import { CATEGORY_COLORS } from '../../utils/constants';

interface CameraClusterProps {
  cameras: Camera[];
  selectedCameraId: string | null;
  onCameraClick: (camera: Camera) => void;
}

function createMarkerIcon(camera: Camera, isSelected: boolean) {
  const color = CATEGORY_COLORS[camera.category] || '#00f0ff';
  const size = isSelected ? 20 : 14;

  return L.divIcon({
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <div style="
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:${size}px;height:${size}px;
          border:2px solid ${color};
          border-radius:50%;
          animation:pulse-ring 2s ease-out infinite;
          opacity:0.6;
        "></div>
        <div style="
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:${size * 0.55}px;height:${size * 0.55}px;
          background:${color};
          border-radius:50%;
          box-shadow:0 0 6px ${color};
        "></div>
      </div>
    `,
    className: 'camera-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function CameraCluster({ cameras, selectedCameraId, onCameraClick }: CameraClusterProps) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!clusterRef.current) {
      clusterRef.current = L.markerClusterGroup({
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div style="
              display:flex;align-items:center;justify-content:center;
              width:36px;height:36px;
              background:rgba(0,240,255,0.15);
              border:1px solid rgba(0,240,255,0.5);
              border-radius:50%;
              color:#00f0ff;
              font-family:'JetBrains Mono',monospace;
              font-size:11px;font-weight:600;
            ">${count}</div>`,
            className: '',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
        },
      });
      map.addLayer(clusterRef.current);
    }

    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
        clusterRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    cluster.clearLayers();
    markersRef.current.clear();

    cameras.forEach(camera => {
      const isSelected = camera.id === selectedCameraId;
      const marker = L.marker([camera.latitude, camera.longitude], {
        icon: createMarkerIcon(camera, isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.on('click', () => onCameraClick(camera));
      cluster.addLayer(marker);
      markersRef.current.set(camera.id, marker);
    });
  }, [cameras, selectedCameraId, onCameraClick]);

  return null;
}
