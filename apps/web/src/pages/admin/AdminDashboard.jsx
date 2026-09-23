import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logger from '../../utils/logger.js';
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
  Tag,
  X,
  Pencil,
  Trash2,
  Wrench,
} from 'lucide-react';
import { useAdminStats, usePendingDesigns, useAdminReports, useAdminUsers } from '../../hooks/useDesigns.js';
import { useCategories } from '../../hooks/useCategories.js';
import { useTechniques } from '../../hooks/useTechniques.js';
import { useToast } from '../../context/ToastContext.jsx';
import api from '../../config/api.js';
import { RankBadge } from '../../components/RankBadge.jsx';

const MANUAL_RANKS = ['platino', 'diamante'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const { stats } = useAdminStats();
  const { designs: pending, refetch: refetchPending } = usePendingDesigns();
  const { reports } = useAdminReports();

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
            ${(stats.totalCommissions || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto">
        {[
          { id: 'pending', label: `Pendientes (${pending.length})`, icon: Clock },
          { id: 'designs', label: 'Diseños', icon: Eye },
          { id: 'users', label: 'Usuarios', icon: Users },
          {
            id: 'reports',
            label: `Denuncias (${reports.filter((r) => r.status === 'pending').length})`,
            icon: AlertTriangle,
          },
          { id: 'config', label: 'Configuración', icon: Settings },
          { id: 'categories', label: 'Categorías', icon: Tag },
          { id: 'techniques', label: 'Técnicas', icon: Wrench },
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
            pending.map((design) => <ModerationCard key={design.id} design={design} onAction={refetchPending} />)
          ) : (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin diseños pendientes</h3>
              <p className="text-gray-500">Todos los diseños fueron revisados.</p>
            </div>
          )}
        </div>
      )}

      {/* Designs management */}
      {activeTab === 'designs' && <DesignsSection />}

      {/* Users */}
      {activeTab === 'users' && <UsersSection />}

      {/* Reports */}
      {activeTab === 'reports' && <ReportsSection />}

      {/* Config */}
      {activeTab === 'config' && <ConfigSection />}

      {/* Categories */}
      {activeTab === 'categories' && <CategoriesSection />}

      {/* Techniques */}
      {activeTab === 'techniques' && <TechniquesSection />}
    </div>
  );
}

