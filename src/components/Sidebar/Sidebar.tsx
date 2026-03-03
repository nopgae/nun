import { useState } from 'react';
import type { Camera } from '../../types/camera';
import { SearchBar } from './SearchBar';
import { RegionFilter } from './RegionFilter';
import { CameraList } from './CameraList';

interface SidebarProps {
  cameras: Camera[];
  selectedCameraId: string | null;
  selectedRegion: string;
  onCameraClick: (camera: Camera) => void;
  onSearch: (query: string) => void;
  onRegionSelect: (region: string) => void;
}

export function Sidebar({
  cameras,
  selectedCameraId,
  selectedRegion,
  onCameraClick,
  onSearch,
  onRegionSelect,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="flex flex-col h-full transition-all duration-300 relative"
      style={{
        width: isCollapsed ? '32px' : '260px',
        background: 'rgba(10,10,15,0.97)',
        borderRight: '1px solid rgba(0,240,255,0.15)',
      }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(prev => !prev)}
        className="absolute -right-3 top-4 z-50 w-6 h-6 flex items-center justify-center font-mono text-[10px]"
        style={{
          background: 'rgba(10,10,15,0.9)',
          border: '1px solid rgba(0,240,255,0.3)',
          borderRadius: '50%',
          color: '#00f0ff',
          cursor: 'pointer',
        }}
        title={isCollapsed ? 'Open sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '▶' : '◀'}
      </button>

      {!isCollapsed && (
        <>
          {/* Header */}
          <div className="px-4 pt-4 pb-3 shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="font-mono text-base font-bold text-[#00f0ff]">눈</div>
              <div className="font-mono text-xs text-[rgba(0,240,255,0.5)] tracking-widest">
                NUN SYSTEM
              </div>
            </div>

            {/* Search */}
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Region filter */}
          <div className="px-4 pb-3 shrink-0" style={{ borderBottom: '1px solid rgba(0,240,255,0.1)' }}>
            <RegionFilter selectedRegion={selectedRegion} onSelect={onRegionSelect} />
          </div>

          {/* Camera count */}
          <div className="px-4 py-2 shrink-0">
            <div className="font-mono text-[10px] text-[rgba(0,240,255,0.4)] tracking-wider">
              CAMERAS: <span className="text-[#00ff88]">{cameras.length}</span>
            </div>
          </div>

          {/* Camera list */}
          <CameraList
            cameras={cameras}
            selectedCameraId={selectedCameraId}
            onCameraClick={onCameraClick}
          />

          {/* Footer */}
          <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid rgba(0,240,255,0.08)' }}>
            <div className="font-mono text-[9px] text-[rgba(0,240,255,0.25)] text-center leading-relaxed">
              공개 카메라 피드만 사용합니다<br />
              Public feeds only · Legal use
            </div>
          </div>
        </>
      )}

      {/* Collapsed state */}
      {isCollapsed && (
        <div className="flex flex-col items-center pt-12 gap-3">
          <div
            className="font-mono text-[10px] text-[#00f0ff]"
            style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
          >
            눈 NUN
          </div>
        </div>
      )}
    </div>
  );
}
