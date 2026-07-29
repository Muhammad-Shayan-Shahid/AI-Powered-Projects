import { useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import CartDrawer from '@/components/CartDrawer'
import AppRoutes from '@/app/app.routes'

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isBookingRoute = location.pathname.startsWith('/booking')

  return (
    <div className="min-h-screen bg-background text-white">
      <Toaster theme="dark" position="top-center" richColors />
      {!isAdminRoute && <Navbar />}
      <AppRoutes />
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && !isBookingRoute && <ChatWidget />}
      {!isAdminRoute && <CartDrawer />}
    </div>
  )
}
