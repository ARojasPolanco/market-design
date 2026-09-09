import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  BarChart3,
  AlertTriangle,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Tag,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useAdminStats, usePendingDesigns } from '../../hooks/useDesigns.js';
import { useCategories } from '../../hooks/useCategories.js';

const MOCK_USERS = [
  {
    id: 1,
    name: 'Diseños María',
    email: 'maria@email.com',
    role: 'Vendedor',
    status: 'active',
    designs: 45,
    sales: 523,
  },
  {
    id: 2,
    name: 'Arte Digital Juan',
    email: 'juan@email.com',
    role: 'Vendedor',
    status: 'active',
    designs: 28,
    sales: 215,
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos@email.com',
    role: 'Comprador',
    status: 'active',
    designs: 0,
    sales: 12,
  },
  {
    id: 4,
    name: 'SublimeArte',
    email: 'sublime@email.com',
    role: 'Vendedor',
    status: 'active',
    designs: 72,
    sales: 890,
  },
  {
    id: 5,
    name: 'Papelería Creativa',
    email: 'papeleria@email.com',
    role: 'Vendedor',
    status: 'active',
    designs: 53,
    sales: 340,
  },
  {
    id: 6,
    name: 'Laura Fernández',
    email: 'laura@email.com',
    role: 'Comprador',
    status: 'active',
    designs: 0,
    sales: 8,
  },
  {
    id: 7,
    name: 'Pedro Sánchez',
    email: 'pedro@email.com',
    role: 'Comprador',
    status: 'active',
    designs: 0,
    sales: 15,
  },
  {
    id: 8,
    name: 'Ana Martínez',
    email: 'ana@email.com',
    role: 'Comprador',
    status: 'active',
    designs: 0,
    sales: 6,
  },
  {
    id: 9,
    name: 'Usuario Suspendido',
    email: 'suspendido@email.com',
    role: 'Comprador',
    status: 'suspended',
    designs: 0,
    sales: 0,
  },
  {
    id: 10,
    name: 'Roberto Díaz',
    email: 'roberto@email.com',
    role: 'Comprador',
    status: 'active',
    designs: 0,
    sales: 22,
  },
  {
    id: 11,
    name: 'María García',
    email: 'maria.g@email.com',
    role: 'Comprador',
    status: 'active',
    designs: 0,
    sales: 4,
  },
  {
    id: 12,
    name: 'Jorge Ruiz',
    email: 'jorge@email.com',
    role: 'Comprador',
    status: 'active',
    designs: 0,
    sales: 9,
  },
];

