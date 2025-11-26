import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    toast.success("Proceeding to checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-400 text-lg mb-6">
            Your cart is empty. Add items to continue.
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LEFT SIDE – ITEMS */}
        <div className="md:col-span-2">
          <div className="bg-slate-800/70 rounded-2xl shadow-lg p-5 border border-slate-700">
            <div className="divide-y divide-slate-700">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>

            <div className="text-right mt-5">
              <button
                onClick={async () => {
                  const success = await clearCart();
                  if (success) toast.success("Cart cleared");
                  else toast.error("Failed to clear cart");
                }}
                className="text-red-400 hover:text-red-600 text-sm font-semibold"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – SUMMARY */}
        <div className="md:col-span-1">
          <div className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-lg p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4 pb-2 border-b border-slate-700">
              Summary
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="font-semibold text-white">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span className="text-green-400 font-medium">Free</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-700 text-lg font-semibold">
                <span>Total</span>
                <span className="text-white">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/payment"
              onClick={handleCheckout}
              className="block mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg text-center shadow transition"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// CART ITEM
const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const product = item.product;
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleDecrease = () => {
    const newQty = quantity - 1;
    if (newQty >= 1) {
      setQuantity(newQty);
      onUpdateQuantity(item.id, newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onUpdateQuantity(item.id, newQty);
  };

  const handleRemove = () => {
    onRemove(item.id);
    toast.success(`${product.name} removed`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-5 py-5">
      
      {/* LEFT */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-xl border border-slate-700"
        />

        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-green-400 font-bold mt-1">
            ₹{(product.price * quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {/* QTY */}
        <div className="flex items-center border border-slate-600 rounded-lg overflow-hidden">
          <button
            onClick={handleDecrease}
            className="px-3 py-1 text-gray-300 hover:bg-slate-700"
          >
            −
          </button>
          <span className="px-4 text-white">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="px-3 py-1 text-gray-300 hover:bg-slate-700"
          >
            +
          </button>
        </div>

        {/* REMOVE */}
        <button
          onClick={handleRemove}
          className="text-red-400 hover:text-red-600 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default Cart;
