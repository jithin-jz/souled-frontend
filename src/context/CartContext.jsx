// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // cart: backend cart items -> [{ id, product: {...}, quantity }]
  const [cart, setCart] = useState([]);
  // wishlistItems: backend wishlist items -> [{ id, product: {...} }]
  const [wishlistItems, setWishlistItems] = useState([]);
  // wishlist: exposed to UI -> array of product objects for backward compatibility
  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);

  // Load cart + wishlist when user logs in (or clear when logged out)
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([loadCart(), loadWishlist()]).finally(() => setLoading(false));
    } else {
      setCart([]);
      setWishlistItems([]);
      setWishlist([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // -------------------------
  // Backend loaders
  // -------------------------
  const loadCart = async () => {
    try {
      const res = await api.get("/cart/");
      // backend returns { id, items: [{ id, product, quantity }] }
      setCart(res.data.items || []);
      return res.data;
    } catch (err) {
      // silent fail
      return null;
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await api.get("/cart/wishlist/");
      // res.data.items -> [{ id: wishlist_item_id, product: {...} }]
      const items = res.data.items || [];
      setWishlistItems(items);
      // expose just product objects for compatibility with existing UI
      setWishlist(items.map((it) => it.product));
      return res.data;
    } catch (err) {
      // silent fail
      setWishlistItems([]);
      setWishlist([]);
      return null;
    }
  };

  // -------------------------
  // CART actions
  // -------------------------
  const addToCart = async (product, quantity = 1) => {
    if (!user) return;
    try {
      await api.post("/cart/add/", { product_id: product.id, quantity });
      await loadCart();
    } catch (err) {
      // silent fail
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}/`);
      await loadCart();
    } catch (err) {
      // silent fail
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return removeFromCart(itemId);
    try {
      await api.patch(`/cart/update/${itemId}/`, { quantity: newQty });
      await loadCart();
    } catch (err) {
      // silent fail
    }
  };

  const clearCart = async () => {
    try {
      // Remove each item (backend doesn't expose a clear endpoint)
      const items = [...cart];
      for (const it of items) {
        await api.delete(`/cart/remove/${it.id}/`);
      }
      setCart([]);
    } catch (err) {
      // silent fail
    }
  };

  // -------------------------
  // WISHLIST actions (same context)
  // -------------------------
  const addToWishlist = async (product) => {
    if (!user) return;
    try {
      await api.post("/cart/wishlist/add/", { product_id: product.id });
      await loadWishlist();
    } catch (err) {
      // silent fail
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      // find wishlist item id by product id
      const item = wishlistItems.find((it) => it.product?.id === productId);
      if (!item) return;
      await api.delete(`/cart/wishlist/remove/${item.id}/`);
      await loadWishlist();
    } catch (err) {
      // silent fail
    }
  };

  const isProductWishlisted = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  // -------------------------
  // Derived values
  // -------------------------
  const cartCount = cart.reduce((sum, it) => sum + (it.quantity || 1), 0);

  const cartTotal = cart.reduce(
    (sum, it) => sum + (it.product?.price || 0) * (it.quantity || 1),
    0
  );

  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider
      value={{
        // cart
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        // wishlist (exposed as array of product objects for backward compatibility)
        wishlist,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        isProductWishlisted,

        // meta
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
