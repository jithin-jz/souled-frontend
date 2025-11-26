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
      <div className="min-h-[calc(100vh-80px)] bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Large Cart Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-slate-800 border-2 border-slate-700 rounded-full p-8">
              <svg 
                className="w-20 h-20 text-slate-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            You haven't added any items yet. Browse products and add items to see them here.
          </p>
          
          <Link
            to="/products"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-colors"
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
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold text-white">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
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
            className="px-3 py-1 text-slate-300 hover:bg-slate-700"
          >
            −
          </button>
          <span className="px-4 text-white">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="px-3 py-1 text-slate-300 hover:bg-slate-700"
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
