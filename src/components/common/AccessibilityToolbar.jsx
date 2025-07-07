
import React, { useState } from 'react';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDyslexicFont = () => {
    document.body.classList.toggle('dyslexic-font');
  };

  const increaseFontSize = () => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${currentSize + 2}px`;
  };

  const decreaseFontSize = () => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${Math.max(currentSize - 2, 12)}px`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label="Accessibility Options"
      >
        ♿
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-white border rounded-lg shadow-lg p-4 min-w-48">
          <h3 className="font-semibold mb-3">Accessibility</h3>
          <div className="space-y-2">
            <button
              onClick={toggleDyslexicFont}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            >
              Toggle Dyslexic Font
            </button>
            <button
              onClick={increaseFontSize}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            >
              Increase Font Size
            </button>
            <button
              onClick={decreaseFontSize}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            >
              Decrease Font Size
            </button>
          </div>
        </div>
      )}
    </div>
  );
}