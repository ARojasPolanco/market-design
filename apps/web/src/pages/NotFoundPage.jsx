import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
        <p className="text-gray-500 mb-8">La página que buscás no existe o fue movida.</p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="bg-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-dark-light transition-colors flex items-center gap-2"
          >
            <Home size={18} />
            Ir al inicio
          </Link>
          <Link
            to="/catalogo"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Search size={18} />
            Explorar diseños
          </Link>
        </div>
      </div>
    </div>
  );
}
