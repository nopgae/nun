export interface Camera {
  id: string;
  name: string;
  nameEn: string;
  latitude: number;
  longitude: number;
  region: string;
  city: string;
  country: string;
  feedUrl: string;
  feedType: 'hls' | 'mjpeg' | 'youtube' | 'iframe' | 'image-refresh';
  source: string;
  sourceUrl: string;
  category: 'traffic' | 'weather' | 'tourist' | 'city' | 'nature' | 'port' | 'other';
  isActive: boolean;
  lastChecked: string;
  thumbnailUrl?: string;
}

export interface Region {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  latitude: number;
  longitude: number;
  zoom: number;
  cameraCount?: number;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  type: 'government' | 'youtube' | 'webcam' | 'traffic';
  country: string;
  apiKey?: string;
}

export interface NearbyQuery {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
}

export interface CameraFilter {
  region?: string;
  city?: string;
  country?: string;
  category?: Camera['category'];
  feedType?: Camera['feedType'];
  isActive?: boolean;
  search?: string;
}

export interface FeedState {
  camera: Camera | null;
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
}
