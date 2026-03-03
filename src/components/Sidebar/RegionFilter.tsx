import regionsData from '../../data/regions.json';
import type { Region } from '../../types/camera';

const regions = regionsData as Region[];

interface RegionFilterProps {
  selectedRegion: string;
  onSelect: (region: string) => void;
}

export function RegionFilter({ selectedRegion, onSelect }: RegionFilterProps) {
  return (
    <div>
      <div className="font-mono text-[10px] text-[rgba(0,240,255,0.4)] mb-2 tracking-wider">
        지역 / REGION
      </div>
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onSelect('')}
          className="font-mono text-[10px] px-2 py-1 rounded transition-all"
          style={{
            background: !selectedRegion ? 'rgba(0,240,255,0.2)' : 'rgba(0,240,255,0.05)',
            border: `1px solid ${!selectedRegion ? '#00f0ff' : 'rgba(0,240,255,0.2)'}`,
            color: !selectedRegion ? '#00f0ff' : 'rgba(229,231,235,0.5)',
          }}
        >
          ALL
        </button>
        {regions.filter(r => r.id !== 'korea').map(region => (
          <button
            key={region.id}
            onClick={() => onSelect(region.name)}
            className="font-mono text-[10px] px-2 py-1 rounded transition-all"
            style={{
              background: selectedRegion === region.name ? 'rgba(0,240,255,0.2)' : 'rgba(0,240,255,0.05)',
              border: `1px solid ${selectedRegion === region.name ? '#00f0ff' : 'rgba(0,240,255,0.2)'}`,
              color: selectedRegion === region.name ? '#00f0ff' : 'rgba(229,231,235,0.5)',
            }}
          >
            {region.nameEn}
          </button>
        ))}
      </div>
    </div>
  );
}
