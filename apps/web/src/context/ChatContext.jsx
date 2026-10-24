import { createContext, useCallback, useContext, useState } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const openChat = useCallback((conversationId = null) => {
    setActiveConversationId(conversationId);
    setIsOpen(true);
  }, []);

  const openList = useCallback(() => {
    setActiveConversationId(null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);
  const backToList = useCallback(() => setActiveConversationId(null), []);

  return (
    <ChatContext.Provider
      value={{ isOpen, activeConversationId, openChat, openList, close, toggle, backToList }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatWidget() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatWidget debe usarse dentro de ChatProvider');
  }
  return context;
}
