import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Login = () => {
    const { login, googleLogin } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { email, password } = formData;

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // FIX: send positional args, not an object
            await login(email, password);
            toast.success("Logged in successfully!");
        } catch (err) {
            let msg = "Invalid email or password.";
            if (err?.response?.data?.detail) msg = err.response.data.detail;
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSuccess = async (res) => {
        setGoogleLoading(true);
        try {
            await googleLogin(res.credential);
            toast.success("Google login successful!");
        } catch {
            toast.error("Google login failed. Try again.");
        } finally {
            setGoogleLoading(false);
        }
    };

    const disabled = loading || googleLoading;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl border border-slate-700">
                <h2 className="text-3xl text-white font-bold text-center mb-6">
                    Welcome Back 🚀
                </h2>

                <form onSubmit={submit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={onChange}
                        className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:ring-2 focus:ring-red-500"
                    />

                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                        value={password}
                        onChange={onChange}
                        className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:ring-2 focus:ring-red-500"
                    />

                    <button
                        type="submit"
                        disabled={disabled}
                        className={`w-full p-3 rounded text-lg font-semibold text-white transition
                        ${disabled ? "bg-red-800 opacity-70 cursor-not-allowed"
                                   : "bg-red-600 hover:bg-red-700"}`}
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-center space-y-3">
                    <div className="text-gray-500">OR</div>
                    {googleLoading ? (
                        <p className="text-gray-300 text-sm">Connecting to Google...</p>
                    ) : (
                        <GoogleLogin
                            onSuccess={onGoogleSuccess}
                            onError={() => toast.error("Google sign-in error")}
                            disabled={loading}
                        />
                    )}
                </div>

                <p className="text-gray-400 text-center mt-6">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-red-400 hover:text-red-300 underline font-medium"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
