import React, { useState, useRef } from "react";
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  FiDownload, FiFilter, FiRefreshCw, FiDollarSign, FiShoppingBag, 
  FiUsers, FiTrendingUp, FiCalendar, FiChevronDown, FiChevronUp 
} from "react-icons/fi";
import { CSVLink } from 'react-csv';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Mock data
const initialSales = [
  { id: 1, date: "2025-06-19", value: 120, items: 45, customers: 32, category: "Electronics" },
  { id: 2, date: "2025-06-20", value: 200, items: 68, customers: 45, category: "Electronics" },
  { id: 3, date: "2025-06-21", value: 150, items: 52, customers: 38, category: "Fashion" },
  { id: 4, date: "2025-06-22", value: 300, items: 95, customers: 62, category: "Home & Living" },
  { id: 5, date: "2025-06-23", value: 250, items: 78, customers: 55, category: "Electronics" },
  { id: 6, date: "2025-06-24", value: 400, items: 120, customers: 85, category: "Fashion" },
  { id: 7, date: "2025-06-25", value: 350, items: 105, customers: 72, category: "Home & Living" },
];

const topProducts = [
  { id: 1, name: 'Wireless Earbuds', sales: 45, revenue: 899.55, stock: 32 },
  { id: 2, name: 'Smart Watch', sales: 38, revenue: 759.99, stock: 15 },
  { id: 3, name: 'Bluetooth Speaker', sales: 32, revenue: 639.36, stock: 24 },
  { id: 4, name: 'Laptop Backpack', sales: 28, revenue: 419.72, stock: 18 },
  { id: 5, name: 'Phone Case', sales: 25, revenue: 124.75, stock: 42 },
];

const categories = [
  { name: 'Electronics', sales: 45, value: 1659.54 },
  { name: 'Fashion', sales: 53, value: 774.75 },
  { name: 'Home & Living', sales: 47, value: 1059.36 },
  { name: 'Accessories', sales: 32, value: 479.88 },
  { name: 'Others', sales: 18, value: 215.82 },
];

export default function Analytics() {
  const [sales, setSales] = useState(initialSales);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  const [isLoading, setIsLoading] = useState(false);

  // Filter sales data based on date range
  const filteredSales = React.useMemo(() => {
    if (!startDate || !endDate) return sales;
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }, [sales, startDate, endDate]);

  // Calculate summary metrics
  const summary = React.useMemo(() => {
    if (filteredSales.length === 0) return { totalSales: 0, totalItems: 0, avgOrderValue: 0, totalCustomers: 0 };
    
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.value, 0);
    const totalItems = filteredSales.reduce((sum, sale) => sum + sale.items, 0);
    const totalCustomers = filteredSales.reduce((sum, sale) => sum + sale.customers, 0);
    const avgOrderValue = totalSales / filteredSales.length;
    
    return {
      totalSales: totalSales.toFixed(2),
      totalItems,
      avgOrderValue: avgOrderValue.toFixed(2),
      totalCustomers,
    };
  }, [filteredSales]);

  // Prepare chart data
  const salesChartData = {
    labels: filteredSales.map(sale => sale.date),
    datasets: [
      {
        label: 'Sales ($)',
        data: filteredSales.map(sale => sale.value),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryChartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        data: categories.map(cat => cat.value),
        backgroundColor: [
          '#8B5CF6',
          '#EC4899',
          '#3B82F6',
          '#10B981',
          '#F59E0B',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
    },
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // In a real app, you would fetch data based on the selected range
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Prepare data for export
  const exportData = filteredSales.map(sale => ({
    'Date': sale.date,
    'Sales ($)': sale.value,
    'Items Sold': sale.items,
    'Customers': sale.customers,
    'Category': sale.category,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your store's performance and gain insights</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter className="mr-2" />
            Filter
          </button>
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
          <CSVLink data={exportData} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <FiDownload className="mr-2" />
            Export
          </CSVLink>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mb-6">
          <div className="flex space-x-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                className="mt-1 block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                className="mt-1 block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-instaPink">
            ${summary.totalSales}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-instaPurple">
            ${summary.avgOrderValue}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Customers</h3>
          <p className="text-3xl font-bold text-green-600">
            {summary.totalCustomers}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales Chart</h2>
        <Line data={salesChartData} options={chartOptions} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Product Name</th>
                <th className="text-left py-2">Sales</th>
                <th className="text-left py-2">Revenue</th>
                <th className="text-left py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{product.name}</td>
                  <td className="py-2">{product.sales}</td>
                  <td className="py-2 font-semibold text-instaPink">${product.revenue}</td>
                  <td className="py-2">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales by Category</h2>
        <Pie data={categoryChartData} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Sales</th>
                <th className="text-left py-2">Items Sold</th>
                <th className="text-left py-2">Customers</th>
                <th className="text-left py-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{sale.date}</td>
                  <td className="py-2 font-semibold text-instaPink">${sale.value}</td>
                  <td className="py-2">{sale.items}</td>
                  <td className="py-2">{sale.customers}</td>
                  <td className="py-2">{sale.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}