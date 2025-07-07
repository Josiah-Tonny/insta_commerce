import React, { useState, useEffect, useCallback, useRef } from "react";
import { Heart, Star, StarHalf, ChevronLeft, ChevronRight, Filter, ShoppingCart, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";

// Mock product generator
function generateProducts(start, count) {
  return Array.from({ length: count }, (_, i) => {
    const id = start + i;
    const price = (Math.random() * 100 + 10).toFixed(2);
    const originalPrice = (parseFloat(price) * 1.2).toFixed(2);
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    
    return {
      id,
      name: `Product ${id}`,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      discount,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
      reviewCount: Math.floor(Math.random() * 1000),
      isInWishlist: false,
      stock: Math.floor(Math.random() * 50) + 10, // At least 10 in stock
      image: `https://source.unsplash.com/random/300x300?product=${id}`,
    };
  });
}

const ProductCard = ({ product, onToggleWishlist, onAddToCart, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
        <div className="pt-[100%] bg-gray-200"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mt-2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        onClick={() => onToggleWishlist(product.id)}
        className={`absolute top-2 right-2 p-2 rounded-full ${product.isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} bg-white/80 backdrop-blur-sm z-10 transition-colors`}
        aria-label={product.isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 ${product.isInWishlist ? 'fill-current' : 'fill-none'}`} />
      </button>
      
      <Link to={`/product/${product.id}`} className="block relative pt-[100%] overflow-hidden group">
        <img 
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
          </div>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </Link>
      
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`} className="block mb-1">
          <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-pink-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mt-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(product.rating) ? (
                  <Star className="w-3 h-3 fill-current" />
                ) : i < Math.ceil(product.rating) ? (
                  <StarHalf className="w-3 h-3 fill-current" />
                ) : (
                  <Star className="w-3 h-3" />
                )}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center">
            <span className="text-lg font-bold text-pink-500">${product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="ml-2 text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <p className="text-xs text-green-600 mt-1">
            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
          </p>
        </div>
        
        <Button 
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const observer = useRef();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Load initial products
  useEffect(() => {
    setProducts(generateProducts(1, 10));
  }, []);

  // Toggle wishlist status
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    if (product.stock === 0) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categories */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/categories" className="text-pink-500 hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Electronics', icon: '📱', bg: 'bg-blue-100', text: 'text-blue-600' },
            { name: 'Fashion', icon: '👕', bg: 'bg-pink-100', text: 'text-pink-600' },
            { name: 'Home', icon: '🏠', bg: 'bg-purple-100', text: 'text-purple-600' },
            { name: 'Beauty', icon: '💄', bg: 'bg-red-100', text: 'text-red-600' },
            { name: 'Sports', icon: '⚽', bg: 'bg-green-100', text: 'text-green-600' },
            { name: 'Books', icon: '📚', bg: 'bg-yellow-100', text: 'text-yellow-600' },
          ].map((category, i) => (
            <Link 
              key={i} 
              to={`/category/${category.name.toLowerCase()}`}
              className="group"
            >
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${category.bg} ${category.text} rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-pink-500 transition-colors">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div id="featured-products" className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-pink-500 hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              ref={index === products.length - 1 ? null : null}
            >
              <ProductCard 
                product={{
                  ...product,
                  isInWishlist: wishlist.has(product.id)
                }}
                onToggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
          
          {/* Loading skeletons */}
          {isLoading && Array(5).fill(0).map((_, i) => (
            <div key={`loading-${i}`}>
              <ProductCard isLoading={true} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Back to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors z-50"
        aria-label="Back to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Home;
