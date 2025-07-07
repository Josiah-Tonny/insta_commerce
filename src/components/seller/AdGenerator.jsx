import React, { useRef, useState } from "react";
import { FaDownload, FaInstagram, FaPalette, FaImage, FaMagic } from "react-icons/fa";

// Mock templates
const TEMPLATES = [
  {
    id: "summer",
    name: "Summer Sale",
    bg: "linear-gradient(135deg, #FFE259 0%, #FFA751 100%)",
    defaultText: "SUMMER SALE",
  },
  {
    id: "newdrop",
    name: "New Drop",
    bg: "linear-gradient(135deg, #43C6AC 0%, #191654 100%)",
    defaultText: "NEW DROP",
  },
  {
    id: "classic",
    name: "Classic",
    bg: "linear-gradient(135deg, #fff 0%, #f3f3f3 100%)",
    defaultText: "Shop Now",
  },
  {
    id: "vivid",
    name: "Vivid",
    bg: "linear-gradient(135deg, #E1306C 0%, #833AB4 100%)",
    defaultText: "LIMITED OFFER",
  },
  {
    id: "minimal",
    name: "Minimal",
    bg: "linear-gradient(135deg, #fff 0%, #E0EAFC 100%)",
    defaultText: "SALE",
  },
];

// Mock AI background removal (returns transparent PNG)
async function mockRemoveBg(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Just return the original image for mock
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    }, 1200);
  });
}

// Download canvas as PNG
function downloadCanvas(canvasRef) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = "promo-ad.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Mock Instagram post
function mockPostToInstagram(dataUrl) {
  alert("Mock: Ad posted to Instagram!\n" + dataUrl.slice(0, 40) + "...");
}

function getContrastColor(bg) {
  // Simple: use dark text for light backgrounds, white for vivid
  if (bg.includes("#fff") || bg.includes("#FFE259") || bg.includes("#E0EAFC")) return "#222";
  return "#fff";
}

