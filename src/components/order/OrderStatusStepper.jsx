import React from "react";

const steps = [
  { label: "Pending" },
  { label: "Shipped" },
  { label: "Delivered" },
];

export default function OrderStatusStepper({ status = "Pending" }) {
  const currentStep = steps.findIndex((s) => s.label === status);

  return (
    <div className="flex items-center justify-between w-full max-w-xl mx-auto py-6 px-2">
      {steps.map((step, idx) => (
        <div key={step.label} className="flex-1 flex flex-col items-center">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              font-bold
              ${idx <= currentStep ? "bg-instaPink text-white" : "bg-gray-200 text-gray-400"}
              transition
            `}
          >
            {idx + 1}
          </div>
          <span
            className={`
              mt-2 text-xs sm:text-sm font-semibold
              ${idx <= currentStep ? "text-instaPink" : "text-gray-400"}
            `}
          >
            {step.label}
          </span>
          {idx < steps.length - 1 && (
            <div className={`h-1 w-full max-w-[60px] mx-auto my-2 rounded ${idx < currentStep ? "bg-instaPink" : "bg-gray-200"}`}></div>
          )}
        </div>
      ))}
    </div>
  );
}