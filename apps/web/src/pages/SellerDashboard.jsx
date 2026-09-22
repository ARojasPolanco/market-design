import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  TrendingUp,
  DollarSign,
  Star,
  Eye,
  ShoppingCart,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  Save,
  Award,
  Zap,
  Target,
} from 'lucide-react';
import BackButton from '../components/BackButton.jsx';
import CommissionInfo from '../components/CommissionInfo.jsx';
import {
  useSellerSales,
  useSellerDesigns,
  useSellerRatings,
} from '../hooks/useDesigns.js';
import { useCurrentSeller } from '../hooks/useSeller.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../config/api.js';
import RatingStars from '../components/RatingStars.jsx';
import { RankBadge, getRankInfo } from '../components/RankBadge.jsx';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const { sales, stats } = useSellerSales();
  const { designs: myDesigns, refetch: refetchDesigns } = useSellerDesigns();
  const { ratings } = useSellerRatings();
  const approved = myDesigns.filter((d) => d.status === 'approved');
  const pending = myDesigns.filter((d) => d.status === 'pending');
  const rejected = myDesigns.filter((d) => d.status === 'rejected');
  const { seller, isLoading } = useCurrentSeller();
  const { showToast } = useToast();

  const handleDeleteDesign = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/v1/designs/${deleteModal}`);
      showToast('Diseño eliminado correctamente', { type: 'success' });
      setDeleteModal(null);
      setDeleteConfirmText('');
      refetchDesigns();
    } catch (_err) {
      showToast('Error al eliminar el diseño', { type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!seller || (seller.role !== 'seller' && seller.role !== 'admin')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso no disponible</h2>
        <p className="text-gray-500 mb-4">Esta sección es solo para vendedores.</p>
        <Link to="/registro" className="text-brand-teal hover:underline">
          Registrate como vendedor
        </Link>
      </div>
    );
  }

  const rankInfo = getRankInfo(seller.rank);
  const isDiamante = seller.isDiamante;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton label="Volver al inicio" />

      {/* Diamante banner */}
      {isDiamante && (
        <div className="mb-6 bg-gradient-to-r from-brand-teal via-brand-violet to-brand-teal rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
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

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Panel del vendedor</h1>
          <RankBadge rank={seller.rank} size={28} />
        </div>
        <Link
          to="/vendedor/panel/subir"
          className="bg-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-dark-light transition-colors flex items-center gap-2"
        >
          <Upload size={18} />
          Subir diseño
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Ganancias totales</span>
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
          <p className="text-xs text-gray-500 mt-1">Últimos 90 días</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star size={20} className="text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Rating</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
          <RatingStars rating={stats.avgRating} size={12} showValue={false} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Comisión</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{rankInfo.commission}%</p>
          <p className="text-xs mt-1" style={{ color: rankInfo.color }}>
            Rango {rankInfo.name}
          </p>
        </div>
      </div>

      {/* Extra stats for Diamante */}
      {isDiamante && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-brand-teal/5 to-brand-violet/5 border border-brand-teal/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={16} className="text-brand-teal" />
              <span className="text-sm text-gray-600">Vistas totales</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-brand-teal/5 to-brand-violet/5 border border-brand-teal/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-brand-violet" />
              <span className="text-sm text-gray-600">Tasa de conversión</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.conversionRate}%</p>
          </div>
        </div>
      )}

      {/* Logros for Diamante */}
      {isDiamante && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
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
              <div
                key={logro.title}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-2xl">{logro.icon}</span>
                <p className="text-sm font-medium text-gray-900 mt-1">{logro.title}</p>
                <p className="text-xs text-gray-500">{logro.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commission info */}
      <CommissionInfo variant="compact" />

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6 overflow-visible">
        {[
          { id: 'overview', label: 'Resumen', tooltip: 'Acá podés ver el resumen de tus ventas y estadísticas' },
          { id: 'designs', label: `Mis diseños (${approved.length})`, tooltip: 'Acá podés ver tus diseños aprobados que están a la venta' },
          { id: 'pending', label: `Pendientes (${pending.length})`, tooltip: 'Acá podés ver tus diseños que están pendientes de revisión' },
          { id: 'rejected', label: `Rechazados (${rejected.length})`, tooltip: 'Acá podés ver los diseños que fueron rechazados' },
          { id: 'sales', label: 'Ventas', tooltip: 'Acá podés ver tu historial de ventas y ganancias' },
          { id: 'profile', label: 'Mi perfil', tooltip: 'Acá podés editar tu perfil de vendedor' },
        ].map((tab) => (
          <div key={tab.id} className="relative flex">
            <button
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={(e) => {
                const tooltip = e.currentTarget.nextElementSibling;
                if (tooltip) tooltip.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const tooltip = e.currentTarget.nextElementSibling;
                if (tooltip) tooltip.style.opacity = '0';
              }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {tab.tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent sales */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Ventas recientes</h2>
              <button
                onClick={() => setActiveTab('sales')}
                className="text-sm text-brand-teal hover:text-brand-teal-dark flex items-center gap-1"
              >
                Ver todas <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sale.design?.title || 'Diseño'}</p>
                    <p className="text-xs text-gray-500">{sale.buyer?.fullname || sale.buyer?.username || 'Comprador'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+${Number(sale.sellerEarnings || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(sale.createdAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission progress */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Nivel de comisión</h2>
            <div className="flex items-center gap-4 mb-4">
              <RankBadge rank={seller.rank} size={36} />
              <div>
                <p className="font-medium text-gray-900">Rango {rankInfo.name}</p>
                <p className="text-sm text-gray-500">{rankInfo.commission}% de comisión</p>
              </div>
            </div>
            {!isDiamante && (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Progreso al siguiente nivel</span>
                    <span className="text-gray-700">{stats.totalSales}/{stats.nextLevel.salesNeeded} ventas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-teal h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((stats.totalSales / stats.nextLevel.salesNeeded) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Te faltan <span className="font-medium text-brand-teal">{stats.nextLevel.salesNeeded - stats.totalSales} ventas</span> para
                    bajar tu comisión a <span className="font-medium">{stats.nextLevel.rate}%</span>
                  </p>
                </div>
              </>
            )}
            {isDiamante && (
              <div className="bg-gradient-to-r from-brand-teal/10 to-brand-violet/10 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-medium">
                  Tenés la comisión más baja (10%) de por vida como Diseñador Diamante.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews section in overview */}
      {activeTab === 'overview' && ratings.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimas reseñas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratings.slice(0, 4).map((rating) => (
              <div key={rating.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <RatingStars rating={rating.score} size={14} showValue={false} />
                  <span className="text-xs text-gray-500">· {rating.designTitle}</span>
                </div>
                {rating.comment && (
                  <p className="text-sm text-gray-600 line-clamp-2">{rating.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {rating.buyer?.username || rating.buyer?.fullname || 'Usuario'} · {new Date(rating.createdAt).toLocaleDateString('es-AR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'designs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDesigns.filter(d => d.status === 'approved').map((design) => (
            <Link
              key={design.id}
              to={`/diseno/${design.id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={design.previewUrl}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Publicado
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{design.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>${design.price.toLocaleString()}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ShoppingCart size={14} /> {design.salesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {design.viewCount}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pending.length > 0 ? (
            pending.map((design) => (
              <div key={design.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                <img
                  src={design.previewUrl}
                  alt={design.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{design.title}</h3>
                  <p className="text-sm text-gray-500">{design.category} · ${design.price.toLocaleString()}</p>
                </div>
                <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 text-sm px-3 py-1 rounded-full">
                  <Clock size={14} /> Pendiente
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin diseños pendientes</h3>
              <p className="text-gray-500">Todos tus diseños fueron revisados.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rejected' && (
        <div className="space-y-4">
          {rejected.length > 0 ? (
            rejected.map((design) => (
              <div key={design.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={design.previewUrl}
                    alt={design.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{design.title}</h3>
                    <p className="text-sm text-gray-500">{design.category} · ${design.price.toLocaleString()}</p>
                  </div>
                  <span className="flex items-center gap-1 text-red-600 bg-red-50 text-sm px-3 py-1 rounded-full">
                    <XCircle size={14} /> Rechazado
                  </span>
                </div>
                <div className="bg-red-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Motivo:</span> {design.rejectionReason}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/vendedor/panel/subir?edit=${design.id}`}
                    className="text-sm text-brand-teal hover:text-brand-teal-dark font-medium"
                  >
                    Editar y reenviar
                  </Link>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => { setDeleteModal(design.id); setDeleteConfirmText(''); }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin diseños rechazados</h3>
              <p className="text-gray-500">Todos tus diseños fueron aprobados.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Diseño</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Comprador</th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">Precio</th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">Comisión</th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">Ganancia</th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.design?.title || 'Diseño'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.buyer?.fullname || sale.buyer?.username || 'Comprador'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      ${Number(sale.price || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 text-right">
                      -${Number(sale.commission || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600 text-right">
                      +${Number(sale.sellerEarnings || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right">
                      {new Date(sale.createdAt).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Profile tab */}
      {activeTab === 'profile' && <ProfileSection seller={seller} />}

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Eliminar diseño</h3>
              </div>
              <button
                onClick={() => { setDeleteModal(null); setDeleteConfirmText(''); }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-6 space-y-3">
              <p className="text-sm text-gray-600">
                Si eliminás este diseño, vas a tener que cargarlo nuevamente desde cero (archivos, imágenes, descripción, etc.).
              </p>
              <p className="text-sm text-gray-600">
                Si lo que querés es corregirlo, podés usar <span className="font-medium">"Editar y reenviar"</span> en su lugar.
              </p>
              <p className="text-sm text-gray-600">
                Para confirmar la eliminación, escribí <span className="font-bold text-red-600">Eliminar</span> abajo:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Escribí Eliminar"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteModal(null); setDeleteConfirmText(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteDesign}
                disabled={deleteConfirmText !== 'Eliminar'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Eliminar diseño
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileSection({ seller }) {
  const [storeName, setStoreName] = useState(seller.storeName);
  const [description, setDescription] = useState(seller.description);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(seller.avatarUrl);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { refreshUser } = useAuth();
  const { showToast } = useToast();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        await api.post('/v1/auth/upload-avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // Update profile fields if changed
      const updateData = {};
      if (storeName !== seller.storeName) updateData.storeName = storeName;
      if (description !== seller.description) updateData.description = description;

      if (Object.keys(updateData).length > 0) {
        await api.patch('/v1/auth/profile', updateData);
      }

      await refreshUser();
      setAvatarFile(null);
      setSaved(true);
      showToast('Perfil actualizado correctamente', { type: 'success' });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const message = err.response?.data?.message || 'Error al guardar el perfil';
      showToast(message, { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-6">Editar perfil de vendedor</h2>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-500">
                  {seller.storeName?.charAt(0)?.toUpperCase() || seller.username?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}
            <label className="absolute bottom-0 right-0 p-1.5 bg-dark text-white rounded-full cursor-pointer hover:bg-dark-light transition-colors">
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div>
            <p className="font-medium text-gray-900">{seller.name}</p>
            <p className="text-sm text-gray-500">@{seller.username}</p>
            <RankBadge rank={seller.rank} size={20} />
            {avatarFile && (
              <p className="text-xs text-brand-teal mt-1">Nueva foto seleccionada</p>
            )}
          </div>
        </div>

        {/* Store name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de tienda
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
          <p className="text-xs text-gray-500 mt-1">
            Este nombre ven los compradores en tu tienda y en tus diseños.
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción de la tienda
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {description.length}/200 caracteres
          </p>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-dark text-white px-6 py-2 rounded-lg font-medium hover:bg-dark-light transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && (
            <span className="text-sm text-brand-teal flex items-center gap-1">
              <CheckCircle size={16} /> Guardado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
