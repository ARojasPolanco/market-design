import { Award, Shield } from 'lucide-react';
import { RankBadge } from './RankBadge.jsx';

const RANKS = [
  {
    rank: 'bronce',
    commission: 20,
    requirement: 'Por defecto al registrarte',
    description: 'Nivel inicial para todos los vendedores.',
  },
  {
    rank: 'plata',
    commission: 18,
    requirement: '50+ ventas en los últimos 90 días',
    description: 'Bajás tu comisión un 2% automáticamente.',
  },
  {
    rank: 'oro',
    commission: 15,
    requirement: '200+ ventas en los últimos 90 días',
    description: 'La comisión más baja por ventas.',
  },
  {
    rank: 'platino',
    commission: 12,
    requirement: 'Solo por invitación del equipo',
    description: 'Para vendedores con ventas excepcionales.',
  },
];

export default function CommissionInfo({ variant = 'full' }) {
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award size={18} className="text-brand-orange" />
          Sistema de rangos
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Cuanto más vendés, menos comisión pagás. Los rangos se calculan automáticamente según tus ventas de los últimos 90 días.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RANKS.map((r) => (
            <div key={r.rank} className="text-center p-3 bg-gray-50 rounded-lg">
              <RankBadge rank={r.rank} size={28} showLabel={false} />
              <p className="text-sm font-medium text-gray-900 mt-1">{r.commission}%</p>
              <p className="text-xs text-gray-500 capitalize">{r.rank}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <Award size={18} className="text-brand-orange" />
        ¿Cómo funcionan los rangos?
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Cuanto más vendés, menos comisión pagás. Los rangos se calculan automáticamente según tus ventas de los últimos 90 días.
        También existe un rango especial por invitación del equipo para vendedores con ventas excepcionales.
      </p>

      <div className="space-y-3">
        {RANKS.map((r) => (
          <div
            key={r.rank}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <RankBadge rank={r.rank} size={32} showLabel={false} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 capitalize">{r.rank}</span>
                <span className="text-sm text-gray-500">— {r.commission}% de comisión</span>
              </div>
              <p className="text-sm text-gray-600">{r.description}</p>
              <p className="text-xs text-gray-400 mt-1">{r.requirement}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-brand-teal/5 border border-brand-teal/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-brand-teal shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">¿Cómo subo de rango?</h4>
            <p className="text-sm text-gray-600">
              Los rangos se calculan automáticamente. Solo tenés que seguir vendiendo diseños de calidad.
              El sistema revisa tus ventas cada 24 horas y te sube de rango si cumplís el requisito.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
