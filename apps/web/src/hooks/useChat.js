import { useState, useEffect, useCallback } from 'react';
import api from '../config/api.js';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setConversations([]);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/v1/chat/conversations');
      setConversations(res.data.conversations || []);
      setError(null);
    } catch (_err) {
      setError('No pudimos cargar tus conversaciones.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  return { conversations, isLoading, error, refetch: load };
}

export function useConversation(id) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    if (!localStorage.getItem('token')) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get(`/v1/chat/conversations/${id}/messages`);
      setConversation(res.data.conversation);
      setMessages(res.data.messages || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No pudimos cargar la conversación.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [load]);

  const send = async (body) => {
    const res = await api.post(`/v1/chat/conversations/${id}/messages`, { body });
    setMessages((prev) => [...prev, res.data.message]);
    return res.data.message;
  };

  const markRead = useCallback(async () => {
    if (!id) return;
    try {
      await api.patch(`/v1/chat/conversations/${id}/read`);
    } catch (_err) {
      // best-effort
    }
  }, [id]);

  return { conversation, messages, isLoading, error, send, markRead, refetch: load };
}

export async function createConversation({ sellerId, designId, type } = {}) {
  const res = await api.post('/v1/chat/conversations', { sellerId, designId, type });
  return res.data.conversation;
}

export async function reportMessage(messageId, reason) {
  const res = await api.post(`/v1/chat/messages/${messageId}/report`, { reason });
  return res.data;
}

export async function blockUser(userId) {
  const res = await api.post(`/v1/chat/users/${userId}/block`);
  return res.data;
}
