import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HomePage from '@/features/home/pages/HomePage'
import MenuPage from '@/features/menu/pages/MenuPage'
import BookingPage from '@/features/booking/pages/BookingPage'
import ItemPage from '@/features/item/pages/ItemPage'
import AdminDashboard from '@/features/admin/pages/AdminDashboard'
import TableManagement from '@/features/admin/pages/TableManagement'

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: 'easeInOut' },
}

function Page({ children }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  )
}

export default function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Page>
              <HomePage />
            </Page>
          }
        />
        <Route
          path="/menu"
          element={
            <Page>
              <MenuPage />
            </Page>
          }
        />
        <Route
          path="/booking"
          element={
            <Page>
              <BookingPage />
            </Page>
          }
        />
        <Route
          path="/item/:id"
          element={
            <Page>
              <ItemPage />
            </Page>
          }
        />
        <Route
          path="/admin"
          element={
            <Page>
              <AdminDashboard />
            </Page>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <Page>
              <TableManagement />
            </Page>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}
