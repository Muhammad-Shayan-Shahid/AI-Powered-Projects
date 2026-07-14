import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-slate-200 px-3 py-3"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your question…"
        disabled={disabled}
        maxLength={500}
        className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-signal disabled:bg-slate-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal text-white transition hover:bg-signalDark disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
