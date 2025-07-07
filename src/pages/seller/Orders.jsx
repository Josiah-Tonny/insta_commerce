import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiDownload, FiPrinter, FiEye, FiTruck, FiCheck, FiX, FiClock } from 'react-icons/fi';
import { FaBox, FaMoneyBillWave, FaCreditCard, FaPaypal } from 'react-icons/fa';
import SellerLayout from '../../components/seller/SellerLayout';

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-1001',
    customer: 'John Doe',
    email: 'john@example.com',
    date: '2023-06-29',
    items: 3,
    total: 149.99,
    status: 'Processing',
    paymentMethod: 'credit_card',
    shippingAddress: '123 Main St, Anytown, USA',
    itemsDetails: [
      { id: 1, name: 'Premium T-Shirt', price: 29.99, quantity: 2, image: 'https://via.placeholder.com/60' },
      { id: 2, name: 'Denim Jeans', price: 59.99, quantity: 1, image: 'https://via.placeholder.com/60' },
    ]
  },
  {
    id: 'ORD-1002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    date: '2023-06-28',
    items: 2,
    total: 89.98,
    status: 'Shipped',
    paymentMethod: 'paypal',
    trackingNumber: '1Z999AA1234567890',
    shippingAddress: '456 Oak Ave, Somewhere, USA',
    itemsDetails: [
      { id: 3, name: 'Wireless Earbuds', price: 89.98, quantity: 1, image: 'https://via.placeholder.com/60' },
    ]
  },
  {
    id: 'ORD-1003',
    customer: 'Robert Johnson',
    email: 'robert@example.com',
    date: '2023-06-27',
    items: 5,
    total: 224.95,
    status: 'Delivered',
    paymentMethod: 'credit_card',
    trackingNumber: '1Z999BB1234567890',
    shippingAddress: '789 Pine Rd, Nowhere, USA',
    itemsDetails: [
      { id: 4, name: 'Smart Watch', price: 199.99, quantity: 1, image: 'https://via.placeholder.com/60' },
      { id: 5, name: 'Screen Protector', price: 9.99, quantity: 2, image: 'https://via.placeholder.com/60' },
      { id: 6, name: 'Charging Cable', price: 4.99, quantity: 1, image: 'https://via.placeholder.com/60' },
    ]
  },
];

