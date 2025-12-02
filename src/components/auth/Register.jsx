import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Register = () => {
  const { register, googleLogin } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { firstName, lastName, email, password } = formData;

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(firstName, lastName, email, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      let msg = "Registration failed";
      
      // Handle different error response formats
      if (err?.response?.data) {
        const data = err.response.data;
        // Direct detail field
        if (data.detail) {
          msg = data.detail;
        }
        // Email specific errors
        else if (data.email && Array.isArray(data.email)) {
          msg = data.email[0];
        }
        // Password specific errors
        else if (data.password && Array.isArray(data.password)) {
          msg = data.password[0];
        }
        // Non-field errors
        else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          msg = data.non_field_errors[0];
        }
      }
      
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (response) => {
    setGoogleLoading(true);
    try {
      await googleLogin(response.credential);
      toast.success("Google login successful!");
      navigate("/");
    } catch (err) {
      let msg = "Google sign-in failed. Try again.";
      
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

        <form className="space-y-4" onSubmit={submit}>
          <input
            type="text"
            name="firstName"
            required
            value={firstName}
            onChange={onChange}
            placeholder="First Name"
            className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            name="lastName"
            required
            value={lastName}
            onChange={onChange}
            placeholder="Last Name"
            className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:ring-2 focus:ring-red-500"
          />

          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={onChange}
            placeholder="Email"
            className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            name="password"
            required
            minLength={8}
            value={password}
            onChange={onChange}
            placeholder="Password (min 8 characters)"
            className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            disabled={disabled}
            className={`w-full p-3 rounded text-lg font-semibold text-white transition
            ${disabled ? "bg-red-800 opacity-70 cursor-not-allowed"
                       : "bg-red-600 hover:bg-red-700"}`}
          >
            {loading ? "Creating account..." : "Register"}
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-400 hover:text-red-300 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

