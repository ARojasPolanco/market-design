import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, size = 16, showValue = true }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const safeRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(safeRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }
        />
      ))}
      {showValue && <span className="text-sm text-gray-600 ml-1">{safeRating.toFixed(1)}</span>}
    </div>
  );
}
