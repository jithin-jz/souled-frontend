// src/utils/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error("Missing VITE_API_URL in .env");
}

// Token management
export const tokenManager = {
  getAccessToken: () => localStorage.getItem("access_token"),
  getRefreshToken: () => localStorage.getItem("refresh_token"),
  setTokens: (access, refresh) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  },
  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let onLogoutCallback = () => {
  console.error("Logout callback not initialized");
};

export const setLogoutCallback = (cb) => {
  onLogoutCallback = cb;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Not a 401 or no response
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry if already retried
    if (originalRequest._retry) {
      tokenManager.clearTokens();
      onLogoutCallback();
      return Promise.reject(error);
    }

    // If this is a refresh request that failed, logout
    if (originalRequest.url === "/refresh/") {
      tokenManager.clearTokens();
      onLogoutCallback();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      tokenManager.clearTokens();
      onLogoutCallback();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(`${API_URL}/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      tokenManager.setTokens(access, refreshToken);

      isRefreshing = false;
      processQueue(null, access);

      originalRequest.headers.Authorization = `Bearer ${access}`;
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError, null);
      tokenManager.clearTokens();
      onLogoutCallback();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