function ConfigSection() {
  const [config, setConfig] = useState({
    commission_base: 20,
    commission_level1: 18,
    commission_min: 15,
    dpi_min: 150,
    formats: ['PDF', 'PNG', 'ZIP'],
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await api.get('/v1/admin/config');
      if (res.data.config && res.data.config.commission) {
        setConfig((prev) => ({ ...prev, ...res.data.config.commission }));
      }
    } catch (err) {
      logger.error('Error fetching config:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/v1/admin/config', { key: 'commission', value: config });
      showToast('Configuración guardada', { type: 'success' });
    } catch (_err) {
      showToast('Error al guardar', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFormat = (format) => {
    setConfig((prev) => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter((f) => f !== format)
        : [...prev.formats, format],
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
      <h2 className="font-semibold text-gray-900 mb-6">Configuración de comisiones</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comisión base (%)
          </label>
          <input
            type="number"
            value={config.commission_base}
            onChange={(e) => updateConfig('commission_base', Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comisión nivel 1 (%) — al alcanzar 50 ventas
          </label>
          <input
            type="number"
            value={config.commission_level1}
            onChange={(e) => updateConfig('commission_level1', Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comisión mínima (%) — tope
          </label>
          <input
            type="number"
            value={config.commission_min}
            onChange={(e) => updateConfig('commission_min', Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DPI mínimo aceptado
          </label>
          <input
            type="number"
            value={config.dpi_min}
            onChange={(e) => updateConfig('dpi_min', Number(e.target.value))}
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
                  checked={config.formats.includes(format)}
                  onChange={() => toggleFormat(format)}
                  className="text-coral-400 focus:ring-coral-500 rounded"
                />
                <span className="text-sm text-gray-600">{format}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-dark text-white px-6 py-2 rounded-lg font-medium hover:bg-dark-light transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </div>
  );
}

function ModerationCard({ design, onAction }) {
  const { categories } = useCategories();
  const [showChecklist, setShowChecklist] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);
  const [assignedCategory, setAssignedCategory] = useState('');
  const [showCategoryWarning, setShowCategoryWarning] = useState(false);

  const handleApprove = async () => {
    // Check if category is assigned
    if (!assignedCategory && !design.category) {
      setShowCategoryWarning(true);
      return;
    }
    
    try {
      // If category was assigned, update the design first
      if (assignedCategory) {
        await api.patch(`/v1/designs/${design.id}`, { category: assignedCategory});
      }
      
      await api.patch(`/v1/designs/${design.id}/approve`);
      setShowSuccess('approved');
      setTimeout(() => {
        setShowSuccess(null);
        onAction?.();
      }, 1500);
    } catch (err) {
      logger.error('Error approving design:', err);
    }
  };

  const confirmApproveWithoutCategory = async () => {
    setShowCategoryWarning(false);
    try {
      await api.patch(`/v1/designs/${design.id}/approve`);
      setShowSuccess('approved');
      setTimeout(() => {
        setShowSuccess(null);
        onAction?.();
      }, 1500);
    } catch (err) {
      logger.error('Error approving design:', err);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      await api.patch(`/v1/designs/${design.id}/reject`, { reason: rejectReason });
      setShowRejectModal(false);
      setRejectReason('');
      setShowSuccess('rejected');
      setTimeout(() => {
        setShowSuccess(null);
        onAction?.();
      }, 1500);
    } catch (err) {
      logger.error('Error rejecting design:', err);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-start gap-4">
          {/* Image with link to detail */}
          <Link to={`/diseno/${design.id}`} className="shrink-0 group">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={design.previewUrl}
                alt={design.title}
                className="w-24 h-24 object-cover group-hover:opacity-80 transition-opacity"
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
                  {design.seller.name} · {design.categorySuggested || 'Sin categoría'} · ${design.price.toLocaleString()}
                </p>
              </div>
              <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 text-xs px-2 py-1 rounded-full">
                <Clock size={12} /> Pendiente
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{design.description}</p>

            {/* Category assignment */}
            <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-500 shrink-0">Sugerida:</span>
              <span className="text-xs font-medium text-gray-700 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                {design.categorySuggested || 'Sin sugerencia'}
              </span>
              <span className="text-gray-300">→</span>
              <select
                value={assignedCategory}
                onChange={(e) => setAssignedCategory(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white"
              >
                <option value="" disabled>Asignar categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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

      {/* Category warning modal */}
      {showCategoryWarning && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle size={20} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sin categoría asignada</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Este diseño no tiene una categoría asignada. ¿Estás seguro de que querés aprobarlo sin categoría?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCategoryWarning(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar y asignar
              </button>
              <button
                onClick={confirmApproveWithoutCategory}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
              >
                Aprobar sin categoría
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
  const [roleFilter, setRoleFilter] = useState('seller');
  const [page, setPage] = useState(1);
  const [showRankModal, setShowRankModal] = useState(null);
  const [showRankConfirm, setShowRankConfirm] = useState(null);
  const { users, total } = useAdminUsers({
    role: roleFilter,
    search,
    page,
  });
  const [localUsers, setLocalUsers] = useState([]);
  const perPage = 10;

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const filtered = localUsers;
  const totalPages = Math.ceil(total / perPage);

  const handleRankChange = async () => {
    if (!showRankConfirm) return;
    try {
      await api.patch(`/v1/admin/users/${showRankConfirm.userId}/rank`, { rank: showRankConfirm.newRank });
      setLocalUsers((prev) => prev.map((u) => (u.id === showRankConfirm.userId ? { ...u, rank: showRankConfirm.newRank } : u)));
      setShowRankModal(null);
      setShowRankConfirm(null);
    } catch (err) {
      logger.error('Error updating rank:', err);
    }
  };

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
          <option value="seller">Vendedores</option>
          <option value="buyer">Compradores</option>
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
                <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Rango</th>
                <th className="text-left text-sm font-medium text-gray-500 px-6 py-3 hidden sm:table-cell">
                  Ventas
                </th>
                <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Estado</th>
                <th className="text-right text-sm font-medium text-gray-500 px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{user.fullname || user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'seller'
                          ? 'bg-coral-50 text-coral-500'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role === 'seller' ? 'Vendedor' : user.role === 'admin' ? 'Admin' : 'Comprador'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <RankBadge rank={user.rank} size={20} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                    {user.sales || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        user.isDeleted
                          ? 'bg-red-50 text-red-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {user.isDeleted ? 'Suspendido' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.role === 'seller' && (
                        <button
                          onClick={() => setShowRankModal(user)}
                          className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          Cambiar rango
                        </button>
                      )}
                      <Link
                        to={`/vendedor/${user.id}`}
                        className="text-sm text-brand-teal hover:text-brand-teal-dark"
                      >
                        Ver detalle
                      </Link>
                    </div>
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
                    p === page
                      ? 'bg-brand-teal text-white'
                      : 'hover:bg-gray-200 text-gray-700'
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

      {/* Rank modal */}
      {showRankModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cambiar rango</h3>
            <p className="text-sm text-gray-600 mb-4">
              Vendedor: <span className="font-medium">{showRankModal.fullname || showRankModal.username}</span>
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Rango actual: <RankBadge rank={showRankModal.rank} size={18} />
            </p>

            <div className="space-y-2 mb-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Rangos manuales (solo admin)
              </p>
              {MANUAL_RANKS.map((rank) => (
                <button
                  key={rank}
                  onClick={() => setShowRankConfirm({ userId: showRankModal.id, newRank: rank, userName: showRankModal.fullname || showRankModal.username, currentRank: showRankModal.rank })}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    showRankModal.rank === rank
                      ? 'border-brand-teal bg-brand-teal/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <RankBadge rank={rank} size={24} />
                  <span className="text-sm text-gray-600">
                    {rank === 'diamante' ? '10% comisión' : '12% comisión'}
                  </span>
                </button>
              ))}

              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Rangos automáticos
                </p>
                {['oro', 'plata', 'bronce'].map((rank) => (
                  <button
                    key={rank}
                    onClick={() => setShowRankConfirm({ userId: showRankModal.id, newRank: rank, userName: showRankModal.fullname || showRankModal.username, currentRank: showRankModal.rank })}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      showRankModal.rank === rank
                        ? 'border-brand-teal bg-brand-teal/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <RankBadge rank={rank} size={24} />
                    <span className="text-sm text-gray-600">
                      {rank === 'oro' ? '15%' : rank === 'plata' ? '18%' : '20%'} comisión
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowRankModal(null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Rank change confirmation */}
      {showRankConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle size={20} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar cambio de rango</h3>
            </div>

            <div className="mb-6 space-y-3">
              <p className="text-sm text-gray-600">
                ¿Confirmás cambiar el rango de <span className="font-medium">{showRankConfirm.userName}</span>?
              </p>
              <div className="flex items-center justify-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <RankBadge rank={showRankConfirm.currentRank} size={28} />
                  <p className="text-xs text-gray-500 mt-1">Actual</p>
                </div>
                <span className="text-gray-400">→</span>
                <div className="text-center">
                  <RankBadge rank={showRankConfirm.newRank} size={28} />
                  <p className="text-xs text-gray-500 mt-1">Nuevo</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRankConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleRankChange}
                className="flex-1 px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal-dark transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportsSection() {
  const [filter, setFilter] = useState('all');
  const { reports, refetch } = useAdminReports(filter === 'all' ? null : filter);

  const filtered = reports;

  const handleReviewReport = async (reportId, status) => {
    try {
      await api.patch(`/v1/admin/reports/${reportId}`, { status });
      refetch();
    } catch (err) {
      logger.error('Error reviewing report:', err);
    }
  };

  const handleWithdrawDesign = async (designId, reportId) => {
    try {
      await api.patch(`/v1/designs/${designId}/reject`, { reason: 'Retirado por denuncia verificada' });
      await handleReviewReport(reportId, 'reviewed');
    } catch (err) {
      logger.error('Error withdrawing design:', err);
    }
  };

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
                ? 'bg-dark text-white'
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
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={report.design?.previewUrl}
                    alt={report.designTitle}
                    className="w-20 h-20 object-cover group-hover:opacity-80 transition-opacity"
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
                      <h3 className="font-medium text-gray-900">{report.design?.title || 'Diseño'}</h3>
                      <Link
                        to={`/diseno/${report.designId}`}
                        className="text-coral-400 hover:text-coral-500"
                        title="Ver diseño"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                      Reportado por: {report.reporter?.fullname || report.reporter?.username || 'Usuario'} ·{' '}
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
                    <button
                      onClick={() => handleWithdrawDesign(report.designId, report.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Retirar diseño
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => handleReviewReport(report.id, 'reviewed')}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                    >
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
          className="bg-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-dark-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

function TechniquesSection() {
  const { techniques, addTechnique, updateTechnique, deleteTechnique } = useTechniques();
  const [newTechniqueName, setNewTechniqueName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleAdd = () => {
    if (addTechnique(newTechniqueName)) {
      setNewTechniqueName('');
    }
  };

  const handleStartEdit = (index, name) => {
    setEditingIndex(index);
    setEditingValue(name);
  };

  const handleSaveEdit = (oldName) => {
    if (updateTechnique(oldName, editingValue)) {
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleDelete = (name) => {
    deleteTechnique(name);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-2">Gestión de técnicas</h2>
      <p className="text-sm text-gray-500 mb-6">
        Las técnicas que crees acá van a estar disponibles para los vendedores al cargar diseños.
      </p>

      {/* Add new */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTechniqueName}
          onChange={(e) => setNewTechniqueName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nueva técnica..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
        />
        <button
          onClick={handleAdd}
          disabled={!newTechniqueName.trim()}
          className="bg-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-dark-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {techniques.map((tech, i) => (
          <div
            key={tech}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
          >
            {editingIndex === i ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(tech);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="flex-1 px-3 py-1 border border-coral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(tech)}
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
                  <Tag size={16} className="text-brand-teal" />
                  <span className="text-sm font-medium text-gray-900">{tech}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(i, tech)}
                    className="p-1.5 text-gray-500 hover:text-coral-400 hover:bg-coral-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(tech)}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar técnica</h3>
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
        {techniques.length} {techniques.length === 1 ? 'técnica' : 'técnicas'} en total
      </p>
    </div>
  );
}

function DesignsSection() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pauseModal, setPauseModal] = useState(null);
  const [pauseReason, setPauseReason] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchDesigns();
  }, [filter]);

  const fetchDesigns = async () => {
    setIsLoading(true);
    try {
      let url = '/v1/designs?limit=50';
      if (filter !== 'all') url += `&status=${filter}`;
      const res = await api.get(url);
      setDesigns(res.data.designs || []);
    } catch (err) {
      logger.error('Error fetching designs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    if (!pauseReason.trim() || pauseReason.trim().length < 10) return;
    try {
      await api.patch(`/v1/admin/designs/${pauseModal.id}/pause`, { reason: pauseReason });
      showToast('Diseño pausado correctamente', { type: 'success' });
      setPauseModal(null);
      setPauseReason('');
      fetchDesigns();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al pausar el diseño', { type: 'error' });
    }
  };

  const handleUnpause = async (designId) => {
    try {
      await api.patch(`/v1/admin/designs/${designId}/unpause`);
      showToast('Diseño reactivado', { type: 'success' });
      fetchDesigns();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al reactivar el diseño', { type: 'error' });
    }
  };

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'approved', label: 'Aprobados' },
          { id: 'paused', label: 'Pausados' },
          { id: 'all', label: 'Todos' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === f.id
                ? 'bg-dark text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full mx-auto" />
        </div>
      ) : designs.length > 0 ? (
        <div className="space-y-3">
          {designs.map((design) => (
            <div key={design.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
              <Link to={`/diseno/${design.id}`} className="shrink-0">
                <img
                  src={design.previewUrl}
                  alt={design.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{design.title}</h3>
                <p className="text-sm text-gray-500">
                  {design.seller?.storeName || design.seller?.username} · ${Number(design.price).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {design.categorySuggested || 'Sin categoría'} · {design.technique}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  design.status === 'approved'
                    ? 'bg-green-50 text-green-700'
                    : design.status === 'paused'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-gray-50 text-gray-700'
                }`}>
                  {design.status === 'approved' ? 'Aprobado' : design.status === 'paused' ? 'Pausado' : design.status}
                </span>
                {design.status === 'approved' && (
                  <button
                    onClick={() => setPauseModal(design)}
                    className="text-xs px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    Pausar
                  </button>
                )}
                {design.status === 'paused' && (
                  <button
                    onClick={() => handleUnpause(design.id)}
                    className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Reactivar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Eye size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin diseños</h3>
          <p className="text-gray-500">No hay diseños en esta categoría.</p>
        </div>
      )}

      {/* Pause modal */}
      {pauseModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle size={20} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pausar diseño</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Diseño: <span className="font-medium">{pauseModal.title}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              El diseño dejará de ser visible para los compradores hasta que lo reactives.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de la pausa <span className="text-red-500">*</span>
              </label>
              <textarea
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                placeholder="Explicá por qué se pausa este diseño. El vendedor recibirá este motivo por email."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 10 caracteres. El vendedor recibirá un email con el motivo y un número de ticket.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setPauseModal(null); setPauseReason(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePause}
                disabled={pauseReason.trim().length < 10}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pausar diseño
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
