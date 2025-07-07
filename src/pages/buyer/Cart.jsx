import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard, DollarSign, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
    cartItemCount
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, parseInt(newQuantity, 10));
    }
  };

  const shippingFee = cartTotal > 0 ? 10 : 0; // Example shipping fee
  const tax = cartTotal * 0.1; // 10% tax
  const orderTotal = cartTotal + shippingFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-pink-50 p-6 rounded-full mb-6">
          <ShoppingBag className="w-12 h-12 text-pink-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link to="/" className="bg-pink-500 hover:bg-pink-600">
            Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})</h1>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-pink-500 hover:bg-pink-50"
            >
              Clear Cart
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="border-b border-gray-100 last:border-0">
                <div className="flex p-4">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <Link to={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-pink-500">
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-pink-500 font-semibold mt-1">${item.price.toFixed(2)}</p>
                    
                    <div className="mt-3 flex items-center">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                          className="w-12 text-center border-x border-gray-200 py-1 text-sm focus:outline-none"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="ml-auto font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-pink-500 hover:bg-pink-600 h-12 text-base">
              Proceed to Checkout
            </Button>
            
            <div className="mt-6 space-y-4 text-sm text-gray-500">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Secure Checkout. Your information is safe with us.</span>
              </div>
              <div className="flex items-start">
                <Truck className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-start">
                <RefreshCw className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Easy returns within 30 days</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">We Accept</h3>
            <div className="flex flex-wrap gap-3">
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-200">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <span className="text-xs block mt-1 text-center">Visa</span>
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-200">
                <CreditCard className="w-8 h-8 text-yellow-500" />
                <span className="text-xs block mt-1 text-center">Mastercard</span>
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-200">
                <DollarSign className="w-8 h-8 text-blue-400" />
                <span className="text-xs block mt-1 text-center">M-Pesa</span>
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-200">
                <CreditCard className="w-8 h-8 text-blue-700" />
                <span className="text-xs block mt-1 text-center">PayPal</span>
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-200">
                <CreditCard className="w-8 h-8 text-orange-500" />
                <span className="text-xs block mt-1 text-center">Skrill</span>
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-200">
                <CreditCard className="w-8 h-8 text-blue-800" />
                <span className="text-xs block mt-1 text-center">Payoneer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
