import React, { useState, useMemo, useId, useEffect } from "react";
import { css } from "@emotion/react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// Mock TensorFlow.js v4+ (AI recommendation)
import * as tf from "@tensorflow/tfjs";

// Mock product data
const PRODUCTS = [
  { id: 1, name: "Sunglasses", price: 29.99, img: "https://source.unsplash.com/400x400/?sunglasses" },
  { id: 2, name: "Hat", price: 19.99, img: "https://source.unsplash.com/400x400/?hat" },
  { id: 3, name: "Watch", price: 89.0, img: "https://source.unsplash.com/400x400/?watch" },
  { id: 4, name: "Bag", price: 49.99, img: "https://source.unsplash.com/400x400/?bag" },
  { id: 5, name: "Shoes", price: 59.99, img: "https://source.unsplash.com/400x400/?shoes" },
];

// Mock AI: returns 2-3 "frequently bought together" combos
async function mockAIRecommend(selectedIds) {
  // Pretend to use TensorFlow.js for recommendations
  await tf.ready();
  // Just recommend next 2 products not in bundle
  const recs = PRODUCTS.filter(p => !selectedIds.includes(p.id)).slice(0, 3);
  return recs;
}

// Draggable Product Card
function ProductCard({ product, onAdd, isInBundle }) {
  const [{ isDragging }, drag] = useDrag({
    type: "PRODUCT",
    item: { id: product.id },
    canDrag: !isInBundle,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      css={css`
        opacity: ${isDragging ? 0.5 : 1};
        border: 2px solid ${isInBundle ? "#E1306C" : "#eee"};
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        padding: 16px;
        margin: 8px 0;
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: ${isInBundle ? "not-allowed" : "grab"};
        transition: border 0.2s;
      `}
    >
      <img
        src={product.img}
        alt={product.name}
        css={css`
          width: 64px;
          height: 64px;
          border-radius: 8px;
          object-fit: cover;
          border: 1.5px solid #eee;
        `}
      />
      <div css={css`flex:1;`}>
        <div css={css`font-weight: bold; color: #E1306C;`}>{product.name}</div>
        <div css={css`color: #555; font-size: 1rem;`}>${product.price.toFixed(2)}</div>
      </div>
      {!isInBundle && (
        <button
          css={css`
            background: #E1306C;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 8px 14px;
            font-weight: 600;
            cursor: pointer;
            &:hover { background: #833AB4; }
          `}
          onClick={() => onAdd(product)}
        >
          Add
        </button>
      )}
    </div>
  );
}

// Droppable Bundle Area
function BundleDrop({ bundle, onRemove, onDrop }) {
  const [{ isOver }, drop] = useDrop({
    accept: "PRODUCT",
    drop: (item) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      css={css`
        min-height: 180px;
        background: ${isOver ? "#FFF0F6" : "#F9FAFB"};
        border: 2px dashed #E1306C;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 24px;
        transition: background 0.2s;
      `}
    >
      <div css={css`font-weight: bold; color: #E1306C; margin-bottom: 10px;`}>
        Your Bundle
      </div>
      {bundle.length === 0 ? (
        <div css={css`color: #bbb;`}>Drag products here to build a bundle!</div>
      ) : (
        bundle.map((product) => (
          <div
            key={product.id}
            css={css`
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 8px;
            `}
          >
            <img
              src={product.img}
              alt={product.name}
              css={css`
                width: 40px;
                height: 40px;
                border-radius: 6px;
                object-fit: cover;
                border: 1px solid #eee;
              `}
            />
            <span css={css`flex:1; color: #333;`}>{product.name}</span>
            <span css={css`color: #E1306C; font-weight: 600;`}>${product.price.toFixed(2)}</span>
            <button
              css={css`
                background: #eee;
                color: #E1306C;
                border: none;
                border-radius: 4px;
                padding: 2px 8px;
                margin-left: 8px;
                cursor: pointer;
                font-size: 1rem;
                &:hover { background: #E1306C; color: #fff; }
              `}
              onClick={() => onRemove(product.id)}
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// Main DynamicBundle Component
export default function DynamicBundle() {
  const [bundle, setBundle] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const bundleId = useId(); // React 18+ useId
  // React 20 Actions (mock: just a function, replace with useAction if available)
  const addToBundle = (product) => {
    if (!bundle.find((p) => p.id === product.id)) {
      setBundle((prev) => [...prev, product]);
    }
  };
  const removeFromBundle = (id) => {
    setBundle((prev) => prev.filter((p) => p.id !== id));
  };
  const handleDrop = (id) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (product) addToBundle(product);
  };

  // AI Recommendations
  useEffect(() => {
    mockAIRecommend(bundle.map((p) => p.id)).then(setRecommend);
  }, [bundle]);

  // Bundle price calculation
  const total = useMemo(
    () => bundle.reduce((sum, p) => sum + p.price, 0),
    [bundle]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        css={css`
          max-width: 900px;
          margin: 40px auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(131,58,180,0.08);
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          @media (min-width: 900px) {
            flex-direction: row;
            gap: 48px;
            padding: 48px 32px;
          }
        `}
      >
        {/* Product List */}
        <div
          css={css`
            flex: 1;
            min-width: 260px;
          `}
        >
          <div css={css`font-size: 1.3rem; font-weight: bold; color: #833AB4; margin-bottom: 12px;`}>
            Products
          </div>
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addToBundle}
              isInBundle={!!bundle.find((p) => p.id === product.id)}
            />
          ))}
        </div>
        {/* Bundle Builder */}
        <div
          css={css`
            flex: 1.2;
            min-width: 320px;
          `}
        >
          <BundleDrop
            bundle={bundle}
            onRemove={removeFromBundle}
            onDrop={handleDrop}
          />
          {/* AI Recommendations */}
          {recommend.length > 0 && (
            <div
              css={css`
                margin-bottom: 18px;
                background: #F3F0FF;
                border-radius: 12px;
                padding: 14px 18px;
              `}
            >
              <div css={css`font-weight: bold; color: #833AB4; margin-bottom: 6px;`}>
                Frequently Bought Together
              </div>
              <div css={css`display: flex; gap: 12px; flex-wrap: wrap;`}>
                {recommend.map((p) => (
                  <div
                    key={p.id}
                    css={css`
                      background: #fff;
                      border: 1.5px solid #eee;
                      border-radius: 8px;
                      padding: 8px 12px;
                      display: flex;
                      align-items: center;
                      gap: 8px;
                      cursor: pointer;
                      transition: border 0.2s;
                      &:hover { border-color: #E1306C; }
                    `}
                    onClick={() => addToBundle(p)}
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      css={css`width: 32px; height: 32px; border-radius: 6px; object-fit: cover;`}
                    />
                    <span css={css`color: #333; font-size: 1rem;`}>{p.name}</span>
                    <span css={css`color: #E1306C; font-weight: 600; font-size: 1rem;`}>
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Bundle Price */}
          <div
            css={css`
              margin-top: 18px;
              font-size: 1.2rem;
              font-weight: bold;
              color: #E1306C;
              display: flex;
              align-items: center;
              gap: 12px;
            `}
          >
            Bundle Total:
            <span css={css`font-size: 1.5rem; color: #833AB4;`}>
              ${total.toFixed(2)}
            </span>
          </div>
          {/* Checkout Button */}
          <button
            css={css`
              margin-top: 18px;
              width: 100%;
              background: linear-gradient(90deg, #E1306C 0%, #833AB4 100%);
              color: #fff;
              font-weight: 700;
              font-size: 1.1rem;
              border: none;
              border-radius: 8px;
              padding: 14px 0;
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(131,58,180,0.08);
              transition: background 0.2s;
              &:hover { background: linear-gradient(90deg, #833AB4 0%, #E1306C 100%); }
            `}
            disabled={bundle.length === 0}
            aria-label="Checkout Bundle"
          >
             Checkout Bundle
          </button>
        </div>
      </div>
    </DndProvider>
  );
}