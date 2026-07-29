import { useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, Home, Trees, DoorClosed, Send, Sparkles, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useBooking } from '@/features/booking/hooks/useBooking'
import { cn } from '@/lib/utils'

const seatingIcons = {
  Indoor: Home,
  Outdoor: Trees,
  Private: DoorClosed,
}

const quickTags = ['Window Seat', 'Private Booth', 'Outdoor']

export default function BookingPage() {
  const {
    selectedDate,
    selectedTime,
    guests,
    seating,
    availableTimes,
    seatingOptions,
    setDate,
    setTime,
    incrementGuests,
    decrementGuests,
    setSeating,
  } = useBooking()

  const [messages, setMessages] = useState([
    { from: 'user', text: 'Hi! Can I get a table for two this Saturday evening?' },
    {
      from: 'ai',
      text: 'Absolutely! For Saturday evening I have a few tables open for 2 guests. Which time works best for you?',
      quickTimes: ['6:00 PM', '7:30 PM', '9:00 PM'],
    },
  ])
  const [draft, setDraft] = useState('')

  const sendMessage = (text) => {
    if (!text.trim()) return
    setMessages((prev) => [
      ...prev,
      { from: 'user', text },
      { from: 'ai', text: 'Great choice! I have noted that preference for your reservation.' },
    ])
    setDraft('')
  }

  const handleConfirm = () => {
    toast.success(`Table reserved for ${guests} guests · ${selectedTime} · ${seating}`)
  }

  return (
    <main className="container py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> Instant AI Booking
        </span>
        <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">
          Book Your <span className="text-primary">Table</span>
        </h1>
        <p className="mt-4 text-muted">
          Reserve in seconds. Chat with our AI concierge for the perfect seat, time, and vibe.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <h2 className="text-lg font-semibold">Reserve a Table</h2>
          <p className="text-sm text-muted">Choose your perfect dining moment.</p>

          <div className="mt-6">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 min-h-[44px] w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">Available Times</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <motion.button
                  key={time.label}
                  disabled={time.disabled}
                  whileTap={!time.disabled ? { scale: 0.95 } : undefined}
                  onClick={() => setTime(time.label)}
                  className={cn(
                    'min-h-[44px] rounded-xl border text-sm font-medium transition-colors',
                    time.disabled
                      ? 'cursor-not-allowed border-border/50 text-muted/40 line-through'
                      : selectedTime === time.label
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-background text-muted hover:text-white',
                  )}
                >
                  {time.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">Guests</label>
            <div className="mt-2 flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={decrementGuests}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
                aria-label="Decrease guests"
              >
                <Minus className="h-4 w-4" />
              </motion.button>
              <span className="w-8 text-center text-lg font-semibold">{guests}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={incrementGuests}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
                aria-label="Increase guests"
              >
                <Plus className="h-4 w-4" />
              </motion.button>
              <span className="text-sm text-muted">people</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">Seating</label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {seatingOptions.map((option) => {
                const Icon = seatingIcons[option.value]
                const isActive = seating === option.value
                return (
                  <motion.button
                    key={option.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSeating(option.value)}
                    className={cn(
                      'relative min-h-[44px] rounded-xl border p-3 text-left transition-colors',
                      isActive ? 'border-primary bg-primary/10' : 'border-border bg-background',
                    )}
                  >
                    {isActive && (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="mt-2 text-sm font-semibold">{option.label}</p>
                    <p className="text-[11px] text-muted">{option.description}</p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleConfirm}
            className="mt-8 min-h-[44px] w-full rounded-full bg-primary py-3 text-sm font-semibold text-white"
          >
            Confirm Reservation
          </motion.button>
          <p className="mt-3 text-center text-xs text-muted">
            {guests} guests · {selectedTime} · {seating}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col rounded-2xl border border-border bg-surface"
        >
          <div className="flex items-center gap-2 border-b border-border px-6 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="text-sm font-semibold">Bella Vista AI</p>
              <p className="flex items-center gap-1 text-xs text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Online now
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 px-6 py-4">
            {messages.map((m, idx) => (
              <div key={idx} className={cn('max-w-[85%]', m.from === 'user' && 'ml-auto')}>
                <div
                  className={cn(
                    'rounded-xl px-4 py-2.5 text-sm',
                    m.from === 'ai' ? 'bg-background' : 'bg-primary text-white',
                  )}
                >
                  {m.text}
                </div>
                {m.quickTimes && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.quickTimes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTime(t)}
                        className="rounded-full bg-primary/90 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 px-6 pb-3">
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => sendMessage(tag)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:text-white"
              >
                {tag}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage(draft)
            }}
            className="flex items-center gap-2 border-t border-border p-4"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about tables, times, or specials..."
              className="min-h-[44px] flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