export default function AdGenerator() {
  const [selected, setSelected] = useState(TEMPLATES[0]);
  const [text, setText] = useState(selected.defaultText);
  const [textColor, setTextColor] = useState(getContrastColor(selected.bg));
  const [borderColor, setBorderColor] = useState("#E1306C");
  const [textPos, setTextPos] = useState({ x: 120, y: 220 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [image, setImage] = useState(null);
  const [removingBg, setRemovingBg] = useState(false);
  const [canvasSize, setCanvasSize] = useState(400); // square for Instagram
  const canvasRef = useRef();

  // Responsive: mobile = full screen, desktop = split
  const isMobile = window.innerWidth < 768;

  // Redraw canvas on changes
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // Draw background
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // Gradient
    const grad = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
    // Parse bg from template
    if (selected.bg.startsWith("linear-gradient")) {
      const stops = selected.bg.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
      grad.addColorStop(0, stops[0]);
      grad.addColorStop(1, stops[1]);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = selected.bg;
    }
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw image (centered, max 70% of canvas)
    if (image) {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(
          (canvasSize * 0.7) / img.width,
          (canvasSize * 0.7) / img.height,
          1
        );
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(
          img,
          (canvasSize - w) / 2,
          (canvasSize - h) / 2,
          w,
          h
        );
        drawText();
      };
      img.src = image;
    } else {
      drawText();
    }

    function drawText() {
      // Draw border
      ctx.save();
      ctx.font = "bold 36px 'Montserrat', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 6;
      ctx.strokeStyle = borderColor;
      ctx.strokeText(text, textPos.x, textPos.y);
      ctx.restore();
      // Draw text
      ctx.save();
      ctx.font = "bold 36px 'Montserrat', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = textColor;
      ctx.fillText(text, textPos.x, textPos.y);
      ctx.restore();
    }
    // eslint-disable-next-line
  }, [selected, text, textColor, borderColor, textPos, image, canvasSize]);

  // Drag-and-drop text
  function handleCanvasMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    // Check if click is near text
    const dx = x - rect.left - textPos.x;
    const dy = y - rect.top - textPos.y;
    if (Math.sqrt(dx * dx + dy * dy) < 80) {
      setDragging(true);
      setDragOffset({ x: dx, y: dy });
    }
  }
  function handleCanvasMouseMove(e) {
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    setTextPos({
      x: Math.max(40, Math.min(canvasSize - 40, x - rect.left - dragOffset.x)),
      y: Math.max(40, Math.min(canvasSize - 40, y - rect.top - dragOffset.y)),
    });
  }
  function handleCanvasMouseUp() {
    setDragging(false);
  }

  // Template change
  function handleTemplate(t) {
    setSelected(t);
    setText(t.defaultText);
    setTextColor(getContrastColor(t.bg));
    setBorderColor("#E1306C");
    setTextPos({ x: 120, y: 220 });
    setImage(null);
  }

  // Image upload
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setRemovingBg(true);
    const imgUrl = await mockRemoveBg(file);
    setImage(imgUrl);
    setRemovingBg(false);
  }

  // Export as PNG
  function handleDownload() {
    downloadCanvas(canvasRef);
  }

  // Mock Instagram post
  function handlePost() {
    const dataUrl = canvasRef.current.toDataURL("image/png");
    mockPostToInstagram(dataUrl);
  }

  // Responsive layout
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row items-stretch">
      {/* Desktop: Sidebar */}
      {!isMobile && (
        <div className="w-80 bg-white shadow-lg p-6 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-instaPink mb-2">Ad Templates</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                className={`rounded-lg border-2 p-2 flex flex-col items-center justify-center transition ${
                  selected.id === t.id
                    ? "border-instaPink ring-2 ring-instaPink"
                    : "border-gray-200"
                }`}
                style={{
                  background: t.bg,
                  color: getContrastColor(t.bg),
                  fontWeight: 700,
                  fontSize: 16,
                }}
                onClick={() => handleTemplate(t)}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Ad Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-input w-full rounded border border-gray-300"
              maxLength={32}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <FaPalette />
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                title="Text Color"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border" style={{ background: borderColor }} />
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                title="Border Color"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Product Image</label>
            <div className="flex gap-2 items-center">
              <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-instaPink/10 transition">
                <FaImage />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={removingBg}
                />
              </label>
              {removingBg && (
                <span className="text-xs text-instaPink animate-pulse">Removing BG...</span>
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-instaPink text-white font-semibold hover:bg-instaPurple transition"
              onClick={handleDownload}
            >
              <FaDownload /> Download
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-instaPurple text-white font-semibold hover:bg-instaPink transition"
              onClick={handlePost}
            >
              <FaInstagram /> Post
            </button>
          </div>
        </div>
      )}
      {/* Canvas Area */}
      <div
        className={`flex-1 flex flex-col items-center justify-center ${
          isMobile ? "pt-4 pb-24" : "p-12"
        }`}
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="rounded-xl shadow-lg border-4 border-instaPink"
            style={{
              touchAction: "none",
              background: selected.bg,
              width: isMobile ? "90vw" : 400,
              height: isMobile ? "90vw" : 400,
              maxWidth: 400,
              maxHeight: 400,
              cursor: dragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onTouchStart={handleCanvasMouseDown}
            onTouchMove={handleCanvasMouseMove}
            onTouchEnd={handleCanvasMouseUp}
            aria-label="Ad Canvas"
          />
          {/* Drag hint */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-xs text-gray-400 pointer-events-none">
            Drag text to reposition
          </div>
        </div>
      </div>
      {/* Mobile: Toolbar at bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around items-center py-3 z-50">
          <button
            className={`flex flex-col items-center text-xs ${
              selected.id === TEMPLATES[0].id ? "text-instaPink" : "text-gray-500"
            }`}
            onClick={() => handleTemplate(TEMPLATES[0])}
          >
            <FaMagic className="text-lg mb-1" />
            {TEMPLATES[0].name}
          </button>
          <label className="flex flex-col items-center text-xs text-gray-500 cursor-pointer">
            <FaImage className="text-lg mb-1" />
            Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={removingBg}
            />
          </label>
          <label className="flex flex-col items-center text-xs text-gray-500 cursor-pointer">
            <FaPalette className="text-lg mb-1" />
            Color
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="hidden"
            />
          </label>
          <button
            className="flex flex-col items-center text-xs text-instaPink"
            onClick={handleDownload}
          >
            <FaDownload className="text-lg mb-1" />
            Download
          </button>
          <button
            className="flex flex-col items-center text-xs text-instaPurple"
            onClick={handlePost}
          >
            <FaInstagram className="text-lg mb-1" />
            Post
          </button>
        </div>
      )}
    </div>
  );
}