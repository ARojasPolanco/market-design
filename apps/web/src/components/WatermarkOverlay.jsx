export default function WatermarkOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      <svg
        className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%]"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.16, transform: 'rotate(-25deg)' }}
      >
        <defs>
          <pattern
            id="watermark-pattern"
            x="0"
            y="0"
            width="280"
            height="220"
            patternUnits="userSpaceOnUse"
          >
            {/* M Logo */}
            <g transform="translate(20, 30)">
              {/* Bag handle */}
              <path
                d="M18 8 Q18 0, 26 0 Q34 0, 34 8"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* M left vertical */}
              <rect x="4" y="10" width="12" height="24" rx="2" fill="white" />
              {/* M left diagonal */}
              <polygon points="4,10 16,10 10,28" fill="white" />
              {/* M right diagonal */}
              <polygon points="38,10 50,10 44,28" fill="white" />
              {/* M right vertical */}
              <rect x="38" y="10" width="12" height="24" rx="2" fill="white" />
              {/* Cursor */}
              <path d="M42 32 L42 44 L46 40 L50 46 L52 44 L48 38 L52 36 Z" fill="white" />
            </g>
            {/* Text */}
            <text
              x="90"
              y="55"
              fontFamily="Arial, sans-serif"
              fontSize="24"
              fontWeight="bold"
              fill="white"
              dominantBaseline="middle"
            >
              Market Design
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#watermark-pattern)" />
      </svg>
    </div>
  );
}
