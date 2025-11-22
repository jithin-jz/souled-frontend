// src/utils/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error("Missing VITE_API_URL in .env");
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let onLogoutCallback = () => {
  console.error("Logout callback not initialized");
};

export const setLogoutCallback = (cb) => {
  onLogoutCallback = cb;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config: original } = err;

    if (!response) {
      // Network/CORS error, nothing to refresh
      return Promise.reject(err);
    }

    // Not a 401 → let caller handle it
    if (response.status !== 401) {
      return Promise.reject(err);
    }

    // 401 from "no credentials" (guest user, e.g. /me/ when logged out)
    // In this case we DO NOT try refresh or logout, just pass the error through.
    const detail = response.data?.detail;
    if (detail === "Authentication credentials were not provided.") {
      return Promise.reject(err);
    }

    // Prevent infinite loop
    if (original._retry) {
      onLogoutCallback();
      return Promise.reject(err);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(original)),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      // Browser sends refresh cookie automatically
      await refreshApi.post("/refresh/");

      isRefreshing = false;
      processQueue(null);

      // Retry original failed request with new access token
      return api(original);
    } catch (refreshErr) {
      isRefreshing = false;
      processQueue(refreshErr);

      // Refresh failed → real auth problem → hard logout
      onLogoutCallback();

      return Promise.reject(refreshErr);
    }
  }
);

export default api;
