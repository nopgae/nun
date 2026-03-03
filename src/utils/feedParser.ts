import type { Camera } from '../types/camera';

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
];

export function extractYouTubeVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeEmbedUrl(videoId: string, autoplay = true, mute = true): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: mute ? '1' : '0',
    rel: '0',
    modestbranding: '1',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function detectFeedType(url: string): Camera['feedType'] {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.endsWith('.m3u8') || url.includes('.m3u8?')) return 'hls';
  if (url.includes('mjpeg') || url.includes('cgi-bin/mjpeg')) return 'mjpeg';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) return 'image-refresh';
  return 'iframe';
}

export function getFeedDisplayUrl(camera: Camera): string {
  if (camera.feedType === 'youtube') {
    const videoId = extractYouTubeVideoId(camera.feedUrl);
    if (videoId) return getYouTubeEmbedUrl(videoId);
  }
  return camera.feedUrl;
}
