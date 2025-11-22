import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { setLogoutCallback } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.warn("Logout request failed, clearing state anyway.");
        }
        setUser(null);
        navigate("/login");
    }, [navigate]);

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
        setLogoutCallback(logout);
    }, [logout]);

    useEffect(() => {
        loadUser().finally(() => setLoading(false));
    }, [loadUser]);

    const handleAuthSuccess = async () => {
        const userData = await loadUser();
        if (userData?.is_staff) {
            navigate("/admin/dashboard");
        } else {
            navigate("/");
        }
    };

    // Keep positional args since UI already matches
    const login = async (email, password) => {
        await authApi.login(email, password);
        await handleAuthSuccess();
    };

    const register = async (first_name, last_name, email, password) => {
        await authApi.register(first_name, last_name, email, password);
        await handleAuthSuccess();
    };

    const googleLogin = async (credential) => {
        await authApi.googleLogin(credential);
        await handleAuthSuccess();
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
