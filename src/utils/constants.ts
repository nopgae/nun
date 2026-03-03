export const MAP_DEFAULTS = {
  center: [36.5, 127.5] as [number, number],
  zoom: 7,
  minZoom: 3,
  maxZoom: 18,
} as const;

export const MAP_TILES = {
  darkMatter: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  darkMatterAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  satelliteAttribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const FEED_REFRESH_INTERVAL = 2000; // ms for image-refresh feeds
export const DEBOUNCE_DELAY = 300; // ms for search debounce
export const NEARBY_RADIUS_KM = 50;

export const CATEGORY_LABELS: Record<string, string> = {
  traffic: '교통',
  weather: '날씨',
  tourist: '관광',
  city: '도시',
  nature: '자연',
  port: '항구',
  other: '기타',
};

export const CATEGORY_COLORS: Record<string, string> = {
  traffic: '#ff6b35',
  weather: '#4ecdc4',
  tourist: '#ffe66d',
  city: '#00f0ff',
  nature: '#00ff88',
  port: '#a8dadc',
  other: '#9b89c4',
};

export const REGION_LABELS: Record<string, string> = {
  '서울특별시': 'Seoul',
  '부산광역시': 'Busan',
  '제주특별자치도': 'Jeju',
  '인천광역시': 'Incheon',
  '대구광역시': 'Daegu',
  '대전광역시': 'Daejeon',
  '광주광역시': 'Gwangju',
  '경기도': 'Gyeonggi',
  '강원도': 'Gangwon',
  '울산광역시': 'Ulsan',
  '전라북도': 'Jeollabuk',
};
