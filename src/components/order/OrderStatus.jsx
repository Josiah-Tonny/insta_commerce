import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Server, SocketIO } from "mock-socket";

// Step icons and labels
const steps = [
  { label: "Packed", icon: FaBoxOpen },
  { label: "Shipped", icon: FaTruck },
  { label: "Delivered", icon: FaCheckCircle },
];

// Color for each step
const stepColors = [
  "bg-gray-300 text-gray-400",      // Pending
  "bg-instaPurple text-white",       // In Progress
  "bg-instaPink text-white",         // Completed
];

// Mock WebSocket server for real-time updates
let mockServer;
if (!window.__ORDER_WS__) {
  mockServer = new Server("ws://localhost:8081");
  let currentStep = 0;
  setInterval(() => {
    if (currentStep < 2) {
      currentStep += 1;
      mockServer.emit("message", JSON.stringify({ step: currentStep }));
    }
  }, 8000);
  window.__ORDER_WS__ = true;
}

function getStepColor(idx, current) {
  if (idx < current) return stepColors[2];
  if (idx === current) return stepColors[1];
  return stepColors[0];
}

function getStepStatus(idx, current) {
  if (idx < current) return "completed";
  if (idx === current) return "active";
  return "pending";
}

function getStepDetail(idx) {
  switch (idx) {
    case 0:
      return "Your order has been packed and is ready to ship.";
    case 1:
      return "Your order is on the way! Track your shipment for updates.";
    case 2:
      return "Your order has been delivered. Thank you for shopping!";
    default:
      return "";
  }
}

function getDeliveryCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return "Arriving soon!";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${mins}m left`;
}

export default function OrderStatus({ orderId = "ORD123", initialStep = 0, etaMinutes = 60 }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [expanded, setExpanded] = useState(null);
  const [eta, setEta] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() + etaMinutes * 60000);
  });

  // WebSocket for real-time updates
  useEffect(() => {
    const ws = new window.WebSocket("ws://localhost:8081");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (typeof data.step === "number") setCurrentStep(data.step);
    };
    return () => ws.close();
  }, []);

  // ETA countdown
  const [countdown, setCountdown] = useState(getDeliveryCountdown(eta));
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getDeliveryCountdown(eta));
    }, 1000 * 30);
    return () => clearInterval(timer);
  }, [eta]);

  // Responsive: horizontal scroll on mobile
  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-2">
      <div
        className={`
          flex ${window.innerWidth < 640 ? "overflow-x-auto scrollbar-hide" : ""}
          items-center justify-between gap-0 relative
        `}
        style={{ minWidth: window.innerWidth < 640 ? 480 : "auto" }}
      >
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const color = getStepColor(idx, currentStep);
          const status = getStepStatus(idx, currentStep);
          return (
            <div key={step.label} className="flex-1 flex flex-col items-center min-w-[120px] relative">
              {/* Step Icon */}
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white shadow transition ${color} ${status === "active" ? "ring-2 ring-instaPink" : ""}`}
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                aria-label={`Show details for ${step.label}`}
              >
                <Icon />
              </button>
              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={`
                    absolute top-1/2 left-full w-16 h-1
                    ${idx < currentStep ? "bg-instaPink" : "bg-gray-200"}
                    ${window.innerWidth < 640 ? "hidden" : ""}
                  `}
                  style={{ zIndex: 0, marginLeft: -8 }}
                />
              )}
              {/* Step Label */}
              <span
                className={`mt-2 text-xs sm:text-sm font-semibold ${status === "completed" ? "text-instaPink" : status === "active" ? "text-instaPurple" : "text-gray-400"}`}
              >
                {step.label}
              </span>
              {/* Expand/collapse chevron */}
              <button
                className="mt-1 text-gray-400 hover:text-instaPink"
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                aria-label={expanded === idx ? "Hide details" : "Show details"}
              >
                {expanded === idx ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {/* Step Details */}
              {expanded === idx && (
                <div className="mt-2 bg-white rounded shadow p-3 text-sm w-56 max-w-xs z-10 border border-instaPink/20">
                  <div className="font-semibold mb-1">{step.label} Details</div>
                  <div>{getStepDetail(idx)}</div>
                  {idx === 1 && (
                    <div className="mt-2 text-instaPink font-semibold">
                      Estimated Delivery: <span>{countdown}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile: horizontal connecting lines */}
      {window.innerWidth < 640 && (
        <div className="flex items-center justify-between mt-2 px-4">
          {steps.map((_, idx) =>
            idx < steps.length - 1 ? (
              <div
                key={idx}
                className={`flex-1 h-1 mx-1 rounded ${idx < currentStep ? "bg-instaPink" : "bg-gray-200"}`}
              />
            ) : null
          )}
        </div>
      )}
      {/* Order Info */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        Order <span className="font-bold text-instaPink">{orderId}</span> •{" "}
        {currentStep < 2 ? (
          <>
            Status:{" "}
            <span className={currentStep === 1 ? "text-instaPurple" : "text-instaPink"}>
              {steps[currentStep].label}
            </span>
            {currentStep === 1 && (
              <>
                {" "}
                • <span className="font-semibold">{countdown}</span>
              </>
            )}
          </>
        ) : (
          <span className="text-instaPink font-semibold">Delivered</span>
        )}
      </div>
    </div>
  );
}