const statusOptions = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentMethods = ['All', 'Credit Card', 'PayPal'];

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    paymentMethod: 'All',
    dateRange: 'all'
  });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'All' || order.status === filters.status;
    const matchesPaymentMethod = 
      filters.paymentMethod === 'All' || 
      (filters.paymentMethod === 'Credit Card' && order.paymentMethod === 'credit_card') ||
      (filters.paymentMethod === 'PayPal' && order.paymentMethod === 'paypal');
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Toggle order selection
  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Toggle select all orders
  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Bulk update order statuses
  const bulkUpdateStatus = (newStatus) => {
    setOrders(orders.map(order => 
      selectedOrders.includes(order.id) ? { ...order, status: newStatus } : order
    ));
    setSelectedOrders([]);
    setIsBulkActionOpen(false);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <FaCreditCard className="text-gray-500" />;
      case 'paypal':
        return <FaPaypal className="text-blue-600" />;
      default:
        return <FaMoneyBillWave className="text-gray-500" />;
    }
  };

  return (
    <SellerLayout pageTitle="Orders">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage customer orders</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Search orders by ID, customer, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <FiFilter className="h-4 w-4 mr-2" />
                Filters
                {isFilterOpen ? (
                  <FiChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <FiChevronDown className="ml-2 h-4 w-4" />
                )}
              </button>
              
              {isFilterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <label htmlFor="status-filter" className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                      <select
                        id="status-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="px-4 py-2 border-b border-gray-200">
                      <label htmlFor="payment-filter" className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</label>
                      <select
                        id="payment-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                        value={filters.paymentMethod}
                        onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                      >
                        {paymentMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>
                    <div className="px-4 py-2">
                      <label htmlFor="date-filter" className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</label>
                      <select
                        id="date-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                        value={filters.dateRange}
                        onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsBulkActionOpen(!isBulkActionOpen)}
                disabled={selectedOrders.length === 0}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                  selectedOrders.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Bulk Actions
                <FiChevronDown className="ml-2 h-4 w-4" />
              </button>
              
              {isBulkActionOpen && selectedOrders.length > 0 && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => bulkUpdateStatus('Processing')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Mark as Processing
                    </button>
                    <button
                      onClick={() => bulkUpdateStatus('Shipped')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Mark as Shipped
                    </button>
                    <button
                      onClick={() => bulkUpdateStatus('Delivered')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Mark as Delivered
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => bulkUpdateStatus('Cancelled')}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      Cancel Orders
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
              <FiDownload className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filters.status !== 'All' || filters.paymentMethod !== 'All' 
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'No orders have been placed yet.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <li key={order.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <p className="ml-3 text-sm font-medium text-pink-600 truncate">
                        {order.id}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {order.items} {order.items === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{order.customer}</span>
                        <span className="hidden sm:mx-2 sm:inline" aria-hidden="true">
                          &middot;
                        </span>
                        <span className="mt-1 sm:mt-0">{order.email}</span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span className="mr-2">
                        {getPaymentMethodIcon(order.paymentMethod)}
                      </span>
                      <p>
                        <time dateTime={order.date}>{new Date(order.date).toLocaleDateString()}</time>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="ml-2 text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="text-pink-600 hover:text-pink-900 text-sm font-medium"
                      >
                        {expandedOrder === order.id ? 'Hide details' : 'View details'}
                      </button>
                      
                      {order.status === 'Processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Shipped')}
                          className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FiTruck className="h-3 w-3 mr-1" /> Ship
                        </button>
                      )}
                      
                      {order.status === 'Shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FiCheck className="h-3 w-3 mr-1" /> Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Details - Expanded View */}
                  {expandedOrder === order.id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Details</h4>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Order Items */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Items Ordered</h5>
                            <ul className="space-y-3">
                              {order.itemsDetails.map((item) => (
                                <li key={item.id} className="flex">
                                  <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>
                                  <div className="ml-4 flex-1 flex flex-col">
                                    <div>
                                      <h6 className="text-sm font-medium text-gray-900">{item.name}</h6>
                                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="mt-1 text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                              <p className="text-sm font-medium text-gray-900">Total</p>
                              <p className="text-base font-bold text-gray-900">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          {/* Shipping and Status */}
                          <div>
                            <div className="mb-6">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h5>
                              <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                            </div>
                            
                            <div className="mb-6">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h5>
                              <div className="flex items-center">
                                {getPaymentMethodIcon(order.paymentMethod)}
                                <span className="ml-2 text-sm text-gray-700">
                                  {order.paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal'}
                                  {order.paymentMethod === 'credit_card' && ' ending in 4242'}
                                </span>
                              </div>
                            </div>
                            
                            {order.trackingNumber && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-1">Tracking Information</h5>
                                <div className="flex items-center">
                                  <FiTruck className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                    {order.trackingNumber}
                                  </span>
                                  <a 
                                    href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="ml-2 text-sm text-pink-600 hover:text-pink-800"
                                  >
                                    Track
                                  </a>
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Order Status</h5>
                              <div className="flex space-x-2">
                                {['Processing', 'Shipped', 'Delivered'].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => updateOrderStatus(order.id, status)}
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                      order.status === status
                                        ? 'bg-pink-100 text-pink-800 border border-pink-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                                  className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full ml-2"
                                >
                                  Cancel Order
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                            <FiPrinter className="h-4 w-4 mr-2" />
                            Print Invoice
                          </button>
                          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                            <FiTruck className="h-4 w-4 mr-2" />
                            {order.status === 'Processing' ? 'Mark as Shipped' : 'Update Shipping'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SellerLayout>
  );
}