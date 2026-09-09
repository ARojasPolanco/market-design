import { Star, Heart, BadgeCheck } from 'lucide-react';

export default function DesignPreviewCard({ formData, previewImage }) {
  const {
    title = 'Título del diseño',
    description = 'Descripción del diseño...',
    price = 0,
    category = 'categoría',
  } = formData;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-xs">
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {previewImage ? (
          <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">Preview del diseño</span>
          </div>
        )}
        {/* Category badge */}
        {category && (
          <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {category}
          </span>
        )}
        {/* Favorite button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full">
          <Heart size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {title || 'Título del diseño'}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {description || 'Descripción del diseño...'}
        </p>

        {/* Seller (mock) */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <span className="text-sm text-gray-600">Tu tienda</span>
          <BadgeCheck size={14} className="text-blue-500" />
        </div>

        {/* Price and rating */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {price > 0 ? `$${Number(price).toLocaleString()}` : '$0'}
          </span>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
