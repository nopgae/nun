import { useState, useEffect } from 'react';

interface StatusBarProps {
  cameraCount: number;
  selectedRegion: string;
  isConnected: boolean;
  itsAvailable?: boolean;
}

export function StatusBar({ cameraCount, selectedRegion, isConnected, itsAvailable }: StatusBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 bg-[#0a0a0f] border-b border-[rgba(0,240,255,0.15)] flex items-center justify-between px-4 z-50 relative shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[#00f0ff] text-xs font-bold tracking-widest">
          눈 NUN
        </span>
        <span className="text-[rgba(0,240,255,0.3)] text-xs font-mono">|</span>
        <span className="font-mono text-[rgba(0,240,255,0.6)] text-xs hidden sm:inline">
          REAL-TIME CAMERA NETWORK
        </span>
      </div>

      {/* Center */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <span className="text-[rgba(0,240,255,0.5)]">
          CAMERAS: <span className="text-[#00ff88] font-bold">{cameraCount}</span>
        </span>
        {selectedRegion && (
          <>
            <span className="text-[rgba(0,240,255,0.3)]">|</span>
            <span className="text-[rgba(0,240,255,0.5)]">
              <span className="text-[#00f0ff]">{selectedRegion}</span>
            </span>
          </>
        )}
        {itsAvailable !== undefined && (
          <>
            <span className="text-[rgba(0,240,255,0.3)]">|</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{
                background: itsAvailable ? 'rgba(0,255,136,0.1)' : 'rgba(255,100,0,0.1)',
                border: `1px solid ${itsAvailable ? 'rgba(0,255,136,0.3)' : 'rgba(255,100,0,0.3)'}`,
                color: itsAvailable ? '#00ff88' : '#ff9944',
              }}
            >
              ITS {itsAvailable ? '✓' : '— API키 필요'}
            </span>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#00ff88]' : 'bg-red-500'}`}
            style={isConnected ? { boxShadow: '0 0 6px #00ff88' } : {}}
          />
          <span className={isConnected ? 'text-[#00ff88]' : 'text-red-400'}>
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <span className="text-[rgba(0,240,255,0.3)]">|</span>
        <span className="text-[rgba(0,240,255,0.5)]">
          {time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </span>
      </div>
    </div>
  );
}
