import React, { useState } from "react";
import ReactUrlPreview from "react-url-preview";

// Mock analytics event
function trackClick(url) {
  // Replace with real analytics integration
  // eslint-disable-next-line no-console
  console.log("Analytics: Website link clicked:", url);
}

// Simple mobile optimization check (mock: checks for "m." or "mobile" in URL)
function isMobileOptimized(url) {
  return /m\.|mobile/i.test(url);
}

export default function WebsiteIntegration() {
  const [url, setUrl] = useState("");
  const [valid, setValid] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [embedType, setEmbedType] = useState("card"); // "card" or "iframe"
  const [cta, setCta] = useState("Shop Now");
  const [clicked, setClicked] = useState(false);

  // Validate HTTPS URL
  function handleUrlChange(e) {
    const value = e.target.value.trim();
    setUrl(value);
    setShowPreview(false);
    setClicked(false);
    setValid(/^https:\/\/[^\s/$.?#].[^\s]*$/.test(value));
  }

  function handlePreview() {
    setShowPreview(true);
    setClicked(false);
  }

  function handleEmbedType(type) {
    setEmbedType(type);
    setClicked(false);
  }

  function handleCtaChange(e) {
    setCta(e.target.value);
  }

  function handleCtaClick() {
    setClicked(true);
    trackClick(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold text-instaPink mb-4">Connect Your Website</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Website URL</label>
        <input
          type="url"
          className={`form-input w-full rounded border ${
            url && !valid ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="https://yourshop.com"
          value={url}
          onChange={handleUrlChange}
        />
        {url && !valid && (
          <div className="text-red-500 text-sm mt-1">
            Please enter a valid HTTPS URL.
          </div>
        )}
      </div>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded font-semibold ${
            embedType === "card"
              ? "bg-instaPink text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleEmbedType("card")}
        >
          Link Card
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${
            embedType === "iframe"
              ? "bg-instaPink text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleEmbedType("iframe")}
          disabled={!valid}
        >
          Full Iframe
        </button>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">CTA Button Text</label>
        <input
          type="text"
          className="form-input w-full rounded border border-gray-300"
          value={cta}
          onChange={handleCtaChange}
          maxLength={24}
        />
      </div>
      <button
        className={`px-6 py-2 rounded font-semibold ${
          valid ? "bg-instaPink text-white hover:bg-instaPurple" : "bg-gray-300 text-gray-500"
        }`}
        onClick={handlePreview}
        disabled={!valid}
      >
        Preview
      </button>
      {/* Preview Section */}
      {showPreview && valid && (
        <div className="mt-8">
          {/* Mobile warning */}
          {!isMobileOptimized(url) && (
            <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded flex items-center gap-2">
              <span className="font-bold">⚠️ Mobile Warning:</span>
              <span>
                This site may not be optimized for mobile devices.
              </span>
            </div>
          )}
          {embedType === "card" ? (
            <div className="border rounded-lg shadow p-4 flex flex-col items-center bg-gray-50">
              <ReactUrlPreview url={url} />
              <button
                className="mt-4 px-6 py-2 rounded-full bg-instaPink text-white font-semibold hover:bg-instaPurple transition"
                onClick={handleCtaClick}
              >
                {cta}
              </button>
              {clicked && (
                <div className="mt-2 text-xs text-instaPink">Click tracked (mock analytics)</div>
              )}
            </div>
          ) : (
            <div className="w-full">
              <iframe
                src={url}
                title="Website Preview"
                className="w-full rounded-lg border"
                style={{ minHeight: 400, border: "1px solid #eee" }}
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
              <button
                className="mt-4 px-6 py-2 rounded-full bg-instaPink text-white font-semibold hover:bg-instaPurple transition"
                onClick={handleCtaClick}
              >
                {cta}
              </button>
              {clicked && (
                <div className="mt-2 text-xs text-instaPink">Click tracked (mock analytics)</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}