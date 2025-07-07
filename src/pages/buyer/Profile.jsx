import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, User, ShoppingBag, Heart, Settings, LogOut, CreditCard, MapPin, Bell, Lock, HelpCircle } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data - in a real app, this would come from your auth context or API
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    address: '123 Main St, Apt 4B, New York, NY 10001',
    joinedDate: 'January 15, 2022',
  });

  // Mock orders data
  const orders = [
    {
      id: 'ORD-12345',
      date: '2023-05-15',
      status: 'Delivered',
      total: 149.99,
      items: 3,
    },
    {
      id: 'ORD-12344',
      date: '2023-04-28',
      status: 'Delivered',
      total: 89.99,
      items: 2,
    },
    {
      id: 'ORD-12343',
      date: '2023-04-10',
      status: 'Cancelled',
      total: 199.99,
      items: 1,
    },
  ];

  // Mock wishlist items
  const wishlist = [
    {
      id: 'item-1',
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'item-2',
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    },
  ];

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-24"></div>
              <div className="px-6 pb-6 -mt-12 relative">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24 border-4 border-white">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                </div>
                
                <nav className="mt-6 space-y-1">
                  <Button 
                    variant={activeTab === 'profile' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Button>
                  <Button 
                    variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('orders')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    My Orders
                  </Button>
                  <Button 
                    variant={activeTab === 'wishlist' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('wishlist')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button 
                    variant={activeTab === 'addresses' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('addresses')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Addresses
                  </Button>
                  <Button 
                    variant={activeTab === 'payments' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('payments')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                  <Button 
                    variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>
                    Manage your profile information and account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 text-center sm:text-left">
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">Member since {user.joinedDate}</p>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" /> Change Photo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={user.name} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={user.email} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={user.phone} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={user.address} readOnly />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and manage your recent orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0 text-right">
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">{order.items} {order.items === 1 ? 'item' : 'items'}</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                      <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
                      <div className="mt-6">
                        <Button onClick={() => navigate('/')}>
                          Continue Shopping
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'wishlist' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                  <CardDescription>
                    Your saved items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="h-48 bg-gray-100 overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-pink-600 font-semibold mt-1">${item.price.toFixed(2)}</p>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm" className="flex-1">
                                Add to Cart
                              </Button>
                              <Button variant="outline" size="sm" className="px-3">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
                      <p className="mt-1 text-sm text-gray-500">Save items you love for later.</p>
                      <div className="mt-6">
                        <Button onClick={() => navigate('/')}>
                          Start Shopping
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'addresses' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Addresses</CardTitle>
                  <CardDescription>
                    Manage your shipping addresses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-dashed border-2 border-gray-300 hover:border-pink-400 transition-colors flex items-center justify-center min-h-48 cursor-pointer">
                      <div className="text-center p-6">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-sm font-medium text-gray-900">Add New Address</h3>
                      </div>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">John Doe</h3>
                            <p className="mt-1 text-sm text-gray-600">
                              123 Main St, Apt 4B<br />
                              New York, NY 10001<br />
                              United States
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                              Phone: +1 (555) 123-4567
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-pink-600">
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                            Default Shipping Address
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'payments' && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your saved payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <CreditCard className="h-8 w-8 text-gray-400 mr-4" />
                            <div>
                              <h3 className="font-medium">Visa ending in 4242</h3>
                              <p className="text-sm text-gray-600">Expires 12/25</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-pink-600">
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                            Default Payment Method
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Button variant="outline" className="w-full mt-6">
                      <Plus className="h-4 w-4 mr-2" /> Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center">
                      <Bell className="h-4 w-4 mr-2 text-gray-400" />
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive updates about your orders and account</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">SMS Notifications</p>
                          <p className="text-sm text-gray-500">Get order updates via text message</p>
                        </div>
                        <Switch id="sms-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Marketing Emails</p>
                          <p className="text-sm text-gray-500">Receive our newsletter and promotional emails</p>
                        </div>
                        <Switch id="marketing-emails" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-gray-400" />
                      Security
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="current-password">Change Password</Label>
                        <div className="mt-1 grid grid-cols-1 gap-3">
                          <Input id="current-password" type="password" placeholder="Current Password" />
                          <Input type="password" placeholder="New Password" />
                          <Input type="password" placeholder="Confirm New Password" />
                        </div>
                        <Button className="mt-3">Update Password</Button>
                      </div>
                      <div className="pt-4">
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout of all devices
                        </Button>
                        <p className="mt-2 text-sm text-gray-500">
                          This will log you out of all devices except this one.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-gray-400" />
                      Help & Support
                    </h3>
                    <div className="mt-4 space-y-3">
                      <Button variant="ghost" className="w-full justify-start">
                        Help Center
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Contact Support
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Terms of Service
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Privacy Policy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-red-200 bg-red-50 p-4 rounded-lg mt-8">
                    <h3 className="text-sm font-medium text-red-800">Danger Zone</h3>
                    <p className="mt-1 text-sm text-red-700">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" className="mt-3">
                      Delete My Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
