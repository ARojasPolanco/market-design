import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye, ArrowLeft } from 'lucide-react';
import { useDesign } from '../hooks/useDesigns.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import RatingStars from '../components/RatingStars.jsx';
import SellerBadge from '../components/SellerBadge.jsx';
import DesignCard from '../components/DesignCard.jsx';

export default function DesignDetailPage() {
  const { id } = useParams();
  const { design, related, error } = useDesign(id);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  if (error || !design) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Diseño no encontrado</h2>
        <Link to="/catalogo" className="text-indigo-600 hover:text-indigo-700">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const fav = isFavorite(design.id);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <img src={design.previewUrl} alt={design.title} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div>
          <div className="mb-4">
            <span className="text-sm text-indigo-600 font-medium">{design.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{design.title}</h1>
          </div>

          {/* Rating & stats */}
          <div className="flex items-center gap-4 mb-6">
            <RatingStars rating={design.rating} />
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <ShoppingCart size={14} /> {design.salesCount} ventas
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Eye size={14} /> {design.viewCount}
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900 mb-6">
            ${design.price.toLocaleString()}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">{design.description}</p>

          {/* Technique */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Técnica:</span>
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {design.technique}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Link
              to={`/checkout/${design.id}`}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Comprar ahora
            </Link>
            <button
              onClick={() => (fav ? removeFavorite(design.id) : addFavorite(design.id))}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart size={20} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
            </button>
          </div>

          {/* Seller card */}
          <Link
            to={`/vendedor/${design.seller.id}`}
            className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <img
                src={design.seller.avatar}
                alt={design.seller.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{design.seller.name}</h3>
                  <SellerBadge seller={design.seller} />
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {design.seller.rating}
                  </span>
                  <span>{design.seller.salesCount} ventas</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Related designs */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Diseños relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((d) => (
              <DesignCard key={d.id} design={d} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
