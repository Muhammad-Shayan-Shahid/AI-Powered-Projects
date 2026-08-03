import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Button from './Button'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 transition-all duration-300 sm:px-6 ${
          scrolled
            ? 'border border-border bg-bg/80 py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl'
            : 'border border-transparent bg-transparent py-3'
        }`}
      >
        <Link to="/" className="group flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: -6, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-lg font-bold text-bg"
          >
            M
          </motion.span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            MSH<span className="text-accent">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-2"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button to="/contact" size="md">
            Get a Quote
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 mt-2 flex flex-col gap-1 rounded-2xl border border-border bg-bg/95 p-4 backdrop-blur-xl md:hidden"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-surface-2 text-ink' : 'text-muted'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
            <div className="mt-2 px-4">
              <Button to="/contact" className="w-full justify-center">
                Get a Quote
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
