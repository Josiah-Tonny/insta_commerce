import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import SellerLayout from './components/seller/SellerLayout';
import Home from './pages/buyer/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ProductDetail from './pages/buyer/ProductDetail';
import Wishlist from './pages/buyer/Wishlist';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products.jsx';
import SellerOrders from './pages/seller/Orders.jsx';
import SellerAnalytics from './pages/seller/Analytics.jsx';
import OrderSuccess from './pages/buyer/OrderSuccess';
import Profile from './pages/buyer/Profile';
import Cart from './pages/buyer/Cart';
import Categories from './pages/buyer/Categories';
import './styles/responsive.css';
import './index.css';

// Simple auth check (replace with your actual auth logic)
const isAuthenticated = () => {
  // Bypass authentication in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Authentication bypassed');
    return true;
  }
  return localStorage.getItem('token') !== null;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  // In development, bypass the authentication check
  if (process.env.NODE_ENV !== 'development' && !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Seller Layout Wrapper
const SellerLayoutWrapper = ({ children, pageTitle }) => (
  <ProtectedRoute>
    <SellerLayout pageTitle={pageTitle}>
      {children}
    </SellerLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <CartProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              
              {/* Protected Buyer Routes */}
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/order-success" element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Seller Routes */}
              <Route path="/seller" element={
                <SellerLayoutWrapper pageTitle="Dashboard">
                  <SellerDashboard />
                </SellerLayoutWrapper>
              } />
              <Route path="/seller/dashboard" element={
                <SellerLayoutWrapper pageTitle="Dashboard">
                  <SellerDashboard />
                </SellerLayoutWrapper>
              } />
              <Route path="/seller/products" element={
                <SellerLayoutWrapper pageTitle="Products">
                  <SellerProducts />
                </SellerLayoutWrapper>
              } />
              <Route path="/seller/orders" element={
                <SellerLayoutWrapper pageTitle="Orders">
                  <SellerOrders />
                </SellerLayoutWrapper>
              } />
              <Route path="/seller/analytics" element={
                <SellerLayoutWrapper pageTitle="Analytics">
                  <SellerAnalytics />
                </SellerLayoutWrapper>
              } />
              
              {/* 404 Page */}
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-6">Page not found</p>
                  <Link 
                    to="/" 
                    className="inline-block px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Go back home
                  </Link>
                </div>
              </div>} />
            </Routes>
            <ToastContainer 
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Layout>
        </CartProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;