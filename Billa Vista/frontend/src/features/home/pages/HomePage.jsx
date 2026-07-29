import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Quote,
  MapPin,
  Phone,
  Mail,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'
import { menuItems, featuredDish, testimonials, contactInfo } from '@/lib/data'
import { formatCurrency, cn } from '@/lib/utils'
import { useCart } from '@/features/cart/hooks/useCart'

const avatarSeeds = [
  'photo-1633332755192-727a05c4013d',
  'photo-1573497019940-1c28c88b4f3e',
  'photo-1519345182560-3f2917c472ef',
]

export default function HomePage() {
  const scrollerRef = useRef(null)
  const { addToCart } = useCart()
  const { hash } = useLocation()
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    if (!hash) return
    const target = document.querySelector(hash)
    if (target) {
      const timer = setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 350)
      return () => clearTimeout(timer)
    }
  }, [hash])

  const scroll = (direction) => {
    scrollerRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' })
  }

  const handleAddToCart = (item) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })
    toast.success(`${item.name} added to cart`)
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    toast.success("Message sent! We'll get back to you shortly.")
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <main>
      <section className="container grid grid-cols-1 items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Now taking AI reservations
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-5xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl"
          >
            Taste Meets
            <br />
            <span className="text-primary">Technology</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-md text-muted"
          >
            AI powered reservations. Zero wait time. Pure flavor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/booking"
                className="flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
              >
                Book a Table
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="flex min-h-[44px] items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-white"
              >
                Explore Menu
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {avatarSeeds.map((seed) => (
                <img
                  key={seed}
                  src={`https://images.unsplash.com/${seed}?w=100&q=80&auto=format&fit=crop&crop=faces`}
                  alt="Diner"
                  className="h-9 w-9 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-accent-orange">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-muted">4.9 · 2,350 reviews</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="overflow-hidden rounded-2xl border border-border"
          >
            <img
              src={featuredDish.image}
              alt={featuredDish.name}
              className="aspect-square w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute left-4 top-4 rounded-xl border border-border bg-surface/95 px-4 py-3 backdrop-blur"
          >
            <p className="flex items-center gap-1 text-xs text-muted">
              <Clock className="h-3 w-3" /> Ready in
            </p>
            <p className="text-lg font-bold">30 Min</p>
            <p className="text-xs text-primary">Super fast service</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Dishes</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted hover:text-white"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={scrollerRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
          {menuItems.slice(0, 8).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
              className="w-64 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <Link to={`/item/${item.id}`} className="block">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/item/${item.id}`}>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">{item.shortDescription}</p>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-background"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="reviews" className="container scroll-mt-24 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary">
            <Star className="h-3 w-3 fill-current" /> What Guests Say
          </span>
          <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Loved by <span className="text-primary">2,350+</span> Diners
          </h2>
          <p className="mt-3 text-muted">Real reviews from real tables.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col rounded-2xl border border-border bg-surface p-6"
            >
              <Quote className="h-5 w-5 text-primary" />
              <p className="mt-3 flex-1 text-sm text-muted">{review.quote}</p>
              <div className="mt-4 flex items-center gap-1 text-accent-orange">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn('h-3.5 w-3.5', i < review.rating ? 'fill-current' : 'text-muted/30')}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="contact" className="container scroll-mt-24 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary">
            <Mail className="h-3 w-3" /> Get in Touch
          </span>
          <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Contact <span className="text-primary">Us</span>
          </h2>
          <p className="mt-3 text-muted">Questions, feedback, or private events — we'd love to hear from you.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                <MapPin className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold">Visit Us</p>
                <p className="mt-1 text-sm text-muted">{contactInfo.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Phone className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold">Call Us</p>
                <p className="mt-1 text-sm text-muted">{contactInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Mail className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold">Email Us</p>
                <p className="mt-1 text-sm text-muted">{contactInfo.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Clock className="h-4 w-4 text-primary" />
              </span>
              <div className="w-full">
                <p className="text-sm font-semibold">Opening Hours</p>
                <div className="mt-1 space-y-1">
                  {contactInfo.hours.map((slot) => (
                    <div key={slot.day} className="flex justify-between text-sm text-muted">
                      <span>{slot.day}</span>
                      <span>{slot.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onSubmit={handleContactSubmit}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                required
                value={contactForm.name}
                onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                className="mt-2 min-h-[44px] w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium">Email</label>
              <input
                required
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                className="mt-2 min-h-[44px] w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium">Message</label>
              <textarea
                required
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="How can we help?"
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="mt-6 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-white"
            >
              Send Message
              <Send className="h-4 w-4" />
            </motion.button>
          </motion.form>
        </div>
      </section>
    </main>
  )
}
