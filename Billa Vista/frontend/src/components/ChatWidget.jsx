import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'

const quickReplies = ['Book a table', 'View menu', 'Ask about specials']

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! I’m the Bella Vista AI concierge. How can I help today?' },
  ])
  const [draft, setDraft] = useState('')

  const sendMessage = (text) => {
    if (!text.trim()) return
    setMessages((prev) => [
      ...prev,
      { from: 'user', text },
      { from: 'ai', text: 'Got it! Let me help you with that shortly.' },
    ])
    setDraft('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex h-[420px] w-[320px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold">Bella Vista AI</p>
                <p className="flex items-center gap-1 text-xs text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Online now
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    m.from === 'ai'
                      ? 'bg-background text-white'
                      : 'ml-auto bg-primary text-white'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-white"
                >
                  {reply}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(draft)
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about tables, times..."
                className="min-h-[44px] flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, y: 40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg"
        aria-label="Toggle chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  )
}
