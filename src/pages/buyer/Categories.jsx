import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  // Sample categories data - replace with your actual data
  const categories = [
    { id: 1, name: 'Electronics', slug: 'electronics', image: 'https://via.placeholder.com/300x200?text=Electronics', count: 42 },
    { id: 2, name: 'Fashion', slug: 'fashion', image: 'https://via.placeholder.com/300x200?text=Fashion', count: 68 },
    { id: 3, name: 'Home & Garden', slug: 'home-garden', image: 'https://via.placeholder.com/300x200?text=Home+Garden', count: 35 },
    { id: 4, name: 'Beauty', slug: 'beauty', image: 'https://via.placeholder.com/300x200?text=Beauty', count: 27 },
    { id: 5, name: 'Sports', slug: 'sports', image: 'https://via.placeholder.com/300x200?text=Sports', count: 53 },
    { id: 6, name: 'Books', slug: 'books', image: 'https://via.placeholder.com/300x200?text=Books', count: 89 },
    { id: 7, name: 'Toys & Games', slug: 'toys-games', image: 'https://via.placeholder.com/300x200?text=Toys+%26+Games', count: 31 },
    { id: 8, name: 'Health', slug: 'health', image: 'https://via.placeholder.com/300x200?text=Health', count: 47 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shop by Category</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            to={`/category/${category.slug}`} 
            key={category.id}
            className="group block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-semibold text-lg bg-pink-500 px-4 py-2 rounded-full">
                  Shop Now
                </span>
              </div>
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
