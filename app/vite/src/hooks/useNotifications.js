import { useCallback, useEffect, useState } from 'react';

import {
  getBillDueNotifications,
  markAllNotificationsRead,
  markNotificationsRead
} from 'services/notificationService';

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getBillDueNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      setNotifications([]);
      setUnreadCount(0);
      setError(err.response?.data?.message || 'Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function markAsRead(key) {
    const data = await markNotificationsRead([key]);
    setNotifications(data.notifications || []);
    setUnreadCount(data.unreadCount || 0);
  }

  async function markAllAsRead() {
    const data = await markAllNotificationsRead();
    setNotifications(data.notifications || []);
    setUnreadCount(data.unreadCount || 0);
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    reload: loadNotifications,
    markAsRead,
    markAllAsRead
  };
}
