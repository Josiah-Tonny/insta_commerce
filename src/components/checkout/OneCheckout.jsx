import React, { useState, useEffect, useRef, useTransition } from "react";
import { validate as validateEmail } from "react-email-validator";
import { useGeolocated } from "react-geolocated";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Mock: Replace with your publishable key
const stripePromise = loadStripe("pk_test_12345");

// Mock saved cards
const MOCK_SAVED_CARDS = [
  { id: "card_1", brand: "Visa", last4: "4242", exp: "12/26" },
  { id: "card_2", brand: "Mastercard", last4: "4444", exp: "11/25" },
];

// Prefetch payment methods (simulate API call)
let paymentMethodsCache = null;
async function prefetchPaymentMethods(email) {
  if (!paymentMethodsCache) {
    await new Promise((r) => setTimeout(r, 400));
    paymentMethodsCache = MOCK_SAVED_CARDS;
  }
  return paymentMethodsCache;
}

// --- Main Checkout Form ---
function CheckoutForm({ cartItems }) {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(null);
  const [address, setAddress] = useState("");
  const [card, setCard] = useState("new");
  const [savedCards, setSavedCards] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [actionState, submitAction] = React.useActionState(async (formData) => {
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1200));
    return { ok: true, message: "Payment successful!" };
  }, { ok: false, message: "" });

  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();

  // Geolocation autofill
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
  });

  // Autofill address from geolocation
  useEffect(() => {
    if (coords) {
      // Mock reverse geocode
      setAddress(
        `Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`
      );
    }
  }, [coords]);

  // Validate email and prefetch payment methods
  useEffect(() => {
    if (email && validateEmail(email)) {
      setEmailValid(true);
      startTransition(() => {
        prefetchPaymentMethods(email).then(setSavedCards);
      });
    } else if (email) {
      setEmailValid(false);
    } else {
      setEmailValid(null);
    }
  }, [email]);

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    let paymentResult = { ok: false, message: "" };
    if (card === "new") {
      // Stripe payment (mock)
      const cardElement = elements.getElement(CardElement);
      // In real app: await stripe.confirmCardPayment(...)
      paymentResult = await submitAction(new FormData(e.target));
    } else {
      // Use saved card (mock)
      paymentResult = await submitAction(new FormData(e.target));
    }
    setSubmitting(false);
    if (paymentResult.ok) {
      alert(paymentResult.message);
    }
  }

  // Mock Instagram OAuth
  function handleInstagramPay() {
    alert("Redirecting to Instagram OAuth (mock)...");
  }

  return (
    <form
      className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto flex flex-col gap-6"
      onSubmit={handleSubmit}
      aria-busy={submitting}
    >
      <h2 className="text-2xl font-bold text-instaPink mb-2">Checkout</h2>
      {/* Email */}
      <div>
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          className={`form-input w-full rounded border ${
            emailValid === false
              ? "border-red-400"
              : emailValid === true
              ? "border-green-400"
              : "border-gray-300"
          }`}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailValid === false && (
          <div className="text-red-500 text-sm mt-1">Invalid email address</div>
        )}
      </div>
      {/* Shipping Address (autofill) */}
      <div>
        <label className="block font-semibold mb-1">Shipping Address</label>
        <input
          type="text"
          name="address"
          className="form-input w-full rounded border border-gray-300"
          placeholder="Enter your shipping address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          autoComplete="shipping street-address"
        />
        <button
          type="button"
          className="mt-2 px-3 py-1 rounded bg-instaPink text-white font-semibold hover:bg-instaPurple transition"
          onClick={() => {
            if (!isGeolocationAvailable) {
              alert("Geolocation not available");
            } else if (!isGeolocationEnabled) {
              alert("Geolocation not enabled");
            } else {
              // Will autofill via useEffect
            }
          }}
        >
          Autofill from Location
        </button>
      </div>
      {/* Payment */}
      <div>
        <label className="block font-semibold mb-1">Payment Method</label>
        {savedCards.length > 0 && (
          <select
            className="form-select w-full rounded border border-gray-300 mb-2"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            name="savedCard"
          >
            <option value="new">New Card</option>
            {savedCards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand} •••• {c.last4} (exp {c.exp})
              </option>
            ))}
          </select>
        )}
        {card === "new" ? (
          <div className="border rounded p-3">
            <CardElement options={{ style: { base: { fontSize: "18px" } } }} />
          </div>
        ) : (
          <div className="text-green-700 font-semibold mb-2">
            Using saved card: {savedCards.find((c) => c.id === card)?.brand} ••••{" "}
            {savedCards.find((c) => c.id === card)?.last4}
          </div>
        )}
      </div>
      {/* Pay with Instagram */}
      <button
        type="button"
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#FD1D1D] text-white font-bold flex items-center justify-center gap-2 mb-2"
        onClick={handleInstagramPay}
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#E1306C" />
          <rect x="8" y="8" width="16" height="16" rx="5" fill="#fff" />
          <circle cx="16" cy="16" r="5" fill="#E1306C" />
        </svg>
        Pay with Instagram
      </button>
      {/* Submit */}
      <button
        type="submit"
        className={`w-full py-3 rounded-lg font-semibold ${
          submitting
            ? "bg-gray-300 text-gray-500"
            : "bg-instaPink text-white hover:bg-instaPurple"
        }`}
        disabled={submitting || !emailValid}
      >
        {submitting ? "Processing..." : "Pay Now"}
      </button>
      {actionState.message && (
        <div
          className={`mt-2 text-center font-semibold ${
            actionState.ok ? "text-green-600" : "text-red-500"
          }`}
        >
          {actionState.message}
        </div>
      )}
    </form>
  );
}

// --- Main OneCheckout Wrapper ---
export default function OneCheckout({ cartItems = [] }) {
  // Prefetch payment methods on cart interaction
  useEffect(() => {
    if (cartItems.length > 0) {
      prefetchPaymentMethods();
    }
  }, [cartItems.length]);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm cartItems={cartItems} />
    </Elements>
  );
}