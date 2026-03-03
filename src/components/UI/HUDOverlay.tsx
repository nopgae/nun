import { useState, useEffect } from 'react';
import { formatCoordinates } from '../../utils/coordinates';

interface HUDOverlayProps {
  lat: number;
  lng: number;
  zoom: number;
}

export function HUDOverlay({ lat, lng, zoom }: HUDOverlayProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Bottom HUD bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-t from-[rgba(10,10,15,0.9)] to-transparent">
        {/* Coordinates */}
        <div className="font-mono text-xs text-[rgba(0,240,255,0.7)] flex items-center gap-3">
          <span className="text-[rgba(0,240,255,0.4)]">◎</span>
          <span>{formatCoordinates(lat, lng)}</span>
        </div>

        {/* Center: Grid reference */}
        <div className="font-mono text-xs text-[rgba(0,240,255,0.4)] tracking-widest">
          NUN CAMERA SYSTEM v1.0
        </div>

        {/* Right: Zoom + time */}
        <div className="font-mono text-xs text-[rgba(0,240,255,0.7)] flex items-center gap-3">
          <span>
            ZOOM: <span className="text-[#00f0ff]">{zoom}</span>
          </span>
          <span className="text-[rgba(0,240,255,0.4)]">|</span>
          <span>
            {time.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
