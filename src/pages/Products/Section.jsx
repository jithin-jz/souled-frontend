import ProductCard from "./ProductCard";
import { useCart } from "../../context/CartContext";

const Section = ({
  category,
  banner,
  products,
  onAddToCart,
  onToggleWishlist,
}) => {
  const { isProductWishlisted } = useCart();

  if (!products || products.length === 0) return null;

  const handleLoad = (e) => {
    e.currentTarget.style.opacity = 1;
  };

  return (
    <div className="mb-12">
      {/* Banner */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-sm">
        <img
          src={banner}
          alt={`${category} Banner`}
          loading="lazy"
          onLoad={handleLoad}
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/1200x400?text=Image+Not+Found";
            e.currentTarget.style.opacity = 1;
          }}
          className="w-full h-auto max-h-[280px] object-cover opacity-0 transition-opacity duration-500"
        />
      </div>

      {/* Category Heading */}
      <h2 className="text-2xl font-semibold mt-4 mb-4 text-white">
        {category} Collection
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            isWishlisted={isProductWishlisted(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Section;
