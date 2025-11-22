// src/api/authApi.js
import api from "../utils/api";

export const authApi = {
    login: (email, password) =>
        api.post("/login/", { email, password }),

    register: (first_name, last_name, email, password) =>
        api.post("/register/", {
            first_name,
            last_name,
            email,
            password,
        }),

    googleLogin: (id_token) =>
        api.post("/google/", { id_token }),

    logout: () => api.post("/logout/"),

    me: () => api.get("/me/"),
};
