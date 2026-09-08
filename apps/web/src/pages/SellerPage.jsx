import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar } from 'lucide-react';
import { useSeller } from '../hooks/useSeller.js';
import { useSellerDesigns } from '../hooks/useDesigns.js';
import SellerBadge from '../components/SellerBadge.jsx';
import DesignCard from '../components/DesignCard.jsx';

export default function SellerPage() {
  const { id } = useParams();
  const { seller, error } = useSeller(id);
  const { designs } = useSellerDesigns(id);

  if (error || !seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendedor no encontrado</h2>
        <Link to="/catalogo" className="text-indigo-600 hover:text-indigo-700">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/catalogo"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>

      {/* Seller header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <img src={seller.avatar} alt={seller.name} className="w-24 h-24 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
              <SellerBadge seller={seller} size="lg" />
            </div>
            <p className="text-gray-600 mb-4">{seller.description}</p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">{seller.rating}</span>
                <span>rating</span>
              </div>
              <span>{seller.salesCount} ventas</span>
              <span>{seller.totalDesigns} diseños</span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Miembro desde{' '}
                {new Date(seller.memberSince).toLocaleDateString('es-AR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seller designs */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Diseños de {seller.name}</h2>
      {designs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">
          Este vendedor aún no tiene diseños publicados.
        </p>
      )}
    </div>
  );
}
