import { Link } from 'react-router-dom';
import { Star, Heart, BadgeCheck, TrendingUp } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function DesignCard({ design }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(design.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
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
            <img
              src={design.seller.avatar}
              alt={design.seller.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{design.seller.name}</span>
            {design.seller.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
            {design.seller.isTopSeller && <TrendingUp size={14} className="text-orange-500" />}
          </div>

          {/* Price and rating */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${design.price.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{design.rating}</span>
              <span className="text-xs text-gray-400">({design.salesCount})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
