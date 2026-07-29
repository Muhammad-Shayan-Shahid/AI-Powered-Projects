import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid,
  Grid3x3,
  ClipboardList,
  CalendarDays,
  UtensilsCrossed as Utensils,
  Sparkles,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { currentUser } from '@/lib/data'

const links = [
  { label: 'Dashboard', to: '/admin', icon: LayoutGrid },
  { label: 'Live Floor', to: '/admin/tables', icon: Grid3x3 },
  { label: 'Orders', to: '/admin#orders', icon: ClipboardList },
  { label: 'Reservations', to: '/admin#reservations', icon: CalendarDays },
  { label: 'Menu', to: '/admin#menu', icon: Utensils },
  { label: 'AI Insights', to: '/admin#insights', icon: Sparkles },
  { label: 'Analytics', to: '/admin#analytics', icon: BarChart3 },
  { label: 'Settings', to: '/admin#settings', icon: Settings },
]

function SidebarContent({ onNavigate }) {
  return (
    <>
      <div>
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <Utensils className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-semibold">Bella Vista</span>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {links.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/admin'}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-white' : 'text-muted hover:bg-background hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
        <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold">{currentUser.name}</p>
          <p className="text-xs text-muted">{currentUser.role}</p>
        </div>
      </div>
    </>
  )
}

export default function AdminSidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-surface/40 p-4 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <Utensils className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-semibold">Bella Vista</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setDrawerOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </motion.button>
      </div>

      <motion.aside
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden h-full w-64 flex-shrink-0 flex-col justify-between border-r border-border bg-surface/40 p-5 lg:flex"
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between overflow-y-auto border-r border-border bg-surface p-5 lg:hidden"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border"
                aria-label="Close admin menu"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
