import { LayoutDashboard, Users, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
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
          <p className="text-2xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Aprobados hoy</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Usuarios</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">342</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LayoutDashboard size={20} className="text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Diseños totales</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">1.284</p>
        </div>
      </div>

      {/* Moderation queue placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Cola de moderación</h2>
        <p className="text-gray-500 text-sm">
          Acá vas a ver los diseños pendientes de aprobación cuando se conecte el backend.
        </p>
      </div>
    </div>
  );
}
