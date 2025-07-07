import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Clock, MapPin, Truck, MessageSquare, Home, ShoppingCart } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // In a real app, you would get this from your state management or API
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Order Confirmed!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Order #{orderNumber}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-pink-100 rounded-full p-3">
                  <ShoppingBag className="h-6 w-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Order Placed</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Estimated Delivery</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {estimatedDelivery.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Shipping to</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {location.state?.shippingAddress || '123 Main St, City, Country'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-6 py-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-gray-400" />
                <p className="ml-2 text-sm text-gray-600">
                  Your order is being prepared for shipping. We'll notify you when it's on its way.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="mt-4 sm:mt-0"
                onClick={() => {
                  // In a real app, you would implement tracking
                  alert('Order tracking would be implemented here');
                }}
              >
                Track Order
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Need Help?</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Customer Support</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Have questions about your order? Our customer service team is here to help.
                  </p>
                  <div className="mt-2">
                    <Button variant="link" className="text-pink-600 p-0 h-auto">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Order Updates</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We'll send you shipping and delivery updates via email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <Button 
            className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600"
            onClick={() => navigate('/')}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
