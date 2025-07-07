import React, { useState, useRef, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import imageCompression from "browser-image-compression";
import { FaPaperPlane, FaImage, FaTimes, FaCheckDouble, FaChevronLeft } from "react-icons/fa";

// Mock endpoints
const MOCK_WS_URL = "wss://mock-chat-server.example/ws";
const MOCK_POLL_URL = "/api/chat/poll";
const MOCK_SEND_URL = "/api/chat/send";
const MOCK_READ_URL = "/api/chat/read";

// Util: debounce
function useDebounce(fn, delay) {
  const timeout = useRef();
  return useCallback(
    (...args) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}

// Util: fallback to long polling
function useLongPolling(enabled, onMessage) {
  useEffect(() => {
    let polling = true;
    async function poll() {
      while (polling && enabled) {
        try {
          const res = await fetch(MOCK_POLL_URL);
          const data = await res.json();
          if (data && data.messages) onMessage({ data: JSON.stringify(data) });
        } catch {}
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    if (enabled) poll();
    return () => {
      polling = false;
    };
  }, [enabled, onMessage]);
}

// Responsive helpers
const isMobile = () => window.innerWidth < 768;

// Main ChatWidget
export default function ChatWidget({
  user = { id: "u1", name: "You", avatar: null },
  peer = { id: "u2", name: "Seller", avatar: null },
  open,
  onClose,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [img, setImg] = useState(null);
  const [typing, setTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const [wsFailed, setWsFailed] = useState(false);
  const [readIds, setReadIds] = useState([]);
  const inputRef = useRef();
  const bottomRef = useRef();

  // WebSocket setup
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket(MOCK_WS_URL, {
    onOpen: () => setWsFailed(false),
    onClose: () => setWsFailed(true),
    onError: () => setWsFailed(true),
    shouldReconnect: () => true,
    share: true,
    filter: () => true,
    retryOnError: true,
  }, wsFailed ? false : true);

  // Long polling fallback
  useLongPolling(wsFailed, (event) => {
    const data = JSON.parse(event.data);
    if (data.messages) setMessages(data.messages);
    if (data.typing) setPeerTyping(true);
    if (data.read) setReadIds((ids) => [...ids, ...data.read]);
  });

  // Handle incoming messages
  useEffect(() => {
    if (!lastJsonMessage) return;
    if (lastJsonMessage.type === "message") {
      setMessages((msgs) => [...msgs, lastJsonMessage.message]);
    }
    if (lastJsonMessage.type === "typing") {
      setPeerTyping(true);
      setTimeout(() => setPeerTyping(false), 1500);
    }
    if (lastJsonMessage.type === "read") {
      setReadIds((ids) => [...ids, lastJsonMessage.id]);
    }
  }, [lastJsonMessage]);

  // Typing indicator (debounced)
  const sendTyping = useDebounce(() => {
    if (readyState === ReadyState.OPEN && !wsFailed) {
      sendJsonMessage({ type: "typing", from: user.id, to: peer.id });
    }
  }, 400);

  // Send message
  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() && !img) return;
    let imageUrl = null;
    if (img) {
      // Compress image
      const compressed = await imageCompression(img, { maxWidthOrHeight: 600, maxSizeMB: 0.3 });
      imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(compressed);
      });
    }
    const msg = {
      id: Date.now() + Math.random(),
      from: user.id,
      to: peer.id,
      text: input,
      image: imageUrl,
      date: new Date().toISOString(),
      read: false,
    };
    setMessages((msgs) => [...msgs, msg]);
    setInput("");
    setImg(null);
    setTyping(false);

    // Send via WS or fallback
    if (readyState === ReadyState.OPEN && !wsFailed) {
      sendJsonMessage({ type: "message", message: msg });
    } else {
      await fetch(MOCK_SEND_URL, { method: "POST", body: JSON.stringify(msg) });
    }
    // Mock read receipt
    setTimeout(() => {
      setReadIds((ids) => [...ids, msg.id]);
      fetch(MOCK_READ_URL, { method: "POST", body: JSON.stringify({ id: msg.id }) });
    }, 1200);
  }

  // Scroll to bottom on new message
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Handle input typing
  function handleInput(e) {
    setInput(e.target.value);
    setTyping(true);
    sendTyping();
  }

  // Image select
  async function handleImg(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImg(file);
  }

  // Modal/panel close (mobile: swipe down)
  function handleSwipe(e) {
    if (e.changedTouches && e.changedTouches[0].clientY - e.touches[0].clientY > 80) {
      onClose();
    }
  }

  // Avatar helper
  function Avatar({ user }) {
    return user.avatar ? (
      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border" />
    ) : (
      <div className="w-9 h-9 rounded-full bg-instaPink/20 flex items-center justify-center font-bold text-instaPink uppercase">
        {user.name?.[0] || "?"}
      </div>
    );
  }

  // Chat bubble
  function Bubble({ msg }) {
    const isMe = msg.from === user.id;
    return (
      <div className={`flex items-end gap-2 ${isMe ? "justify-end" : ""}`}>
        {!isMe && <Avatar user={peer} />}
        <div className={`max-w-xs px-4 py-2 rounded-2xl shadow ${isMe ? "bg-instaPink text-white" : "bg-gray-100 text-gray-800"} relative`}>
          {msg.image && (
            <img src={msg.image} alt="attachment" className="w-40 h-40 object-cover rounded-lg mb-2" />
          )}
          <div>{msg.text}</div>
          <div className="text-xs text-right mt-1 opacity-60 flex items-center gap-1">
            {new Date(msg.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {isMe && readIds.includes(msg.id) && <FaCheckDouble className="inline ml-1 text-green-400" title="Read" />}
          </div>
        </div>
        {isMe && <Avatar user={user} />}
      </div>
    );
  }

  // Layout
  if (!open) return null;
  return isMobile() ? (
    // Mobile: Full-screen modal
    <div
      className="fixed inset-0 z-50 bg-white flex flex-col"
      onTouchEnd={handleSwipe}
      style={{ overscrollBehavior: "contain" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button onClick={onClose} className="text-2xl text-instaPink">
          <FaChevronLeft />
        </button>
        <Avatar user={peer} />
        <span className="font-bold text-lg">{peer.name}</span>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Typing indicator */}
      {peerTyping && (
        <div className="px-6 pb-2 text-sm text-instaPink animate-pulse">Typing…</div>
      )}
      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-3 border-t bg-white"
        autoComplete="off"
      >
        <label className="cursor-pointer text-instaPink">
          <FaImage className="text-xl" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImg}
          />
        </label>
        {img && (
          <div className="relative">
            <img
              src={URL.createObjectURL(img)}
              alt="preview"
              className="w-12 h-12 object-cover rounded"
            />
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => setImg(null)}
              aria-label="Remove"
            >
              <FaTimes />
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Type a message…"
          className="flex-1 px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-instaPink"
        />
        <button
          type="submit"
          className="bg-instaPink text-white px-4 py-2 rounded-full font-semibold hover:bg-instaPurple transition"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  ) : (
    // Desktop: Slide-out panel
    <div className="fixed top-0 right-0 w-96 h-full z-50 bg-white shadow-xl flex flex-col border-l">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <span className="font-bold text-lg">{peer.name}</span>
        <Avatar user={peer} />
        <button onClick={onClose} className="ml-auto text-2xl text-instaPink">
          <FaTimes />
        </button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Typing indicator */}
      {peerTyping && (
        <div className="px-6 pb-2 text-sm text-instaPink animate-pulse">Typing…</div>
      )}
      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-3 border-t bg-white"
        autoComplete="off"
      >
        <label className="cursor-pointer text-instaPink">
          <FaImage className="text-xl" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImg}
          />
        </label>
        {img && (
          <div className="relative">
            <img
              src={URL.createObjectURL(img)}
              alt="preview"
              className="w-12 h-12 object-cover rounded"
            />
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => setImg(null)}
              aria-label="Remove"
            >
              <FaTimes />
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Type a message…"
          className="flex-1 px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-instaPink"
        />
         <button
          type="submit"
          className="bg-instaPink text-white px-4 py-2 rounded-full font-semibold hover:bg-instaPurple transition"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}