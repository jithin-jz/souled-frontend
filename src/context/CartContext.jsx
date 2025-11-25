// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);

  // Prevent multiple initial loads
  const hasLoaded = useRef(false);

  /* ------------------------ LOADERS ------------------------ */
  const loadCart = useCallback(async () => {
    try {
      const res = await api.get("/cart/");
      setCart(res.data.items || []);
    } catch {}
  }, []);

  const loadWishlist = useCallback(async () => {
    try {
      const res = await api.get("/cart/wishlist/");
      const items = res.data.items || [];
      setWishlistItems(items);
      setWishlist(items.map((it) => it.product));
    } catch {
      setWishlistItems([]);
      setWishlist([]);
    }
  }, []);

  /* ------------------------ INITIAL LOAD ------------------------ */
  useEffect(() => {
    if (!user) {
      // Reset on logout
      setCart([]);
      setWishlistItems([]);
      setWishlist([]);
      hasLoaded.current = false;
      setLoading(false);
      return;
    }

    // Load only once per login
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      setLoading(true);

      Promise.all([loadCart(), loadWishlist()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user, loadCart, loadWishlist]); // loadCart and loadWishlist are stable due to useCallback

  /* ------------------------ CART ACTIONS ------------------------ */
  const addToCart = async (product, quantity = 1) => {
    if (!user) return;

    try {
      await api.post("/cart/add/", {
        product_id: product.id,
        quantity,
      });
      await loadCart();
    } catch {}
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}/`);
      await loadCart();
    } catch {}
  };

  const updateQuantity = async (itemId, qty) => {
    if (qty < 1) return removeFromCart(itemId);

    try {
      await api.patch(`/cart/update/${itemId}/`, { quantity: qty });
      await loadCart();
    } catch {}
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      await api.delete("/cart/clear/");
      await loadCart();
      return true;
    } catch {
      return false;
    }
  };

  /* ------------------------ WISHLIST ACTIONS ------------------------ */
  const addToWishlist = async (product) => {
    if (!user) return;

    try {
      await api.post("/cart/wishlist/add/", {
        product_id: product.id,
      });
      await loadWishlist();
    } catch {}
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    try {
      const item = wishlistItems.find((it) => it.product?.id === productId);
      if (!item) return;

      await api.delete(`/cart/wishlist/remove/${item.id}/`);
      await loadWishlist();
    } catch {}
  };

  const isProductWishlisted = (productId) =>
    wishlist.some((p) => p.id === productId);

  /* ------------------------ DERIVED VALUES ------------------------ */
  const cartCount = cart.reduce((sum, it) => sum + (it.quantity || 1), 0);

  const cartTotal = cart.reduce(
    (sum, it) =>
      sum + (it.product?.price || 0) * (it.quantity || 1),
    0
  );

  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        wishlist,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        isProductWishlisted,

        loading,

        reloadCart: loadCart,
        reloadWishlist: loadWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
