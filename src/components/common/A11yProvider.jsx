import React, { useRef, useEffect, useState } from "react";

// Mock AI alt text generator
async function mockGenerateAltText(src) {
  // In real use, call an AI service
  return "Product image showing item in a stylish setting";
}

// Live region for announcements
export function LiveRegion({ message }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      id="a11y-live-region"
      tabIndex={-1}
    >
      {message}
    </div>
  );
}

// Skip to content link
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="absolute left-2 top-2 z-50 bg-instaPink text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-instaPurple transition"
      style={{ transform: "translateY(-120%)" }}
      onFocus={e => (e.target.style.transform = "translateY(0)")}
      onBlur={e => (e.target.style.transform = "translateY(-120%)")}
    >
      Skip to main content
    </a>
  );
}

// Focus trap for modals - simplified without react-aria
export function FocusTrap({ children, isOpen }) {
  const ref = useRef();
  
  useEffect(() => {
    if (!isOpen) return;
    
    const focusableElements = ref.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements?.length) {
      focusableElements[0].focus();
    }
  }, [isOpen]);

  return (
    <div ref={ref} tabIndex={-1}>
      {children}
    </div>
  );
}

// Alt text hook for product images
export function useProductAlt(src, name) {
  const [alt, setAlt] = useState("");
  useEffect(() => {
    let mounted = true;
    mockGenerateAltText(src).then((desc) => {
      if (mounted) setAlt(`${name}: ${desc}`);
    });
    return () => {
      mounted = false;
    };
  }, [src, name]);
  return alt || `${name} product image`;
}