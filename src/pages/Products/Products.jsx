import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

// Assume these components are responsive internally
import Filters from "./Filters";
import Section from "./Section";

const priceRanges = [
  { label: "₹0 - ₹999", min: 0, max: 999 },
  { label: "₹1000 - ₹1999", min: 1000, max: 1999 },
  { label: "₹2000 - ₹2999", min: 2000, max: 2999 },
  { label: "₹3000+", min: 3000, max: Infinity },
];

const categories = ["Men", "Women"];

const sectionBanners = {
  Men: "https://prod-img.thesouledstore.com/public/theSoul/uploads/users/artists/20250507115108-cp-1.jpg?format=webp&w=1500&dpr=1.5",
  Women:
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/users/artists/20241202232928-cp-1.jpg?format=webp&w=1500&dpr=1.5",
};

const Products = () => {
  const location = useLocation();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for filters
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Used to toggle visibility on smaller screens

  // Contexts
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    addToCart,
    isProductWishlisted,
    cart,
  } = useCart();
  const { user } = useAuth();

  // --------------------------------------
  // Apply category filter if coming from SingleProduct (Functionality unchanged)
  // --------------------------------------
  useEffect(() => {
    if (location.state?.category) {
      const cat =
        location.state.category.toLowerCase() === "men" ? "Men" : "Women";
      setSelectedCategories([cat]);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // --------------------------------------
  // Fetch Products using backend filtering (Functionality unchanged)
  // --------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};

        if (searchTerm.trim()) params.search = searchTerm;

        // Backend filtering only supports single category/price range selection based on the original code
        if (selectedCategories.length === 1)
          params.category = selectedCategories[0].toLowerCase();

        if (selectedPrices.length === 1) {
          const range = selectedPrices[0];
          params.min_price = range.min;
          if (range.max !== Infinity) params.max_price = range.max;
        }

        const res = await api.get("/products/", { params });
        setAllProducts(res.data);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchProducts();
  }, [searchTerm, selectedCategories, selectedPrices]);

  // --------------------------------------
  // Wishlist Handling (Functionality unchanged)
  // --------------------------------------
  const handleToggleWishlist = useCallback(
    (product) => {
      if (!user) {
        toast.warn("Please login to manage wishlist");
        return;
      }

      if (isProductWishlisted(product.id)) {
        removeFromWishlist(product.id);
        toast.info(`${product.name} removed from wishlist`);
      } else {
        addToWishlist(product);
        toast.success(`${product.name} added to wishlist`);
      }
    },
    [user, isProductWishlisted, addToWishlist, removeFromWishlist]
  );

  // --------------------------------------
  // Add to Cart (Functionality unchanged)
  // --------------------------------------
  const handleAddToCart = useCallback(
    (product) => {
      if (!user) {
        toast.warn("Please login to add items to cart");
        return;
      }

      const isInCart = cart.some((item) => item.product.id === product.id);

      if (isInCart) {
        toast.info(`${product.name} is already in the cart`);
      } else {
        addToCart(product);
        toast.success(`${product.name} added to cart`);
      }
    },
    [user, cart, addToCart]
  );

  // --------------------------------------
  // Group products by category (Functionality unchanged)
  // --------------------------------------
  const groupedByCategory = useMemo(
    () =>
      categories.map((cat) => ({
        category: cat,
        banner: sectionBanners[cat],
        products: allProducts.filter(
          (p) => p.category.toLowerCase() === cat.toLowerCase()
        ),
      })),
    [allProducts]
  );

  // --------------------------------------
  // Filter Toggles (Functionality unchanged)
  // --------------------------------------
  const togglePriceFilter = (range) => {
    setSelectedPrices((prev) =>
      prev.some((r) => r.label === range.label) ? [] : [range]
    );
  };

  const toggleCategoryFilter = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? [] : [category]
    );
  };

  return (
    // Responsive container setup: uses full width on small screens, centers content.
    <div className="min-h-screen bg-slate-900 text-white pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*
          Filters component is passed props to control its visibility.
          The internal implementation of Filters must handle the mobile view,
          for example, by using a fixed/modal view when showFilters is true on small screens.
        */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          // The responsive logic for showing/hiding the filter UI on mobile is handled by
          // the 'showFilters' state and the 'Filters' component's internal design.
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedPrices={selectedPrices}
          togglePriceFilter={togglePriceFilter}
          selectedCategories={selectedCategories}
          toggleCategoryFilter={toggleCategoryFilter}
          priceRanges={priceRanges}
          categories={categories}
        />

        <div className="mt-8">
          {loading ? (
            <Loader />
          ) : allProducts.length === 0 ? (
            <p className="text-center text-xl text-slate-400 py-10">
              No products found matching the criteria.
            </p>
          ) : (
            // The product sections are rendered here
            groupedByCategory.map(({ category, banner, products }) => (
              <Section
                key={category}
                category={category}
                banner={banner}
                products={products}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                wishlist={wishlist}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
