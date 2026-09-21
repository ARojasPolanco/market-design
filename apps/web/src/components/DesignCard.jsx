import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, BadgeCheck, TrendingUp } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { RankBadge } from './RankBadge.jsx';
import WatermarkOverlay from './WatermarkOverlay.jsx';

export default function DesignCard({ design }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fav = isFavorite(design.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (fav) {
      removeFavorite(design.id);
    } else {
      addFavorite(design.id);
    }
  };

  return (
    <Link to={`/diseno/${design.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={design.previewUrl}
            alt={design.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <WatermarkOverlay />
          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            title={user ? (fav ? 'Quitar de favoritos' : 'Agregar a favoritos') : 'Iniciá sesión para agregar a favoritos'}
          >
            <Heart size={18} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
          </button>
          {/* Category badge */}
          <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {design.category}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{design.title}</h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{design.description}</p>

          {/* Seller */}
          <div className="flex items-center gap-2 mb-3">
            {design.seller?.avatarUrl ? (
              <img
                src={design.seller.avatarUrl}
                alt={design.seller.storeName || design.seller.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">
                  {(design.seller?.storeName || design.seller?.username || '?').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">{design.seller?.storeName || design.seller?.username}</span>
            <RankBadge rank={design.seller?.rank} size={14} />
            {design.seller?.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
            {design.seller?.isTopSeller && <TrendingUp size={14} className="text-orange-500" />}
          </div>

          {/* Price and rating */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${design.price.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{Number(design.ratingAvg || 0).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({design.salesCount || 0})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
