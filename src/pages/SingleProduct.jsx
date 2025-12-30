import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import { toast } from "react-toastify";
import api from "../utils/api";
import Loader from "../components/Loader";
import { handleApiError } from "../utils/errorHandler";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        handleApiError(error, 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const safeAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (!product) return;

    setBtnLoading(true);
    await addToCart(product); // cleaner and consistent with CartContext logic
    setBtnLoading(false);

    toast.success("Added to cart!");
  };

  const safeBuyNow = async () => {
    if (!user) {
      toast.error("Please login to buy products");
      return;
    }

    setBtnLoading(true);
    await addToCart(product);
    setBtnLoading(false);

    navigate("/cart");
  };

  const handleImageError = (e) => {
    e.currentTarget.src = "https://via.placeholder.com/400?text=No+Image";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-slate-900 text-white">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-900 text-white">
        <p className="text-red-500 font-semibold mb-4">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all hover:scale-105 shadow-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  const frontendCategory =
    product.category.toLowerCase() === "men" ? "Men" : "Women";

  return (
    <div className="bg-slate-900 text-white min-h-screen px-4 pt-10 pb-0">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-slate-800 p-6 rounded-2xl shadow-lg">
        
        {/* Product Image */}
        <div className="bg-slate-700 rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-[450px] object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <p className="text-2xl text-green-400 font-semibold">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <p className="text-slate-300 text-sm">
              {product.description || "No description available."}
            </p>

            <div className="text-sm">
              <span className="font-medium text-slate-100">Category: </span>
              <Link
                to="/products"
                state={{ category: frontendCategory }}
                className="text-green-400 hover:underline"
              >
                {frontendCategory}
              </Link>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              disabled={btnLoading}
              onClick={safeAddToCart}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold bg-red-600 hover:bg-red-700 transition-all disabled:opacity-50 hover:scale-105 shadow-lg"
            >
              {btnLoading ? "Processing..." : "Add to Cart"}
            </button>

            <button
              disabled={btnLoading}
              onClick={safeBuyNow}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold bg-red-600 hover:bg-red-700 transition-all disabled:opacity-50 hover:scale-105 shadow-lg"
            >
              {btnLoading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SingleProduct;

