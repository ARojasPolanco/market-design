export function RankBronce({ size = 24, showLabel = true }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="bronce-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CD7F32" />
            <stop offset="100%" stopColor="#A0522D" />
          </linearGradient>
        </defs>
        <path
          d="M16 2L4 8v8c0 7.18 5.12 13.88 12 16 6.88-2.12 12-8.82 12-16V8L16 2z"
          fill="url(#bronce-grad)"
          stroke="#8B4513"
          strokeWidth="0.5"
        />
        <text x="16" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          B
        </text>
      </svg>
      {showLabel && (
        <span className="text-xs font-semibold" style={{ color: '#CD7F32' }}>
          Bronce
        </span>
      )}
    </div>
  );
}

export function RankPlata({ size = 24, showLabel = true }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="plata-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C0C0C0" />
            <stop offset="100%" stopColor="#808080" />
          </linearGradient>
        </defs>
        <path
          d="M16 2L4 8v8c0 7.18 5.12 13.88 12 16 6.88-2.12 12-8.82 12-16V8L16 2z"
          fill="url(#plata-grad)"
          stroke="#696969"
          strokeWidth="0.5"
        />
        <text x="16" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          S
        </text>
      </svg>
      {showLabel && (
        <span className="text-xs font-semibold" style={{ color: '#808080' }}>
          Plata
        </span>
      )}
    </div>
  );
}

export function RankOro({ size = 24, showLabel = true }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="oro-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#DAA520" />
          </linearGradient>
        </defs>
        <path
          d="M16 2L4 8v8c0 7.18 5.12 13.88 12 16 6.88-2.12 12-8.82 12-16V8L16 2z"
          fill="url(#oro-grad)"
          stroke="#B8860B"
          strokeWidth="0.5"
        />
        <text x="16" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          G
        </text>
      </svg>
      {showLabel && (
        <span className="text-xs font-semibold" style={{ color: '#DAA520' }}>
          Oro
        </span>
      )}
    </div>
  );
}

export function RankPlatino({ size = 28, showLabel = true }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="platino-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5E4E2" />
            <stop offset="50%" stopColor="#B0B0B0" />
            <stop offset="100%" stopColor="#E5E4E2" />
          </linearGradient>
          <filter id="platino-glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d="M16 2L4 8v8c0 7.18 5.12 13.88 12 16 6.88-2.12 12-8.82 12-16V8L16 2z"
          fill="url(#platino-grad)"
          stroke="#808080"
          strokeWidth="0.5"
          filter="url(#platino-glow)"
        />
        <path d="M16 2L4 8h24L16 2z" fill="white" opacity="0.4" />
        <text x="16" y="20" textAnchor="middle" fill="#333" fontSize="9" fontWeight="bold">
          P
        </text>
      </svg>
      {showLabel && (
        <span className="text-xs font-bold" style={{ color: '#808080' }}>
          Platino
        </span>
      )}
    </div>
  );
}

export function RankDiamante({ size = 28, showLabel = true }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="animate-pulse">
        <defs>
          <linearGradient id="diamante-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C2B8" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#00C2B8" />
          </linearGradient>
          <filter id="diamante-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d="M16 2L6 12l10 18 10-18L16 2z"
          fill="url(#diamante-grad)"
          stroke="#00C2B8"
          strokeWidth="0.5"
          filter="url(#diamante-glow)"
        />
        <path d="M16 2L6 12h20L16 2z" fill="white" opacity="0.3" />
        <text x="16" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
          D
        </text>
      </svg>
      {showLabel && (
        <span className="text-xs font-bold bg-gradient-to-r from-brand-teal to-brand-violet bg-clip-text text-transparent">
          Diamante
        </span>
      )}
    </div>
  );
}

export function RankBadge({ rank = 'bronce', size = 24, showLabel = true }) {
  switch (rank) {
    case 'diamante':
      return <RankDiamante size={size} showLabel={showLabel} />;
    case 'platino':
      return <RankPlatino size={size} showLabel={showLabel} />;
    case 'oro':
      return <RankOro size={size} showLabel={showLabel} />;
    case 'plata':
      return <RankPlata size={size} showLabel={showLabel} />;
    case 'bronce':
    default:
      return <RankBronce size={size} showLabel={showLabel} />;
  }
}

export function getRankInfo(rank) {
  const ranks = {
    bronce: { name: 'Bronce', commission: 20, color: '#CD7F32', type: 'auto', salesNeeded: 0 },
    plata: { name: 'Plata', commission: 18, color: '#808080', type: 'auto', salesNeeded: 50 },
    oro: { name: 'Oro', commission: 15, color: '#DAA520', type: 'auto', salesNeeded: 200 },
    platino: { name: 'Platino', commission: 12, color: '#808080', type: 'manual', salesNeeded: 0 },
    diamante: { name: 'Diamante', commission: 10, color: '#00C2B8', type: 'manual', salesNeeded: 0 },
  };
  return ranks[rank] || ranks.bronce;
}

export const ALL_RANKS = ['bronce', 'plata', 'oro', 'platino', 'diamante'];
export const MANUAL_RANKS = ['platino', 'diamante'];
export const AUTO_RANKS = ['bronce', 'plata', 'oro'];
