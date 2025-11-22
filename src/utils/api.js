// src/utils/api.js
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) console.error("Missing VITE_API_URL in .env");

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 15000,
});

const refreshApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

let onLogoutCallback = () =>
    console.error("Logout callback not initialized");

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

// ======================================================
// CSRF SUPPORT  IMPORTANT for POST/PUT/PATCH/DELETE
// ======================================================
api.defaults.xsrfCookieName = "csrftoken";
api.defaults.xsrfHeaderName = "X-CSRFToken";
refreshApi.defaults.xsrfCookieName = "csrftoken";
refreshApi.defaults.xsrfHeaderName = "X-CSRFToken";

// Attach CSRF token
api.interceptors.request.use((config) => {
    const csrf = Cookies.get("csrftoken");
    if (csrf) config.headers["X-CSRFToken"] = csrf;
    return config;
});

refreshApi.interceptors.request.use((config) => {
    const csrf = Cookies.get("csrftoken");
    if (csrf) config.headers["X-CSRFToken"] = csrf;
    return config;
});

// ======================================================
// 401 HANDLING WITH REFRESH QUEUE
// ======================================================
api.interceptors.response.use(
    (res) => res,

    async (err) => {
        const { response, config: original } = err;

        if (!response) return Promise.reject(err);

        if (response.status !== 401) return Promise.reject(err);

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
            await refreshApi.post("/refresh/");

            isRefreshing = false;
            processQueue(null);
            return api(original);

        } catch (refreshErr) {
            isRefreshing = false;
            processQueue(refreshErr);
            onLogoutCallback();
            return Promise.reject(refreshErr);
        }
    }
);

export default api;
