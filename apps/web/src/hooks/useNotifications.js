import { useState, useEffect } from 'react';
import api from '../config/api.js';
import logger from '../utils/logger.js';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/v1/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      logger.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/v1/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      logger.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/v1/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      logger.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/v1/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      // Recalculate unread count
      setUnreadCount(prev => {
        const notif = notifications.find(n => n.id === id);
        return notif && !notif.isRead ? Math.max(0, prev - 1) : prev;
      });
    } catch (err) {
      logger.error('Error deleting notification:', err);
    }
  };

  return { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification, refetch: fetchNotifications };
}
