import { useState } from 'react';

export default function AchievementGrid({ achievements = [] }) {
  const [active, setActive] = useState(null);

  if (achievements.length === 0) return null;

  return (
    <div className="grid grid-cols-5 gap-3 sm:gap-5 max-w-md">
      {achievements.map((a) => {
        const earned = Boolean(a.earned);
        const isLegend = a.id === 'leyenda';
        return (
          <div key={a.id} className="relative flex flex-col items-center">
            <button
              type="button"
              onClick={() => setActive(active === a.id ? null : a.id)}
              onMouseEnter={() => setActive(a.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(a.id)}
              onBlur={() => setActive(null)}
              aria-label={`${a.name} (${earned ? 'obtenido' : 'no obtenido'})`}
              className={`transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-teal rounded-full ${
                earned ? '' : 'grayscale opacity-40'
              }`}
            >
              <img
                src={`/badges/${a.id}.svg`}
                alt={a.name}
                className={isLegend ? 'w-16 h-16' : 'w-14 h-14'}
              />
            </button>

            <span
              className={`mt-1 text-[10px] text-center leading-tight ${
                earned ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {a.name}
            </span>

            {active === a.id && (
              <div className="absolute z-30 top-full mt-2 w-44 -translate-x-1/2 left-1/2 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
                <p className="font-semibold mb-1">{a.name}</p>
                <p className="text-gray-300">{a.description}</p>
                <p className="mt-1.5 text-[11px] text-brand-teal">
                  {earned && a.earnedAt
                    ? `Obtenido el ${new Date(a.earnedAt).toLocaleDateString('es-AR')}`
                    : 'Todavía no obtenido'}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
