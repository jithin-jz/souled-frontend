// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { setLogoutCallback } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadUser = useCallback(async () => {
        try {
            const res = await authApi.me();
            setUser(res.data);
            return res.data;
        } catch {
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        loadUser().finally(() => setLoading(false));
    }, [loadUser]);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {}
        setUser(null);
        navigate("/login", { replace: true });
    }, [navigate]);

    useEffect(() => setLogoutCallback(logout), [logout]);

    const login = async (email, password) => {
        await authApi.login(email, password);
        await loadUser();
        navigate("/", { replace: true });
    };

    const register = async (first_name, last_name, email, password) => {
        await authApi.register(first_name, last_name, email, password);
        await loadUser();
        navigate("/", { replace: true });
    };

    const googleLogin = async (credential) => {
        await authApi.googleLogin(credential);
        await loadUser();
        navigate("/", { replace: true });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAdmin: Boolean(user?.is_staff),
                login,
                register,
                googleLogin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
