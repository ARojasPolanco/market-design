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
} from 'lucide-react';
import {
  useSellerSales,
  useSellerDesigns,
  usePendingDesigns,
  useRejectedDesigns,
} from '../hooks/useDesigns.js';
import RatingStars from '../components/RatingStars.jsx';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { sales, stats } = useSellerSales('s1');
  const { designs: myDesigns } = useSellerDesigns('s1');
  const { designs: pending } = usePendingDesigns();
  const { designs: rejected } = useRejectedDesigns();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel del vendedor</h1>
        <Link
          to="/vendedor/panel/subir"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
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
          <p className="text-xs text-green-600 mt-1">+12% vs mes anterior</p>
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
          <p className="text-2xl font-bold text-gray-900">{stats.commissionRate}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.nextLevel.salesNeeded - stats.totalSales} ventas para {stats.nextLevel.rate}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6">
        {[
          { id: 'overview', label: 'Resumen' },
          { id: 'designs', label: `Mis diseños (${myDesigns.length})` },
          { id: 'pending', label: `Pendientes (${pending.length})` },
          { id: 'rejected', label: `Rechazados (${rejected.length})` },
          { id: 'sales', label: 'Ventas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
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
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Ver todas <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {sales.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sale.designTitle}</p>
                    <p className="text-xs text-gray-500">{sale.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      +${sale.earnings.toLocaleString()}
                    </p>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nivel actual</span>
                <span className="font-medium text-gray-900">
                  {stats.commissionLevel} ({stats.commissionRate}%)
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Progreso al siguiente nivel</span>
                  <span className="text-gray-700">
                    {stats.totalSales}/{stats.nextLevel.salesNeeded} ventas
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((stats.totalSales / stats.nextLevel.salesNeeded) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Te faltan{' '}
                  <span className="font-medium text-indigo-600">
                    {stats.nextLevel.salesNeeded - stats.totalSales} ventas
                  </span>{' '}
                  para bajar tu comisión a{' '}
                  <span className="font-medium">{stats.nextLevel.rate}%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'designs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDesigns.map((design) => (
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
              <div
                key={design.id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
              >
                <img
                  src={design.previewUrl}
                  alt={design.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{design.title}</h3>
                  <p className="text-sm text-gray-500">
                    {design.category} · ${design.price.toLocaleString()}
                  </p>
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
                    <p className="text-sm text-gray-500">
                      {design.category} · ${design.price.toLocaleString()}
                    </p>
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
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Editar y reenviar
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
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
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">
                    Comprador
                  </th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">Precio</th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">
                    Comisión
                  </th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">
                    Ganancia
                  </th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {sale.designTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.buyerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      ${sale.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 text-right">
                      -${sale.commission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600 text-right">
                      +${sale.earnings.toLocaleString()}
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
    </div>
  );
}
