import React from 'react';
import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaRegStarHalfAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const { 
    id, 
    name, 
    price, 
    originalPrice, 
    image, 
    rating, 
    reviewCount,
    isInWishlist = false,
    isInCart = false,
    stock = 0
  } = product;

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaRegStarHalfAlt key="half" className="text-yellow-400" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return (
      <div className="flex items-center mt-1">
        <div className="flex">
          {stars}
        </div>
        <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
      </div>
    );
  };


  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      {/* Wishlist Button */}
      <button 
        onClick={() => onAddToWishlist && onAddToWishlist(product)}
        className={`absolute top-2 right-2 p-2 rounded-full ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} bg-white bg-opacity-80 backdrop-blur-sm z-10`}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FaHeart className={isInWishlist ? 'fill-current' : 'fill-current'} />
      </button>

      
      {/* Product Image */}
      <Link to={`/product/${id}`} className="block relative pt-[100%] overflow-hidden group">
        <img 
          src={image || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
          </div>
        )}
      </Link>
      
      {/* Product Info */}
      <div className="p-3 flex-1 flex flex-col">
        <Link to={`/product/${id}`} className="block mb-1">
          <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-pink-500 transition-colors">
            {name}
          </h3>
        </Link>
        
        {/* Rating */}
        {rating > 0 && renderRating()}
        
        {/* Price */}
        <div className="mt-2 flex items-center">
          <span className="text-lg font-bold text-pink-500">${price.toFixed(2)}</span>
          {originalPrice > price && (
            <span className="ml-2 text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          )}
          {originalPrice > price && (
            <span className="ml-2 text-xs font-medium bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded">
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          disabled={stock === 0 || isInCart}
          className={`mt-3 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            stock === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : isInCart 
                ? 'bg-green-100 text-green-700' 
                : 'bg-pink-500 text-white hover:bg-pink-600'
          }`}
        >
          {stock === 0 ? 'Out of Stock' : isInCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
