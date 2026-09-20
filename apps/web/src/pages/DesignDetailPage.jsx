import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, ArrowLeft, X, ChevronLeft, ChevronRight, Flag, Star, Send } from 'lucide-react';
import { useDesign } from '../hooks/useDesigns.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import RatingStars from '../components/RatingStars.jsx';
import SellerBadge from '../components/SellerBadge.jsx';
import DesignCard from '../components/DesignCard.jsx';
import { DetailSkeleton } from '../components/Skeletons.jsx';
import { ErrorState } from '../components/EmptyStates.jsx';
import api from '../config/api.js';
import logger from '../utils/logger.js';

export default function DesignDetailPage() {
  const { id } = useParams();
  const { design, related, reviews, error } = useDesign(id);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showZoom, setShowZoom] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseId, setPurchaseId] = useState(null);
  const [hasRated, setHasRated] = useState(false);

  // Get all preview URLs (support both single and multiple)
  const previewUrls = design?.previewUrls?.length > 0
    ? design.previewUrls
    : design?.previewUrl
      ? [design.previewUrl]
      : [];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, [id]);

  // Check if user has purchased this design
  useEffect(() => {
    if (!user || !id) return;
    const checkPurchase = async () => {
      try {
        const res = await api.get('/v1/purchases/my');
        const purchases = res.data.purchases || [];
        const purchase = purchases.find(p => p.designId === id && p.status === 'completed');
        if (purchase) {
          setHasPurchased(true);
          setPurchaseId(purchase.id);
          // Check if already rated
          const ratingsRes = await api.get(`/v1/purchases/ratings/${id}`);
          const ratings = ratingsRes.data.ratings || [];
          const alreadyRated = ratings.some(r => r.buyerId === user.id);
          setHasRated(alreadyRated);
        }
      } catch (err) {
        logger.error('Error checking purchase:', err);
      }
    };
    checkPurchase();
  }, [user, id]);

  const handleReport = async () => {
    if (!reportReason.trim() || reportReason.trim().length < 10) return;
    setReportSubmitting(true);
    try {
      await api.post('/v1/admin/reports', { designId: id, reason: reportReason.trim() });
      showToast('Denuncia enviada. El equipo de moderación la revisará.', { type: 'success' });
      setShowReportModal(false);
      setReportReason('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al enviar la denuncia', { type: 'error' });
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleRating = async () => {
    if (ratingScore === 0 || !purchaseId) return;
    setRatingSubmitting(true);
    try {
      await api.post('/v1/purchases/ratings', {
        designId: id,
        purchaseId,
        score: ratingScore,
        comment: ratingComment.trim() || null,
      });
      showToast('¡Gracias por tu valoración!', { type: 'success' });
      setShowRatingForm(false);
      setRatingScore(0);
      setRatingComment('');
      setHasRated(true);
      // Refresh design data to update rating
      window.location.reload();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al enviar la valoración', { type: 'error' });
    } finally {
      setRatingSubmitting(false);
    }
  };

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
        {/* Image carousel */}
        <div className="relative">
          <div
            className="aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in group"
            onClick={() => setShowZoom(true)}
          >
            <img
              src={previewUrls[currentPreview] || design.previewUrl}
              alt={design.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-900 text-sm px-4 py-2 rounded-full transition-opacity">
                Click para ampliar
              </span>
            </div>

            {/* Navigation arrows */}
            {previewUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPreview((prev) => (prev === 0 ? previewUrls.length - 1 : prev - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPreview((prev) => (prev === previewUrls.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {previewUrls.length > 1 && (
            <div className="flex gap-2 mt-3">
              {previewUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPreview(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentPreview === index ? 'border-brand-teal' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
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
          <div className="flex gap-4 mb-4">
            {user ? (
              <Link
                to={`/checkout/${design.id}`}
                className="flex-1 bg-dark text-white py-3 px-6 rounded-lg font-semibold hover:bg-dark-light transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Comprar ahora
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex-1 bg-dark text-white py-3 px-6 rounded-lg font-semibold hover:bg-dark-light transition-colors flex items-center justify-center gap-2"
              >
                Iniciá sesión para comprar
              </Link>
            )}
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
          {!user && (
            <p className="text-xs text-gray-500 mb-8">
              <Link to="/login" className="text-brand-teal hover:underline">Iniciá sesión</Link> o{' '}
              <Link to="/registro" className="text-brand-teal hover:underline">regístrate</Link> para comprar y dejar tu review.
            </p>
          )}

          {/* Seller card */}
          <Link
            to={`/vendedor/${design.seller.id}`}
            className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              {design.seller.avatarUrl ? (
                <img
                  src={design.seller.avatarUrl}
                  alt={design.seller.storeName || design.seller.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-500">
                    {(design.seller.storeName || design.seller.username || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{design.seller.storeName || design.seller.username}</h3>
                  <SellerBadge seller={design.seller} />
                </div>
              </div>
            </div>
          </Link>

          {/* Report button */}
          {user && (
            <button
              onClick={() => setShowReportModal(true)}
              className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <Flag size={14} />
              Reportar diseño
            </button>
          )}
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
                  {review.buyer?.avatarUrl ? (
                    <img
                      src={review.buyer.avatarUrl}
                      alt={review.buyer?.username || 'Usuario'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">
                        {(review.buyer?.username || review.buyer?.fullname || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{review.buyer?.username || review.buyer?.fullname || 'Usuario'}</h4>
                    <RatingStars rating={review.score} size={14} showValue={false} />
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(review.createdAt).toLocaleDateString('es-AR')}
                  </span>
                </div>
                {review.comment && <p className="text-gray-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leave review CTA */}
      <section className="mt-8 bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="font-semibold text-gray-900 mb-2">¿Compraste este diseño?</h3>
        {user ? (
          hasPurchased ? (
            hasRated ? (
              <p className="text-sm text-gray-500">
                Ya valoraste este diseño. ¡Gracias por tu opinión!
              </p>
            ) : showRatingForm ? (
              <div className="max-w-md mx-auto">
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingScore(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= ratingScore
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Contanos tu experiencia con este diseño (opcional)..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none mb-3"
                />
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setShowRatingForm(false); setRatingScore(0); setRatingComment(''); }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRating}
                    disabled={ratingScore === 0 || ratingSubmitting}
                    className="px-6 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send size={16} />
                    {ratingSubmitting ? 'Enviando...' : 'Enviar valoración'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Dejá tu valoración para ayudar a otros compradores.
                </p>
                <button
                  onClick={() => setShowRatingForm(true)}
                  className="inline-flex items-center gap-2 bg-brand-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors"
                >
                  <Star size={18} />
                  Valorar diseño
                </button>
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500">
              Comprá este diseño para poder valorarlo.
            </p>
          )
        ) : (
          <p className="text-sm text-gray-500">
            <Link to="/login" className="text-brand-teal hover:underline">Iniciá sesión</Link> para dejar tu review y ayudar a otros compradores.
          </p>
        )}
      </section>

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

          {/* Navigation in zoom */}
          {previewUrls.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPreview((prev) => (prev === 0 ? previewUrls.length - 1 : prev - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPreview((prev) => (prev === previewUrls.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <img
            src={previewUrls[currentPreview] || design.previewUrl}
            alt={design.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Thumbnail strip */}
          {previewUrls.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {previewUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPreview(index);
                  }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentPreview === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Report modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flag size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Reportar diseño</h3>
              </div>
              <button
                onClick={() => { setShowReportModal(false); setReportReason(''); }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Si este diseño infringe derechos de autor, contiene contenido inapropiado o viola nuestras reglas, contanos abajo.
              </p>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describí el motivo de la denuncia (mínimo 10 caracteres)..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {reportReason.length}/10 caracteres mínimos
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowReportModal(false); setReportReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReport}
                disabled={reportReason.trim().length < 10 || reportSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reportSubmitting ? 'Enviando...' : 'Enviar denuncia'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
