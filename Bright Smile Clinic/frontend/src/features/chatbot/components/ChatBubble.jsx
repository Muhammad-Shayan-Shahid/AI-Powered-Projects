import { motion } from "framer-motion";

export default function ChatBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser ? "bg-signal text-white" : "bg-cloud text-charcoal"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}
