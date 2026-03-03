import type { Camera } from '../../types/camera';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../utils/constants';
import { formatCoordinates } from '../../utils/coordinates';

interface FeedInfoProps {
  camera: Camera;
}

export function FeedInfo({ camera }: FeedInfoProps) {
  const categoryColor = CATEGORY_COLORS[camera.category] || '#00f0ff';

  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3"
      style={{ borderTop: '1px solid rgba(0,240,255,0.1)' }}>
      {/* Left: Names */}
      <div className="flex-1 min-w-0">
        <div className="font-sans font-semibold text-sm text-white truncate">
          {camera.name}
        </div>
        <div className="font-mono text-xs text-[rgba(229,231,235,0.5)] truncate mt-0.5">
          {camera.nameEn}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className="font-mono text-[10px] px-1.5 py-0.5 rounded"
            style={{
              background: `${categoryColor}18`,
              border: `1px solid ${categoryColor}40`,
              color: categoryColor,
            }}
          >
            {CATEGORY_LABELS[camera.category]}
          </span>
          <span className="font-mono text-[10px] text-[rgba(229,231,235,0.4)]">
            {camera.city} · {camera.region}
          </span>
        </div>
      </div>

      {/* Right: Coordinates + Source */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="font-mono text-[10px] text-[rgba(0,240,255,0.6)]">
          {formatCoordinates(camera.latitude, camera.longitude)}
        </div>
        <a
          href={camera.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-[rgba(0,240,255,0.4)] hover:text-[#00f0ff] transition-colors"
        >
          {camera.source} ↗
        </a>
      </div>
    </div>
  );
}