const MOCK_REPORTS = [
  {
    id: 1,
    designId: '24',
    designTitle: 'Spider-Man Fan Art',
    designImage: 'https://placehold.co/120x120/ff0000/ffffff?text=Spider-Man',
    reporter: 'SublimeArte',
    reason: 'Contiene personaje con derechos de autor (Marvel)',
    status: 'pending',
    createdAt: '2025-02-15T10:00:00Z',
  },
  {
    id: 2,
    designId: '22',
    designTitle: 'Logo Nike Adaptado',
    designImage: 'https://placehold.co/120x120/1a1a2e/53d8fb?text=Nike',
    reporter: 'Diseños María',
    reason: 'Usa marca registrada sin autorización',
    status: 'reviewed',
    createdAt: '2025-02-12T14:00:00Z',
  },
];

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
            <div className="p-2 bg-teal-100 rounded-lg">
              <BarChart3 size={20} className="text-teal-600" />
            </div>
            <span className="text-sm text-gray-500">Comisiones</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalCommissions.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto">
        {[
          { id: 'pending', label: `Pendientes (${pending.length})`, icon: Clock },
          { id: 'users', label: 'Usuarios', icon: Users },
          {
            id: 'reports',
            label: `Denuncias (${MOCK_REPORTS.filter((r) => r.status === 'pending').length})`,
            icon: AlertTriangle,
          },
          { id: 'config', label: 'Configuración', icon: Settings },
          { id: 'categories', label: 'Categorías', icon: Tag },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-coral-400 text-coral-400'
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
      {activeTab === 'users' && <UsersSection />}

      {/* Reports */}
      {activeTab === 'reports' && <ReportsSection />}

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comisión nivel 1 (%) — al alcanzar 50 ventas
              </label>
              <input
                type="number"
                defaultValue={18}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comisión mínima (%) — tope
              </label>
              <input
                type="number"
                defaultValue={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DPI mínimo aceptado
              </label>
              <input
                type="number"
                defaultValue={150}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
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
                      className="text-coral-400 focus:ring-coral-500 rounded"
                    />
                    <span className="text-sm text-gray-600">{format}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="bg-coral-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-coral-500 transition-colors">
              Guardar configuración
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      {activeTab === 'categories' && <CategoriesSection />}
    </div>
  );
}

function ModerationCard({ design }) {
  const { categories, addCategory } = useCategories();
  const [showChecklist, setShowChecklist] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);
  const [assignedCategory, setAssignedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const handleApprove = () => {
    if (isCustomCategory && newCategory.trim()) {
      addCategory(newCategory.trim());
    }
    setShowSuccess('approved');
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    setShowRejectModal(false);
    setRejectReason('');
    setShowSuccess('rejected');
    setTimeout(() => setShowSuccess(null), 3000);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-start gap-4">
          {/* Image with link to detail */}
          <Link to={`/diseno/${design.id}`} className="shrink-0 group">
            <div className="relative">
              <img
                src={design.previewUrl}
                alt={design.title}
                className="w-24 h-24 rounded-lg object-cover group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={20} className="text-white drop-shadow-lg" />
              </div>
            </div>
          </Link>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{design.title}</h3>
                  <Link
                    to={`/diseno/${design.id}`}
                    className="text-coral-400 hover:text-coral-500"
                    title="Ver diseño completo"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
                <p className="text-sm text-gray-500">
                  {design.seller.name} · {design.category} · ${design.price.toLocaleString()}
                </p>
              </div>
              <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 text-xs px-2 py-1 rounded-full">
                <Clock size={12} /> Pendiente
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{design.description}</p>

            {/* Category assignment */}
            <div className="bg-coral-50 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-coral-500 mb-2">
                Categoría sugerida por el vendedor:{' '}
                <span className="font-bold">{design.category}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={isCustomCategory ? '__custom__' : assignedCategory}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomCategory(true);
                      setAssignedCategory('');
                    } else {
                      setIsCustomCategory(false);
                      setAssignedCategory(e.target.value);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-sm border border-coral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 bg-white"
                >
                  <option value="">Asignar categoría existente</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__custom__">+ Crear nueva categoría</option>
                </select>
                {isCustomCategory && (
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nueva categoría..."
                    className="flex-1 px-3 py-1.5 text-sm border border-coral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                )}
              </div>
            </div>

            {/* Checklist */}
            <button
              onClick={() => setShowChecklist(!showChecklist)}
              className="text-sm text-coral-400 hover:text-coral-500 mb-3"
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
                      className="text-coral-400 focus:ring-coral-500 rounded"
                    />
                    <span className="text-gray-600">{item}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Feedback */}
            {showSuccess === 'approved' && (
              <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg mb-3">
                Diseño aprobado correctamente
              </div>
            )}
            {showSuccess === 'rejected' && (
              <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-3">
                Diseño rechazado
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={16} /> Aprobar
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <XCircle size={16} /> Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rechazar diseño</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Diseño: <span className="font-medium">{design.title}</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo del rechazo <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explicá por qué se rechaza este diseño. Este mensaje se enviará al vendedor."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 10 caracteres. El vendedor recibirá este motivo por email.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={rejectReason.trim().length < 10}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UsersSection() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = MOCK_USERS.filter((user) => {
    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 text-sm"
        >
          <option value="all">Todos los roles</option>
          <option value="vendedor">Vendedores</option>
          <option value="comprador">Compradores</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-3">
        {filtered.length} {filtered.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Usuario</th>
                <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Rol</th>
                <th className="text-left text-sm font-medium text-gray-500 px-6 py-3 hidden sm:table-cell">
                  Diseños
                </th>
                <th className="text-left text-sm font-medium text-gray-500 px-6 py-3 hidden sm:table-cell">
                  Compras/Ventas
                </th>
                <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Estado</th>
                <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'Vendedor'
                          ? 'bg-coral-50 text-coral-500'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                    {user.designs || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                    {user.sales}
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
                    <button className="text-sm text-coral-400 hover:text-coral-500">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    p === page ? 'bg-coral-400 text-white' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportsSection() {
  const [filter, setFilter] = useState('all');

  const filtered = MOCK_REPORTS.filter((r) => filter === 'all' || r.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {[
          { id: 'all', label: 'Todas' },
          { id: 'pending', label: 'Pendientes' },
          { id: 'reviewed', label: 'Revisadas' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === f.id
                ? 'bg-coral-400 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-start gap-4">
              {/* Design preview */}
              <Link to={`/diseno/${report.designId}`} className="shrink-0 group">
                <div className="relative">
                  <img
                    src={report.designImage}
                    alt={report.designTitle}
                    className="w-20 h-20 rounded-lg object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={18} className="text-white drop-shadow-lg" />
                  </div>
                </div>
              </Link>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{report.designTitle}</h3>
                      <Link
                        to={`/diseno/${report.designId}`}
                        className="text-coral-400 hover:text-coral-500"
                        title="Ver diseño"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                      Reportado por: {report.reporter} ·{' '}
                      {new Date(report.createdAt).toLocaleDateString('es-AR')}
                    </p>
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
                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                      Retirar diseño
                    </button>
                    <span className="text-gray-300">|</span>
                    <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                      Descartar denuncia
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesSection() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleAdd = () => {
    if (addCategory(newCategoryName)) {
      setNewCategoryName('');
    }
  };

  const handleStartEdit = (index, name) => {
    setEditingIndex(index);
    setEditingValue(name);
  };

  const handleSaveEdit = (oldName) => {
    if (updateCategory(oldName, editingValue)) {
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleDelete = (name) => {
    deleteCategory(name);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-2">Gestión de categorías</h2>
      <p className="text-sm text-gray-500 mb-6">
        Las categorías que crees acá van a estar disponibles para los vendedores al cargar diseños.
      </p>

      {/* Add new */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nueva categoría..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
        />
        <button
          onClick={handleAdd}
          disabled={!newCategoryName.trim()}
          className="bg-coral-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-coral-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {categories.map((cat, i) => (
          <div
            key={cat}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
          >
            {editingIndex === i ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(cat);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="flex-1 px-3 py-1 border border-coral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(cat)}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Tag size={16} className="text-coral-500" />
                  <span className="text-sm font-medium text-gray-900">{cat}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(i, cat)}
                    className="p-1.5 text-gray-500 hover:text-coral-400 hover:bg-coral-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(cat)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar categoría</h3>
            <p className="text-sm text-gray-600 mb-4">
              ¿Seguro que querés eliminar <span className="font-medium">"{showDeleteConfirm}"</span>?
              Los diseños que la usen no se verán afectados.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-gray-400 mt-4">
        {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'} en total
      </p>
    </div>
  );
}
