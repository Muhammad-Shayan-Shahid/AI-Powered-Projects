import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UtensilsCrossed, ShoppingBag, ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { currentUser } from '@/lib/data'
import { useCart } from '@/features/cart/hooks/useCart'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Reservations', to: '/booking' },
  { label: 'Reviews', to: '/#reviews' },
  { label: 'Contact', to: '/#contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { totalItems, toggleCart } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <UtensilsCrossed className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Bella Vista</span>
          </Link>
        </motion.div>

        <motion.nav
          className="hidden items-center gap-1 rounded-full border border-border bg-surface p-1 md:flex"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {navLinks.map((link) => {
            const isActive = link.to === '/' ? location.pathname === '/' : location.pathname === link.to
            return (
              <NavLink
                key={link.label}
                to={link.to}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors',
                  isActive ? 'text-white' : 'hover:text-white',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </NavLink>
            )
          })}
        </motion.nav>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-orange text-[10px] font-bold text-black"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button className="hidden items-center gap-2 rounded-full border border-border bg-surface pl-1 pr-2 py-1 md:flex">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <ChevronDown className="h-3.5 w-3.5 text-muted" />
          </button>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="container flex flex-col gap-1 py-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'min-h-[44px] rounded-lg px-4 py-3 text-sm font-medium',
                      isActive ? 'bg-primary text-white' : 'text-muted hover:bg-surface hover:text-white',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
