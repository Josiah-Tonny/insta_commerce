import React, { useState, useRef, useEffect } from "react";
import { 
  FaHome, 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaBars, 
  FaTimes, 
  FaSearch,
  FaStore,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaShoppingBag,
  FaSpinner
} from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { SkipToContent, LiveRegion } from "./common/A11yProvider";
import logo from "../assets/logo.png"; 
import AccessibilityToolbar from "./common/AccessibilityToolbar";
import "../styles/responsive.css";

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white py-8 mt-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center">
            <img src={logo} alt="Insta-Commerce" className="h-8 w-auto" />
            <span className="font-bold text-xl text-white">Insta-Commerce</span>
          </div>
          <p className="text-gray-400 text-sm">Transforming social commerce with seamless shopping experiences.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Facebook"><FaFacebook size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Twitter"><FaTwitter size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition" aria-label="LinkedIn"><FaLinkedin size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition" aria-label="YouTube"><FaYoutube size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
            <li><Link to="/products" className="text-gray-400 hover:text-white transition">Shop</Link></li>
            <li><Link to="/categories" className="text-gray-400 hover:text-white transition">Categories</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
            <li><Link to="/shipping" className="text-gray-400 hover:text-white transition">Shipping Policy</Link></li>
            <li><Link to="/returns" className="text-gray-400 hover:text-white transition">Return Policy</Link></li>
            <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
              aria-label="Email address for newsletter subscription"
            />
            <button 
              type="submit" 
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-r-md transition-colors"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Insta-Commerce. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Loading overlay component
const LoadingOverlay = ({ isActive, targetView }) => {
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <FaSpinner className="animate-spin text-pink-500 text-4xl mx-auto mb-4" />
        <p className="text-gray-700 font-medium">Loading {targetView}...</p>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [targetView, setTargetView] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const isSellerRoute = location.pathname.startsWith('/seller');

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      setTargetView(`results for "${searchQuery}"`);
      
      // Simulate loading
      setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsLoading(false);
        setSearchQuery("");
      }, 1000);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Skip to main content handler
  const handleSkipToContent = (e) => {
    e.preventDefault();
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      setTimeout(() => mainContent.removeAttribute('tabindex'), 1000);
    }
  };

  // If it's a seller route, don't render the main layout
  if (isSellerRoute) {
    return children;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SkipToContent onClick={handleSkipToContent} />
      <AccessibilityToolbar />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Insta-Commerce" className="h-8 w-auto" />
                <span className="ml-2 text-xl font-bold text-pink-500">Insta-Commerce</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                Shop
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                Categories
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                Contact
              </Link>
              <Link to="/seller/dashboard" className="flex items-center text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                <FaStore className="mr-1" /> Seller Dashboard
              </Link>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    ref={searchInputRef}
                    aria-label="Search products"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500"
                    aria-label="Search"
                  >
                    <FaSearch />
                  </button>
                </form>
              </div>

              {/* Cart */}
              <Link to="/cart" className="text-gray-700 hover:text-pink-500 relative" aria-label="Shopping Cart">
                <FaShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="text-gray-700 hover:text-pink-500 relative" aria-label="Wishlist">
                <FaHeart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* User Account */}
              <Link to="/account" className="text-gray-700 hover:text-pink-500" aria-label="My Account">
                <FaUser className="h-6 w-6" />
              </Link>

              {/* Mobile menu button */}
              <button 
                onClick={toggleMenu}
                className="md:hidden text-gray-700 hover:text-pink-500 focus:outline-none"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden py-3 px-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                Home
              </Link>
              <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                Shop
              </Link>
              <Link to="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                Categories
              </Link>
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                About
              </Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                Contact
              </Link>
              <Link to="/seller/dashboard" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                <FaStore className="mr-2" /> Seller Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Loading Overlay */}
      <LoadingOverlay isActive={isLoading} targetView={targetView} />
      
      {/* Live Region for Accessibility */}
      <LiveRegion />
      
      {/* Toast Container */}
      <div id="toast-root" className="fixed bottom-0 right-0 z-50 p-4"></div>
    </div>
  );
};

export default Layout;
