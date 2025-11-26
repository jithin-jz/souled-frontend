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

/* PRODUCT CARD */
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
    <div className="group relative w-full">
      <button
        onClick={toggle}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 hover:bg-slate-800 transition-colors"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500 text-lg" />
        ) : (
          <FiHeart className="text-slate-300 text-lg group-hover:text-red-500 transition-colors" />
        )}
      </button>

      <Link to={`/products/${product.id}`} className="block">
        <div className="overflow-hidden rounded-xl bg-slate-800 border border-slate-700">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-[3/4] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="mt-3">
          <h3 className="text-white text-sm sm:text-base font-medium truncate">
            {product.name}
          </h3>
          <p className="text-slate-300 font-bold text-sm sm:text-base mt-1">
            ₹{product.price}
          </p>
        </div>
      </Link>
    </div>
  );
};

/* HOME PAGE */
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  const { addToWishlist, removeFromWishlist, isProductWishlisted } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    bannerImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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
      <div className="flex justify-center items-center min-h-[60vh] bg-slate-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-4 bg-slate-900 text-white">

      {/* BANNER */}
      <div className="w-full relative">
        <img
          src={bannerImages[currentBanner]}
          alt="Banner"
          className="
            w-full 
            h-48 sm:h-64 
            md:h-auto 
            object-cover 
            md:object-fill 
            transition-opacity 
            duration-700
          "
        />

        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-2.5 w-2.5 rounded-full ${
                index === currentBanner ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="overflow-hidden py-2">
        <div className="flex gap-6 animate-marquee whitespace-nowrap min-w-max">
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
              className="px-4 py-2 rounded-full text-xs sm:text-sm text-white bg-slate-800 border border-slate-700 shadow-md"
            >
              {offer}
            </div>
          ))}
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <section className="px-4">
        <h2 className="mb-4 text-xl sm:text-2xl font-bold">NEW ARRIVALS</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
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

      {/* FEATURED PRODUCTS */}
      <section className="px-4">
        <h2 className="mb-4 text-xl sm:text-2xl font-bold">FEATURED PRODUCTS</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
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

      <div className="flex flex-col items-center mt-8 mb-6">
  <span className="text-base font-bold tracking-widest text-red-500">
    VIEW ALL PRODUCTS
  </span>

  <Link
    to="/products"
    className="text-red-600 hover:text-red-700 text-6xl font-extrabold leading-none jump-arrow"
  >
    ᗐ
  </Link>
</div>

    </div>
  );
};

export default Home;

