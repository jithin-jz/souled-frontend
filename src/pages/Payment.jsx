import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

const Payment = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    full_name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

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

    if (!user) {
      toast.error("Please login!");
      return;
    }

    setLoading(true);

    try {
      validateAddress();

      // correct backend format
      const formattedCart = cart.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: Number(i.product.price),
        quantity: Number(i.quantity),
      }));

      const payload = {
        address,
        payment_method: paymentMethod,
        cart: formattedCart,
      };

      const res = await api.post("/orders/create/", payload);

      if (paymentMethod === "cod") {
        clearCart();
        toast.success("Order placed (COD)");
        navigate("/order-success");
        return;
      }

      // STRIPE REDIRECT
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
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl p-8 shadow-xl flex flex-col md:flex-row gap-10">

        {/* LEFT FORM */}
        <form className="md:w-2/3 space-y-6" onSubmit={placeOrder}>
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">
            Shipping Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="full_name" label="Full Name" value={address.full_name} onChange={handleChange} />
            <Input name="phone" label="Phone Number" value={address.phone} onChange={handleChange} />
            <Input name="street" label="Street Address" value={address.street} onChange={handleChange} full />
            <Input name="city" label="City" value={address.city} onChange={handleChange} />
            <Input name="pincode" label="Pincode" value={address.pincode} onChange={handleChange} />
          </div>

          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">
            Payment Method
          </h2>

          <div className="space-y-3">
            <Radio label="Cash on Delivery (COD)" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
            <Radio label="Stripe Card Payment" value="stripe" checked={paymentMethod === "stripe"} onChange={() => setPaymentMethod("stripe")} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        {/* RIGHT SUMMARY */}
        <div className="md:w-1/3 bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4">
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
      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-green-500"
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
