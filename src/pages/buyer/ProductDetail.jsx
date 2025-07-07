import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, 
  FaShoppingCart, FaShare, FaChevronLeft, FaChevronRight, 
  FaSpinner, FaCheck, FaTimes, FaPlus, FaMinus 
} from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TODO: Move to a separate constants file
const API_BASE_URL = 'http://localhost:5000/api';

// TODO: Move to a separate mock data file or remove when backend is ready
const mockProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    brand: 'AudioPro',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    rating: 4.5,
    reviewCount: 128,
    description: 'Experience crystal clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.',
    highlights: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Bluetooth 5.0',
      'Built-in microphone',
      'Foldable design'
    ],
    colors: ['#000000', '#1E40AF', '#991B1B', '#065F46'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    ],
    inStock: true,
    isInWishlist: false,
    isInCart: false,
    sku: 'PRD-001',
    category: 'Electronics',
    tags: ['wireless', 'audio', 'headphones', 'bluetooth'],
    shipping: 'Free shipping on all orders over $50',
    returnPolicy: '30-day return policy',
    warranty: '1-year manufacturer warranty'
  },
  // Add more mock products as needed
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Replace with actual API call
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        
        // TODO: Uncomment when backend is ready
        // const response = await fetch(`${API_BASE_URL}/products/${id}`);
        // if (!response.ok) throw new Error('Product not found');
        // const data = await response.json();
        // setProduct(data);
        
        // Mock implementation
        setTimeout(() => {
          const foundProduct = mockProducts.find(p => p.id === parseInt(id)) || mockProducts[0];
          setProduct(foundProduct);
          setSelectedColor(foundProduct.colors?.[0]);
          setSelectedSize(foundProduct.sizes?.[0]);
          setIsLoading(false);
        }, 500);
        
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load product details');
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // TODO: Implement actual API call
  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.warning('Please select color and size');
      return;
    }

    try {
      setIsAddingToCart(true);
      
      // TODO: Uncomment when backend is ready
      // const response = await fetch(`${API_BASE_URL}/cart`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     productId: product.id,
      //     color: selectedColor,
      //     size: selectedSize,
      //     quantity
      //   })
      // });
      
      // if (!response.ok) throw new Error('Failed to add to cart');
      
      // Mock success
      setTimeout(() => {
        toast.success('Added to cart successfully!');
        setIsAddingToCart(false);
      }, 500);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart');
      setIsAddingToCart(false);
    }
  };

  // TODO: Implement actual API call
  const handleAddToWishlist = async () => {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await fetch(`${API_BASE_URL}/wishlist`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ productId: product.id })
      // });
      
      // if (!response.ok) throw new Error('Failed to update wishlist');
      
      // Mock success
      setProduct(prev => ({
        ...prev,
        isInWishlist: !prev.isInWishlist
      }));
      
      toast.success(
        product.isInWishlist 
          ? 'Removed from wishlist' 
          : 'Added to wishlist!'
      );
      
    } catch (err) {
      console.error('Error updating wishlist:', err);
      toast.error('Failed to update wishlist');
    }
  };

  // TODO: Implement actual API call for submitting reviews
  const handleSubmitReview = async (reviewData) => {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await fetch(`${API_BASE_URL}/products/${id}/reviews`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(reviewData)
      // });
      
      // if (!response.ok) throw new Error('Failed to submit review');
      
      // Mock success
      toast.success('Review submitted successfully!');
      
      // TODO: Refresh reviews
      // const updatedProduct = await fetchProduct();
      // setProduct(updatedProduct);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <FaTimes className="text-red-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link 
          to="/" 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Navigation */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <IoIosArrowBack className="mr-2" />
          Back to Products
        </button>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="relative">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => setCurrentImageIndex(prev => 
                prev === 0 ? (product.images.length - 1) : prev - 1
              )}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={() => setCurrentImageIndex(prev => 
                prev === product.images.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
            
            {/* Wishlist Button */}
            <button 
              onClick={handleAddToWishlist}
              className="absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
              aria-label={product.isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {product.isInWishlist ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-700" />
              )}
            </button>
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto py-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                  currentImageIndex === index ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.floor(product.rating) ? (
                    <FaStar />
                  ) : star - 0.5 <= product.rating ? (
                    <FaStarHalfAlt />
                  ) : (
                    <FaRegStar />
                  )}
                </span>
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>
          
          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="ml-2 text-lg text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                {product.discount}% OFF
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-blue-500' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      selectedSize === size
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <FaMinus size={12} />
              </button>
              <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300 bg-white text-gray-900">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.inStock}
              className={`flex-1 flex items-center justify-center py-3 px-6 rounded-md font-medium ${
                product.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              {isAddingToCart ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <FaShoppingCart className="mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </button>
            
            <button
              disabled={!product.inStock}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Buy Now
            </button>
          </div>
          
          {/* Product Meta */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">SKU</h4>
                <p className="mt-1 text-sm text-gray-900">{product.sku}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <p className="mt-1 text-sm text-gray-900">{product.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Shipping</h4>
                <p className="mt-1 text-sm text-gray-900">{product.shipping}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Returns</h4>
                <p className="mt-1 text-sm text-gray-900">{product.returnPolicy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium">
              Description
            </button>
            <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium">
              Specifications
            </button>
            <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium">
              Reviews ({product.reviewCount})
            </button>
          </nav>
        </div>
        
        <div className="py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              {product.description}
            </p>
            
            <h4 className="text-md font-medium text-gray-900 mt-6 mb-2">Highlights</h4>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {product.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
            
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-900 mb-2">Warranty</h4>
              <p className="text-gray-600">{product.warranty}</p>
            </div>
          </div>
          
          {/* TODO: Add review form and list component */}
          <div className="mt-12">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Customer Reviews</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600">
                Be the first to review "{product.name}"
              </p>
              <button
                onClick={() => {
                  // TODO: Open review modal/form
                  toast.info('Review functionality coming soon!');
                }}
                className="mt-4 inline-block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {mockProducts.filter(p => p.id !== product.id).length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.filter(p => p.id !== product.id).map((relatedProduct) => (
              <div key={relatedProduct.id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                  <img
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm text-gray-700">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {relatedProduct.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{relatedProduct.brand}</p>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  ${relatedProduct.price.toFixed(2)}
                  {relatedProduct.originalPrice > relatedProduct.price && (
                    <span className="ml-1 text-xs text-gray-500 line-through">
                      ${relatedProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
