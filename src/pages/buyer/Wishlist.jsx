import React, { useState } from "react";

// Example empty state illustration SVG
const EmptyIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    <rect width="120" height="120" rx="24" fill="#F3F4F6"/>
    <path d="M40 60c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z" fill="#E1306C" fillOpacity=".15"/>
    <path d="M60 45a15 15 0 100 30 15 15 0 000-30zm0 26a11 11 0 110-22 11 11 0 010 22z" fill="#E1306C"/>
    <circle cx="60" cy="60" r="6" fill="#833AB4"/>
  </svg>
);

const mockWishlist = [
  {
    id: 1,
    name: "Trendy Sunglasses",
    price: "$29.99",
    img: "https://source.unsplash.com/400x400/?sunglasses",
  },
  {
    id: 2,
    name: "Classic Watch",
    price: "$89.00",
    img: "https://source.unsplash.com/400x400/?watch",
  },
];

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(mockWishlist);
  const [cart, setCart] = useState([]);

  const moveToCart = (id) => {
    const product = wishlist.find((p) => p.id === id);
    setWishlist((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => [...prev, product]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-instaPink via-instaPurple to-instaPink bg-clip-text text-transparent mb-6">
          Your Wishlist
        </h1>
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <EmptyIllustration />
            <div className="mt-6 text-lg text-gray-500 font-semibold">Your wishlist is empty.</div>
            <div className="mt-2 text-sm text-gray-400">Browse products and save your favorites!</div>
          </div>
        ) : (
          <ul className="space-y-6">
            {wishlist.map((item) => (
              <li key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm">
                <img src={item.img} alt={item.name} className="w-20 h-20 rounded-lg object-cover border" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 truncate">{item.name}</div>
                  <div className="text-instaPink font-bold">{item.price}</div>
                </div>
                <button
                  className="bg-instaPink text-white px-4 py-2 rounded-full font-semibold hover:bg-instaPurple transition"
                  onClick={() => moveToCart(item.id)}
                >
                  Move to Cart
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}