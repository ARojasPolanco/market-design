import { useState } from 'react';
import { MessageSquare, Send, Pencil, Trash2, X } from 'lucide-react';
import RatingStars from './RatingStars.jsx';

function ReviewItem({ rating, canReply, onReply, onRemoveReply }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(rating.sellerReply || '');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (text.trim().length < 2) return;
    setBusy(true);
    try {
      await onReply(rating.id, text.trim());
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await onRemoveReply(rating.id);
      setText('');
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const showForm = canReply && (!rating.sellerReply || editing);
  const buyerName = rating.buyer?.username || rating.buyer?.fullname || 'Usuario';

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-3 mb-2">
        {rating.buyer?.avatarUrl ? (
          <img src={rating.buyer.avatarUrl} alt={buyerName} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500">{buyerName.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">{buyerName}</span>
            <RatingStars rating={rating.score} size={14} showValue={false} />
          </div>
          <p className="text-xs text-gray-400">
            {new Date(rating.createdAt).toLocaleDateString('es-AR')}
            {rating.designTitle ? ` · ${rating.designTitle}` : ''}
          </p>
        </div>
      </div>

      {rating.comment && <p className="text-sm text-gray-700">{rating.comment}</p>}

      {rating.sellerReply && !editing && (
        <div className="mt-3 ml-3 pl-3 border-l-2 border-brand-teal/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-brand-teal-dark">
              {canReply ? 'Tu respuesta' : 'Respuesta del vendedor'}
            </p>
            {canReply && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setText(rating.sellerReply);
                    setEditing(true);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-700"
                  aria-label="Editar respuesta"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={remove}
                  disabled={busy}
                  className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
                  aria-label="Borrar respuesta"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{rating.sellerReply}</p>
        </div>
      )}

      {showForm && (
        <div className="mt-3">
          {editing && (
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-brand-teal-dark">Editar respuesta</p>
              <button
                onClick={() => setEditing(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
                aria-label="Cancelar"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Respondé a este comprador..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
            <button
              onClick={submit}
              disabled={busy || text.trim().length < 2}
              className="px-3 py-2 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal-dark disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              <Send size={14} /> Responder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SellerReviews({
  ratings = [],
  onReply,
  onRemoveReply,
  canReply = true,
  emptyMessage = 'Todavía no tenés reseñas de compradores.',
}) {
  if (ratings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((r) => (
        <ReviewItem
          key={r.id}
          rating={r}
          canReply={canReply}
          onReply={onReply}
          onRemoveReply={onRemoveReply}
        />
      ))}
    </div>
  );
}
