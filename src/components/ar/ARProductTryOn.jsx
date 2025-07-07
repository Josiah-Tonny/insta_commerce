import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { HexColorPicker } from "react-colorful";
import { FaCamera, FaPalette } from "react-icons/fa";
import * as htmlToImage from "html-to-image";

// Lazy load AR and 3D viewer libs
const WebAR = lazy(() => import("react-web-ar"));
const { Canvas } = lazy(() => import("@react-three/fiber"));

// Mock 3D model (replace with real GLTF/GLB for production)
function MockModel({ color = "#E1306C" }) {
  return (
    <mesh>
      <boxGeometry args={[1.2, 0.4, 0.8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Suspense fallback
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-instaPink">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-instaPink mb-4" />
      Loading AR experience...
    </div>
  );
}

// Main AR Try-On Component
export default function ARProductTryOn({
  swatches = ["#E1306C", "#833AB4", "#FFD700", "#222", "#fff"],
  defaultColor = "#E1306C",
  productName = "Virtual Sunglasses",
}) {
  const [color, setColor] = useState(defaultColor);
  const [showPicker, setShowPicker] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const arRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Device adaptation
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memory cleanup for camera streams (React 18+)
  useEffect(() => {
    return () => {
      if (arRef.current && arRef.current.stopCamera) {
        arRef.current.stopCamera();
      }
    };
  }, []);

  // Screenshot capture
  const handleScreenshot = async () => {
    const node = document.getElementById("ar-tryon-view");
    if (!node) return;
    const dataUrl = await htmlToImage.toPng(node);
    setScreenshot(dataUrl);
  };

  // Swatch picker UI
  function SwatchPicker() {
    return (
      <div className="flex gap-2 items-center mt-2">
        {swatches.map((sw) => (
          <button
            key={sw}
            className={`w-8 h-8 rounded-full border-2 ${color === sw ? "border-instaPink" : "border-gray-300"}`}
            style={{ background: sw }}
            onClick={() => setColor(sw)}
            aria-label={`Select color ${sw}`}
          />
        ))}
        <button
          className="ml-2 flex items-center gap-1 px-2 py-1 rounded bg-gray-100 hover:bg-instaPink/10 text-instaPink"
          onClick={() => setShowPicker((v) => !v)}
        >
          <FaPalette /> Custom
        </button>
        {showPicker && (
          <div className="absolute z-50 mt-10">
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-6 mt-8 relative">
      <h2 className="text-xl font-bold text-instaPink mb-4">{productName} AR Try-On</h2>
      <div className="relative">
        <div id="ar-tryon-view" className="rounded-xl overflow-hidden bg-black flex items-center justify-center" style={{ minHeight: 360 }}>
          <Suspense fallback={<Loader />}>
            {isMobile ? (
              // Mobile: AR camera with face mesh (mocked)
              <WebAR
                ref={arRef}
                faceMesh
                style={{ width: "100%", height: 360, objectFit: "cover" }}
                overlays={[
                  {
                    // Mock overlay: colored sunglasses rectangle
                    type: "rectangle",
                    color,
                    width: 180,
                    height: 40,
                    y: 80,
                  },
                ]}
                // 8th Wall API mock: just overlays a colored rectangle on face
                onCameraStart={() => {}}
                onCameraStop={() => {}}
              />
            ) : (
              // Desktop: 3D model viewer
              <div style={{ width: 400, height: 360 }}>
                <Suspense fallback={<Loader />}>
                  <Canvas camera={{ position: [0, 0, 3] }}>
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[2, 2, 2]} />
                    <MockModel color={color} />
                  </Canvas>
                </Suspense>
              </div>
            )}
          </Suspense>
        </div>
        {/* Screenshot preview */}
        {screenshot && (
          <div className="mt-4 flex flex-col items-center">
            <img src={screenshot} alt="AR Screenshot" className="rounded-lg border shadow w-64" />
            <a
              href={screenshot}
              download="ar-tryon.png"
              className="mt-2 px-4 py-2 rounded bg-instaPink text-white font-semibold hover:bg-instaPurple transition"
            >
              Download Screenshot
            </a>
          </div>
        )}
      </div>
      {/* Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
        <SwatchPicker />
        <button
          className="flex items-center gap-2 px-4 py-2 rounded bg-instaPink text-white font-semibold hover:bg-instaPurple transition"
          onClick={handleScreenshot}
        >
         <FaCamera /> Capture Screenshot
        </button>
      </div>
    </div>
  );
}