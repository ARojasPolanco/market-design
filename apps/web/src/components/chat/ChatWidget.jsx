import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import { useChatWidget } from '../../context/ChatContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useConversations, createConversation } from '../../hooks/useChat.js';
import { displayName, otherParty } from '../../utils/chat.js';
import ConversationList from './ConversationList.jsx';
import ChatWindow from './ChatWindow.jsx';

export default function ChatWidget() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const { isOpen, activeConversationId, openChat, close, toggle, backToList } = useChatWidget();
  const { conversations, isLoading, refetch } = useConversations();

  const totalUnread = useMemo(
    () => conversations.reduce((sum, conversation) => sum + (conversation.unreadCount || 0), 0),
    [conversations]
  );

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );
  const activeOther = otherParty(activeConversation, user?.id);

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen, activeConversationId, refetch]);

  if (!user || user.role === 'admin' || location.pathname === '/beta-vendedores') {
    return null;
  }

  const handleSupport = async () => {
    try {
      const conversation = await createConversation({ type: 'support' });
      openChat(conversation.id);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'No pudimos abrir soporte.', { type: 'error' });
    }
  };

  return (
    <>
      <button
        onClick={toggle}
        aria-label={isOpen ? 'Cerrar mensajes' : 'Abrir mensajes'}
        className="fixed bottom-6 right-6 z-[96] w-14 h-14 rounded-full bg-dark text-white shadow-xl hover:bg-dark-light transition-colors flex items-center justify-center"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-brand-teal text-dark text-[11px] font-bold flex items-center justify-center">
            {totalUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[94] bg-black/40 sm:hidden"
            onClick={close}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-[95] sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[600px] sm:max-h-[calc(100vh-8rem)] bg-white sm:rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
            <div className="bg-dark text-white px-4 py-3 flex items-center gap-2 shrink-0">
              {activeConversationId ? (
                <button
                  onClick={backToList}
                  aria-label="Volver"
                  className="p-1 -ml-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              ) : (
                <span className="w-6" />
              )}
              <p className="font-semibold text-sm truncate flex-1">
                {activeConversationId
                  ? activeOther?.isSupport
                    ? activeOther.name
                    : displayName(activeOther)
                  : 'Mensajes'}
              </p>
              <button
                onClick={close}
                aria-label="Cerrar"
                className="p-1 -mr-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 min-h-0">
              {activeConversationId ? (
                <ChatWindow conversationId={activeConversationId} onChanged={refetch} />
              ) : (
                <ConversationList
                  conversations={conversations}
                  isLoading={isLoading}
                  onSelect={openChat}
                  onSupport={handleSupport}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
