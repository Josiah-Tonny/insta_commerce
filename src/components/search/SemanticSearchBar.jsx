import React, { useRef, useState, useEffect, useCallback, useTransition, useOptimistic } from "react";
import { useSyncExternalStore } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import { FixedSizeList as List } from "react-window";
import * as tf from "@tensorflow/tfjs";
import { FaMicrophone, FaSearch, FaTimes } from "react-icons/fa";

// --- Mock Data & Embeddings ---
const PRODUCTS = [
  { id: 1, name: "Sunglasses", img: "https://source.unsplash.com/400x400/?sunglasses", price: "$29.99" },
  { id: 2, name: "Hat", img: "https://source.unsplash.com/400x400/?hat", price: "$19.99" },
  { id: 3, name: "Watch", img: "https://source.unsplash.com/400x400/?watch", price: "$89.00" },
  { id: 4, name: "Bag", img: "https://source.unsplash.com/400x400/?bag", price: "$49.99" },
  { id: 5, name: "Shoes", img: "https://source.unsplash.com/400x400/?shoes", price: "$59.99" },
  // ...add more for virtualization
];

// Mock embedding: simple char code sum for demo
async function getEmbedding(text) {
  await tf.ready();
  return text
    .toLowerCase()
    .split("")
    .reduce((sum, c) => sum + c.charCodeAt(0), 0);
}

// Semantic similarity: lower diff = more similar
async function semanticSearch(query, products) {
  const qEmbed = await getEmbedding(query);
  const scored = await Promise.all(
    products.map(async (p) => {
      const pEmbed = await getEmbedding(p.name);
      return { ...p, score: Math.abs(qEmbed - pEmbed) };
    })
  );
  return scored.sort((a, b) => a.score - b.score).slice(0, 20);
}

// --- Recent Searches Store (localStorage + useSyncExternalStore) ---
function getRecent() {
  try {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
  } catch {
    return [];
  }
}
function setRecent(arr) {
  localStorage.setItem("recentSearches", JSON.stringify(arr));
}
function subscribeRecent(cb) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
function useRecentSearches() {
  return useSyncExternalStore(subscribeRecent, getRecent, getRecent);
}

// --- Debounce Hook ---
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// --- Voice Search (Mock) ---
function useVoiceSearch(onResult) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef();
  const start = () => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      onResult("sunglasses"); // Mock result
    }, 1200);
  };
  const stop = () => setListening(false);
  return { listening, start, stop };
}

// --- Main Component ---
export default function SemanticSearchBar() {
  const inputRef = useRef();
  const [query, setQuery] = useState("");
  const [optimisticQuery, setOptimisticQuery] = useOptimistic(query);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [isPending, startTransition] = useTransition();
  const recent = useRecentSearches();
  const debouncedQuery = useDebouncedValue(query, 300);

  // Floating UI
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",
  });

  // Semantic search
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    let cancelled = false;
    startTransition(() => {
      semanticSearch(debouncedQuery, PRODUCTS).then((res) => {
        if (!cancelled) setResults(res);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Save to recent
  const saveRecent = useCallback(
    (q) => {
      if (!q.trim()) return;
      const arr = [q, ...recent.filter((r) => r !== q)].slice(0, 8);
      setRecent(arr);
      window.dispatchEvent(new Event("storage"));
    },
    [recent]
  );

  // Voice search
  const { listening, start: startVoice } = useVoiceSearch((voiceText) => {
    setQuery(voiceText);
    setOpen(true);
    inputRef.current?.focus();
  });

  // Keyboard navigation
  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      setHighlight((h) => Math.min(h + 1, results.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlight((h) => Math.max(h - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter" && results[highlight]) {
      handleSelect(results[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Select result
  function handleSelect(item) {
    setOptimisticQuery(item.name);
    setQuery(item.name);
    setOpen(false);
    saveRecent(item.name);
    // ...navigate or show product
  }

  // Render result row (virtualized)
  const Row = ({ index, style }) => {
    const item = results[index];
    return (
      <div
        style={style}
        className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${
          highlight === index ? "bg-instaPink/10" : ""
        }`}
        onMouseEnter={() => setHighlight(index)}
        onMouseDown={() => handleSelect(item)}
        role="option"
        aria-selected={highlight === index}
        tabIndex={-1}
      >
        <img src={item.img} alt={item.name} className="w-10 h-10 rounded object-cover border" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{item.name}</div>
          <div className="text-instaPink font-bold text-sm">{item.price}</div>
        </div>
      </div>
    );
  };

  // Show recent if no query
  const showRecent = !debouncedQuery && recent.length > 0;

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2">
        <FaSearch className="text-instaPink text-lg" />
        <input
          ref={(el) => {
            inputRef.current = el;
            refs.setReference(el);
          }}
          type="text"
          className="flex-1 bg-transparent outline-none text-lg"
          placeholder="Search products…"
          value={optimisticQuery}
          onChange={(e) => {
            setOptimisticQuery(e.target.value);
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
          aria-controls="search-results-list"
          aria-activedescendant={open && results[highlight] ? `result-${highlight}` : undefined}
          role="combobox"
          aria-expanded={open}
        />
        <button
          type="button"
          className={`text-instaPink text-lg ${listening ? "animate-pulse" : ""}`}
          aria-label="Voice search"
          onClick={startVoice}
        >
          <FaMicrophone />
        </button>
        {query && (
          <button
            type="button"
            className="text-gray-400 text-lg"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOptimisticQuery("");
              setOpen(false);
            }}
          >
            <FaTimes />
          </button>
        )}
      </div>
      {/* Floating Results Panel */}
      {open && (results.length > 0 || showRecent) && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50 absolute left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          role="listbox"
          id="search-results-list"
        >
          {showRecent ? (
            <div>
              <div className="px-4 py-2 text-xs text-gray-500">Recent searches</div>
              {recent.map((r, i) => (
                <div
                  key={r}
                  className="px-4 py-2 cursor-pointer hover:bg-instaPink/10"
                  onMouseDown={() => {
                    setQuery(r);
                    setOptimisticQuery(r);
                    setOpen(false);
                  }}
                  tabIndex={0}
                  role="option"
                  aria-selected={false}
                >
                  {r}
                </div>
              ))}
            </div>
          ) : (
            <List
              height={Math.min(320, results.length * 56)}
              itemCount={results.length}
              itemSize={56}
              width="100%"
              style={{ outline: "none" }}
            >
              {Row}
            </List>
          )}
        </div>
      )}
    </div>
  );
}