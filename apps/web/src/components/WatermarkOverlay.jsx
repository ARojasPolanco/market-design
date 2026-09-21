const WATERMARK_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
  <g transform="translate(20, 30) scale(0.9)">
    <path d="M18 8 Q18 0, 26 0 Q34 0, 34 8" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <rect x="4" y="10" width="12" height="24" rx="2" fill="white"/>
    <polygon points="4,10 16,10 10,28" fill="white"/>
    <polygon points="38,10 50,10 44,28" fill="white"/>
    <rect x="38" y="10" width="12" height="24" rx="2" fill="white"/>
    <path d="M42 32 L42 44 L46 40 L50 46 L52 44 L48 38 L52 36 Z" fill="white"/>
  </g>
  <text x="85" y="55" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" dominant-baseline="middle">Market Design</text>
</svg>`)}`;

export default function WatermarkOverlay({ small = false }) {
  const size = small ? '80px 56px' : '200px 140px';

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{
        backgroundImage: `url("${WATERMARK_SVG}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: size,
        opacity: 0.22,
        transform: 'rotate(-25deg) scale(2)',
        transformOrigin: 'center center',
        zIndex: 5,
      }}
    />
  );
}
