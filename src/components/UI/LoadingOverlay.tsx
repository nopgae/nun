interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = 'SCANNING...' }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-4">
        {/* Ripple rings */}
        <div className="relative w-20 h-20">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-[#00f0ff]"
              style={{
                animation: `pulse-ring 2s ease-out infinite ${i * 0.6}s`,
                opacity: 0,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-4 h-4 rounded-full bg-[#00f0ff]"
              style={{ boxShadow: '0 0 20px #00f0ff' }}
            />
          </div>
        </div>

        {/* Text */}
        <div className="font-mono text-[#00f0ff] text-sm tracking-widest animate-pulse">
          {message}
        </div>

        {/* Progress bar */}
        <div className="w-40 h-0.5 bg-[rgba(0,240,255,0.1)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00f0ff] rounded-full"
            style={{
              animation: 'progress 2s ease-in-out infinite',
              width: '40%',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
