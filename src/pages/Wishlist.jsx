import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = async (product) => {
    await removeFromWishlist(product.id);
    await addToCart(product);
  };

  const handleImageError = (e) => {
    e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+Image";
  };

  return (
    <div className="bg-slate-900 min-h-[calc(100vh-80px)] text-white">
      {wishlist.length === 0 ? (
        <div className="flex items-center justify-center px-4 min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            {/* Large Heart Icon */}
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">Your wishlist is empty</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Save your favorite items here. Browse products and add items to your wishlist.
            </p>
            
            <Link
              to="/products"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-slate-800 rounded-xl shadow hover:shadow-xl overflow-hidden flex flex-col group border border-slate-700"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className="w-full bg-slate-700">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={handleImageError}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-white truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-green-400 font-semibold">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                  </Link>
                </div>

                <div className="px-4 pb-4 mt-auto flex justify-between items-center">
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="text-red-400 hover:text-red-500 text-sm font-medium transition"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="text-green-400 hover:text-green-500 text-sm font-medium transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
