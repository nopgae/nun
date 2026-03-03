import type { Camera } from '../../types/camera';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../utils/constants';

interface CameraListProps {
  cameras: Camera[];
  selectedCameraId: string | null;
  onCameraClick: (camera: Camera) => void;
}

function CameraListItem({
  camera,
  isSelected,
  onClick,
}: {
  camera: Camera;
  isSelected: boolean;
  onClick: () => void;
}) {
  const categoryColor = CATEGORY_COLORS[camera.category] || '#00f0ff';

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 transition-all group"
      style={{
        background: isSelected ? 'rgba(0,240,255,0.1)' : 'transparent',
        borderLeft: `2px solid ${isSelected ? '#00f0ff' : 'transparent'}`,
        borderBottom: '1px solid rgba(0,240,255,0.06)',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(0,240,255,0.05)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      <div className="flex items-start gap-2">
        {/* Status dot */}
        <div
          className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
          style={{
            background: camera.isActive ? categoryColor : '#666',
            boxShadow: camera.isActive ? `0 0 4px ${categoryColor}` : 'none',
          }}
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span
              className="font-sans text-xs font-medium truncate"
              style={{ color: isSelected ? '#00f0ff' : 'rgba(229,231,235,0.85)' }}
            >
              {camera.name}
            </span>
            <span
              className="font-mono text-[9px] shrink-0"
              style={{ color: categoryColor }}
            >
              {CATEGORY_LABELS[camera.category]}
            </span>
          </div>
          <div className="font-mono text-[10px] text-[rgba(229,231,235,0.35)] truncate mt-0.5">
            {camera.city} · {camera.feedType.toUpperCase()}
          </div>
        </div>
      </div>
    </button>
  );
}

export function CameraList({ cameras, selectedCameraId, onCameraClick }: CameraListProps) {
  if (cameras.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="font-mono text-xs text-[rgba(0,240,255,0.3)] text-center">
          <div className="text-2xl mb-2">◎</div>
          <div className="tracking-widest">NO CAMERAS FOUND</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      {cameras.map(camera => (
        <CameraListItem
          key={camera.id}
          camera={camera}
          isSelected={camera.id === selectedCameraId}
          onClick={() => onCameraClick(camera)}
        />
      ))}
    </div>
  );
}
