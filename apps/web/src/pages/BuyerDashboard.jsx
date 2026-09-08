import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function BuyerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mis compras</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button className="pb-3 border-b-2 border-indigo-600 text-indigo-600 font-medium">
          Compras
        </button>
        <button className="pb-3 text-gray-500 hover:text-gray-700">Favoritos</button>
      </div>

      {/* Empty state */}
      <div className="text-center py-20">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No tenés compras todavía</h2>
        <p className="text-gray-500 mb-6">Explorá nuestro catálogo y encontrá el diseño perfecto</p>
        <Link
          to="/catalogo"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          Explorar diseños
        </Link>
      </div>
    </div>
  );
}
