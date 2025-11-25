import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

const ProfileDetails = () => {
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    try {
      const res = await api.get("/orders/addresses/");
      setAddresses(res.data);
    } catch {
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-center px-4">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-lg font-semibold mb-2">Please Log In</h2>
          <p className="text-slate-400 text-sm">
            You need to be logged in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-slate-900 text-white rounded-lg border border-slate-800 space-y-6">
      <h2 className="text-2xl font-bold text-red-500">Account</h2>

      {/* Basic info */}
      <div className="space-y-2 text-slate-300">
        <p>
          <span className="font-semibold text-white">Name:</span> {fullName}
        </p>
        <p>
          <span className="font-semibold text-white">Email:</span> {user.email}
        </p>
      </div>

      {/* Saved Addresses (read only) */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>

        {loadingAddresses ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : addresses.length === 0 ? (
          <p className="text-slate-400 text-sm">No address saved.</p>
        ) : (
          <>
            {addresses.slice(0, 1).map(addr => (
              <div key={addr.id} className="space-y-1">
                <p className="font-semibold text-white">{addr.full_name}</p>
                <p className="text-slate-300">{addr.phone}</p>
                <p className="text-slate-400">
                  {addr.street}, {addr.city} - {addr.pincode}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link
          to="/orders"
          className="bg-red-600 hover:bg-red-700 text-center py-2 rounded transition"
        >
          My Orders
        </Link>
        <Link
          to="/wishlist"
          className="bg-blue-600 hover:bg-blue-700 text-center py-2 rounded transition"
        >
          Wishlist
        </Link>
      </div>
    </div>
  );
};

export default ProfileDetails;
