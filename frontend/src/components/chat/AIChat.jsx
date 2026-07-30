import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  Minimize2,
} from "lucide-react";
import { sendMessage } from "../../services/chatService";

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm AutoBot AI — your personal vehicle assistant.\n\nAsk me about models, prices, stock, features, or anything related to our inventory.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const question = input.trim();
    setInput("");

    try {
      setLoading(true);
      const response = await sendMessage(question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Show available SUVs",
    "What's the cheapest car?",
    "Cars under ₹10 lakh",
    "Latest models",
  ];

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    // Optional: auto-send
    // setTimeout(() => handleSend(), 50);
  };

  return (
    <>
      {/* ── Floating Action Button ── */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label={open ? "Close chat" : "Open AutoBot AI"}
      >
        {/* Glow ring */}
        <span className="absolute inset-0 rounded-full bg-red-600/40 blur-xl group-hover:bg-red-500/50 transition-all duration-500" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-2xl shadow-red-600/40 ring-1 ring-white/10">
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} strokeWidth={2.25} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle size={22} strokeWidth={2} />
                {/* Online pulse */}
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-red-600 animate-pulse" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[min(100vw-2rem,24rem)] h-[min(70vh,620px)] flex flex-col overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl shadow-2xl shadow-black/60"
          >
            {/* Soft ambient glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-red-600/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl" />

            {/* ── Header ── */}
            <div className="relative flex items-center justify-between gap-3 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-950/90 px-4 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-600/30 ring-1 ring-white/10">
                    <Bot className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[15px] font-bold tracking-tight text-white truncate">
                      AutoBot AI
                    </h3>
                    <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium">
                    Online · Vehicle assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-xl p-2 text-zinc-500 hover:text-white hover:bg-zinc-800/80 transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex gap-2.5 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700/60 text-red-400">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap shadow-sm ${
                      msg.role === "user"
                        ? "rounded-2xl rounded-br-md bg-gradient-to-br from-red-600 to-red-700 text-white"
                        : "rounded-2xl rounded-bl-md bg-zinc-900/80 border border-zinc-800/80 text-zinc-200"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === "user" && (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 justify-start"
                >
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700/60 text-red-400">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-zinc-900/80 border border-zinc-800/80 px-4 py-3 flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:300ms]" />
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">Thinking…</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick prompts (only on first message) ── */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[11px] font-medium text-zinc-400 hover:text-white hover:border-red-500/40 hover:bg-red-600/10 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input bar ── */}
            <div className="relative border-t border-zinc-800/80 bg-zinc-950/80 p-3.5">
              <div className="flex items-end gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 focus-within:border-red-500/40 focus-within:ring-1 focus-within:ring-red-500/20 transition-all px-3.5 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about cars, prices, stock…"
                  className="flex-1 bg-transparent py-2 text-[13.5px] text-white placeholder:text-zinc-600 outline-none min-w-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={loading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-colors"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" strokeWidth={2.25} />
                  )}
                </motion.button>
              </div>
              <p className="mt-2 text-center text-[10px] text-zinc-600">
                AutoBot · Powered by AI · Demo responses
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;