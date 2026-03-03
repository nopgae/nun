import { useState } from 'react';
import type { Camera } from '../../types/camera';
import { FeedPlayer } from './FeedPlayer';
import { FeedInfo } from './FeedInfo';
import { FeedGrid } from './FeedGrid';

interface FeedViewerProps {
  camera: Camera | null;
  gridCameras: Camera[];
  isGridMode: boolean;
  isLoading: boolean;
  error: string | null;
  onFeedLoaded: () => void;
  onFeedError: (msg: string) => void;
  onClose: () => void;
  onAddToGrid: (camera: Camera) => void;
  onRemoveFromGrid: (id: string) => void;
  onToggleGrid: () => void;
}

export function FeedViewer({
  camera,
  gridCameras,
  isGridMode,
  isLoading,
  error,
  onFeedLoaded,
  onFeedError,
  onClose,
  onAddToGrid,
  onRemoveFromGrid,
  onToggleGrid,
}: FeedViewerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!camera && gridCameras.length === 0) return null;

  const PANEL_HEIGHT = isCollapsed ? 'h-10' : 'h-72';

  return (
    <div
      className={`${PANEL_HEIGHT} transition-all duration-300 flex flex-col`}
      style={{
        background: 'rgba(10,10,15,0.97)',
        borderTop: '1px solid rgba(0,240,255,0.2)',
        boxShadow: '0 -4px 20px rgba(0,240,255,0.1)',
      }}
    >
      {/* Header bar */}
      <div
        className="h-10 flex items-center justify-between px-3 shrink-0"
        style={{ borderBottom: isCollapsed ? 'none' : '1px solid rgba(0,240,255,0.1)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff88]" style={{ boxShadow: '0 0 6px #00ff88' }} />
          <span className="font-mono text-xs text-[#00f0ff] font-bold tracking-wider">
            {isGridMode ? `MULTI-FEED [${gridCameras.length}]` : (camera?.name ?? 'LIVE FEED')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {camera && !isGridMode && (
            <button
              onClick={() => onAddToGrid(camera)}
              className="font-mono text-[10px] px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
              title="그리드에 추가"
              style={{
                background: 'rgba(0,240,255,0.1)',
                border: '1px solid rgba(0,240,255,0.3)',
                color: '#00f0ff',
              }}
            >
              + GRID
            </button>
          )}
          {gridCameras.length > 0 && (
            <button
              onClick={onToggleGrid}
              className="font-mono text-[10px] px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
              style={{
                background: isGridMode ? 'rgba(0,240,255,0.2)' : 'rgba(0,240,255,0.05)',
                border: `1px solid ${isGridMode ? '#00f0ff' : 'rgba(0,240,255,0.2)'}`,
                color: '#00f0ff',
              }}
            >
              GRID
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(prev => !prev)}
            className="font-mono text-[10px] px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
            style={{
              background: 'rgba(0,240,255,0.05)',
              border: '1px solid rgba(0,240,255,0.2)',
              color: 'rgba(0,240,255,0.6)',
            }}
          >
            {isCollapsed ? '▲' : '▼'}
          </button>
          <button
            onClick={onClose}
            className="font-mono text-[10px] px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
            style={{
              background: 'rgba(255,50,50,0.1)',
              border: '1px solid rgba(255,50,50,0.3)',
              color: 'rgba(255,100,100,0.8)',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {isGridMode && gridCameras.length > 0 ? (
            <FeedGrid cameras={gridCameras} onRemove={onRemoveFromGrid} />
          ) : camera ? (
            <>
              <div className="flex-1 relative overflow-hidden">
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center"
                    style={{ background: 'rgba(10,10,15,0.8)' }}>
                    <div className="font-mono text-xs text-[rgba(0,240,255,0.6)] animate-pulse tracking-widest">
                      CONNECTING...
                    </div>
                  </div>
                )}
                {error ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="font-mono text-xs text-red-400 text-center">
                      <div className="text-2xl mb-2">⊘</div>
                      <div>{error}</div>
                    </div>
                  </div>
                ) : (
                  <FeedPlayer
                    camera={camera}
                    onLoaded={onFeedLoaded}
                    onError={onFeedError}
                  />
                )}
              </div>
              <FeedInfo camera={camera} />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
