import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";

// Instagram OAuth endpoint (replace with your real client_id and redirect_uri)
const INSTAGRAM_OAUTH_URL =
  "https://api.instagram.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user_profile,user_media&response_type=code";

export default function InstagramAuth({ text = "Login with Instagram" }) {
  const [loading, setLoading] = useState(false);

  // Mock handler for OAuth redirect
  const handleInstagramLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate redirect delay
    setTimeout(() => {
      window.location.href = INSTAGRAM_OAUTH_URL;
    }, 600);
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleInstagramLogin}
        disabled={loading}
        className={`
          w-full max-w-xs
          flex items-center justify-center gap-2
          py-3 px-6
          rounded-md font-semibold text-white
          bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#FD1D1D]
          shadow-md hover:shadow-lg
          transition
          focus:outline-none
          ${loading ? "opacity-70 cursor-not-allowed" : ""}
        `}
        style={{
          // Mobile: full width, Desktop: max width 20rem
          width: "100%",
        }}
        aria-label={text}
        >
        {loading ? (
          <FiLoader className="animate-spin text-xl" />
        ) : (
          // Instagram logo SVG
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 448 512">
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 186.6c-39.6 0-71.7-32.1-71.7-71.7s32.1-71.7 71.7-71.7 71.7 32.1 71.7 71.7-32.1 71.7-71.7 71.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.3-9.9-66.7-36.2-92.9S388.6 1.7 353.3 0C317.7-1.7 130.3-1.7 94.7 0 59.4 1.7 28 9.9 1.7 36.2S1.7 123.4 0 158.7c-1.7 35.6-1.7 223 0 258.6 1.7 35.3 9.9 66.7 36.2 92.9s57.6 34.5 92.9 36.2c35.6 1.7 223 1.7 258.6 0 35.3-1.7 66.7-9.9 92.9-36.2s34.5-57.6 36.2-92.9c1.7-35.6 1.7-223 0-258.6zM398.8 388c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.2 9-132.3 9s-102.9 2.6-132.3-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.2-9-132.3s-2.6-102.9 9-132.3c7.8-19.6 22.9-34.7 42.5-42.5C121.1 9 190.9 11.6 224 11.6s102.9-2.6 132.3 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.2 9 132.3s2.7 102.9-9 132.3z"/>
          </svg>
        )}
        <span className="ml-2">{text}</span>
      </button>
    </div>
  );
}