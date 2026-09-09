import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye, ArrowLeft, X } from 'lucide-react';
import { useDesign } from '../hooks/useDesigns.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import RatingStars from '../components/RatingStars.jsx';
import SellerBadge from '../components/SellerBadge.jsx';
import DesignCard from '../components/DesignCard.jsx';
import { DetailSkeleton } from '../components/Skeletons.jsx';
import { ErrorState } from '../components/EmptyStates.jsx';

export default function DesignDetailPage() {
  const { id } = useParams();
  const { design, related, reviews, error } = useDesign(id);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) return <DetailSkeleton />;

  if (error || !design) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorState
          message={error || 'Diseño no encontrado'}
          onRetry={() => window.location.reload()}
        />
        <div className="text-center mt-4">
          <Link to="/catalogo" className="text-coral-400 hover:text-coral-500">
            Volver al catálogo
          </Link>
        </div>
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
        <div className="relative">
          <div
            className="aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in group"
            onClick={() => setShowZoom(true)}
          >
            <img
              src={design.previewUrl}
              alt={design.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-900 text-sm px-4 py-2 rounded-full transition-opacity">
                Click para ampliar
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="mb-4">
            <span className="inline-block bg-coral-50 text-coral-500 text-xs font-medium px-2.5 py-1 rounded-full mb-2">
              {design.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{design.title}</h1>
          </div>

          {/* Rating & stats */}
          <div className="flex items-center gap-4 mb-6">
            <RatingStars rating={design.rating} />
            <span className="text-sm text-gray-500">({design.ratingCount} reviews)</span>
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
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full capitalize">
              {design.technique}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Link
              to={`/checkout/${design.id}`}
              className="flex-1 bg-dark text-white py-3 px-6 rounded-lg font-semibold hover:bg-dark-light transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Comprar ahora
            </Link>
            <button
              onClick={() => (fav ? removeFavorite(design.id) : addFavorite(design.id))}
              className={`p-3 border rounded-lg transition-colors ${
                fav
                  ? 'border-red-300 bg-red-50 hover:bg-red-100'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
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

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={review.buyerAvatar}
                    alt={review.buyerName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{review.buyerName}</h4>
                    <RatingStars rating={review.score} size={14} showValue={false} />
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(review.createdAt).toLocaleDateString('es-AR')}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

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

      {/* Zoom modal */}
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>
          <img
            src={design.previewUrl}
            alt={design.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
