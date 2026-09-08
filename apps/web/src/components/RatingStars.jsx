import { Star } from 'lucide-react';

export default function RatingStars({ rating, size = 16, showValue = true }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }
        />
      ))}
      {showValue && <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
}
