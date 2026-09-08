import { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import { useAdminStats, usePendingDesigns } from '../hooks/useDesigns.js';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const { stats } = useAdminStats();
  const { designs: pending } = usePendingDesigns();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Panel de administración</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Pendientes</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Aprobados hoy</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.approvedToday}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Usuarios</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Comisiones</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalCommissions.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6">
        {[
          { id: 'pending', label: `Pendientes (${pending.length})`, icon: Clock },
          { id: 'users', label: 'Usuarios', icon: Users },
          { id: 'reports', label: 'Denuncias', icon: AlertTriangle },
          { id: 'config', label: 'Configuración', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pending designs */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pending.length > 0 ? (
            pending.map((design) => <ModerationCard key={design.id} design={design} />)
          ) : (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin diseños pendientes</h3>
              <p className="text-gray-500">Todos los diseños fueron revisados.</p>
            </div>
          )}
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Usuario</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Rol</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Estado</th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: 'Diseños María',
                    email: 'maria@email.com',
                    role: 'Vendedor',
                    status: 'active',
                  },
                  {
                    name: 'Arte Digital Juan',
                    email: 'juan@email.com',
                    role: 'Vendedor',
                    status: 'active',
                  },
                  {
                    name: 'Carlos López',
                    email: 'carlos@email.com',
                    role: 'Comprador',
                    status: 'active',
                  },
                  {
                    name: 'SublimeArte',
                    email: 'sublime@email.com',
                    role: 'Vendedor',
                    status: 'active',
                  },
                  {
                    name: 'Usuario Suspendido',
                    email: 'suspendido@email.com',
                    role: 'Comprador',
                    status: 'suspended',
                  },
                ].map((user, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {user.status === 'active' ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-indigo-600 hover:text-indigo-700">
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {[
            {
              id: 1,
              designTitle: 'Spider-Man Fan Art',
              reporter: 'SublimeArte',
              reason: 'Contiene personaje con derechos de autor (Marvel)',
              status: 'pending',
            },
            {
              id: 2,
              designTitle: 'Logo Nike Adaptado',
              reporter: 'Diseños María',
              reason: 'Usa marca registrada sin autorización',
              status: 'reviewed',
            },
          ].map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{report.designTitle}</h3>
                  <p className="text-sm text-gray-500">Reportado por: {report.reporter}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'pending'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {report.status === 'pending' ? 'Pendiente' : 'Revisado'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{report.reason}</p>
              <div className="flex gap-2">
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Retirar diseño
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                  Descartar denuncia
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Config */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
          <h2 className="font-semibold text-gray-900 mb-6">Configuración de comisiones</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comisión base (%)
              </label>
              <input
                type="number"
                defaultValue={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comisión nivel 1 (%) — al alcanzar 50 ventas
              </label>
              <input
                type="number"
                defaultValue={18}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comisión mínima (%) — tope
              </label>
              <input
                type="number"
                defaultValue={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DPI mínimo aceptado
              </label>
              <input
                type="number"
                defaultValue={150}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formatos aceptados
              </label>
              <div className="flex flex-wrap gap-2">
                {['PDF', 'PNG', 'ZIP', 'AI', 'PSD', 'EPS'].map((format) => (
                  <label key={format} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={['PDF', 'PNG', 'ZIP'].includes(format)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="text-sm text-gray-600">{format}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Guardar configuración
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ModerationCard({ design }) {
  const [showChecklist, setShowChecklist] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-start gap-4">
        <img
          src={design.previewUrl}
          alt={design.title}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-medium text-gray-900">{design.title}</h3>
              <p className="text-sm text-gray-500">
                {design.seller.name} · {design.category} · ${design.price.toLocaleString()}
              </p>
            </div>
            <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 text-xs px-2 py-1 rounded-full">
              <Clock size={12} /> Pendiente
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{design.description}</p>

          {/* Checklist */}
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className="text-sm text-indigo-600 hover:text-indigo-700 mb-3"
          >
            {showChecklist ? 'Ocultar checklist' : 'Mostrar checklist de moderación'}
          </button>

          {showChecklist && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
              {[
                '¿Es original o copia obvia de marca/personaje?',
                '¿La preview se ve nítida?',
                '¿Está categorizado correctamente?',
                '¿Título/descripción son coherentes?',
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="text-indigo-600 focus:ring-indigo-500 rounded"
                  />
                  <span className="text-gray-600">{item}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              <CheckCircle size={16} /> Aprobar
            </button>
            <button className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              <XCircle size={16} /> Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
