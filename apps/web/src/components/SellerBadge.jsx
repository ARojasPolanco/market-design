import { BadgeCheck, TrendingUp } from 'lucide-react';

export default function SellerBadge({ seller, size = 'sm' }) {
  const sizes = {
    sm: { icon: 14, text: 'text-xs' },
    md: { icon: 16, text: 'text-sm' },
    lg: { icon: 20, text: 'text-base' },
  };

  const s = sizes[size] || sizes.sm;

  return (
    <div className="flex items-center gap-2">
      {seller.isVerified && (
        <span className="flex items-center gap-1 text-blue-600">
          <BadgeCheck size={s.icon} />
          <span className={s.text}>Verificado</span>
        </span>
      )}
      {seller.isTopSeller && (
        <span className="flex items-center gap-1 text-orange-600">
          <TrendingUp size={s.icon} />
          <span className={s.text}>Top Seller</span>
        </span>
      )}
    </div>
  );
}
