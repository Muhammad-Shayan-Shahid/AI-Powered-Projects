import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2 } from 'lucide-react'

const fieldClasses =
  'w-full rounded-xl border border-border bg-bg px-4 py-3.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors duration-200 focus:border-accent/60'

export default function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // UI only for now — submission wiring comes in a later phase.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-full min-h-100 flex-col items-center justify-center gap-4 rounded-3xl border border-accent/30 bg-surface p-10 text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent"
        >
          <CheckCircle2 size={30} />
        </motion.span>
        <h3 className="font-display text-2xl font-semibold text-ink">Message received!</h3>
        <p className="max-w-xs text-sm text-muted">
          Thanks, {values.name.split(' ')[0] || 'there'}. We&rsquo;ll get back to
          you within one business day.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setValues({ name: '', email: '', message: '' })
          }}
          className="mt-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-8 sm:p-10"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={values.name}
          onChange={handleChange}
          placeholder="Your full name"
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={handleChange}
          placeholder="you@brand.com"
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={values.message}
          onChange={handleChange}
          placeholder="Tell us a bit about your brand and what you need..."
          className={`${fieldClasses} resize-none`}
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-white"
      >
        Send Message
        <Send size={16} />
      </motion.button>
    </form>
  )
}
