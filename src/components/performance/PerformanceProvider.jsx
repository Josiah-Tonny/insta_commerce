import React, { Suspense } from "react";
import useSWR from "swr";

// --- 1. Code Splitting (dynamic import, next/dynamic style) ---
export function dynamic(importer, { ssr = false, loading = null } = {}) {
  // Simple dynamic import for client-side only
  const Lazy = React.lazy(importer);
  return function DynamicComponent(props) {
    return (
      <Suspense fallback={loading}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}

// --- 2. Island Architecture (mock react-server-components) ---
export function Island({ children }) {
  // In a real RSC setup, this would be a server boundary.
  // Here, just memoize to isolate re-renders.
  return React.useMemo(() => children, [children]);
}

// --- 3. Caching with useSWR (stale-while-revalidate) ---
export function useCachedData(key, fetcher, options = {}) {
  // Example: const { data, error } = useCachedData('/api/products', fetcher)
  return useSWR(key, fetcher, { revalidateOnFocus: false, ...options });
}

// --- 4. Bundle Analysis (setup instructions for @next/bundle-analyzer) ---
/*
To analyze your bundle size, add @next/bundle-analyzer as a dev dependency:

npm install --save-dev @next/bundle-analyzer

Then add this to your package.json scripts:
"analyze": "ANALYZE=true vite build"

Or, if using Next.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })
module.exports = withBundleAnalyzer({ ...yourNextConfig })

For Vite/CRA, use vite-plugin-bundle-analyzer or source-map-explorer for similar results.
*/
