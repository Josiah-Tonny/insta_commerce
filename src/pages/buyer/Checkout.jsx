import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, DollarSign, Smartphone, Mail, User, MapPin, Phone, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    saveInfo: false,
  });

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'visa', name: 'Visa', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'mastercard', name: 'Mastercard', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'paypal', name: 'PayPal', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'skrill', name: 'Skrill', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'payoneer', name: 'Payoneer', icon: <CreditCard className="w-5 h-5" /> },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Clear cart and redirect to success page
      clearCart();
      navigate('/order/success');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingFee = cartTotal > 0 ? 10 : 0;
  const tax = cartTotal * 0.1;
  const orderTotal = cartTotal + shippingFee + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/cart" className="flex items-center text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      className="pl-10"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    id="address" 
                    name="address" 
                    className="pl-10"
                    value={formData.address}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={formData.country} 
                    onValueChange={(value) => setFormData({...formData, country: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kenya">Kenya</SelectItem>
                      <SelectItem value="uganda">Uganda</SelectItem>
                      <SelectItem value="tanzania">Tanzania</SelectItem>
                      <SelectItem value="rwanda">Rwanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input 
                    id="zipCode" 
                    name="zipCode" 
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="saveInfo" 
                  checked={formData.saveInfo}
                  onCheckedChange={(checked) => setFormData({...formData, saveInfo: checked})}
                />
                <Label htmlFor="saveInfo" className="text-sm font-normal">
                  Save this information for next time
                </Label>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription>All transactions are secure and encrypted.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="grid grid-cols-1 gap-4"
              >
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center space-x-2 cursor-pointer">
                      <span className={`p-1.5 rounded-md ${activeTab === method.id ? 'bg-pink-100 text-pink-600' : 'bg-gray-100'}`}>
                        {method.icon}
                      </span>
                      <span>{method.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {/* Payment Form */}
              <div className="mt-6 space-y-4">
                {activeTab === 'mpesa' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder="e.g. 0712345678" 
                          className="pl-10"
                          required 
                        />
                      </div>
                      <p className="text-sm text-gray-500">You'll receive an M-Pesa payment prompt on your phone</p>
                    </div>
                  </div>
                )}
                
                {(activeTab === 'visa' || activeTab === 'mastercard') && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          className="pl-10"
                          required 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="123" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Cardholder Name</Label>
                      <Input placeholder="John Doe" required />
                    </div>
                  </div>
                )}
                
                {activeTab === 'paypal' && (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-4">You'll be redirected to PayPal to complete your purchase securely</p>
                    <Button variant="outline" className="w-full">
                      Pay with PayPal
                    </Button>
                  </div>
                )}
                
                {(activeTab === 'skrill' || activeTab === 'payoneer') && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" asChild>
              <Link to="/cart">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
              </Link>
            </Button>
            <Button 
              className="bg-pink-500 hover:bg-pink-600"
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Complete Order'}
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Shield className="w-5 h-5 text-blue-500 mr-2" />
              Secure Checkout
            </h3>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and secure. We don't store your credit card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
