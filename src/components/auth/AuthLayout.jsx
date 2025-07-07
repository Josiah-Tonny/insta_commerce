import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle, footerText, footerLink, footerLinkText }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Left side - Branding/Image */}
      <div className="w-full md:w-1/2 lg:w-2/3 bg-gradient-to-br from-pink-500 to-purple-600 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616486338815-3eac5d3c550a?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center justify-center md:justify-start mb-8">
            <Instagram className="h-10 w-10 text-white" />
            <span className="ml-3 text-2xl font-bold text-white">InstaCommerce</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Connect, Shop, Succeed
          </h1>
          <p className="text-xl text-pink-100 max-w-lg">
            The easiest way to sell your products and reach millions of customers on Instagram.
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📱', title: 'Easy Setup', desc: 'Get started in minutes' },
              { icon: '🛍️', title: 'Sell More', desc: 'Reach more customers' },
              { icon: '📊', title: 'Track Sales', desc: 'Real-time analytics' }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-pink-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-6 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}
            </p>
          </div>
          
          {children}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            {footerText}{' '}
            <Link to={footerLink} className="font-medium text-pink-600 hover:text-pink-500">
              {footerLinkText}
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              &copy; {new Date().getFullYear()} InstaCommerce. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
