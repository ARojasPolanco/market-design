import { LifeBuoy, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { displayName, formatChatTime, initials, otherParty } from '../../utils/chat.js';

export default function ConversationList({ conversations, isLoading, onSelect, onSupport }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-500">Tus conversaciones</p>
        <button
          onClick={onSupport}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-teal hover:text-brand-teal-dark transition-colors"
        >
          <LifeBuoy size={14} /> Soporte
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <p className="px-4 py-6 text-sm text-gray-500 text-center">Cargando...</p>}

        {!isLoading && conversations.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-3">
              <MessageCircle size={22} className="text-brand-teal" />
            </div>
            <p className="text-sm font-medium text-gray-900">Todavía no tenés mensajes</p>
            <p className="text-xs text-gray-500 mt-1">Escribile a un vendedor desde un diseño.</p>
          </div>
        )}

        {conversations.map((conversation) => {
          const other = otherParty(conversation, user?.id);
          const unread = conversation.unreadCount || 0;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                  other?.isSupport
                    ? 'bg-dark text-brand-teal'
                    : 'bg-brand-teal/15 text-brand-teal-dark'
                }`}
              >
                {other?.isSupport ? <LifeBuoy size={18} /> : initials(other)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {other?.isSupport ? other.name : displayName(other)}
                  </p>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {formatChatTime(conversation.lastMessageAt)}
                  </span>
                </div>
                <p
                  className={`text-xs truncate ${unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
                >
                  {conversation.lastMessage?.body || 'Sin mensajes todavía'}
                </p>
              </div>

              {unread > 0 && (
                <span className="shrink-0 bg-brand-teal text-dark text-[11px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
