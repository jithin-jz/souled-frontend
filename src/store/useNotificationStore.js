import { create } from 'zustand';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/accounts/notifications/');
      const notifications = res.data;
      const unreadCount = notifications.filter(n => !n.is_read).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      handleApiError(error, 'Failed to fetch notifications', false);
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.post(`/accounts/notifications/${id}/read/`);
      const notifications = get().notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      );
      const unreadCount = notifications.filter(n => !n.is_read).length;
      set({ notifications, unreadCount });
    } catch (error) {
      handleApiError(error, 'Failed to mark notification as read');
    }
  },

  markAllAsRead: async () => {
    const unread = get().notifications.filter(n => !n.is_read);
    const promises = unread.map(n => api.post(`/accounts/notifications/${n.id}/read/`));
    try {
      await Promise.all(promises);
      const notifications = get().notifications.map(n => ({ ...n, is_read: true }));
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      handleApiError(error, 'Failed to mark all notifications as read');
    }
  }
}));

export default useNotificationStore;
