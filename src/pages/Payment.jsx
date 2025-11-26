import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

const Payment = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [address, setAddress] = useState({
    full_name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Load saved addresses
  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      const res = await api.get("/orders/addresses/");
      setSavedAddresses(res.data);
      if (res.data.length > 0) {
        setUseNewAddress(false);
        setSelectedAddressId(res.data[0].id);
      }
    } catch {
      // Ignore error if no addresses
    }
  };

  const handleChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAddress = () => {
    const { full_name, phone, street, city, pincode } = address;

    if (!full_name || !phone || !street || !city || !pincode) {
      throw new Error("All address fields are required");
    }
    if (!/^\d{10}$/.test(phone)) {
      throw new Error("Phone must be 10 digits");
    }
    if (!/^\d{6}$/.test(pincode)) {
      throw new Error("Pincode must be 6 digits");
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!user) {
      toast.error("Please login!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const formattedCart = cart.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: Number(i.product.price),
        quantity: Number(i.quantity),
      }));

      const payload = {
        payment_method: paymentMethod,
        cart: formattedCart,
      };

      // Handle address - use saved or new
      if (useNewAddress) {
        validateAddress();
        payload.address = address;
        // Note: Backend will automatically save this address when creating the order
      } else {
        if (!selectedAddressId) {
          throw new Error("Please select an address");
        }
        payload.address_id = selectedAddressId;
      }

      const res = await api.post("/orders/create/", payload);

      if (paymentMethod === "cod") {
        toast.success("Order placed (Cash on Delivery)");
        navigate("/order-success");
        return;
      }

      // Stripe redirect
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
        return;
      }

      throw new Error("Stripe session not created");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto bg-slate-800 rounded-xl p-8 shadow-xl flex flex-col md:flex-row gap-10">

        {/* LEFT FORM */}
        <form className="md:w-2/3 space-y-6" onSubmit={placeOrder}>

          <h2 className="text-xl font-semibold border-b border-slate-700 pb-2">
            Shipping Information
          </h2>

          {/* Address Selection */}
          {savedAddresses.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!useNewAddress}
                    onChange={() => setUseNewAddress(false)}
                    className="h-4 w-4 text-green-500"
                  />
                  <span>Use saved address</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={useNewAddress}
                    onChange={() => setUseNewAddress(true)}
                    className="h-4 w-4 text-green-500"
                  />
                  <span>Enter new address</span>
                </label>
              </div>

              {/* Saved Address Dropdown */}
              {!useNewAddress && (
                <div>
                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-md text-white"
                    required
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.full_name} - {addr.street}, {addr.city}, {addr.pincode}
                      </option>
                    ))}
                  </select>
                  <Link
                    to="/addresses"
                    className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block"
                  >
                    Manage Addresses →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* New Address Form */}
          {useNewAddress && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="full_name" label="Full Name" value={address.full_name} onChange={handleChange} />
                <Input name="phone" label="Phone Number" value={address.phone} onChange={handleChange} />
                <Input name="street" label="Street Address" value={address.street} onChange={handleChange} full />
                <Input name="city" label="City" value={address.city} onChange={handleChange} />
                <Input name="pincode" label="Pincode" value={address.pincode} onChange={handleChange} />
              </div>
            </>
          )}

          <h2 className="text-xl font-semibold border-b border-slate-700 pb-2">
            Payment Method
          </h2>

          <div className="space-y-3">
            <Radio label="Cash on Delivery (COD)" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
            <Radio label="Stripe Card Payment" value="stripe" checked={paymentMethod === "stripe"} onChange={() => setPaymentMethod("stripe")} />
          </div>

          <button
            type="submit"
            disabled={loading}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

        </form>

        {/* RIGHT SUMMARY */}
        <div className="md:w-1/3 bg-slate-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold border-b border-slate-600 pb-2 mb-4">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span>{item.quantity} × {item.product.name}</span>
                <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mt-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};


/* ------- INPUT COMPONENTS ------- */

const Input = ({ name, label, value, onChange, full = false }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <label className="text-sm mb-1 block">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-md text-white focus:ring-green-500"
      required
    />
  </div>
);

const Radio = ({ label, value, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-green-500"
    />
    <span>{label}</span>
  </label>
);

export default Payment;

