import React, { useRef, useState, useEffect, Suspense, useTransition } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { Blurhash } from "react-blurhash";
import ImageZoom from "react-image-zoom";
import { useKeyboard } from "react-aria";
import { use } from "react"; // React 19 Suspense data fetching

// Example async fetcher (replace with real API)
async function fetchProductImages(productId) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500));
  // Example data: [{ url, blurhash }]
  return [
    {
      url: "https://source.unsplash.com/600x600/?product,1",
      blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
    },
    {
      url: "https://source.unsplash.com/600x600/?product,2",
      blurhash: "LKO2?U%2Tw=w]~RBVZRi};RPxuwH",
    },
    {
      url: "https://source.unsplash.com/600x600/?product,3",
      blurhash: "L9ASR#M{00ay~qRjM{ay00ayM{ay",
    },
  ];
}

// Suspense resource
function productImagesResource(productId) {
  let promise = fetchProductImages(productId);
  let status = "pending";
  let result;
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
}

// Main Carousel Component
export default function ProductCarousel({ productId }) {
  // Suspense data fetch
  const images = use(productImagesResource(productId));

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Responsive
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Autoplay (desktop only)
  useEffect(() => {
    if (isMobile || isPaused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(timer);
  }, [isMobile, isPaused, images.length]);

  // Keyboard navigation (desktop)
  useKeyboard({
    onKeyDown: (e) => {
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    },
  });

  // Swipe handlers (mobile)
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIndex((i) => (i + 1) % images.length),
    onSwipedRight: () => setIndex((i) => (i - 1 + images.length) % images.length),
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 10,
  });

  // Pinch-to-zoom (mobile)
  const zoomProps = {
    width: 360,
    height: 360,
    zoomWidth: 400,
    img: images[index].url,
    zoomPosition: "original",
    scale: 1.6,
  };

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      tabIndex={0}
      aria-label="Product Image Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ outline: "none" }}
      {...(!isMobile ? {} : swipeHandlers)}
    >
      <AnimatePresence initial={false} custom={index}>
        <motion.div
          key={index}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden"
          style={{ position: "relative" }}
        >
          {/* BlurHash Placeholder */}
          <Suspense fallback={<div className="w-full h-full bg-gray-200" />}>
            <Blurhash
              hash={images[index].blurhash}
              width={360}
              height={360}
              resolutionX={32}
              resolutionY={32}
              punch={1}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 1,
              }}
            />
          </Suspense>
          {/* Image or Zoom */}
          {isMobile ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ zIndex: 2, position: "relative" }}
              onDoubleClick={() => setIsZoomed((z) => !z)}
            >
              {isZoomed ? (
                <ImageZoom {...zoomProps} />
              ) : (
                <img
                  src={images[index].url}
                  alt={`product-${index}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                  style={{ touchAction: "pan-y" }}
                />
              )}
              <span className="absolute bottom-2 right-2 text-xs bg-white/80 rounded px-2 py-1 text-instaPink">
                {isZoomed ? "Pinch or drag to zoom" : "Double tap to zoom"}
              </span>
            </div>
          ) : (
            <img
              src={images[index].url}
              alt={`product-${index}`}
              className="w-full h-full object-cover"
              draggable={false}
              style={{ zIndex: 2, position: "relative" }}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
        <button
          className="pointer-events-auto bg-white/70 rounded-full p-2 shadow m-2 text-xl"
          style={{ left: 0 }}
          onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          className="pointer-events-auto bg-white/70 rounded-full p-2 shadow m-2 text-xl"
          style={{ right: 0 }}
          onClick={() => setIndex((i) => (i + 1) % images.length)}
          aria-label="Next"
        >
          ›
        </button>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-instaPink" : "bg-gray-300"}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}