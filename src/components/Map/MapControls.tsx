interface MapControlsProps {
  onResetView: () => void;
  onToggleSatellite: () => void;
  isSatellite: boolean;
}

export function MapControls({ onResetView, onToggleSatellite, isSatellite }: MapControlsProps) {
  return (
    <div
      className="absolute top-4 right-4 z-40 flex flex-col gap-2"
      style={{ pointerEvents: 'all' }}
    >
      <button
        onClick={onResetView}
        className="w-8 h-8 font-mono text-xs flex items-center justify-center"
        title="한국으로 돌아가기"
        style={{
          background: 'rgba(10,10,15,0.9)',
          border: '1px solid rgba(0,240,255,0.3)',
          color: '#00f0ff',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        KR
      </button>
      <button
        onClick={onToggleSatellite}
        className="w-8 h-8 font-mono text-xs flex items-center justify-center"
        title="위성 지도 전환"
        style={{
          background: isSatellite ? 'rgba(0,240,255,0.2)' : 'rgba(10,10,15,0.9)',
          border: `1px solid ${isSatellite ? '#00f0ff' : 'rgba(0,240,255,0.3)'}`,
          color: '#00f0ff',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        SAT
      </button>
    </div>
  );
}
