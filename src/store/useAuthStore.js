import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { authApi } from '../api/authApi';
import { tokenManager } from '../utils/api';
import { handleApiError } from '../utils/errorHandler';

const useAuthStore = create(subscribeWithSelector((set, get) => ({
  user: null,
  loading: true,

  loadUser: async () => {
    try {
      const res = await authApi.me();
      set({ user: res.data, loading: false });
      return res.data;
    } catch (error) {
      set({ user: null, loading: false });
      return null;
    }
  },

  login: async (email, password) => {
    const res = await authApi.login(email, password);
    // Save tokens to localStorage
    if (res.data.access && res.data.refresh) {
      tokenManager.setTokens(res.data.access, res.data.refresh);
    }
    // Set user from response
    set({ user: res.data.user, loading: false });
    return res.data.user;
  },

  register: async (first_name, last_name, email, password) => {
    const res = await authApi.register(first_name, last_name, email, password);
    // Save tokens to localStorage
    if (res.data.access && res.data.refresh) {
      tokenManager.setTokens(res.data.access, res.data.refresh);
    }
    // Set user from response
    set({ user: res.data.user, loading: false });
    return res.data.user;
  },

  googleLogin: async (credential) => {
    const res = await authApi.googleLogin(credential);
    // Save tokens to localStorage
    if (res.data.access && res.data.refresh) {
      tokenManager.setTokens(res.data.access, res.data.refresh);
    }
    // Set user from response
    set({ user: res.data.user, loading: false });
    return res.data.user;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      handleApiError(error, 'Logout failed', false); // Don't show toast, still clearing tokens
    }
    // Clear tokens from localStorage
    tokenManager.clearTokens();
    set({ user: null });
  },
})));

export default useAuthStore;
