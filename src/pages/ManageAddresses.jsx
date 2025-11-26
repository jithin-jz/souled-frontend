import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

const ManageAddresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      const res = await api.get("/orders/addresses/");
      setAddresses(res.data);
    } catch (err) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      street: "",
      city: "",
      pincode: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.patch(`/orders/addresses/${editingId}/`, formData);
        toast.success("Address updated");
      } else {
        await api.post("/orders/addresses/", formData);
        toast.success("Address saved");
      }
      await loadAddresses();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save address");
    }
  };

  const handleEdit = (address) => {
    setFormData({
      full_name: address.full_name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      pincode: address.pincode,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;

    try {
      await api.delete(`/orders/addresses/${id}/`);
      toast.success("Address deleted");
      await loadAddresses();
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            {showForm ? "Cancel" : "+ Add New Address"}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-800 p-6 rounded-lg mb-6 space-y-4"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="bg-slate-700 px-4 py-2 rounded border border-slate-600 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className="bg-slate-700 px-4 py-2 rounded border border-slate-600 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleChange}
                required
                className="md:col-span-2 bg-slate-700 px-4 py-2 rounded border border-slate-600 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="bg-slate-700 px-4 py-2 rounded border border-slate-600 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                pattern="[0-9]{6}"
                className="bg-slate-700 px-4 py-2 rounded border border-slate-600 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition"
              >
                {editingId ? "Update Address" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-600 hover:bg-slate-700 px-6 py-2 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <p className="text-lg">No saved addresses yet.</p>
            <p className="text-sm mt-2">
              Click "Add New Address" to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition"
              >
                <h3 className="font-semibold text-lg">{address.full_name}</h3>
                <p className="text-slate-300 mt-1">{address.phone}</p>
                <p className="text-slate-400 mt-2">{address.street}</p>
                <p className="text-slate-400">
                  {address.city}, {address.pincode}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAddresses;

