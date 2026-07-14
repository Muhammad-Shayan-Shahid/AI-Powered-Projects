import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

export default function ChatWidget() {
  const { messages, isOpen, isLoading, toggle, sendMessage } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 flex h-[480px] w-[92vw] max-w-[360px] flex-col overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center gap-2 bg-ink px-5 py-4">
              <Sparkles size={16} className="text-signal" />
              <div>
                <p className="italic-accent text-lg leading-tight text-white">
                  Ask Bright Smile
                </p>
                <p className="text-xs text-slate-300">
                  Usually replies in a few seconds
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg, i) => (
                <ChatBubble key={i} role={msg.role} text={msg.text} />
              ))}
              {isLoading && <ChatBubble role="bot" text="Typing…" />}
            </div>

            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={toggle}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-signal text-white shadow-lg shadow-signal/30"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
