import { useState } from 'react';
import { MessageSquare, Send, Pencil, Trash2, X } from 'lucide-react';
import RatingStars from './RatingStars.jsx';

function ReviewItem({ rating, onReply, onRemoveReply }) {
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

  const showForm = !rating.sellerReply || editing;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <RatingStars rating={rating.score} size={14} showValue={false} />
        <span className="text-xs text-gray-500">· {rating.designTitle}</span>
      </div>

      {rating.comment && <p className="text-sm text-gray-700">{rating.comment}</p>}

      <p className="text-xs text-gray-400 mt-1">
        {rating.buyer?.username || rating.buyer?.fullname || 'Usuario'} ·{' '}
        {new Date(rating.createdAt).toLocaleDateString('es-AR')}
      </p>

      {rating.sellerReply && !editing && (
        <div className="mt-3 ml-4 pl-3 border-l-2 border-brand-teal/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-brand-teal-dark">Tu respuesta</p>
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

export default function SellerReviews({ ratings = [], onReply, onRemoveReply }) {
  if (ratings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Todavía no tenés reseñas de compradores.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((r) => (
        <ReviewItem key={r.id} rating={r} onReply={onReply} onRemoveReply={onRemoveReply} />
      ))}
    </div>
  );
}
