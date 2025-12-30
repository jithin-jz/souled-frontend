import { useEffect, useState, useCallback } from "react";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import api from "../utils/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Loader from "../components/Loader";

const bannerImages = [
  "https://res.cloudinary.com/dk9i3gtpa/image/upload/v1766210649/Home_Page_BdOVM1E_zzej6x.png",
  "https://res.cloudinary.com/dk9i3gtpa/image/upload/v1766210685/The_Dragon_Queen_-_Homepage_banner_copy.2_hiidk8.png",
  "https://res.cloudinary.com/dk9i3gtpa/image/upload/v1766210719/spiderman_homepage_cvy64l.png",
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

  const addToWishlist = useCartStore((state) => state.addToWishlist);
  const removeFromWishlist = useCartStore((state) => state.removeFromWishlist);
  const isProductWishlisted = useCartStore((state) => state.isProductWishlisted);
  const { user } = useAuthStore();

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

      <div className="flex justify-center mt-12 mb-10">
        <Link
          to="/products"
          className="group relative inline-flex items-center gap-2 bg-white text-slate-900 font-bold py-3 px-8 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 border-slate-200"
        >
          <span className="text-sm tracking-wider">EXPLORE ALL PRODUCTS</span>
          <svg 
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

    </div>
  );
};

export default Home;
