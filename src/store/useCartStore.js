import { create } from 'zustand';
import api from '../utils/api';
import useAuthStore from './useAuthStore';
import { handleApiError } from '../utils/errorHandler';

const useCartStore = create((set, get) => ({
  cart: [],
  wishlistItems: [],
  wishlist: [],
  loading: false,

  loadCart: async (silent = false) => {
    if (!useAuthStore.getState().user) {
        set({ cart: [] });
        return;
    }

    if (!silent) set({ loading: true });
    try {
      const res = await api.get("/cart/");
      const items = res.data.items || [];
      // Sort items by ID to maintain stable order
      items.sort((a, b) => a.id - b.id);
      set({ cart: items });
    } catch (error) {
      handleApiError(error, 'Failed to load cart', !silent);
    } finally {
      if (!silent) set({ loading: false });
    }
  },

  loadWishlist: async () => {
    if (!useAuthStore.getState().user) {
        set({ wishlistItems: [], wishlist: [] });
        return;
    }

    try {
      const res = await api.get("/cart/wishlist/");
      const items = res.data.items || [];
      set({ 
          wishlistItems: items,
          wishlist: items.map((it) => it.product)
      });
    } catch (error) {
      handleApiError(error, 'Failed to load wishlist', false);
      set({ wishlistItems: [], wishlist: [] });
    }
  },

  addToCart: async (product, quantity = 1) => {
    if (!useAuthStore.getState().user) return;
    try {
      await api.post("/cart/add/", { product_id: product.id, quantity });
      await get().loadCart();
    } catch (error) {
      handleApiError(error, 'Failed to add item to cart');
    }
  },

  removeFromCart: async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}/`);
      await get().loadCart(true);
    } catch (error) {
      handleApiError(error, 'Failed to remove item from cart');
    }
  },

  updateQuantity: async (itemId, qty) => {
    if (qty < 1) return get().removeFromCart(itemId);
    try {
      await api.patch(`/cart/update/${itemId}/`, { quantity: qty });
      await get().loadCart(true);
    } catch (error) {
      handleApiError(error, 'Failed to update quantity');
    }
  },

  clearCart: async () => {
    if (!useAuthStore.getState().user) return;
    try {
      await api.delete("/cart/clear/");
      await get().loadCart(true);
      return true;
    } catch (error) {
      return false;
    }
  },

  addToWishlist: async (product) => {
    if (!useAuthStore.getState().user) return;
    try {
      await api.post("/cart/wishlist/add/", { product_id: product.id });
      await get().loadWishlist();
    } catch (error) {
      handleApiError(error, 'Failed to add to wishlist');
    }
  },

  removeFromWishlist: async (productId) => {
    if (!useAuthStore.getState().user) return;
    try {
      const { wishlistItems } = get();
      const item = wishlistItems.find((it) => it.product?.id === productId);
      if (!item) return;

      await api.delete(`/cart/wishlist/remove/${item.id}/`);
      await get().loadWishlist();
    } catch (error) {
      handleApiError(error, 'Failed to remove from wishlist');
    }
  },

  isProductWishlisted: (productId) => {
    return get().wishlist.some((p) => p.id === productId);
  },
  
  reset: () => {
      set({ cart: [], wishlistItems: [], wishlist: [] });
  },
}));

// Subscribe to Auth changes
useAuthStore.subscribe((state) => state.user, (user) => {
    if (user) {
        useCartStore.getState().loadCart();
        useCartStore.getState().loadWishlist();
    } else {
        useCartStore.getState().reset();
    }
});

export default useCartStore;
