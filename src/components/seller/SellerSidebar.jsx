import React, { useEffect } from 'react';
import { FaBoxOpen, FaClipboardList, FaChartBar, FaTimes, FaStore } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const sellerLinks = [
  { name: "Dashboard", icon: <FaStore />, href: "/seller/dashboard" },
  { name: "Products", icon: <FaBoxOpen />, href: "/seller/products" },
  { name: "Orders", icon: <FaClipboardList />, href: "/seller/orders" },
  { name: "Analytics", icon: <FaChartBar />, href: "/seller/analytics" },
];

export default function SellerSidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768) {
        onClose();
      }
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [onClose]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const sidebar = document.getElementById('seller-sidebar');
      const menuButton = document.querySelector('[aria-label="Open sidebar"]');
      
      if (open && sidebar && !sidebar.contains(e.target) && menuButton !== e.target) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        id="seller-sidebar"
        className={`
          fixed z-30 inset-y-0 left-0 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:inset-0
          w-64 flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg text-pink-500">Seller Dashboard</span>
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="mt-4 flex-1 overflow-y-auto">
          <div className="px-2 space-y-1">
            {sellerLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`
                    group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-pink-50 text-pink-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    transition-colors duration-200
                  `}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.href);
                    if (window.innerWidth < 768) onClose();
                  }}
                >
                  <span className={`
                    ${isActive ? 'text-pink-500' : 'text-gray-400 group-hover:text-gray-500'}
                    flex-shrink-0 h-6 w-6 flex items-center justify-center
                  `}>
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>
        </nav>
        
        {/* User profile section */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-pink-600 font-medium">
                {localStorage.getItem('userName')?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {localStorage.getItem('userName') || 'User'}
              </p>
              <p className="text-xs text-gray-500">Seller Account</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}