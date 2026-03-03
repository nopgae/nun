import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Camera } from '../../types/camera';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../utils/constants';

interface CameraMarkerProps {
  camera: Camera;
  isSelected: boolean;
  onClick: (camera: Camera) => void;
}

function createCameraIcon(category: Camera['category'], isSelected: boolean) {
  const color = CATEGORY_COLORS[category] || '#00f0ff';
  const size = isSelected ? 20 : 14;

  const html = `
    <div class="camera-pulse" style="width:${size}px;height:${size}px;">
      <div class="camera-pulse-ring" style="border-color:${color};width:${size}px;height:${size}px;"></div>
      <div class="camera-pulse-dot" style="background:${color};box-shadow:0 0 6px ${color};width:${size * 0.6}px;height:${size * 0.6}px;"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'camera-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size],
  });
}

export function CameraMarker({ camera, isSelected, onClick }: CameraMarkerProps) {
  const icon = createCameraIcon(camera.category, isSelected);

  return (
    <Marker
      position={[camera.latitude, camera.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(camera),
      }}
      zIndexOffset={isSelected ? 1000 : 0}
    >
      <Popup
        className="camera-popup"
        closeButton={false}
        offset={[0, -10]}
      >
        <div
          className="font-mono text-xs p-2"
          style={{
            background: 'rgba(10,10,15,0.95)',
            border: '1px solid rgba(0,240,255,0.3)',
            borderRadius: '4px',
            color: '#e5e7eb',
            minWidth: '180px',
          }}
        >
          <div style={{ color: '#00f0ff', fontWeight: 700, marginBottom: '4px' }}>
            {camera.name}
          </div>
          <div style={{ color: 'rgba(229,231,235,0.6)', fontSize: '10px', marginBottom: '4px' }}>
            {camera.nameEn}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                background: `${CATEGORY_COLORS[camera.category]}22`,
                border: `1px solid ${CATEGORY_COLORS[camera.category]}44`,
                color: CATEGORY_COLORS[camera.category],
                padding: '1px 6px',
                borderRadius: '2px',
                fontSize: '9px',
              }}
            >
              {CATEGORY_LABELS[camera.category]}
            </span>
            <span style={{ color: 'rgba(229,231,235,0.4)', fontSize: '10px' }}>
              {camera.city}
            </span>
          </div>
          <div
            style={{
              marginTop: '6px',
              color: '#00f0ff',
              fontSize: '10px',
              cursor: 'pointer',
              textAlign: 'center',
              border: '1px solid rgba(0,240,255,0.3)',
              padding: '2px',
              borderRadius: '2px',
            }}
            onClick={() => onClick(camera)}
          >
            ▶ 피드 열기
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
