import type { Camera } from '../types/camera';
import { API_BASE_URL } from '../utils/constants';
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from '../utils/feedParser';

export function resolveStreamUrl(camera: Camera): string {
  switch (camera.feedType) {
    case 'youtube': {
      const videoId = extractYouTubeVideoId(camera.feedUrl);
      if (videoId) return getYouTubeEmbedUrl(videoId);
      return camera.feedUrl;
    }
    case 'hls':
      return `${API_BASE_URL}/feeds/${camera.id}/proxy`;
    case 'mjpeg':
    case 'image-refresh':
      return `${API_BASE_URL}/feeds/${camera.id}/snapshot`;
    case 'iframe':
      return camera.feedUrl;
    default:
      return camera.feedUrl;
  }
}

export function getSnapshotUrl(camera: Camera): string {
  return `${API_BASE_URL}/feeds/${camera.id}/snapshot?t=${Date.now()}`;
}
