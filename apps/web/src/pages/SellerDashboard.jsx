import { Link } from 'react-router-dom';
import { Upload, TrendingUp, DollarSign, Star, Package, ArrowRight } from 'lucide-react';

export default function SellerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Panel del vendedor</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Ganancias</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$45.200</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package size={20} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Ventas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">128</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star size={20} className="text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Rating</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Nivel comisión</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">18%</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/vendedor/panel/subir"
          className="bg-indigo-600 text-white rounded-xl p-6 hover:bg-indigo-700 transition-colors flex items-center justify-between"
        >
          <div>
            <h3 className="font-semibold text-lg mb-1">Subir diseño</h3>
            <p className="text-indigo-200 text-sm">Cargá un nuevo diseño al marketplace</p>
          </div>
          <Upload size={24} />
        </Link>
        <Link
          to="/vendedor/panel/disenos"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between"
        >
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">Mis diseños</h3>
            <p className="text-gray-500 text-sm">Gestioná tus diseños publicados</p>
          </div>
          <ArrowRight size={24} className="text-gray-400" />
        </Link>
      </div>

      {/* Recent sales placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Ventas recientes</h2>
        <p className="text-gray-500 text-sm">
          Acá vas a ver tus últimas ventas cuando se conecte el backend.
        </p>
      </div>
    </div>
  );
}
