import useCartStore from "../store/useCartStore";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const wishlist = useCartStore((state) => state.wishlist);
  const removeFromWishlist = useCartStore((state) => state.removeFromWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

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
              className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-all inline-block"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
          {/* Page Header */}
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
            My Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
          </h1>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-slate-800 rounded-lg sm:rounded-xl shadow hover:shadow-xl overflow-hidden flex flex-col group border border-slate-700"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className="w-full bg-slate-700 aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="p-3 sm:p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-white text-sm sm:text-base truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-green-400 font-semibold text-sm sm:text-base">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                  </Link>
                </div>

                {/* Mobile-friendly button layout: stack on small screens, side by side on larger */}
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 mt-auto flex flex-col xs:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="flex-1 px-3 sm:px-4 py-2 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-gray-200 active:bg-gray-300 transition-all"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 px-3 sm:px-4 py-2 rounded-full bg-red-600 text-white text-xs sm:text-sm font-semibold hover:bg-red-700 active:bg-red-800 transition-all"
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
