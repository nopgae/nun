/**
 * ITS 국가교통정보센터 CCTV Open API
 * API 키: data.go.kr에서 무료 신청 (보통 1시간 이내 승인)
 * 서비스명: 국토교통부_CCTV 화상자료
 */

import type { Camera } from '../../src/types/camera.js';

const ITS_BASE_URL = 'https://openapi.its.go.kr:9443/cctvInfo';

interface ItsCamera {
  cctvname: string;
  coordx: string; // longitude
  coordy: string; // latitude
  cctvurl: string;
  cctvtype: string; // '1'=streaming, '2'=snapshot
  cctvresolution?: string;
}

interface ItsResponse {
  response: {
    data?: ItsCamera[];
    resultCode?: string;
    resultMsg?: string;
  };
}

// Cache: 5분
let cache: { cameras: Camera[]; expires: number } | null = null;

function itsToCamera(cam: ItsCamera, type: 'its' | 'ex', idx: number): Camera {
  const isStreaming = cam.cctvtype === '1';
  const lat = parseFloat(cam.coordy);
  const lng = parseFloat(cam.coordx);

  return {
    id: `its-${type}-${idx}-${Math.round(lng * 100)}-${Math.round(lat * 100)}`,
    name: cam.cctvname,
    nameEn: cam.cctvname,
    latitude: lat,
    longitude: lng,
    region: regionFromCoords(lat, lng),
    city: '',
    country: 'KR',
    feedUrl: cam.cctvurl,
    feedType: isStreaming ? 'hls' : 'image-refresh',
    source: 'ITS 국가교통정보센터',
    sourceUrl: 'https://www.its.go.kr/map/cctv',
    category: 'traffic',
    isActive: true,
    lastChecked: new Date().toISOString(),
  };
}

function regionFromCoords(lat: number, lng: number): string {
  if (lat > 37.4 && lat < 37.7 && lng > 126.7 && lng < 127.2) return '서울특별시';
  if (lat > 35.0 && lat < 35.3 && lng > 128.8 && lng < 129.3) return '부산광역시';
  if (lat > 33.2 && lat < 33.6 && lng > 126.1 && lng < 127.0) return '제주특별자치도';
  if (lat > 37.3 && lat < 37.6 && lng > 126.3 && lng < 126.8) return '인천광역시';
  if (lat > 35.7 && lat < 36.1 && lng > 128.4 && lng < 128.8) return '대구광역시';
  if (lat > 36.2 && lat < 36.5 && lng > 127.2 && lng < 127.6) return '대전광역시';
  if (lat > 35.0 && lat < 35.3 && lng > 126.6 && lng < 127.0) return '광주광역시';
  if (lat > 35.4 && lat < 35.7 && lng > 129.1 && lng < 129.5) return '울산광역시';
  if (lat > 37.0 && lat < 37.9 && lng > 126.6 && lng < 127.8) return '경기도';
  if (lat > 37.5 && lat < 38.6 && lng > 127.5 && lng < 129.4) return '강원도';
  return '대한민국';
}

async function fetchItsType(
  apiKey: string,
  type: 'its' | 'ex',
  cctvType: '1' | '2',
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
): Promise<Camera[]> {
  const params = new URLSearchParams({
    apiKey,
    type,
    cctvType,
    minX: String(bounds.minX),
    maxX: String(bounds.maxX),
    minY: String(bounds.minY),
    maxY: String(bounds.maxY),
    getType: 'json',
  });

  const { default: fetch } = await import('node-fetch');
  const res = await fetch(`${ITS_BASE_URL}?${params.toString()}`, {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) return [];

  const data = await res.json() as ItsResponse;
  const cameras = data.response?.data ?? [];
  return cameras
    .filter(c => c.coordx && c.coordy && c.cctvurl)
    .map((c, i) => itsToCamera(c, type, i));
}

export async function fetchItsCameras(): Promise<Camera[]> {
  if (cache && Date.now() < cache.expires) {
    return cache.cameras;
  }

  const apiKey = process.env.DATA_GO_KR_API_KEY;
  if (!apiKey) return [];

  const KOREA_BOUNDS = { minX: 124.0, maxX: 132.0, minY: 33.0, maxY: 39.0 };

  try {
    const [itsCams, exCams] = await Promise.all([
      fetchItsType(apiKey, 'its', '2', KOREA_BOUNDS), // 도시부 스냅샷
      fetchItsType(apiKey, 'ex', '2', KOREA_BOUNDS),  // 고속도로 스냅샷
    ]);

    const cameras = [...itsCams, ...exCams];
    cache = { cameras, expires: Date.now() + 5 * 60 * 1000 };
    console.log(`ITS API: ${cameras.length}개 카메라 로드됨`);
    return cameras;
  } catch (err) {
    console.error('ITS API 오류:', err);
    return [];
  }
}

export function isItsApiConfigured(): boolean {
  return Boolean(process.env.DATA_GO_KR_API_KEY);
}
