import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Login = () => {
  const { login, googleLogin } = useAuthStore();
  const navigate = useNavigate();

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
      const user = await login(email, password);
      toast.success("Logged in successfully!");
      
      if (user?.is_staff) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      let msg = "Invalid email or password.";
      
      // Handle different error response formats
      if (err?.response?.data) {
        const data = err.response.data;
        // Direct detail field
        if (data.detail) {
          msg = data.detail;
        }
        // Non-field errors array
        else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          msg = data.non_field_errors[0];
        }
        // Email or password specific errors
        else if (data.email || data.password) {
          msg = data.email?.[0] || data.password?.[0] || msg;
        }
      }
      
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (res) => {
    setGoogleLoading(true);
    try {
      const user = await googleLogin(res.credential);
      toast.success("Google login successful!");
      
      if (user?.is_staff) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      let msg = "Google login failed. Try again.";
      
      // Extract specific error message if available
      if (err?.response?.data?.detail) {
        msg = err.response.data.detail;
      }
      
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const disabled = loading || googleLoading;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl border border-slate-700">

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
            <p className="text-slate-300 text-sm">Connecting to Google...</p>
          ) : (
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => toast.error("Google sign-in error")}
              disabled={loading}
            />
          )}
        </div>

        <p className="text-slate-400 text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-red-400 hover:text-red-300 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

