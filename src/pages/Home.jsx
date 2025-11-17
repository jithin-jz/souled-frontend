import { useEffect, useState, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Loader from "../components/Loader";

const bannerImages = [
  "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/Home_Page_BdOVM1E.jpg?format=webp&w=1500&dpr=1.5",
  "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/The_Dragon_Queen_-_Homepage_banner_copy.2.jpg?format=webp&w=1500&dpr=1.5",
  "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/spiderman_homepage.jpg?format=webp&w=1500&dpr=1.5",
];

// -------------------------------------------
// Product Card
// -------------------------------------------
const ProductCard = ({ product, isWishlisted, onToggleWishlist }) => {
  const toggle = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleWishlist(product);
    },
    [product, onToggleWishlist]
  );

  return (
    <div className="group relative">
      <button
        onClick={toggle}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-gray-900/80 backdrop-blur-sm"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FiHeart className="text-gray-400 group-hover:text-red-500" />
        )}
      </button>

      <Link to={`/products/${product.id}`} className="block">
        <div className="overflow-hidden rounded-lg bg-gray-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-contain transition-opacity duration-300 group-hover:scale-105"
          />
        </div>

        <div className="mt-3">
          <h3 className="text-white font-medium">{product.name}</h3>
          <p className="text-gray-300 font-bold">₹{product.price}</p>
        </div>
      </Link>
    </div>
  );
};

// -------------------------------------------
// Home Page Component
// -------------------------------------------
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  const { addToWishlist, removeFromWishlist, isProductWishlisted } = useCart();
  const { user } = useAuth();

  // Preload banners
  useEffect(() => {
    bannerImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/");
        const products = res.data;

        setFeaturedProducts(products.slice(0, 4));
        setNewArrivals(products.slice(-4));
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Banner rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Wishlist toggle
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
    [user, addToWishlist, removeFromWishlist, isProductWishlisted]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-0 bg-gray-900 text-white">
      {/* Banner */}
      <div className="w-full overflow-hidden relative">
        <img
          src={bannerImages[currentBanner]}
          alt="Banner"
          className="w-full h-auto object-cover transition-opacity duration-700 opacity-100"
        />

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-2 w-2 rounded-full ${
                index === currentBanner ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden py-2">
        <div className="flex gap-8 animate-marquee whitespace-nowrap min-w-max">
          {[
            "🎉 Free Delivery Over ₹499",
            "🔥 Flat 50% Off - Marvel Gear",
            "🕸️ Spider-Verse Exclusive",
            "🚚 COD Available",
            "🔁 Easy 7-Day Returns",
            "🧙 Anime Merch From Naruto, One Piece & More!",
          ].map((offer, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium text-white bg-gray-800 shadow-md"
            >
              {offer}
            </div>
          ))}
        </div>
      </div>

      {/* Featured */}
      <section className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold">Featured Products</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isProductWishlisted(product.id)}
            />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold">New Arrivals</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isProductWishlisted(product.id)}
            />
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 text-center mb-0">
        <Link
          to="/products"
          className="inline-block rounded-full bg-white text-black px-8 py-3 font-medium hover:bg-gray-200 transition-colors"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default Home;
