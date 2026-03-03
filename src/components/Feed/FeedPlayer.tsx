import { useEffect, useRef, useState } from 'react';
import type { Camera } from '../../types/camera';
import { FEED_REFRESH_INTERVAL } from '../../utils/constants';
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from '../../utils/feedParser';

interface FeedPlayerProps {
  camera: Camera;
  onLoaded?: () => void;
  onError?: (msg: string) => void;
}

function YouTubePlayer({ feedUrl, onLoaded, cameraName }: { feedUrl: string; onLoaded?: () => void; cameraName: string }) {
  const videoId = extractYouTubeVideoId(feedUrl);
  if (!videoId) return <OfflinePlaceholder message="Invalid YouTube URL" />;

  const embedUrl = getYouTubeEmbedUrl(videoId);

  return (
    <div className="relative w-full h-full">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        onLoad={onLoaded}
        style={{ border: 'none' }}
        title={cameraName}
      />
      {/* Fallback notice */}
      <div
        className="absolute bottom-1 right-1 font-mono text-[9px] px-1.5 py-0.5 rounded pointer-events-none"
        style={{ background: 'rgba(10,10,15,0.7)', color: 'rgba(0,240,255,0.4)' }}
      >
        YouTube
      </div>
    </div>
  );
}

function HLSPlayer({
  feedUrl,
  onLoaded,
  onError,
}: {
  feedUrl: string;
  onLoaded?: () => void;
  onError?: (msg: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: import('hls.js').default | null = null;

    async function initHLS() {
      const { default: Hls } = await import('hls.js');
      if (Hls.isSupported()) {
        hlsInstance = new Hls({ enableWorker: true });
        hlsInstance.loadSource(feedUrl);
        hlsInstance.attachMedia(video!);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          video!.play().catch(() => {});
          onLoaded?.();
        });
        hlsInstance.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) onError?.('HLS stream error');
        });
      } else if (video?.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = feedUrl;
        video.addEventListener('loadedmetadata', () => {
          (video as HTMLVideoElement).play().catch(() => {});
          onLoaded?.();
        });
        video.addEventListener('error', () => onError?.('Native HLS error'));
      } else {
        onError?.('HLS not supported in this browser');
      }
    }

    initHLS();
    return () => { hlsInstance?.destroy(); };
  }, [feedUrl, onLoaded, onError]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-contain"
      autoPlay
      muted
      playsInline
    />
  );
}

function ImageRefreshPlayer({
  feedUrl,
  onLoaded,
  onError,
}: {
  feedUrl: string;
  onLoaded?: () => void;
  onError?: (msg: string) => void;
}) {
  const [src, setSrc] = useState(`${feedUrl}?t=${Date.now()}`);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errCount, setErrCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSrc(`${feedUrl}?t=${Date.now()}`);
    }, FEED_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [feedUrl]);

  if (errCount >= 3) return <OfflinePlaceholder message="스냅샷 피드 불가 (Snapshot unavailable)" />;

  return (
    <img
      src={src}
      className="w-full h-full object-contain"
      alt="Camera snapshot"
      onLoad={() => {
        if (!hasLoaded) { setHasLoaded(true); onLoaded?.(); }
        setErrCount(0);
      }}
      onError={() => {
        setErrCount(n => {
          if (n + 1 >= 3) onError?.('Snapshot feed unavailable');
          return n + 1;
        });
      }}
    />
  );
}

function IframePlayer({
  feedUrl,
  onLoaded,
  cameraName,
}: {
  feedUrl: string;
  onLoaded?: () => void;
  cameraName: string;
}) {
  // Windy and similar public embed URLs — no sandbox to avoid blocking scripts
  return (
    <div className="relative w-full h-full">
      <iframe
        src={feedUrl}
        className="w-full h-full"
        onLoad={onLoaded}
        style={{ border: 'none' }}
        allow="autoplay; fullscreen"
        allowFullScreen
        title={cameraName}
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div
        className="absolute bottom-1 right-1 font-mono text-[9px] px-1.5 py-0.5 rounded pointer-events-none"
        style={{ background: 'rgba(10,10,15,0.7)', color: 'rgba(0,240,255,0.4)' }}
      >
        LIVE
      </div>
    </div>
  );
}

function OfflinePlaceholder({ message }: { message: string }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3"
      style={{ background: 'rgba(10,10,15,0.8)' }}
    >
      <div className="font-mono text-[rgba(0,240,255,0.4)] text-xs text-center">
        <div className="text-2xl mb-2">⊘</div>
        <div className="tracking-widest">CAMERA OFFLINE</div>
        <div className="text-[rgba(229,231,235,0.3)] text-xs mt-1 max-w-[180px] leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
}

export function FeedPlayer({ camera, onLoaded, onError }: FeedPlayerProps) {
  switch (camera.feedType) {
    case 'youtube':
      return (
        <YouTubePlayer
          feedUrl={camera.feedUrl}
          onLoaded={onLoaded}
          cameraName={camera.nameEn}
        />
      );
    case 'hls':
      return (
        <HLSPlayer
          feedUrl={`/api/feeds/${camera.id}/proxy`}
          onLoaded={onLoaded}
          onError={onError}
        />
      );
    case 'mjpeg':
    case 'image-refresh':
      return (
        <ImageRefreshPlayer
          feedUrl={`/api/feeds/${camera.id}/snapshot`}
          onLoaded={onLoaded}
          onError={onError}
        />
      );
    case 'iframe':
      return (
        <IframePlayer
          feedUrl={camera.feedUrl}
          onLoaded={onLoaded}
          cameraName={camera.nameEn}
        />
      );
    default:
      return <OfflinePlaceholder message="Unknown feed type" />;
  }
}
