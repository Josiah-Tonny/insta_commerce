import React, { useRef, useEffect } from "react";
import { FocusTrap } from "../common/A11yProvider";

/**
 * Props:
 * - open: boolean (controls sidebar visibility)
 * - onClose: function (called when overlay or close button is clicked)
 * - cartItems: array of { id, name, img, price, quantity }
 * - onQtyChange: function (id, newQty)
 * - onCheckout: function
 */
export default function CartSidebar({
  open,
  onClose,
  cartItems = [],
  onQtyChange = () => {},
  onCheckout = () => {},
  announce = () => {},
}) {
  const sidebarRef = useRef();

  // Trap focus when open
  useEffect(() => {
    if (open && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [open]);

  // Announce cart updates
  useEffect(() => {
    if (open) {
      announce(`Cart updated. ${cartItems.length} items in cart.`);
    }
    // eslint-disable-next-line
  }, [cartItems.length, open]);

  if (!open) return null;

  // Calculate total price
  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity,
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <FocusTrap isOpen={open}>
        <aside
          ref={sidebarRef}
          className={`
            fixed top-0 right-0 z-50 h-full bg-white shadow-xl
            transition-transform duration-300
            w-full max-w-full
            md:w-96 md:max-w-lg
            flex flex-col
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
          style={{ maxWidth: "100vw" }}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          aria-label="Shopping cart"
        >
          {/* Close button (visible on mobile) */}
          <button
            className="absolute top-4 right-4 md:hidden text-2xl"
            onClick={onClose}
            aria-label="Close cart"
          >
            &times;
          </button>
          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-40">
            <h2 className="text-xl font-bold mb-4 text-instaPink">Your Cart</h2>
            {cartItems.length === 0 ? (
              <div className="text-gray-500 text-center mt-16">Your cart is empty.</div>
            ) : (
              <ul className="space-y-6">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-4 items-center">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{item.name}</div>
                      <div className="text-instaPink font-bold">{item.price}</div>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          className="w-7 h-7 rounded-full bg-gray-200 text-lg font-bold flex items-center justify-center hover:bg-instaPink hover:text-white transition"
                          onClick={() => onQtyChange(item.id, Math.max(1, item.quantity - 1))}
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          type="button"
                        >
                          –
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          className="w-7 h-7 rounded-full bg-gray-200 text-lg font-bold flex items-center justify-center hover:bg-instaPink hover:text-white transition"
                          onClick={() => onQtyChange(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Sticky Checkout Section */}
          <div className="absolute bottom-0 left-0 w-full bg-white border-t shadow-lg p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-instaPink text-xl">${total.toFixed(2)}</span>
            </div>
            <button
              className="w-full py-3 bg-instaPink text-white font-semibold rounded-lg hover:bg-instaPurple transition"
              onClick={onCheckout}
              disabled={cartItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </aside>
      </FocusTrap>
    </>
  );
}
