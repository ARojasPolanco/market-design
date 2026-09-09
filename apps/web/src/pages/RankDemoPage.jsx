import {
  DollarSign,
  ShoppingCart,
  Star,
  TrendingUp,
  Eye,
  Users,
  Target,
  Award,
  Zap,
} from 'lucide-react';
import { RankBadge, getRankInfo } from '../components/RankBadge.jsx';

const RANKS = [
  {
    rank: 'bronce',
    seller: {
      name: 'Vendedor Nuevo',
      username: 'NuevoUser',
      storeName: 'Mi Tienda',
      avatar: 'https://placehold.co/200x200/CD7F32/ffffff?text=N',
      description: '¡Recién empezando! Este es el perfil de un vendedor que se acaba de registrar.',
      rating: 0,
      salesCount: 0,
      isVerified: false,
      isTopSeller: false,
      isDiamante: false,
      totalDesigns: 0,
    },
    stats: { totalEarnings: 0, totalSales: 0, avgRating: 0, commission: 20 },
    label: 'Recién registrado',
  },
  {
    rank: 'plata',
    seller: {
      name: 'Vendedor Activo',
      username: 'ActivoDesigns',
      storeName: 'Diseños Activos',
      avatar: 'https://placehold.co/200x200/808080/ffffff?text=A',
      description: 'Ya tiene algunas ventas y está creciendo. Rango Plata desbloqueado.',
      rating: 4.5,
      salesCount: 65,
      isVerified: true,
      isTopSeller: false,
      isDiamante: false,
      totalDesigns: 15,
    },
    stats: { totalEarnings: 52000, totalSales: 65, avgRating: 4.5, commission: 18 },
    label: '50+ ventas',
  },
  {
    rank: 'oro',
    seller: {
      name: 'Vendedor Experto',
      username: 'ExpertoArte',
      storeName: 'Arte Experto',
      avatar: 'https://placehold.co/200x200/DAA520/ffffff?text=E',
      description: 'Vendedor consolidado con excelente reputación. Rango Oro desbloqueado.',
      rating: 4.8,
      salesCount: 250,
      isVerified: true,
      isTopSeller: true,
      isDiamante: false,
      totalDesigns: 45,
    },
    stats: { totalEarnings: 180000, totalSales: 250, avgRating: 4.8, commission: 15 },
    label: '200+ ventas',
  },
  {
    rank: 'diamante',
    seller: {
      name: 'Primer Diseñador',
      username: 'FirstDesigner',
      storeName: 'Diseños Premium',
      avatar: 'https://placehold.co/200x200/00C2B8/ffffff?text=D',
      description: 'Uno de los primeros 10 diseñadores. Comisión más baja de por vida.',
      rating: 4.9,
      salesCount: 500,
      isVerified: true,
      isTopSeller: true,
      isDiamante: true,
      totalDesigns: 72,
    },
    stats: { totalEarnings: 450000, totalSales: 500, avgRating: 4.9, commission: 10 },
    label: 'Primeros 10',
  },
];

export default function RankDemoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Demo de Rangos</h1>
        <p className="text-gray-500">
          Así se ve un vendedor en cada nivel. Esta página es solo para demostración.
        </p>
      </div>

      <div className="space-y-12">
        {RANKS.map((item) => (
          <RankPreview key={item.rank} {...item} />
        ))}
      </div>
    </div>
  );
}

function RankPreview({ rank, seller, stats, label }) {
  const rankInfo = getRankInfo(rank);
  const isDiamante = seller.isDiamante;

  return (
    <div className="border-2 rounded-2xl overflow-hidden" style={{ borderColor: rankInfo.color }}>
      {/* Header */}
      <div
        className="px-6 py-3 text-white font-semibold text-sm"
        style={{ backgroundColor: rankInfo.color }}
      >
        Rango: {rankInfo.name} — {label}
      </div>

      <div className="p-6 bg-white">
        {/* Diamante banner */}
        {isDiamante && (
          <div className="mb-6 bg-gradient-to-r from-brand-teal via-brand-violet to-brand-teal rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Award size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold">¡Bienvenido, Diseñador Diamante!</h2>
                <p className="text-white/80 text-sm">
                  Sos de los primeros 10 diseñadores. Tenés la comisión más baja (10%) de por vida.
                </p>
              </div>
              <RankBadge rank="diamante" size={40} showLabel={false} />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Ganancias</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart size={20} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Ventas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star size={20} className="text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Rating</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.avgRating || '—'}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Comisión</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{rankInfo.commission}%</p>
            <RankBadge rank={rank} size={20} />
          </div>
        </div>

        {/* Extra stats for Diamante */}
        {isDiamante && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-brand-teal/5 to-brand-violet/5 border border-brand-teal/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={16} className="text-brand-teal" />
                <span className="text-sm text-gray-600">Vistas totales</span>
              </div>
              <p className="text-xl font-bold text-gray-900">12.450</p>
            </div>
            <div className="bg-gradient-to-br from-brand-teal/5 to-brand-violet/5 border border-brand-teal/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-brand-violet" />
                <span className="text-sm text-gray-600">Tasa de conversión</span>
              </div>
              <p className="text-xl font-bold text-gray-900">4.2%</p>
            </div>
            <div className="bg-gradient-to-br from-brand-teal/5 to-brand-violet/5 border border-brand-teal/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-brand-rose" />
                <span className="text-sm text-gray-600">Compradores recurrentes</span>
              </div>
              <p className="text-xl font-bold text-gray-900">89</p>
            </div>
          </div>
        )}

        {/* Logros for Diamante */}
        {isDiamante && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap size={18} className="text-brand-orange" />
              Logros desbloqueados
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: '💎', title: 'Primeros 10', desc: 'Diseñador fundador' },
                { icon: '⭐', title: '500+ ventas', desc: 'Vendedor destacado' },
                { icon: '🏆', title: 'Top Seller', desc: 'Máxima reputación' },
                { icon: '✅', title: 'Verificado', desc: 'Identidad confirmada' },
              ].map((logro) => (
                <div key={logro.title} className="text-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{logro.icon}</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{logro.title}</p>
                  <p className="text-xs text-gray-500">{logro.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commission info */}
        {!isDiamante && (
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Progreso de comisión</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Nivel actual: {rankInfo.name}</span>
                  <span className="text-gray-700">{rankInfo.commission}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${rank === 'bronce' ? 33 : rank === 'plata' ? 66 : 100}%`,
                      backgroundColor: rankInfo.color,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">Bronce 20%</span>
                  <span className="text-xs text-gray-400">Plata 18%</span>
                  <span className="text-xs text-gray-400">Oro 15%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
