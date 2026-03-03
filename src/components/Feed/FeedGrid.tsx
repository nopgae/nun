import type { Camera } from '../../types/camera';
import { FeedPlayer } from './FeedPlayer';

interface FeedGridProps {
  cameras: Camera[];
  onRemove: (id: string) => void;
}

export function FeedGrid({ cameras, onRemove }: FeedGridProps) {
  const cols = cameras.length <= 2 ? 2 : cameras.length <= 4 ? 2 : 3;

  return (
    <div
      className="flex-1 grid gap-0.5 overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        background: 'rgba(0,240,255,0.05)',
      }}
    >
      {cameras.map(camera => (
        <div
          key={camera.id}
          className="relative overflow-hidden"
          style={{ background: '#0a0a0f' }}
        >
          <FeedPlayer camera={camera} />

          {/* Overlay: name + remove */}
          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1"
            style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.9), transparent)' }}
          >
            <span className="font-mono text-[9px] text-[rgba(0,240,255,0.7)] truncate">
              {camera.nameEn}
            </span>
            <button
              onClick={() => onRemove(camera.id)}
              className="font-mono text-[9px] text-[rgba(255,100,100,0.7)] hover:text-red-400 ml-1 shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
